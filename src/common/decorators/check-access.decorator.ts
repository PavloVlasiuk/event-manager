import { UseGuards, applyDecorators } from '@nestjs/common';
import { RequirePermissions } from './require-permissions.decorator';
import { JwtGuard, PermissionGuard } from 'src/security/guards';

export  const CheckAccess = (...permissions: string[]) =>
  applyDecorators(
    RequirePermissions(permissions),
    UseGuards(JwtGuard, PermissionGuard)
  );