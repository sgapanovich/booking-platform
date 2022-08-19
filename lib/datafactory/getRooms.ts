import { expect, request } from "@playwright/test";
import { adminHeaders } from "../helpers/adminHeaders";
let baseURL = process.env.APP_URL;

export async function getRoomsAdmin() {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(baseURL + "/room/", {
    headers: adminHeaders(),
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  return body.rooms;
}

export async function getRoomsPublic() {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(baseURL + "/room/", {});

  expect(response.status()).toBe(200);
  const body = await response.json();
  return body.rooms;
}
