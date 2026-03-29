import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateJwtToken = (
  payload: string | object,
  expiresIn: number,
  secret: string,
) => {
  return jwt.sign(payload, secret, { expiresIn: expiresIn });
};

export const verifyJwtToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const decodeJwtToken = (token: string) => {
  return jwt.decode(token);
};

export const getJwtPayload = (token: string) => {
  return jwt.decode(token);
};
