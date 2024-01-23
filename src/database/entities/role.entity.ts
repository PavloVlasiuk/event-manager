import { Permission, RoleName } from '@prisma/client';

export class RoleEntity {
  id: string;
  name: RoleName;
  permissions: Permission[];
}