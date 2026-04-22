// 1. ЭТИ СТРОКИ ДОЛЖНЫ БЫТЬ ПЕРВЫМИ
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

const myEnv = dotenv.config();
expand(myEnv);

// 2. ОСТАЛЬНЫЕ ИМПОРТЫ
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import IORedis from 'ioredis';
import session from 'express-session';
import { ms, StringValue } from './libs/common/utils/ms.util';
import { parseBoolean } from './libs/common/utils/parse-boolean.util';
import { RedisStore } from 'connect-redis';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get(ConfigService);
    
    // Теперь REDIS_URI подтянется корректно без знаков $
    const redis = new IORedis(config.getOrThrow('REDIS_URI'));
    
    app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true
        })
    );

    app.use(
        session({
            secret: config.getOrThrow<string>("SESSION_SECRET"),
            name: config.getOrThrow<string>('SESSION_NAME'),
            resave: true,
            saveUninitialized: false,
            cookie: {
                domain: config.getOrThrow<string>('SESSION_DOMAIN'),
                maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
                httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
                secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
                sameSite: 'lax'
            },
            store: new RedisStore({
                client: redis,
                // Добавил двоеточие в префикс, обычно для Redis так удобнее
                prefix: `${config.getOrThrow<string>('SESSION_FOLDER')}:`
            })
        })
    );

    app.enableCors({
        origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
        credentials: true,
        exposedHeaders: ['set-cookie']
    });

    // Исправил PORT на APPLICATION_PORT, как у тебя в .env
    const port = config.get<number>('APPLICATION_PORT') || 4000;
    await app.listen(port);
    
    console.log(`🚀 Server is running on: http://localhost:${port}`);
}
bootstrap();