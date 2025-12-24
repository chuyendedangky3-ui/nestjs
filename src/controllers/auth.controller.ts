import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { SignInDto, SignUpDto } from 'src/dtos/auth.dto';
import { AuthService } from 'src/services';
import { handleRequest } from 'src/utils/api-helper';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {}

    @Post('signup')
    async signup(@Body() body: SignUpDto) {
        return handleRequest({
            action: () => this.authService.signUp(body),
        });
    }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('login')
    async login(@Body() body: SignInDto, @Res({ passthrough: true }) res: Response) {
        return handleRequest({
            action: async () => {
                const { accessToken, refreshToken } = await this.authService.signIn(body);

                res.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                return { accessToken };
            },
        });
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return handleRequest({
            action: async () => {
                const refreshToken = req.cookies['refresh_token'];
                if (!refreshToken) throw new UnauthorizedException();

                const tokens = await this.authService.refresh(refreshToken);

                res.cookie('refresh_token', tokens.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                return { accessToken: tokens.accessToken };
            },
        });
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        return handleRequest({
            action: async () => {
                res.clearCookie('refresh_token');
                return { message: 'Signed out successfully' };
            },
        });
    }
}
