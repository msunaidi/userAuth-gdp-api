// DONE: Create auth service that will do the following:
// 1. Create a method that will take in an email and password; based on the email,
//      find the user in the database and compare the password. If the password is correct, then
//      generate a token and store it in the database. If the user already owns a token in
//      the database we have to delete the previous token before creating a new one. and then we have to return the token.
// 2. Create a method that will take in a token and return the user's who owns the token.

import User from "../models/user.model";
import Token from "../models/token.model";
import usersService from "./user.service";
import { tokenService, TokenService } from "./token.service";

class AuthService {
  tokenService: TokenService;

  constructor(tokenService: TokenService) {
    this.tokenService = tokenService;
  }

  authenticateUser(email: string, password: string): string {
    const user = usersService.findOneByEmail(email);

    if (!user || user.password !== password) {
      throw new Error("Email or Password is incorrect");
    }

    this.tokenService.removeExistingToken(user.id);

    const tokenSign = this.tokenService.generateToken(user.id);
    const newToken: Token = this.tokenService.addToken({
      tokenSign: tokenSign,
      uid: user.id,
    });

    return newToken.token;
  }

  getUserProfile(token: Token): User {
    const user = usersService.findOneOrFail(token.userId);

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

const authService = new AuthService(tokenService);

export default authService;
