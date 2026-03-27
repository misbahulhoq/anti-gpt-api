import { ConflictException, Inject, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

import { AuthRepository } from './auth.repository';
import { CreateUserDto } from './auth.dto';
import { generateJwtToken } from 'src/utils/jwt';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    @Inject('PG_POOL') private readonly pool: Pool,
  ) {}
  async createUser(user: CreateUserDto) {
    const client = await this.pool.connect();

    const userExists = await this.authRepository.getUserByEmail(user.email);
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    try {
      await client.query('BEGIN');

      const createdUser = await this.authRepository.createUser(
        {
          ...user,
          password: hashedPassword,
        },
        client,
      );

      // Generate a verification token
      const verificationToken = generateJwtToken(
        createdUser,
        // 1 days
        60 * 60 * 24,
        process.env.VERIFICATION_TOKEN_SECRET as string,
      );
      // Hash the verification token
      const verificationTokenHash = await bcrypt.hash(verificationToken, 10);

      // Insert the verification token hash in database
      await this.authRepository.createVerificationToken(
        createdUser.id,
        verificationTokenHash,
        client,
      );
      await client.query('COMMIT');

      console.log(verificationTokenHash);

      return createdUser;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
