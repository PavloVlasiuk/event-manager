import { Controller, Delete, Param } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionByIdPipe } from 'src/common/pipes';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Delete(':id')
  async deletePermission(@Param('id', PermissionByIdPipe) id: string) {
    return await this.permissionService.deletePermission(id);
  }
}