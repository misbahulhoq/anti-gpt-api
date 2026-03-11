import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'anti-gpt',
  password: 'hardtoread',
  port: 5432,
});
