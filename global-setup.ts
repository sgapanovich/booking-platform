import dotenv from "dotenv";
import * as fs from "fs";
import { adminToken } from "./lib/datafactory/adminToken";
import { healthChecks } from "./lib/datafactory/healthChecks";
import { endpointsList } from "./lib/helpers/data";
import { waitFor } from "./lib/helpers/waitFor";
import { warningsFile } from "./lib/helpers/warnings";

console.log("Loading Globals");
dotenv.config();
let baseURL = process.env.APP_URL;
let adminUsername = process.env.ADMIN_USERNAME;
let adminPassword = process.env.ADMIN_PASSWORD;

async function globalSetup() {
  let endpoints = endpointsList;

  for (let endpoint = 0; endpoint < endpoints.length; endpoint++) {
    let maxAttempts = 5;

    for (let i = 0; i < maxAttempts; i++) {
      let healthStatus = await healthChecks(endpoints[endpoint]);

      if (healthStatus === 200) {
        console.log(
          "\x1b[33m%s\x1b[0m",
          `/${endpoints[endpoint]} endpoints are ready`
        );
        break;
      } else {
        console.log(
          `Response code for /${endpoints[endpoint]} health check: ` +
            healthStatus
        );
        console.log("Iteration: " + (i + 1));
        console.log(
          "\x1b[33m%s\x1b[0m",
          "Seems like environment is not ready. Retrying..."
        );
        if (i === maxAttempts - 1) {
          throw `Health check has failed for ${baseURL}/${endpoints[endpoint]}`;
        }
        await waitFor(10000);
      }
    }
  }

  try {
    fs.unlink(warningsFile, function () {});
  } catch (err) {
    console.error(err);
  }

  // get a token for admin and set it to ADMIN_TOKEN environment variable
  process.env.ADMIN_TOKEN = await adminToken(adminUsername, adminPassword);
  console.log("Finished Loading Globals");
}

export default globalSetup;
