import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { User } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}
  createUser(user: User) {
    return this.authRepository.create(user);
  }
}
