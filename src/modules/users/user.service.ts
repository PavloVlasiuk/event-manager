import { Injectable } from '@nestjs/common';
import { RoleName } from '@prisma/client';
import { EntityNotFoundException } from 'src/common/exceptions';
import { UserEntity } from 'src/database/entities';
import { RoleRepository, UserRepository } from 'src/database/repositories';
import { UserMapper } from 'src/mappers';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async getUserWithRoles(id: string): Promise<UserEntity & { roles: RoleName[] }> {
    const user = await this.userRepository.findById(id);
    const roles = await this.roleRepository.findMany({
      where: {
        users: {
          some: {
            userId: id,
          },
        },
      },
    });

    return this.userMapper.getUserWithRoles(user, roles);
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    await this.userRepository.updateById(userId, {
      roles: {
        connectOrCreate: {
          where: {
            userId_roleId: {
              userId,
              roleId,
            },
          },
          create: {
            roleId,
          },
        },
      },
    });
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    const userRole = await this.roleRepository.find(
      {
        users: {
          some: {
            userId,
            roleId,
          },
        },
      },
      true,
    );
    console.log(userRole);

    if (!userRole) {
      throw new EntityNotFoundException('UserRole');
    }

    await this.userRepository.updateById(userId, {
      roles: {
        delete: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
      },
    });
  }
}
