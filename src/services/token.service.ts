import crypto from "crypto";
import { Buffer } from "buffer";
import tokens from "../databases/tokens";
import Token from "../models/token.model";

class TokenService {
  tokenList: Token[];

  constructor(tokens: Token[]) {
    this.tokenList = tokens;
  }

  addToken({ tokenSign, uid }: { tokenSign: string; uid: string }) {
    const tokenObj: Token = { token: tokenSign, userId: uid };
    this.tokenList.push(tokenObj);

    return tokenObj;
  }

  findTokenOrFail(token: string): Token {
    const findToken = this.tokenList.find((t) => t.token === token);

    if (!findToken) {
      throw new Error("Invalid token");
    }

    return findToken;
  }

  removeExistingToken(uid: string) {
    const tokenIndex: number = this.tokenList.findIndex(
      (t) => t.userId === uid
    );
    if (tokenIndex !== -1) {
      this.tokenList.splice(tokenIndex, 1);
    }
  }

  generateToken(uid: string): string {
    const { privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });

    const data = Buffer.from(uid);
    const sign = crypto.sign("SHA256", data, privateKey);

    const tokenSign = sign.toString("base64");

    return tokenSign;
  }
}

const tokenService = new TokenService(tokens);

export { tokenService, TokenService };
