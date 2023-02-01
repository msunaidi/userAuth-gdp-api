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
const user_service_1 = __importDefault(require("./user.service"));
const token_service_1 = require("./token.service");
class AuthService {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    authenticateUser(email, password) {
        const user = user_service_1.default.findOneByEmail(email);
        if (!user || user.password !== password) {
            throw new Error("Email or Password is incorrect");
        }
        this.tokenService.removeExistingToken(user.id);
        const tokenSign = this.tokenService.generateToken(user.id);
        const newToken = this.tokenService.addToken({
            tokenSign: tokenSign,
            uid: user.id,
        });
        return newToken.token;
    }
    getUserProfile(token) {
        const user = user_service_1.default.findOneOrFail(token.userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}
const authService = new AuthService(token_service_1.tokenService);
exports.default = authService;
