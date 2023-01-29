// DONE: Create auth service that will do the following:
// 1. Create a method that will take in an email and password; based on the email,
//      find the user in the database and compare the password. If the password is correct, then
//      generate a token and store it in the database. If the user already owns a token in
//      the database we have to delete the previous token before creating a new one. and then we have to return the token.
// 2. Create a method that will take in a token and return the user's who owns the token.

import crypto from "crypto";
import { Buffer } from "buffer";
import users from "../databases/users";
import User from "../models/user.model";
import Token from "../models/token.model";
import tokens from "../databases/tokens";

class AuthService {
  tokenList: Token[];

  constructor(database: Token[]) {
    this.tokenList = database;
  }

  verifyUser(email: string, password: string): string {
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new Error("Email not found");
    }
    if (user.password !== password) {
      throw new Error("Password don't match");
    }

    this.removeExistingToken(user.id);

    const tokenSign = this.generateToken(user.id);
    const token: Token = { token: tokenSign, userId: user.id };
    tokens.push(token);

    return token.token;
  }

  getUser(token: string): User {
    const findToken = this.tokenList.find((t) => t.token == token);
    if (!findToken) {
      throw new Error("Token not found");
    }
    const user = users.find((u) => u.id === findToken.userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  private removeExistingToken(uid: string) {
    const tokenIndex: number = this.tokenList.findIndex(
      (t) => t.userId === uid
    );
    if (tokenIndex !== -1) {
      this.tokenList = this.tokenList.filter((t, i) => i != tokenIndex);
    }
  }

  private generateToken(uid: string): string {
    const { privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });

    const data = Buffer.from(uid);
    const sign = crypto.sign("SHA256", data, privateKey);

    const tokenSign = sign.toString("base64");

    return tokenSign;
  }
}

const authService = new AuthService(tokens);

export default authService;
