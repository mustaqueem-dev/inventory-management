import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile } from "node:fs/promises";

const execFileAsync = promisify(execFile);

const TEST_DATA_FILE = "./data/test-inventory-integration.json";

beforeEach(async () => {
  await writeFile(TEST_DATA_FILE, "[]", "utf-8");
});

async function runCLI(...args) {
  return execFileAsync(
    "node",
    ["src/app.js", ...args],
    {
      env: {
        ...process.env,
        INVENTORY_DATA_FILE: TEST_DATA_FILE,
      },
    }
  );
}

test("CLI add should create a product", async () => {
  const { stdout } = await runCLI(
    "add",
    "--name",
    "Wireless Mouse",
    "--category",
    "Electronics",
    "--price",
    "799",
    "--quantity",
    "10",
    "--min-stock",
    "2"
  );

  assert.match(
    stdout,
    /Product created successfully/
  );
});

test("CLI get should return an existing product", async () => {
  await runCLI(
    "add",
    "--name",
    "Keyboard",
    "--category",
    "Electronics",
    "--price",
    "1299",
    "--quantity",
    "5",
    "--min-stock",
    "2"
  );

  const { stdout } = await runCLI(
    "get",
    "--id",
    "prod_001"
  );

  assert.match(stdout, /Keyboard/);
});

test("CLI stock-out should decrease stock", async () => {
  await runCLI(
    "add",
    "--name",
    "Mouse",
    "--category",
    "Electronics",
    "--price",
    "500",
    "--quantity",
    "10",
    "--min-stock",
    "2"
  );

  await runCLI(
    "stock-out",
    "--id",
    "prod_001",
    "--quantity",
    "3"
  );

  const { stdout } = await runCLI(
    "get",
    "--id",
    "prod_001"
  );

  assert.match(stdout, /quantity:.*7/);
});

test("CLI should reject unknown option", async () => {
  await assert.rejects(
    () =>
      runCLI(
        "list",
        "--hello",
        "world"
      ),
    (error) => {
      assert.match(
        error.stderr,
        /Unknown option/
      );

      return true;
    }
  );
});

test("CLI should reject insufficient stock", async () => {
  await runCLI(
    "add",
    "--name",
    "Keyboard",
    "--category",
    "Electronics",
    "--price",
    "1000",
    "--quantity",
    "5",
    "--min-stock",
    "2"
  );

  await assert.rejects(
    () =>
      runCLI(
        "stock-out",
        "--id",
        "prod_001",
        "--quantity",
        "10"
      ),
    (error) => {
      assert.match(
        error.stderr,
        /Insufficient stock/
      );

      return true;
    }
  );
});