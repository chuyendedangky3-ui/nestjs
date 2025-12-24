import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const configService = app.get(ConfigService);

    app.use(cookieParser());
    app.enableCors({
        origin: true,
        credentials: true,
    });

    app.setGlobalPrefix('api');

    const port = configService.get('port') ?? 8080;
    await app.listen(port);
    Logger.log(`Application listening on port ${port}`);
}
bootstrap();
