import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AppConfigModule } from './modules/config/app-config-module.module';
import * as process from 'process';

@Module({
  imports: [
    AuthModule,
    AppConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.${process.env.NODE_ENV}.env`],
    }),
  ],
})
export class AppModule {}
