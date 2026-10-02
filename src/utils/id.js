export function generateProductId(products) {
    const nextNumber = products.length + 1;

    return `prod_${String(nextNumber).padStart(3, "0")}`
}