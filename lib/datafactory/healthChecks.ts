import { request } from "@playwright/test";
let baseURL = process.env.APP_URL;

export async function healthChecks(endpoint: string) {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(
    baseURL + "/" + endpoint + "/actuator/health",
    {}
  );
  return response.status();
}
