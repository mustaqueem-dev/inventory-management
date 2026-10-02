export class AppError extends Error {
    constructor(message, details = null, code = "APP_ERROR") {
        super(message);

        this.name = "AppError";
        this.details = details;
        this.code = code;
    }
}