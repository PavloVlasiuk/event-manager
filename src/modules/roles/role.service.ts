import { Injectable } from '@nestjs/common';
import { PermissionRepository, RoleRepository } from 'src/database/repositories';
import { CreatePermissionDTO, CreateRoleDTO } from './dtos';
import { Permission, Role } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async createRole(data: CreateRoleDTO): Promise<Role> {
    return this.roleRepository.createOrUpdate(data);
  }

  async createPermission(roleId: string, permission: CreatePermissionDTO): Promise<Permission> {
    return this.permissionRepository.create({ roleId, action: permission.action });
  }

  async getRolePermissions(roleId: string) {
    return this.permissionRepository.findMany({ where: { roleId } });
  }

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.findMany();
  }
}
