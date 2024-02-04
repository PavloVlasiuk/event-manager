import { Module } from '@nestjs/common';
import { UserMapper } from './user.mapper';

@Module({
  providers: [UserMapper],
  exports: [UserMapper],
})
export class MappperModule {}