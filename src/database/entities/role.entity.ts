import { Permission, RoleName } from '@prisma/client';

export class RoleEntity {
  id: string;
  name: RoleName;
  permissions: Permission[];
  createdAt: Date | null;
  updatedAt: Date | null;
}