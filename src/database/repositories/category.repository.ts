import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { CategoryEntity } from '../entities';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CategoryCreateInput): Promise<CategoryEntity> {
    return this.prisma.category.create({ data });
  }

  async findMany(args?: Prisma.CategoryFindManyArgs): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({ ...args });
  }

  async update(where: Prisma.CategoryWhereUniqueInput, data: Prisma.CategoryUpdateInput): Promise<CategoryEntity> {
    return this.prisma.category.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.CategoryWhereUniqueInput): Promise<CategoryEntity> {
    return this.prisma.category.delete({ where });
  }
}