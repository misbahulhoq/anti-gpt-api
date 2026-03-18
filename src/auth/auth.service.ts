import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { AuthRepository } from './auth.repository';
import { User } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}
  async createUser(user: User) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const userWithPassword = await this.authRepository.create({
      ...user,
      password: hashedPassword,
    });

    const userWithoutPassword = {
      name: userWithPassword.name,
      email: userWithPassword.email,
    };
    return userWithoutPassword;
  }

  async getUsers() {
    const users = await this.authRepository.getUsers();
    return users;
  }
}
