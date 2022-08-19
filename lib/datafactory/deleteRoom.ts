import { expect, request } from "@playwright/test";
import { adminHeaders } from "../helpers/adminHeaders";
let baseURL = process.env.APP_URL;

export async function deleteRoom(roomId: number) {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.delete(
    baseURL + "/room/" + roomId,
    { headers: adminHeaders() }
  );

  expect(response.status()).toBe(202);
}
