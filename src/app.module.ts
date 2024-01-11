import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AppConfigModule } from './modules/config/app-config.module';
import * as process from 'process';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    AuthModule,
    EmailModule,
    AppConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.${process.env.NODE_ENV}.env`],
    }),
  ],
})
export class AppModule {}
