// DONE: Create auth service that will do the following:
// 1. Create a method that will take in an email and password; based on the email,
//      find the user in the database and compare the password. If the password is correct, then
//      generate a token and store it in the database. If the user already owns a token in
//      the database we have to delete the previous token before creating a new one. and then we have to return the token.
// 2. Create a method that will take in a token and return the user's who owns the token.

import crypto from "crypto";
import { Buffer } from "buffer";
import User from "../models/user.model";
import Token from "../models/token.model";
import tokens from "../databases/tokens";
import usersService from "./user.service";

class AuthService {
  tokenList: Token[];

  constructor(database: Token[]) {
    this.tokenList = database;
  }

  authenticateUser(email: string, password: string): string {
    const user = usersService.findOneOrFail("email", email);

    if (!user || user.password !== password) {
      throw new Error("Email or Password is incorrect");
    }

    this.removeExistingToken(user.id);

    const tokenSign = this.generateToken(user.id);
    const tokenObj: Token = { token: tokenSign, userId: user.id };
    this.tokenList.push(tokenObj);

    return tokenObj.token;
  }

  getUser(token: Token): User {
    const user = usersService.findOneOrFail("id", token.userId);

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  findTokenOrFail(token: string): Token {
    const findToken = this.tokenList.find((t) => t.token === token);

    if (!findToken) {
      throw new Error("Invalid token");
    }

    return findToken;
  }

  private removeExistingToken(uid: string) {
    const tokenIndex: number = this.tokenList.findIndex(
      (t) => t.userId === uid
    );
    if (tokenIndex !== -1) {
      this.tokenList.splice(tokenIndex, 1);
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
