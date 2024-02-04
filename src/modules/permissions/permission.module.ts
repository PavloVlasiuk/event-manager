import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionByIdPipe } from 'src/common/pipes';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PermissionByIdPipe],
  exports: [PermissionService, PermissionByIdPipe],
})
export class PermissionModule {}