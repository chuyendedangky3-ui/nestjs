import { Module } from '@nestjs/common';
import appModules from 'src/modules';
import { convertObjectToArray } from 'src/utils/convert-object-to-array.util';
import * as appControllers from 'src/controllers';
import * as appServices from 'src/services';

@Module({
    imports: appModules,
    controllers: convertObjectToArray(appControllers),
    providers: [...convertObjectToArray(appServices)],
})
export class AppModule {}
