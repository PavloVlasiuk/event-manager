import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  private include = {
    permissions: true,
  };

  async create(data: Prisma.RoleUncheckedCreateInput): Promise<Role> {
    return this.prisma.role.create({ data, include: this.include });
  }

  async findById(id: string): Promise<Role | null> {
    return this.prisma.role.findFirst({
      where: { id },
      include: this.include,
    });
  }

  async findMany(args?: Prisma.RoleFindManyArgs): Promise<Role[]> {
    return this.prisma.role.findMany({
      ...args,
      include: this.include,
    });
  }

  async update(where: Prisma.RoleWhereUniqueInput, data: Prisma.RoleUncheckedUpdateInput): Promise<Role> {
    return this.prisma.role.update({
      where,
      data,
    });
  }

  async updateMany(where: Prisma.RoleWhereInput, data: Prisma.RoleUncheckedUpdateInput): Promise<Prisma.BatchPayload> {
    return this.prisma.role.updateMany({
      where,
      data,
    });
  }
}