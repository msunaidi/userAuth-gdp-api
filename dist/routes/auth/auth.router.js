"use strict";
// DONE: Create a route that will do the following:
// 1. Handle a POST request to /auth/login that will take in an email and password as the request body
//      and will return a JSON object with a token property. This token SHOULD be stored in the database.
// 2. Handle a POST request to /auth/profile that will take in a token in the request header with key Authentication.
//      Our clients should send the token in the following format: "Bearer <token>". for example:
//      "Bearer 1234567890". If the token is valid, then return a JSON object with the user's profile.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_error_model_1 = __importDefault(require("../../models/http-error.model"));
const auth_service_1 = __importDefault(require("../../services/auth.service"));
const token_service_1 = require("../../services/token.service");
const authRouter = (0, express_1.Router)();
authRouter.post("/login", (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Bad Request",
            });
        }
        const token = auth_service_1.default.authenticateUser(email, password);
        res.json({ token: token });
    }
    catch (error) {
        throw new http_error_model_1.default(400, error.message);
    }
});
authRouter.post("/profile", (req, res) => {
    const authzHeader = req.headers.authorization;
    if (!authzHeader) {
        return res.status(401).json({
            message: "Failed to authorize",
        });
    }
    const token = authzHeader.split(" ")[1];
    let tokenObj;
    try {
        tokenObj = token_service_1.tokenService.findTokenOrFail(token);
    }
    catch (error) {
        throw new http_error_model_1.default(401, error.message);
    }
    try {
        const user = auth_service_1.default.getUserProfile(tokenObj);
        res.json({ user });
    }
    catch (error) {
        throw new http_error_model_1.default(404, error.message);
    }
});
exports.default = authRouter;
