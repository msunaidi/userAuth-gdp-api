"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("../../services/user.service"));
const http_error_model_1 = __importDefault(require("../../models/http-error.model"));
const userRouter = (0, express_1.Router)();
/**
 * A POST route to handle the submission of the form. This route will
 * create a new user in the database.
 */
userRouter.post("/", (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Bad Request",
            });
        }
        const user = user_service_1.default.create({ name, email, password });
        res.json({
            user,
        });
    }
    catch (error) {
        throw new http_error_model_1.default(500, error.message);
    }
});
/**
 * A GET route to handle the retrieval of all users in the database.
 */
userRouter.get("/", (req, res, next) => {
    try {
        const users = user_service_1.default.find();
        res.json(users);
    }
    catch (error) {
        throw new http_error_model_1.default(500, error.message);
    }
});
/**
 * A GET route to handle the retrieval of a single user in the database.
 */
userRouter.get("/:id", (req, res, next) => {
    const { id } = req.params;
    try {
        const user = user_service_1.default.findOneOrFail(id);
        res.json(user);
    }
    catch (error) {
        throw new http_error_model_1.default(404, error.message);
    }
});
/**
 * A PATCH route to handle the updating of a single user in the database.
 */
userRouter.patch("/:id", (req, res, next) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    let user;
    try {
        user = user_service_1.default.findOneOrFail(id);
    }
    catch (error) {
        throw new http_error_model_1.default(404, error.message);
    }
    try {
        user = user_service_1.default.update(user, { id, name, email, password });
        res.json(user);
    }
    catch (error) {
        throw new http_error_model_1.default(400, "Unable to update user");
    }
});
/**
 * A DELETE route to handle the deletion of a single user in the database.
 */
userRouter.delete("/:id", (req, res, next) => {
    const { id } = req.params;
    let user;
    try {
        user = user_service_1.default.findOneOrFail(id);
    }
    catch (error) {
        throw new http_error_model_1.default(404, error.message);
    }
    try {
        user_service_1.default.delete(user);
        res.json({
            message: "Success",
        });
    }
    catch (error) {
        throw new http_error_model_1.default(400, "Unable to delete user");
    }
});
exports.default = userRouter;
