import { Injectable, PipeTransform } from '@nestjs/common';
import { UserRepository } from 'src/database/repositories';
import { EntityNotFoundException } from '../exceptions';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private readonly userRepository: UserRepository) {}

  async transform(id: string): Promise<string> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new EntityNotFoundException('User');
    }

    return id;
  }
}