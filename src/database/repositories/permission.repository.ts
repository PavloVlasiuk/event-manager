import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Permission, Prisma } from '@prisma/client';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PermissionUncheckedCreateInput): Promise<Permission> {
    return this.prisma.permission.create({ data });
  }

  async findById(id: string): Promise<Permission> {
    return this.prisma.permission.findFirst({
      where: { id },
    });
  }

  async findMany(args?: Prisma.PermissionFindManyArgs): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      ...args,
    });
  }

  async deleteById(id: string): Promise<Permission> {
    return this.prisma.permission.delete({
      where: {
        id,
      },
    });
  }
}