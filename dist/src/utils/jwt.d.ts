import jwt from 'jsonwebtoken';
import 'dotenv/config';
export declare const generateJwtToken: (payload: string | object, expiresIn: number, secret: string) => string;
export declare const verifyJwtToken: (token: string, secret: string) => string | jwt.JwtPayload;
export declare const decodeJwtToken: (token: string) => string | jwt.JwtPayload | null;
export declare const getJwtPayload: (token: string) => string | jwt.JwtPayload | null;
