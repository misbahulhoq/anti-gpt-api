import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import * as fs from 'node:fs';

import path from 'path';

import { AuthRepository } from './auth.repository';
import { CreateUserDto, VerifyEmailDto } from './auth.dto';
import { generateJwtToken, verifyJwtToken } from 'src/utils/jwt';
import { sendEmail } from 'src/utils/email-sender';
import { User } from './auth.types';

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

      const filePath = path.join(
        __dirname,
        'email-verification-template-light.html',
      );
      const template = fs.readFileSync(filePath, 'utf8');
      const verificationUrl =
        'https://chat.antisolbd.com/verify?token=' + verificationToken;

      const html = template.replaceAll(
        '{{VERIFICATION_LINK}}',
        verificationUrl,
      );

      await sendEmail({
        to: user.email,
        subject: 'Verify your email',
        html: html,
      });

      return createdUser;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async verifyEmail(req: VerifyEmailDto) {
    const client = await this.pool.connect();
    try {
      const info = verifyJwtToken(
        req.token,
        process.env.VERIFICATION_TOKEN_SECRET as string,
      );

      console.log(info);
      const user = await this.authRepository.getUserByEmail(
        (info as User).email,
      );

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      console.log(user);
      await client.query('BEGIN');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
