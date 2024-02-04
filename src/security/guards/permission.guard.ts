import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { PermissionService } from 'src/modules/permissions/permission.service';
import { Request } from 'express';
import { NoPermissionException } from 'src/common/exceptions';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    const user = request.user as User;
    const permissions = this.getPermissions(context);

    const isMatch = await this.permissionService.matchPermissions(user.id, permissions);

    if (!isMatch) {
      throw new NoPermissionException();
    }

    return true;
  }

  private getPermissions(context: ExecutionContext): string[] {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());

    return permissions;
  }
}