import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

const poolProvider = {
  provide: 'PG_POOL',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const pool = new Pool({
      user: configService.get<string>('DB_USER'),
      host: configService.get<string>('DB_HOST'),
      database: configService.get<string>('DB_NAME'),
      password: configService.get<string>('DB_PASS'),
      port: 5432,
    });
    return pool;
  },
};
@Global()
@Module({
  providers: [poolProvider],
  exports: [poolProvider],
})
export class DatabaseModule {}
