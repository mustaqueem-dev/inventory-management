import { AppError } from "./app-error.js";

export function handleError(error) {
  if (error instanceof AppError) {
    console.error(`Error: ${error.message}`);

    if (error.details) {
      console.error(
        "Details:",
        JSON.stringify(
          error.details,
          null,
          2,
        ),
      );
    }

    return;
  }

  console.error(
    "Error: Something went wrong.",
  );

  console.error(error.message);
}