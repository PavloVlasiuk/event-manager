import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';
import { PermissionGuard } from './guards/permission.guard';
import { AppConfigModule } from 'src/modules/config/app-config.module';
import { PermissionModule } from 'src/modules/permissions/permission.module';

@Module({
  providers: [JwtStrategy, JwtGuard, PermissionGuard],
  exports: [JwtStrategy, JwtGuard, PermissionGuard, PermissionModule],
  imports: [AppConfigModule, PermissionModule],
})
export class SecurityModule {}