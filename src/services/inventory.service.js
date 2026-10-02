import {
  findAllProducts,
  findProductById,
  createProduct as createProductRecord,
  updateProduct as updateProductRecord,
  deleteProduct as deleteProductRecord,
} from "../repositories/inventory.repository.js";

import {
  validateProductInput,
  validateStockQuantity,
} from "../validation/inventory.validation.js";

import { generateProductId } from "../utils/id.js";
import { AppError } from "../errors/app-error.js";

export async function createProduct(input) {
  const validation = validateProductInput(input);

  if (!validation.valid) {
    throw new AppError(
      "Invalid product data",
      validation.errors,
      "VALIDATION_ERROR",
    );
  }

  const products = await findAllProducts();

  const product = {
    id: generateProductId(products),
    name: input.name.trim(),
    category: input.category.trim(),
    price: input.price,
    quantity: input.quantity,
    minStock: input.minStock,
  };

  return createProductRecord(product);
}

export async function getProductById(id) {
  const product = await findProductById(id);

  if (!product) {
    throw new AppError("Product not found", { id }, "PRODUCT_NOT_FOUND");
  }

  return product;
}

export async function listProducts(filters = {}) {
  const products = await findAllProducts();

  let result = products;

  if (filters.category) {
    result = result.filter(
      (product) =>
        product.category.toLowerCase() ===
        String(filters.category).toLowerCase(),
    );
  }

  if (filters.lowStock) {
    result = result.filter((product) => product.quantity <= product.minStock);
  }

  return result;
}

export async function searchProducts(name) {
  const products = await findAllProducts();

  const query = name?.trim().toLowerCase();

  if (!query) {
    return [];
  }

  return products.filter((product) =>
    product.name.toLowerCase().includes(query),
  );
}

export async function updateProduct(id, updates) {
  const existingProduct = await getProductById(id);

  if (Object.keys(updates).length === 0) {
    throw new AppError("No update fields provided", { id }, "NO_UPDATE_FIELDS");
  }

  const updatedProduct = {
    ...existingProduct,
    ...updates,
    id: existingProduct.id,
    quantity: existingProduct.quantity,
  };

  const validation = validateProductInput(updatedProduct);

  if (!validation.valid) {
    throw new AppError(
      "Invalid product data",
      validation.errors,
      "VALIDATION_ERROR",
    );
  }

  updatedProduct.name = updatedProduct.name.trim();
  updatedProduct.category = updatedProduct.category.trim();

  return updateProductRecord(updatedProduct);
}

export async function deleteProduct(id) {
  const existingProduct = await getProductById(id);

  return deleteProductRecord(existingProduct.id);
}

export async function stockIn(id, quantity) {
  if (!validateStockQuantity(quantity)) {
    throw new AppError(
      "Stock quantity must be a positive integer",
      { quantity },
      "VALIDATION_ERROR"
    );
  }

  const product = await getProductById(id);

  const updatedProduct = {
    ...product,
    quantity: product.quantity + quantity,
  };

  return updateProductRecord(updatedProduct);
}

export async function stockOut(id, quantity) {
  if (!validateStockQuantity(quantity)) {
    throw new AppError(
      "Stock quantity must be a positive integer",
      { quantity },
      "VALIDATION_ERROR"
    );
  }

  const product = await getProductById(id);

  if (quantity > product.quantity) {
    throw new AppError(
      "Insufficient stock",
      {
        available: product.quantity,
        requested: quantity,
      },
      "INSUFFICIENT_STOCK"
    );
  }

  const updatedProduct = {
    ...product,
    quantity: product.quantity - quantity,
  };

  return updateProductRecord(updatedProduct);
}

function roundToTwo(value) {
  return Number(value.toFixed(2));
}

export async function getStatistics() {
  const products = await findAllProducts();

  if (products.length === 0) {
    return {
      totalProducts: 0,
      totalUnits: 0,
      totalInventoryValue: 0,
      lowStockProducts: 0,
    };
  }

  const totalProducts = products.length;

  const totalUnits = products.reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  const totalInventoryValue = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  const lowStockProducts = products.filter(
    (product) => product.quantity <= product.minStock,
  ).length;

  return {
    totalProducts,
    totalUnits,
    totalInventoryValue: roundToTwo(totalInventoryValue),
    lowStockProducts,
  };
}
