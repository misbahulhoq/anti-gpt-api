import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateJwtToken = (
  payload: string | object,
  expiresIn: number,
  secret: string,
) => {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};
