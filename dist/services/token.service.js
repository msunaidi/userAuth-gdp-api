"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = exports.tokenService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const buffer_1 = require("buffer");
const tokens_1 = __importDefault(require("../databases/tokens"));
class TokenService {
    constructor(tokens) {
        this.tokenList = tokens;
    }
    addToken({ tokenSign, uid }) {
        const tokenObj = { token: tokenSign, userId: uid };
        this.tokenList.push(tokenObj);
        return tokenObj;
    }
    findTokenOrFail(token) {
        const findToken = this.tokenList.find((t) => t.token === token);
        if (!findToken) {
            throw new Error("Invalid token");
        }
        return findToken;
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
exports.TokenService = TokenService;
const tokenService = new TokenService(tokens_1.default);
exports.tokenService = tokenService;
