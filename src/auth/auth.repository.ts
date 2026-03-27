import { Injectable, Inject } from '@nestjs/common';
import { User } from './auth.types';
import { Pool } from 'pg';

@Injectable()
export class AuthRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async create(user: User): Promise<User> {
    const result = await this.pool.query(
      `INSERT INTO "User" ("id", "name", "email", "passwordHash") VALUES (gen_random_uuid(), $1, $2, $3) RETURNING "id", "createdAt", "name", "email", "isVerified"`,
      [user.name, user.email, user.password],
    );
    return result.rows[0] as User;
  }

  async getUserByEmail(email: string): Promise<Partial<User> | null | boolean> {
    const user = await this.pool.query(
      `SELECT "id", "name", "email", "isVerified" from "User" WHERE email = $1`,
      [email],
    );

    if (user.rows.length === 0) {
      return false;
    }

    return user.rows[0] as User;
  }
}
