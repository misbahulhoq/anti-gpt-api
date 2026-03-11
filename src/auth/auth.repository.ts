import { Injectable } from '@nestjs/common';
import { User } from './auth.types';
import { pool } from 'src/database/pool';

@Injectable()
export class AuthRepository {
  private readonly users: User[] = [];

  async create(user: User) {
    const client = await pool.connect();
    client.query(
      `INSERT into users (name, email, password) VALUES ('${user.email}', '${user.email}', '${user.password}')`,
    );
    this.users.push(user);
    return user;
  }

  getUsers() {
    return this.users;
  }
}
