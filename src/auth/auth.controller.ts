import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() createUserDto: CreateUserDto): any {
    console.log(createUserDto);
    this.authService.createUser();
  }

  @Get('/login')
  login(@Req() request: Request): { reqBody: string } {
    console.log(request.ip);
    return {
      reqBody: JSON.stringify(request.headers),
    };
  }
}
