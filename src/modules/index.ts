import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { enhance } from '@zenstackhq/runtime';
import { ZenStackModule } from '@zenstackhq/server/nestjs';
import configuration from 'src/configs/configuration';
import { PrismaService } from 'src/services';

export default [
    ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration],
    }),
    JwtModule.register({}),
    ThrottlerModule.forRoot([
        {
            name: 'default',
            ttl: 60000,
            limit: 100,
        },
    ]),
    ZenStackModule.registerAsync({
        useFactory: (prisma: PrismaService) => {
            return {
                getEnhancedPrisma: () => enhance(prisma),
            };
        },
        inject: [PrismaService],
        extraProviders: [PrismaService],
    }),
];
