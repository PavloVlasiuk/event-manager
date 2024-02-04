import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreatePermissionDTO, CreateRoleDTO } from './dtos';
import { Permission, Role } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleByIdPipe } from 'src/common/pipes';
import { CheckAccess } from 'src/common/decorators';
import { Permissions } from 'src/security/PERMISSIONS';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiBearerAuth()
  @CheckAccess(Permissions.ROLES_CREATE)
  @Post()
  async createRole(@Body() body: CreateRoleDTO): Promise<Role> {
    return await this.roleService.createRole(body);
  }

  @ApiBearerAuth()
  @CheckAccess(Permissions.ROLES_PERMISSIONS_CREATE)
  @Post(':roleId/permission')
  async createPermission(
    @Param('roleId', RoleByIdPipe) roleId: string,
    @Body() body: CreatePermissionDTO,
  ): Promise<Permission> {
    return await this.roleService.createPermission(roleId, body);
  }

  @Get(':roleId')
  async getRolePermissions(@Param('roleId', RoleByIdPipe) roleId: string) {
    return await this.roleService.getRolePermissions(roleId);
  }

  @Get()
  async getAllRoles(): Promise<Role[]> {
    return await this.roleService.getAllRoles();
  }
}
