export function showHelp() {
  console.log(`
Inventory Management System

Commands:

  add
  list
  get
  update
  delete
  search
  stock-in
  stock-out
  stats
  help

Examples:

  node src/app.js add --name "Wireless Mouse" --category Electronics --price 799 --quantity 25 --min-stock 5

  node src/app.js list

  node src/app.js list --category Electronics

  node src/app.js list --low-stock true

  node src/app.js get --id prod_001

  node src/app.js search --name Mouse

  node src/app.js update --id prod_001 --price 749

  node src/app.js delete --id prod_001

  node src/app.js stock-in --id prod_001 --quantity 10

  node src/app.js stock-out --id prod_001 --quantity 5

  node src/app.js stats
`);
}