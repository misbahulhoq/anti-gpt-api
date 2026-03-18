import { Injectable, Inject } from '@nestjs/common';
import { User } from './auth.types';
import { Pool } from 'pg';

@Injectable()
export class AuthRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async create(user: User) {
    await this.pool.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
      [user.name, user.email, user.password],
    );

    return user;
  }

  async getUsers() {
    const users = await this.pool.query(`SELECT * from users`);
    return users;
  }
}
