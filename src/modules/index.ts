import { ConfigModule, ConfigService } from '@nestjs/config';
import { enhance } from '@zenstackhq/runtime';
import { ZenStackModule } from '@zenstackhq/server/nestjs';
import configuration from 'src/configs/configuration';
import { PrismaService } from 'src/services';
import { JwtModule } from '@nestjs/jwt';

export default [
    ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration],
    }),
    JwtModule.register({}),
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
