import { Injectable } from '@nestjs/common';
import { RoleEntity } from 'src/database/entities/role.entity';
import { PermissionRepository, RoleRepository } from 'src/database/repositories';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async deletePermission(id: string) {
    return this.permissionRepository.deleteById(id);
  }

  async matchPermissions(userId: string, permissions: string[]) {
    const userRoles = await this.roleRepository.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
    }) as unknown as RoleEntity[];

    return this.matchPermissionsInRoles(userRoles, permissions);
  }

  private matchPermissionsInRoles(roles: RoleEntity[], permissions: string[]) {
    const rolesPermissions = this.getRolesPermissions(roles);

    for (const permission of permissions) {
      if (!rolesPermissions.includes(permission)) return false;
    }

    return true;
  }

  private getRolesPermissions(roles: RoleEntity[]) {
    const rolesPermissions = [];

    for (const role of roles) {
      rolesPermissions.push(...role.permissions);
    }

    return rolesPermissions.map(({ action }) => action);
  }
}