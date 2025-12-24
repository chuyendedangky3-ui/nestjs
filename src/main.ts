import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    app.use(cookieParser());
    app.enableCors({
        origin: true,
        credentials: true,
    });

    app.setGlobalPrefix('api');

    const port = configService.get('port') ?? 8080
    await app.listen(port);
    Logger.log(`Application listening on port ${port}`);
}
bootstrap();
