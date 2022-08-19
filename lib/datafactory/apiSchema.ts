/*
  this function returns how many parameters we should expect
  for a specific endpoint based on API docs
*/

import { expect, request } from "@playwright/test";
import { objectParamsCount } from "../helpers/objectParamsCount";
import { warnings } from "../helpers/warnings";

let baseURL = process.env.APP_URL;

export async function apiSchemaParameters(
  endpoint: string,
  expectedCount: number
) {
  let swaggerURL = `${baseURL}/${endpoint}/swagger-ui/index.html`;

  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(
    `${baseURL}/${endpoint}/v3/api-docs/${endpoint}-api`,
    {}
  );

  expect(response.status()).toBe(200);
  const body = await response.json();

  // capitalize first letter
  endpoint = endpoint[0].toUpperCase() + endpoint.slice(1);
  let properties = body.components.schemas[endpoint].properties;
  let paramsCount = objectParamsCount(properties);

  if (paramsCount !== expectedCount) {
    await warnings(
      `/${endpoint} schema has changed. ` +
        "You might not assert on all parameters. " +
        "See API docs for more information: " +
        swaggerURL
    );
  }

  return paramsCount;
}

export async function apiSchemaParamData(
  endpoint: string,
  parameter: string,
  params: string[]
) {
  let swaggerURL = `${baseURL}/${endpoint}/swagger-ui/index.html`;

  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(
    `${baseURL}/${endpoint}/v3/api-docs/${endpoint}-api`,
    {}
  );

  expect(response.status()).toBe(200);
  const body = await response.json();

  // capitalize first letter
  endpoint = endpoint[0].toUpperCase() + endpoint.slice(1);
  let schemaParam =
    body.components.schemas[endpoint].properties[parameter].pattern;
  let passedParameters = params.toString().replace(/,/g, "|");

  if (schemaParam !== passedParameters) {
    await warnings(
      `'${parameter}' parameter has been updated for '/${endpoint}' endpoint. ` +
        `New values are ${schemaParam}. ` +
        "See API docs for more information: " +
        swaggerURL
    );
  }

  let schemaData = schemaParam.split("|");
  return schemaData;
}
