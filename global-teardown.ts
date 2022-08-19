import * as fs from "fs";
import { warningsFile } from "./lib/helpers/warnings";

async function globalTearDown() {
  try {
    const data = fs.readFileSync(warningsFile, "utf8");
    console.log(data);
  } catch (err) {
    null;
  }
}

export default globalTearDown;
