const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const { helloWorld } = require("../hello");

test("helloWorld returns the expected message", () => {
  assert.equal(helloWorld(), "Hello, world!");
});

test("CLI wiring prints the expected message", () => {
  const scriptPath = path.resolve(__dirname, "..", "hello.js");
  const completed = spawnSync(process.execPath, [scriptPath], {
    encoding: "utf8",
  });

  assert.equal(completed.status, 0);
  assert.equal(completed.stdout, "Hello, world!\n");
  assert.equal(completed.stderr, "");
});

test("importing the module does not print to stdout", () => {
  const script = "require('./hello.js')";
  const completed = spawnSync(process.execPath, ["-e", script], {
    cwd: path.resolve(__dirname, ".."),
    encoding: "utf8",
  });

  assert.equal(completed.status, 0);
  assert.equal(completed.stdout, "");
  assert.equal(completed.stderr, "");
});
