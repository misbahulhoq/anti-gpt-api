import { ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { AuthRepository } from './auth.repository';
import type { User } from './auth.types';

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

    return createdUser;
  }
}
