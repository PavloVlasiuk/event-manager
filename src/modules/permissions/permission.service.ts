import { Injectable } from '@nestjs/common';
import { ADMIN_PERMISSIONS } from 'src/common/constants';
import { RoleEntity } from 'src/database/entities';
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

  async matchPermissions(userId: string, permissions: string[]): Promise<boolean> {
    const userRoles = await this.roleRepository.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
    });

    return this.matchPermissionsInRoles(userRoles, permissions);
  }

  private matchPermissionsInRoles(roles: RoleEntity[], permissions: string[]): boolean {
    const rolesPermissions = this.getRolesPermissions(roles);

    if (rolesPermissions.includes(ADMIN_PERMISSIONS)) return true;

    for (const permission of permissions) {
      if (!rolesPermissions.includes(permission)) return false;
    }

    return true;
  }

  private getRolesPermissions(roles: RoleEntity[]): string[] {
    const rolesPermissions = [];

    for (const role of roles) {
      rolesPermissions.push(...role.permissions);
    }

    return rolesPermissions.map(({ action }) => action);
  }
}