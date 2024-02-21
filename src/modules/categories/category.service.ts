import { Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/database/repositories';
import { CategoryDTO } from './dtos';
import { CategoryEntity } from 'src/database/entities';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(data: CategoryDTO): Promise<CategoryEntity> {
    return this.categoryRepository.create(data);
  }

  async getAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findMany();
  }

  async update(id: string, data: CategoryDTO): Promise<CategoryEntity> {
    return this.categoryRepository.updateById(id, data);
  }

  async delete(id: string): Promise<CategoryEntity> {
    return this.categoryRepository.deleteById(id);
  }
}