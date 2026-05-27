import { User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './auth.dto';
type PrismaTx = Omit<PrismaService, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>;
export declare class AuthRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUser(user: CreateUserDto, client: PrismaTx): Promise<Omit<User, 'passwordHash'>>;
    createVerificationToken(userId: string, token: string, client: PrismaTx): Promise<void>;
    getUserByEmail(email: string): Promise<Partial<User> | null>;
    getUserById(id: string): Promise<Partial<User> | null>;
    verifyUser(email: string, client: PrismaTx): Promise<void>;
    deleteEmailVerificationToken(email: string, client: PrismaTx): Promise<void>;
}
export {};
