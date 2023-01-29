"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError {
    constructor(statusCode, message) {
        this.statusCode = statusCode;
        this.message = message;
    }
}
exports.default = HttpError;
