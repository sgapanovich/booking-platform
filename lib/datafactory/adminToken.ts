import { expect, request } from "@playwright/test";
let baseURL = process.env.APP_URL;

export async function adminToken(userName, password) {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.post(baseURL + "/auth/login", {
    data: {
      username: userName,
      password: password,
    },
  });

  expect(response.status()).toBe(200);
  const token = response.headers()["set-cookie"].split(";")[0];
  return token;
}
