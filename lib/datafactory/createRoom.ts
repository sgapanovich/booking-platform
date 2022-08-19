import { faker } from "@faker-js/faker";
import { expect, request } from "@playwright/test";
import { adminHeaders } from "../helpers/adminHeaders";
import { featuresList, roomTypesList } from "../helpers/data";
import { randomItemFromArray } from "../helpers/random";
let baseURL = process.env.APP_URL;

let name = "Automation Room " + Date.now();
let types = roomTypesList;
let type = randomItemFromArray(types);
let accessible = Math.random() < 0.5;
let image = "https://blog.postman.com/wp-content/uploads/2014/07/logo.png";
let features = featuresList;
let description = faker.lorem.paragraph();
let amount = faker.mersenne.rand(999, 1);

export async function createRoom(
  roomName = name,
  roomType = type,
  isAccessible = accessible,
  roomImage = image,
  roomFeatures = features,
  roomDescription = description,
  roomPrice = amount
) {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.post(baseURL + "/room/", {
    headers: adminHeaders(),
    data: {
      roomName: roomName,
      type: roomType,
      accessible: isAccessible,
      image: roomImage,
      description: roomDescription,
      features: roomFeatures,
      roomPrice: roomPrice,
    },
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  return body;
}
