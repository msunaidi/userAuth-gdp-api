"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A simple logger middleware that logs the request method and path.
 */
exports.default = (req, res, next) => {
    const { method, url } = req;
    res.removeHeader("X-Powered-By");
    console.info(`${method.toUpperCase()} ${url}`);
    next();
};
