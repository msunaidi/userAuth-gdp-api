"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_middleware_1 = __importDefault(require("./middlewares/logger.middleware"));
const error_handler_middleware_1 = __importDefault(require("./middlewares/error-handler.middleware"));
const users_router_1 = __importDefault(require("./routes/users/users.router"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(logger_middleware_1.default);
app.use("/users", users_router_1.default);
app.use(error_handler_middleware_1.default);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
