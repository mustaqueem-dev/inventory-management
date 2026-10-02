import { AppError } from "../errors/app-error.js";

const COMMAND_OPTIONS = {
  add: ["name", "category", "price", "quantity", "min-stock"],

  list: ["category", "low-stock"],

  get: ["id"],

  update: ["id", "name", "category", "price", "min-stock"],

  delete: ["id"],

  search: ["name"],

  "stock-in": ["id", "quantity"],

  "stock-out": ["id", "quantity"],

  stats: [],
};

const REQUIRED_OPTIONS = {
  add: ["name", "category", "price", "quantity", "min-stock"],

  list: [],

  get: ["id"],

  update: ["id"],

  delete: ["id"],

  search: ["name"],

  "stock-in": ["id", "quantity"],

  "stock-out": ["id", "quantity"],

  stats: [],
};

export function parseArgs(args) {
  const options = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (!arg.startsWith("--")) {
      throw new AppError(
        `Unexpected argument "${arg}"`,
        { argument: arg },
        "INVALID_ARGUMENT",
      );
    }

    const key = arg.slice(2);

    if (!key) {
      throw new AppError(
        "Option name cannot be empty",
        null,
        "INVALID_OPTION",
      );
    }

    const value = args[i + 1];

    if (
      value === undefined ||
      value.startsWith("--")
    ) {
      throw new AppError(
        `Missing value for option "--${key}"`,
        { option: key },
        "MISSING_OPTION_VALUE",
      );
    }

    options[key] = value;

    i += 1;
  }

  return options;
}


export function validateOptions(command, options) {
  const allowedOptions =
    COMMAND_OPTIONS[command];

  if (!allowedOptions) {
    throw new AppError(
      `Unknown command "${command}"`,
      { command },
      "INVALID_COMMAND",
    );
  }

  for (const key of Object.keys(options)) {
    if (!allowedOptions.includes(key)) {
      throw new AppError(
        `Unknown option "--${key}" for command "${command}"`,
        { option: key, command },
        "UNKNOWN_OPTION",
      );
    }
  }

  const requiredOptions =
    REQUIRED_OPTIONS[command];

  for (const key of requiredOptions) {
    if (
      options[key] === undefined ||
      options[key].trim() === ""
    ) {
      throw new AppError(
        `Missing required option "--${key}"`,
        { option: key, command },
        "MISSING_OPTION",
      );
    }
  }
}