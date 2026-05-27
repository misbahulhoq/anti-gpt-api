import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, VerifyEmailDto } from './auth.dto';
import type { User } from './auth.types';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(createUserDto: CreateUserDto): Promise<Partial<User>>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<void>;
    login(loginUserDto: LoginUserDto): void;
}
