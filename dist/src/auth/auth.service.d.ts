import { AuthRepository } from './auth.repository';
import { CreateUserDto, VerifyEmailDto } from './auth.dto';
import { PrismaService } from '../database/prisma.service';
export declare class AuthService {
    private readonly authRepository;
    private readonly prisma;
    constructor(authRepository: AuthRepository, prisma: PrismaService);
    createUser(user: CreateUserDto): Promise<any>;
    verifyEmail(req: VerifyEmailDto): Promise<any>;
}
