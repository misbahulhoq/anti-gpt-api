"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fs = __importStar(require("node:fs"));
const path = __importStar(require("path"));
const auth_repository_1 = require("./auth.repository");
const jwt_1 = require("../utils/jwt");
const email_sender_1 = require("../utils/email-sender");
const prisma_service_1 = require("../database/prisma.service");
let AuthService = class AuthService {
    authRepository;
    prisma;
    constructor(authRepository, prisma) {
        this.authRepository = authRepository;
        this.prisma = prisma;
    }
    async createUser(user) {
        const userExists = await this.authRepository.getUserByEmail(user.email);
        if (userExists) {
            throw new common_1.ConflictException('User already exists');
        }
        const hashedPassword = await bcryptjs_1.default.hash(user.password, 10);
        return this.prisma.$transaction(async (tx) => {
            const createdUser = await this.authRepository.createUser({
                ...user,
                password: hashedPassword,
            }, tx);
            const verificationToken = (0, jwt_1.generateJwtToken)(createdUser, 60 * 60 * 24, process.env.VERIFICATION_TOKEN_SECRET);
            const verificationTokenHash = await bcryptjs_1.default.hash(verificationToken, 10);
            await this.authRepository.createVerificationToken(createdUser.id, verificationTokenHash, tx);
            const filePath = path.join(__dirname, 'email-verification-template-light.html');
            const template = fs.readFileSync(filePath, 'utf8');
            const verificationUrl = 'https://chat.antisolbd.com/verify?token=' + verificationToken;
            const html = template.replaceAll('{{VERIFICATION_LINK}}', verificationUrl);
            await (0, email_sender_1.sendEmail)({
                to: user.email,
                subject: 'Verify your email',
                html: html,
            });
            return createdUser;
        });
    }
    async verifyEmail(req) {
        return this.prisma.$transaction(async (tx) => {
            const info = (0, jwt_1.verifyJwtToken)(req.token, process.env.VERIFICATION_TOKEN_SECRET);
            const user = await this.authRepository.getUserByEmail(info.email);
            if (!user) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            await this.authRepository.verifyUser(info.email, tx);
            await this.authRepository.deleteEmailVerificationToken(info.email, tx);
            return { message: 'Email verified successfully' };
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map