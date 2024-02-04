import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MappperModule } from 'src/mappers/mapper.module';
import { SecurityModule } from 'src/security/security.module';
import { UserByIdPipe } from 'src/common/pipes';

@Module({
  controllers: [UserController],
  providers: [UserService, UserByIdPipe],
  exports: [UserService, UserByIdPipe],
  imports: [MappperModule, SecurityModule],
})
export class UserModule {}