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
    const userExists = await this.authRepository.getUserByEmail(user.email);
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await this.authRepository.createUser({
      ...user,
      password: hashedPassword,
    });
    const verificationToken = generateJwtToken(
      createdUser,
      // 1 days
      60 * 60 * 24,
      process.env.VERIFICATION_TOKEN_SECRET as string,
    );

    const verificationTokenHash = await bcrypt.hash(verificationToken, 10);

    console.log(verificationTokenHash);

    return createdUser;
  }
}
