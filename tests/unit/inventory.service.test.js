import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

import {
  createProduct,
  getProductById,
  listProducts,
  updateProduct,
  stockIn,
  stockOut,
  searchProducts,
  deleteProduct,
  getStatistics,
} from "../../src/services/inventory.service.js";

const TEST_DATA_FILE = "./data/test-inventory.json";

beforeEach(async () => {
  await writeFile(
    TEST_DATA_FILE,
    "[]",
    "utf-8"
  );
});

test("createProduct should create a valid product", async () => {
  const product = await createProduct({
    name: "Test Mouse",
    category: "Electronics",
    price: 500,
    quantity: 10,
    minStock: 2,
  });

  assert.equal(product.id, "prod_001");
  assert.equal(product.name, "Test Mouse");
  assert.equal(product.price, 500);
  assert.equal(product.quantity, 10);
  assert.equal(product.minStock, 2);
});

test("getProductById should return an existing product", async () => {
  await createProduct({
    name: "Test Mouse",
    category: "Electronics",
    price: 500,
    quantity: 10,
    minStock: 2,
  });

  const product = await getProductById("prod_001");

  assert.equal(product.name, "Test Mouse");
});

test("getProductById should reject when product does not exist", async () => {
  await assert.rejects(
    () => getProductById("prod_999"),
    {
      message: "Product not found",
    }
  );
});

test("updateProduct should reject empty updates", async () => {
  await createProduct({
    name: "Test Mouse",
    category: "Electronics",
    price: 500,
    quantity: 10,
    minStock: 2,
  });

  await assert.rejects(
    () => updateProduct("prod_001", {}),
    {
      message: "No update fields provided",
    }
  );
});

test("stockIn should reject zero quantity", async () => {
  await createProduct({
    name: "Keyboard",
    category: "Electronics",
    price: 1000,
    quantity: 10,
    minStock: 2,
  });

  await assert.rejects(
    () => stockIn("prod_001", 0),
    {
      message: "Stock quantity must be a positive integer",
    }
  );
});

test("stockOut should reject negative quantity", async () => {
  await createProduct({
    name: "Keyboard",
    category: "Electronics",
    price: 1000,
    quantity: 10,
    minStock: 2,
  });

  await assert.rejects(
    () => stockOut("prod_001", -5),
    {
      message: "Stock quantity must be a positive integer",
    }
  );
});

test("getProductById should reject when product does not exist", async () => {
  await assert.rejects(
    () => getProductById("prod_999"),
    {
      message: "Product not found",
    }
  );
});

test("createProduct should reject invalid price", async () => {
  await assert.rejects(
    () =>
      createProduct({
        name: "Bad Product",
        category: "Electronics",
        price: -10,
        quantity: 5,
        minStock: 1,
      }),
    {
      message: "Invalid product data",
    }
  );
});

test("stockOut should reject when requested quantity exceeds stock", async () => {
  await createProduct({
    name: "Keyboard",
    category: "Electronics",
    price: 1000,
    quantity: 10,
    minStock: 2,
  });

  await assert.rejects(
    () => stockOut("prod_001", 11),
    {
      message: "Insufficient stock",
    }
  );
});

test("stockIn should increase product quantity", async () => {
  await createProduct({
    name: "Keyboard",
    category: "Electronics",
    price: 1000,
    quantity: 10,
    minStock: 2,
  });

  const updatedProduct = await stockIn("prod_001", 5);

  assert.equal(updatedProduct.quantity, 15);
});

test("stockOut should decrease product quantity", async () => {
  await createProduct({
    name: "Keyboard",
    category: "Electronics",
    price: 1000,
    quantity: 10,
    minStock: 2,
  });

  const updatedProduct = await stockOut("prod_001", 3);

  assert.equal(updatedProduct.quantity, 7);
});

test("updateProduct should update only provided fields", async () => {
  await createProduct({
    name: "Keyboard",
    category: "Electronics",
    price: 1000,
    quantity: 10,
    minStock: 2,
  });

  const updatedProduct = await updateProduct(
    "prod_001",
    {
      price: 900,
    }
  );

  assert.equal(updatedProduct.price, 900);
  assert.equal(updatedProduct.name, "Keyboard");
  assert.equal(updatedProduct.category, "Electronics");
  assert.equal(updatedProduct.quantity, 10);
  assert.equal(updatedProduct.minStock, 2);
});

test("searchProducts should find products by name", async () => {
  await createProduct({
    name: "Wireless Mouse",
    category: "Electronics",
    price: 799,
    quantity: 10,
    minStock: 2,
  });

  await createProduct({
    name: "Keyboard",
    category: "Electronics",
    price: 1299,
    quantity: 5,
    minStock: 2,
  });

  const products = await searchProducts("mouse");

  assert.equal(products.length, 1);
  assert.equal(products[0].name, "Wireless Mouse");
});

test("listProducts should filter by category", async () => {
  await createProduct({
    name: "Mouse",
    category: "Electronics",
    price: 799,
    quantity: 10,
    minStock: 2,
  });

  await createProduct({
    name: "USB Cable",
    category: "Accessories",
    price: 199,
    quantity: 20,
    minStock: 5,
  });

  const products = await listProducts({
    category: "Electronics",
  });

  assert.equal(products.length, 1);
  assert.equal(products[0].name, "Mouse");
});

test("listProducts should return low-stock products", async () => {
  await createProduct({
    name: "Mouse",
    category: "Electronics",
    price: 799,
    quantity: 2,
    minStock: 5,
  });

  await createProduct({
    name: "Keyboard",
    category: "Electronics",
    price: 1299,
    quantity: 10,
    minStock: 3,
  });

  const products = await listProducts({
    lowStock: true,
  });

  assert.equal(products.length, 1);
  assert.equal(products[0].name, "Mouse");
});

test("deleteProduct should remove an existing product", async () => {
  await createProduct({
    name: "Keyboard",
    category: "Electronics",
    price: 1000,
    quantity: 10,
    minStock: 2,
  });

  const deletedProduct = await deleteProduct("prod_001");

  assert.equal(deletedProduct.id, "prod_001");

  await assert.rejects(
    () => getProductById("prod_001"),
    {
      message: "Product not found",
    }
  );
});

test("getStatistics should calculate inventory statistics", async () => {
  await createProduct({
    name: "Mouse",
    category: "Electronics",
    price: 500,
    quantity: 10,
    minStock: 2,
  });

  await createProduct({
    name: "Keyboard",
    category: "Electronics",
    price: 1000,
    quantity: 5,
    minStock: 5,
  });

  const statistics = await getStatistics();

  assert.equal(statistics.totalProducts, 2);
  assert.equal(statistics.totalUnits, 15);
  assert.equal(statistics.totalInventoryValue, 10000);
  assert.equal(statistics.lowStockProducts, 1);
});

test("getStatistics should return zeros for empty inventory", async () => {
  const statistics = await getStatistics();

  assert.deepEqual(statistics, {
    totalProducts: 0,
    totalUnits: 0,
    totalInventoryValue: 0,
    lowStockProducts: 0,
  });
});