import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE =
  process.env.INVENTORY_DATA_FILE ??
  path.resolve(__dirname, "../../data/inventory.json");

async function readProducts() {
  const data = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

async function writeProducts(products) {
  await writeFile(
    DATA_FILE,
    JSON.stringify(products, null, 2),
    "utf-8"
  );
}

export async function findAllProducts() {
  return readProducts();
}

export async function findProductById(id) {
  const products = await readProducts();
  return products.find((product) => product.id === id);
}

export async function createProduct(product) {
  const products = await readProducts();

  products.push(product);

  await writeProducts(products);

  return product;
}

export async function updateProduct(updatedProduct) {
  const products = await readProducts();

  const index = products.findIndex(
    (product) => product.id === updatedProduct.id
  );

  if (index === -1) {
    return undefined;
  }

  products[index] = updatedProduct;

  await writeProducts(products);

  return updatedProduct;
}

export async function deleteProduct(id) {
  const products = await readProducts();

  const index = products.findIndex(
    (product) => product.id === id
  );

  if (index === -1) {
    return undefined;
  }

  const [deletedProduct] = products.splice(index, 1);

  await writeProducts(products);

  return deletedProduct;
}