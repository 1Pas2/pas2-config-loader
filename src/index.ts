import { readFile } from "node:fs/promises";
export class ConfigError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ConfigError";
  }
}
export async function loadConfig<T>(
  path: string | URL,
  validate: (value: unknown) => T,
): Promise<T> {
  let value: unknown;
  try {
    value = JSON.parse(
      (await readFile(path, "utf8")).replace(/^\uFEFF/, ""),
    ) as unknown;
  } catch (error) {
    throw new ConfigError("Unable to read or parse configuration", {
      cause: error,
    });
  }
  try {
    return validate(value);
  } catch (error) {
    throw new ConfigError("Configuration validation failed", { cause: error });
  }
}
