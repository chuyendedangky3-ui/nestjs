import { Module } from '@nestjs/common';
import appModules from 'src/modules';
import { convertObjectToArray } from 'src/utils/convert-object-to-array.util';
import * as appControllers from 'src/controllers';
import * as appServices from 'src/services';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
    imports: appModules,
    controllers: convertObjectToArray(appControllers),
    providers: [
        ...convertObjectToArray(appServices),
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
