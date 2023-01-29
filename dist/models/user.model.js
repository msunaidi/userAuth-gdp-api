"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class User {
    constructor(name, email, password, id = (0, crypto_1.randomUUID)()) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
exports.default = User;
