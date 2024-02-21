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

  async findById(id: string): Promise<CategoryEntity | null> {
    return this.prisma.category.findFirst({ where: { id } });
  }

  async findMany(args?: Prisma.CategoryFindManyArgs): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({ ...args });
  }

  async updateById(id: string, data: Prisma.CategoryUpdateInput): Promise<CategoryEntity> {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteById(id: string): Promise<CategoryEntity> {
    return this.prisma.category.delete({ where: { id } });
  }
}