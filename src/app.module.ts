import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [
    // Environment variables configuration
    ConfigModule.forRoot({ isGlobal: true }),
    // Rate limiter
    ThrottlerModule.forRoot([{ ttl: 60, limit: 10 }]),

    AuthModule,
    DatabaseModule,
  ],
  controllers: [AppController, ChatController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    ChatService,
  ],
})
export class AppModule {}
