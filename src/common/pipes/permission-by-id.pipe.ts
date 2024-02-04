import { Injectable, PipeTransform } from '@nestjs/common';
import { PermissionRepository } from 'src/database/repositories';
import { EntityNotFoundException } from '../exceptions';

@Injectable()
export class PermissionByIdPipe implements PipeTransform {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async transform(id: string): Promise<string> {
    const permission = await this.permissionRepository.findById(id);

    if (!permission) {
      throw new EntityNotFoundException('Permission');
    }

    return id;
  }
}