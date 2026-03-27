import { ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { AuthRepository } from './auth.repository';
import type { User } from './auth.types';
import { generateJwtToken } from 'src/utils/jwt';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}
  async createUser(user: User) {
    const userExists = await this.authRepository.getUserByEmail(user.email);
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await this.authRepository.create({
      ...user,
      password: hashedPassword,
    });
    const refreshToken = generateJwtToken(
      createdUser,
      // 7 days
      60 * 60 * 24 * 7,
      process.env.REFRESH_TOKEN_SECRET as string,
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    return createdUser;
  }
}
