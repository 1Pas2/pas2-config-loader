import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import * as api from "../dist/index.js";
test("loads and validates", async () => {
  const dir = await mkdtemp(join(tmpdir(), "pas2-config-"));
  try {
    const p = join(dir, "config.json");
    await writeFile(p, '{"port":3000}');
    assert.equal(await api.loadConfig(p, (x) => x.port), 3000);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("missing file context", async () =>
  await assert.rejects(
    api.loadConfig(new URL("file:///nonexistent-pas2-config.json"), (x) => x),
    api.ConfigError,
  ));
test("validator failure context", async () => {
  const dir = await mkdtemp(join(tmpdir(), "pas2-config-"));
  try {
    const p = join(dir, "x.json");
    await writeFile(p, "{}");
    await assert.rejects(
      api.loadConfig(p, () => {
        throw Error("bad");
      }),
      /validation failed/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
