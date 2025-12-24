import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { SignInDto, SignUpDto } from 'src/dtos/auth.dto';
import { PrismaService } from './prisma.service';
import bcrypt from 'bcrypt';
import { messages } from 'src/constants/constants';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async signUp(data: SignUpDto): Promise<void> {
        await this.prismaService.user.create({
            data: {
                email: data.email,
                password: bcrypt.hashSync(data.password, 10),
            },
        });
    }

    private async generateTokens(userId: string, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                {
                    secret: this.configService.get('authentication.jwtAccessSecret'),
                    expiresIn: this.configService.get('authentication.jwtAccessExpiresIn'),
                },
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                {
                    secret: this.configService.get('authentication.jwtRefreshSecret'),
                    expiresIn: this.configService.get('authentication.jwtRefreshExpiresIn'),
                },
            ),
        ]);

        return { accessToken, refreshToken };
    }

    async signIn(data: SignInDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (!user) throw new UnauthorizedException(messages.AUTHENTICATION.USER_OR_PASSWORD_INCORRECT);

        const passwordMatches = bcrypt.compareSync(data.password, user.password);
        if (!passwordMatches) throw new UnauthorizedException(messages.AUTHENTICATION.USER_OR_PASSWORD_INCORRECT);

        return this.generateTokens(user.id, user.email);
    }

    async refresh(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('authentication.jwtRefreshSecret'),
            });
            return this.generateTokens(payload.sub, payload.email);
        } catch {
            throw new UnauthorizedException();
        }
    }
}
