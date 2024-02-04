import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { PrismaModule } from 'src/database/prisma.module';
import { SecurityModule } from 'src/security/security.module';
import { RoleByIdPipe } from 'src/common/pipes';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleByIdPipe],
  exports: [RoleService, RoleByIdPipe],
  imports: [PrismaModule, SecurityModule],
})
export class RoleModule {}