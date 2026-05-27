"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let AuthRepository = class AuthRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(user, client) {
        return client.user.create({
            data: {
                name: user.name,
                email: user.email,
                passwordHash: user.password,
            },
            select: {
                id: true,
                createdAt: true,
                name: true,
                email: true,
                isVerified: true,
                updatedAt: true,
                isDeleted: true,
            },
        });
    }
    async createVerificationToken(userId, token, client) {
        await client.emailVerification.create({
            data: {
                userId,
                tokenHash: token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
    }
    async getUserByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                isVerified: true,
            },
        });
    }
    async getUserById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                isVerified: true,
            },
        });
    }
    async verifyUser(email, client) {
        await client.user.update({
            where: { email },
            data: { isVerified: true },
        });
    }
    async deleteEmailVerificationToken(email, client) {
        const user = await client.user.findUnique({ where: { email } });
        if (user) {
            await client.emailVerification.deleteMany({
                where: { userId: user.id },
            });
        }
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map