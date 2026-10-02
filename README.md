# Inventory Management System

A CLI-based Inventory Management System built with Node.js.

## Features

- Add products
- List products
- Get product by ID
- Update product details
- Delete products
- Search products by name
- Stock in
- Stock out
- Inventory statistics
- Category filtering
- Low-stock filtering
- Input validation
- Custom application errors
- JSON file persistence
- Unit tests
- Integration tests

## Tech Stack

- Node.js
- JavaScript
- ES Modules
- Node.js Test Runner
- JSON File Storage

## Architecture

```text
User
 ↓
CLI
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
JSON File
```
---

### Responsibilities
* Controller:
    - Handles application/CLI interaction
    - Delegates opration to service

* Service:
    - Contain business logic
    - Validates business rules
    - Handles stock operations
    - Calculates statistics

* Repository:
    - Handles JSON file persistence
    - Reads and writes products data

* Validation:
    - Validates product input
    - Validates stock quantities

* Errors
    - Providies custom application erros
    - Centralize CLI error handling


---

### Project Structure

inventory-management/
├── src/
│   ├── app.js
│   ├── controller/
│   │   └── inventory.controller.js
│   ├── services/
│   │   └── inventory.service.js
│   ├── repositories/
│   │   └── inventory.repository.js
│   ├── validation/
│   │   └── inventory.validation.js
│   ├── utils/
│   │   ├── cli.js
│   │   ├── help.js
│   │   └── id.js
│   └── errors/
│       ├── app-error.js
│       └── error-handler.js
│
├── data/
│   ├── inventory.json
│   ├── test-inventory.json
│   └── test-inventory-integration.json
│
├── tests/
│   ├── unit/
│   │   └── inventory.service.test.js
│   └── integration/
│       └── inventory.cli.test.js
│
├── .gitignore
├── package.json
└── README.md

--- 

### Architecture

User
 ↓
CLI / app.js
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
JSON File

and in the side

Service
 ├── Validation
 └── Errors

 --- 

 ### Installation

Clone the repository and install dependencies:

npm install
