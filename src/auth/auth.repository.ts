import { Injectable, Inject } from '@nestjs/common';
import type { User } from './auth.types';
import { Pool } from 'pg';
import { CreateUserDto } from './auth.dto';

@Injectable()
export class AuthRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async createUser(user: CreateUserDto): Promise<User> {
    const result = await this.pool.query(
      `INSERT INTO "User" ("id", "name", "email", "passwordHash") VALUES (gen_random_uuid(), $1, $2, $3) RETURNING "id", "createdAt", "name", "email", "isVerified"`,
      [user.name, user.email, user.password],
    );
    return result.rows[0] as User;
  }

  async createVerificationToken(userId: string, token: string): Promise<any> {
    const result = await this.pool.query(
      `INSERT INTO "VerificationToken" ("userId", "token") VALUES ($1, $2)`,
      [userId, token],
    );
    return result.rows[0];
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
