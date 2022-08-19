import { expect, request } from "@playwright/test";
import { adminHeaders } from "../helpers/adminHeaders";
let baseURL = process.env.APP_URL;

export async function getRoomByIdAdmin(roomId: number) {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(baseURL + "/room/" + roomId, {
    headers: adminHeaders(),
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  return body;
}

export async function getRoomByIdPublic(roomId: number) {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(baseURL + "/room/" + roomId);

  expect(response.status()).toBe(200);
  const body = await response.json();
  return body;
}
