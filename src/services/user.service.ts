import User from "../models/user.model";
import users from "../databases/users";

class UsersService {
  database: User[];

  constructor(database: User[]) {
    this.database = database;
  }

  create({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const user = new User(name, email, password);

    this.database.push(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  update(user: User, payload: User): User {
    Object.assign(user, {
      name: payload.name || user.name,
      email: payload.email || user.email,
      password: payload.password || user.password,
    });

    return user;
  }

  find(): User[] {
    return this.database;
  }

  findOneOrFail(id: string): User {
    const user = this.database.find((user) => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  delete(user: User): void {
    this.database.splice(this.database.indexOf(user), 1);
  }
}

const usersService = new UsersService(users);

export default usersService;
