import { Injectable } from '@nestjs/common';
import { RoleName } from '@prisma/client';
import { RoleEntity } from 'src/database/entities';
import { UserEntity } from 'src/database/entities';

@Injectable()
export class UserMapper {

  getUserWithRoles(user: UserEntity, roles: RoleEntity[]): UserEntity & { roles: RoleName[] } {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      state: user.state,
      roles: this.getUserRoles(roles),
    } as UserEntity & { roles: RoleName[] };
  }

  private getUserRoles(roles: RoleEntity[]): RoleName[] {
    return roles.map(({ name }) => name);
  }
}