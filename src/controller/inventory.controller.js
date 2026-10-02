import {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  stockIn,
  stockOut,
  getStatistics,
} from "../services/inventory.service.js";

export function createProductController(input) {
  return createProduct(input);
}

export function listProductsController(filters) {
  return listProducts(filters);
}

export function getProductController(id) {
  return getProductById(id);
}

export function updateProductController(
  id,
  updates,
) {
  return updateProduct(id, updates);
}

export function deleteProductController(id) {
  return deleteProduct(id);
}

export function searchProductsController(name) {
  return searchProducts(name);
}

export function stockInController(
  id,
  quantity,
) {
  return stockIn(id, quantity);
}

export function stockOutController(
  id,
  quantity,
) {
  return stockOut(id, quantity);
}

export function getStatisticsController() {
  return getStatistics();
}