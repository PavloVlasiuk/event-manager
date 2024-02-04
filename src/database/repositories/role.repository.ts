import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, UserRole } from '@prisma/client';
import { RoleEntity } from '../entities';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  private include = {
    permissions: true,
  };

  async create(data: Prisma.RoleUncheckedCreateInput): Promise<RoleEntity> {
    return this.prisma.role.create({ data, include: this.include });
  }

  async find(where: Prisma.RoleWhereInput, includeUsers?: boolean): Promise<RoleEntity | RoleEntity & UserRole | null> {
    return this.prisma.role.findFirst({
      where,
      include: includeUsers ? { ...this.include, users: true } : this.include,
    });
  }

  async findById(id: string): Promise<RoleEntity | null> {
    return this.prisma.role.findFirst({
      where: { id },
      include: this.include,
    });
  }

  async findMany(args?: Prisma.RoleFindManyArgs): Promise<RoleEntity[]> {
    return this.prisma.role.findMany({
      ...args,
      include: this.include,
    });
  }

  async update(where: Prisma.RoleWhereUniqueInput, data: Prisma.RoleUncheckedUpdateInput): Promise<RoleEntity> {
    return this.prisma.role.update({
      where,
      data,
      include: this.include,
    });
  }

  async updateMany(where: Prisma.RoleWhereInput, data: Prisma.RoleUncheckedUpdateInput): Promise<Prisma.BatchPayload> {
    return this.prisma.role.updateMany({
      where,
      data,
    });
  }
}