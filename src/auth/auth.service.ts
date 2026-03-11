import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { User } from './auth.types';

@Injectable()
export class AuthService {
  private readonly authRepository = new AuthRepository();
  createUser(user: User) {
    console.log(this.authRepository.getUsers().length);
    return this.authRepository.create(user);
  }
}
