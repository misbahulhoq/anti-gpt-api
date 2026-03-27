import { Injectable, Inject } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

import type { User } from './auth.types';
import { CreateUserDto } from './auth.dto';

@Injectable()
export class AuthRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async createUser(user: CreateUserDto, client: PoolClient): Promise<User> {
    const result = await client.query(
      `INSERT INTO "User" ("name", "email", "passwordHash") VALUES ($1, $2, $3) RETURNING "id", "createdAt", "name", "email", "isVerified"`,
      [user.name, user.email, user.password],
    );
    return result.rows[0] as User;
  }

  async createVerificationToken(
    userId: string,
    token: string,
    client: PoolClient,
  ): Promise<void> {
    await client.query(
      `INSERT INTO "EmailVerification" ("userId", "tokenHash", "expiresAt") VALUES ($1, $2, NOW() + INTERVAL '1 day')`,
      [userId, token],
    );
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
