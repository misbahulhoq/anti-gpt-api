import { Injectable } from '@nestjs/common';
import { User } from './auth.types';

@Injectable()
export class AuthRepository {
  private readonly users: User[] = [];

  create(user: User) {
    this.users.push(user);
    return user;
  }

  getUsers() {
    return this.users;
  }
}
