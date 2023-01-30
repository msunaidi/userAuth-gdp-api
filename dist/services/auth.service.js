"use strict";
// DONE: Create auth service that will do the following:
// 1. Create a method that will take in an email and password; based on the email,
//      find the user in the database and compare the password. If the password is correct, then
//      generate a token and store it in the database. If the user already owns a token in
//      the database we have to delete the previous token before creating a new one. and then we have to return the token.
// 2. Create a method that will take in a token and return the user's who owns the token.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const buffer_1 = require("buffer");
const users_1 = __importDefault(require("../databases/users"));
const tokens_1 = __importDefault(require("../databases/tokens"));
class AuthService {
    constructor(database) {
        this.tokenList = database;
    }
    verifyUser(email, password) {
        const user = users_1.default.find((u) => u.email === email);
        if (!user) {
            throw new Error("Email not found");
        }
        if (user.password !== password) {
            throw new Error("Password is incorrect");
        }
        this.removeExistingToken(user.id);
        const tokenSign = this.generateToken(user.id);
        const tokenObj = { token: tokenSign, userId: user.id };
        this.tokenList.push(tokenObj);
        return tokenObj.token;
    }
    getUser(token) {
        const findToken = this.tokenList.find((t) => t.token === token);
        if (!findToken) {
            throw new Error("Invalid token");
        }
        const user = users_1.default.find((u) => u.id === findToken.userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    removeExistingToken(uid) {
        const tokenIndex = this.tokenList.findIndex((t) => t.userId === uid);
        if (tokenIndex !== -1) {
            this.tokenList.splice(tokenIndex, 1);
        }
    }
    generateToken(uid) {
        const { privateKey } = crypto_1.default.generateKeyPairSync("rsa", {
            modulusLength: 2048,
        });
        const data = buffer_1.Buffer.from(uid);
        const sign = crypto_1.default.sign("SHA256", data, privateKey);
        const tokenSign = sign.toString("base64");
        return tokenSign;
    }
}
const authService = new AuthService(tokens_1.default);
exports.default = authService;
