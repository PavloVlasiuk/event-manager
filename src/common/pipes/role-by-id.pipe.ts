import { Injectable, PipeTransform } from '@nestjs/common';
import { RoleRepository } from 'src/database/repositories';
import { EntityNotFoundException } from '../exceptions';

@Injectable()
export class RoleByIdPipe implements PipeTransform {
  constructor(private readonly roleRepository: RoleRepository) {}

  async transform(id: string): Promise<string> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new EntityNotFoundException('Role');
    }

    return id;
  }
}