import {
  createProductController,
  listProductsController,
  getProductController,
  updateProductController,
  deleteProductController,
  searchProductsController,
  stockInController,
  stockOutController,
  getStatisticsController,
} from "./controller/inventory.controller.js";

import { parseArgs, validateOptions } from "./utils/cli.js";

import { handleError } from "./errors/error-handler.js";
import { showHelp } from "./utils/help.js";

async function main() {
  const [, , command, ...args] = process.argv;

  if (!command || command === "help") {
    showHelp();
    return;
  }

  const options = parseArgs(args);

  validateOptions(command, options);

  switch (command) {
    case "add":
      return handleAdd(options);

    case "list":
      return handleList(options);

    case "get":
      return handleGet(options);

    case "update":
      return handleUpdate(options);

    case "delete":
      return handleDelete(options);

    case "search":
      return handleSearch(options);

    case "stock-in":
      return handleStockIn(options);

    case "stock-out":
      return handleStockOut(options);

    case "stats":
      return handleStats();

    default:
      throw new Error(`Unknown command "${command}"`);
  }
}

// main().catch(handleError)
main().catch((error) => {
  handleError(error);
  process.exitCode = 1;
})

async function handleAdd(options) {
  const product = await createProductController({
    name: options.name,
    category: options.category,
    price: Number(options.price),
    quantity: Number(options.quantity),
    minStock: Number(options["min-stock"]),
  });

  console.log("Product created successfully.");

  console.log(product);
}

async function handleList(options) {
  const products = await listProductsController({
    category: options.category,
    lowStock: options["low-stock"] !== undefined,
  });

  console.table(products);
}

async function handleGet(options) {
  const product = await getProductController(options.id);

  console.log(product);
}

async function handleSearch(options) {
  const products = await searchProductsController(options.name);

  console.table(products);
}

async function handleUpdate(options) {
  const updates = {};

  if (options.name !== undefined) {
    updates.name = options.name;
  }

  if (options.category !== undefined) {
    updates.category = options.category;
  }

  if (options.price !== undefined) {
    updates.price = Number(options.price);
  }

  if (options["min-stock"] !== undefined) {
    updates.minStock = Number(options["min-stock"]);
  }

  const product = await updateProductController(options.id, updates);

  console.log("Product updated successfully.");

  console.log(product);
}

async function handleDelete(options) {
  const product = await deleteProductController(options.id);

  console.log("Product deleted successfully.");

  console.log(product);
}

async function handleStockIn(options) {
  const product = await stockInController(options.id, Number(options.quantity));

  console.log("Stock added successfully.");

  console.log(product);
}

async function handleStockOut(options) {
  const product = await stockOutController(
    options.id,
    Number(options.quantity),
  );

  console.log("Stock removed successfully.");

  console.log(product);
}

async function handleStats() {
  const statistics = await getStatisticsController();

  console.log(statistics);
}
