import { Injectable, PipeTransform } from '@nestjs/common';
import { CategoryRepository } from 'src/database/repositories';
import { EntityNotFoundException } from '../exceptions';

@Injectable()
export class CategoryByIdPipe implements PipeTransform {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async transform(id: string): Promise<string> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new EntityNotFoundException('Category');
    }

    return id;
  }
}