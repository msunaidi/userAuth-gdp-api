import { randomUUID } from "crypto";

class User {
  id: string;
  name: string;
  email: string;
  password: string;

  constructor(
    name: string,
    email: string,
    password: string,
    id = randomUUID()
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

export default User;
