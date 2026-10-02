function isValidName(name) {
    return (
        typeof name === "string" &&
        name.trim().length > 0
    );
}

function isValidCategory(category) {
  return (
    typeof category === "string" &&
    category.trim().length > 0
  );
}

function isValidPrice(price) {
  return (
    typeof price === "number" &&
    Number.isFinite(price) &&
    price > 0
  );
}

function isValidQuantity(quantity) {
  return (
    Number.isInteger(quantity) &&
    quantity >= 0
  );
}

function isValidMinStock(minStock) {
  return (
    Number.isInteger(minStock) &&
    minStock >= 0
  );
}

export function validateProductInput(input) {
  const errors = {};

  if (!isValidName(input.name)) {
    errors.name =
      "Name must be a non-empty string";
  }

  if (!isValidCategory(input.category)) {
    errors.category =
      "Category must be a non-empty string";
  }

  if (!isValidPrice(input.price)) {
    errors.price =
      "Price must be a positive number";
  }

  if (!isValidQuantity(input.quantity)) {
    errors.quantity =
      "Quantity must be a non-negative integer";
  }

  if (!isValidMinStock(input.minStock)) {
    errors.minStock =
      "Minimum stock must be a non-negative integer";
  }

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      errors
    };
  }

  return {
    valid: true,
    errors: {}
  };
}

export function validateStockQuantity(quantity) {
    return (
        Number.isInteger(quantity) && quantity > 0
    );
}