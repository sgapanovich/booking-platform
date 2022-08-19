import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";
import {
  apiSchemaParamData,
  apiSchemaParameters,
} from "../../lib/datafactory/apiSchema";
import { confirmRoomDetails } from "../../lib/datafactory/confirmRoomDetails";
import { deleteRoom } from "../../lib/datafactory/deleteRoom";
import {
  getRoomByIdPublic,
  getRoomByIdAdmin,
} from "../../lib/datafactory/getRoomById";
import { getRoomsAdmin, getRoomsPublic } from "../../lib/datafactory/getRooms";
import { adminHeaders } from "../../lib/helpers/adminHeaders";
import { featuresList, roomTypesList } from "../../lib/helpers/data";
import { objectParamsCount } from "../../lib/helpers/objectParamsCount";
import { randomBoolean, randomItemFromArray } from "../../lib/helpers/random";

test.describe("Room API tests", async () => {
  let endpoint = "room";
  let checkedParams = 8;
  let apiDocsParams: number;
  let roomId: number;
  let requestHeaders = adminHeaders();
  let roomName: string;
  let roomTypes: string[];
  let roomType: string;
  let accessible: boolean;
  let image = "https://www.mwtestconsultancy.co.uk/img/testim/room2.jpg";
  let features = featuresList;
  let description = faker.lorem.paragraph();
  let amount: number;
  let triggerAfterEach: boolean;

  test.beforeAll(async () => {
    apiDocsParams = await apiSchemaParameters(endpoint, checkedParams);
    roomTypes = await apiSchemaParamData(endpoint, "type", roomTypesList);
  });

  test.beforeEach(async () => {
    triggerAfterEach = false;
    roomName = "Automation Room " + Date.now();
    roomType = randomItemFromArray(roomTypes);
    accessible = randomBoolean();
    amount = faker.mersenne.rand(999, 1);
  });

  test.afterEach(async () => {
    if (triggerAfterEach) {
      await deleteRoom(roomId);
    }
  });

  // room id is not working as expected
  test("POST create a room with all valid parameters based on docs @happy", async ({
    request,
    baseURL,
  }) => {
    const response = await request.post(`${baseURL}/${endpoint}/`, {
      headers: requestHeaders,
      data: {
        roomid: 0,
        roomName: roomName,
        type: roomType,
        accessible: accessible,
        image: image,
        description: description,
        features: features,
        roomPrice: amount,
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(typeof body.roomid).toBe("number");
    expect(body.roomName).toBe(roomName);
    expect(body.type).toBe(roomType);
    expect(body.accessible).toBe(accessible);
    expect(body.image).toBe(image);
    expect(body.description).toBe(description);
    expect(body.features).toEqual(features);
    expect(body.roomPrice).toBe(amount);
    expect(objectParamsCount(body)).toBe(apiDocsParams);

    let roomByIdAdmin = await getRoomByIdAdmin(body.roomid);
    expect(roomByIdAdmin).toEqual(body);

    let roomById = await getRoomByIdPublic(body.roomid);
    expect(roomById).toEqual(body);

    let roomsAdmin = await getRoomsAdmin();
    let roomAdmin = roomsAdmin.filter((room) => room.roomid === body.roomid)[0];
    expect(roomAdmin).toEqual(body);

    let roomsPublic = await getRoomsPublic();
    let roomPublic = roomsPublic.filter(
      (room) => room.roomid === body.roomid
    )[0];
    expect(roomPublic).toEqual(body);
  });

  test("POST create a room with valid UI parameters @UI @happy", async ({
    request,
    baseURL,
  }) => {
    const response = await request.post(`${baseURL}/${endpoint}/`, {
      headers: requestHeaders,
      data: {
        roomName: roomName,
        type: roomType,
        accessible: accessible,
        image: image,
        description: description,
        features: features,
        roomPrice: amount,
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(typeof body.roomid).toBe("number");
    expect(body.roomName).toBe(roomName);
    expect(body.type).toBe(roomType);
    expect(body.accessible).toBe(accessible);
    expect(body.image).toBe(image);
    expect(body.description).toBe(description);
    expect(body.features).toEqual(features);
    expect(body.roomPrice).toBe(amount);
    expect(objectParamsCount(body)).toBe(apiDocsParams);

    await confirmRoomDetails(body);
  });

  // price is also a required parameter
  test("POST create a room with required parameters only @happy", async ({
    request,
    baseURL,
  }) => {
    triggerAfterEach = true;

    const response = await request.post(`${baseURL}/${endpoint}/`, {
      headers: requestHeaders,
      data: {
        roomName: roomName,
        type: roomType,
        roomPrice: amount,
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(typeof body.roomid).toBe("number");
    roomId = body.roomid;
    expect(body.roomName).toBe(roomName);
    expect(body.type).toBe(roomType);
    expect(body.accessible).toBe(false);
    expect(body.features).toEqual([null]);
    expect(body.roomPrice).toBe(amount);

    // issue with parameters count (does not return 2)
    expect(objectParamsCount(body)).toBe(apiDocsParams - 2);

    await confirmRoomDetails(body);
  });

  test("POST create a room with custom features @bug", async ({
    request,
    baseURL,
  }) => {
    triggerAfterEach = true;
    let customFeatures = ["Smoking Room", "Free Mini Bar", "3pm Check Out"];

    const response = await request.post(`${baseURL}/${endpoint}/`, {
      headers: requestHeaders,
      data: {
        roomName: roomName,
        type: roomType,
        accessible: accessible,
        image: image,
        description: description,
        features: customFeatures,
        roomPrice: amount,
      },
    });

    test.fail(
      response.status() === 400,
      "See #BUG-123: Add Validation For Features"
    );
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(typeof body.roomid).toBe("number");
    roomId = body.roomid;
    expect(body.roomName).toBe(roomName);
    expect(body.type).toBe(roomType);
    expect(body.accessible).toBe(accessible);
    expect(body.image).toBe(image);
    expect(body.description).toBe(description);
    expect(body.features).toEqual(customFeatures);
    expect(body.roomPrice).toBe(amount);
    expect(objectParamsCount(body)).toBe(apiDocsParams);

    await confirmRoomDetails(body);
  });

  test("POST create a room without passing any params @negative", async ({
    request,
    baseURL,
  }) => {
    const response = await request.post(`${baseURL}/${endpoint}/`, {
      headers: requestHeaders,
      data: {},
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errorCode).toBe(400);
    expect(body.error).toBe("BAD_REQUEST");
    expect(typeof body.errorMessage).toBe("string");
    expect(body.fieldErrors).toContain("Type must be set");
    expect(body.fieldErrors).toContain("must not be null");
    expect(body.fieldErrors).toContain("Room name must be set");
    expect(body.fieldErrors).toContain("must be greater than or equal to 1");
    expect(objectParamsCount(body)).toBe(4);
  });

  test("POST create a room with passing an invalid token @negative", async ({
    request,
    baseURL,
  }) => {
    const response = await request.post(`${baseURL}/${endpoint}/`, {
      headers: { cookie: "token=invalid" },
      data: {
        roomid: 0,
        roomName: roomName,
        type: roomType,
        accessible: accessible,
        image: image,
        description: description,
        features: features,
        roomPrice: amount,
      },
    });

    expect(response.status()).toBe(403);
    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST create a room without passing a token @negative", async ({
    request,
    baseURL,
  }) => {
    const response = await request.post(`${baseURL}/${endpoint}/`, {
      data: {
        roomid: 0,
        roomName: roomName,
        type: roomType,
        accessible: accessible,
        image: image,
        description: description,
        features: features,
        roomPrice: amount,
      },
    });

    expect(response.status()).toBe(403);
    const body = await response.text();
    expect(body).toBe("");
  });
});
