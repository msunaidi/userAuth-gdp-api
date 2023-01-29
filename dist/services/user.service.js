"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const users_1 = __importDefault(require("../databases/users"));
class UsersService {
    constructor(database) {
        this.database = database;
    }
    create({ name, email, password, }) {
        const user = new user_model_1.default(name, email, password);
        this.database.push(user);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
    update(user, payload) {
        Object.assign(user, {
            name: payload.name || user.name,
            email: payload.email || user.email,
            password: payload.password || user.password,
        });
        return user;
    }
    find() {
        return this.database;
    }
    findOneOrFail(id) {
        const user = this.database.find((user) => user.id === id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    delete(user) {
        this.database.splice(this.database.indexOf(user), 1);
    }
}
const usersService = new UsersService(users_1.default);
exports.default = usersService;
