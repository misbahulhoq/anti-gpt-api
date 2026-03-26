import { Injectable, Inject } from '@nestjs/common';
import { User } from './auth.types';
import { Pool } from 'pg';

@Injectable()
export class AuthRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async create(user: User): Promise<User> {
    const result = await this.pool.query(
      `INSERT INTO users (id, name, email, password) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id, created_at, name, email, is_verified`,
      [user.name, user.email, user.password],
    );
    return result.rows[0] as User;
  }

  async getUserByEmail(email: string) {
    const user = await this.pool.query(`SELECT * from users WHERE email = $1`, [
      email,
    ]);
    return user;
  }

  async getUsers() {
    const users = await this.pool.query(`SELECT * from users`);
    return users;
  }
}
