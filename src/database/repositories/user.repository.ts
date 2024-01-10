import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<UserEntity> {
    return this.prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  async find(where: Prisma.UserWhereInput): Promise<UserEntity | null> {
    return this.prisma.user.findFirst({
      where,
    });
  }

  async findMany(where: Prisma.UserWhereInput): Promise<UserEntity[]> {
    return this.prisma.user.findMany({
      where,
    });
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<UserEntity> {
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async updateById(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserEntity> {
    return this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<UserEntity> {
    return this.prisma.user.delete({
      where,
    });
  }

  async deleteById(id: string): Promise<UserEntity> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
