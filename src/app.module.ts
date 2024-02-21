import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AppConfigModule } from './modules/config/app-config.module';
import * as process from 'process';
import { EmailModule } from './modules/email/email.module';
import { RoleModule } from './modules/roles/role.module';
import { SecurityModule } from './security/security.module';
import { PermissionModule } from './modules/permissions/permission.module';
import { UserModule } from './modules/users/user.module';
import { MappperModule } from './mappers/mapper.module';
import { CategoryModule } from './modules/categories/category.module';

@Module({
  imports: [
    AuthModule,
    EmailModule,
    RoleModule,
    SecurityModule,
    PermissionModule,
    UserModule,
    MappperModule,
    AppConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.${process.env.NODE_ENV}.env`],
    }),
    CategoryModule,
  ],
})
export class AppModule {}
