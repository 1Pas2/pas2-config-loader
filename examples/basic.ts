import { loadConfig } from "../dist/index.js";
// Given an app.json file containing {"port":3000}:
const config = await loadConfig("./app.json", (value) => {
  if (
    !value ||
    typeof value !== "object" ||
    !("port" in value) ||
    typeof value.port !== "number"
  )
    throw new Error("Expected port");
  return { port: value.port };
});
console.log(config);
