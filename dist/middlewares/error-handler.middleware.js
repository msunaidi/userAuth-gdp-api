"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_error_model_1 = __importDefault(require("../models/http-error.model"));
const errorHandlerMiddleware = (error, req, res, _next) => {
    let statusCode = 500;
    let message = "Something went wrong!";
    if (error instanceof http_error_model_1.default) {
        statusCode = error.statusCode;
        message = error.message;
    }
    res.status(statusCode).json({
        message,
        statusCode,
    });
};
exports.default = errorHandlerMiddleware;
