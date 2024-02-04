import { Controller, Delete, Param } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionByIdPipe } from 'src/common/pipes';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAccess } from 'src/common/decorators';
import { Permissions } from 'src/security/PERMISSIONS';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiBearerAuth()
  @CheckAccess(Permissions.PERMISSIONS_DELETE)
  @Delete(':id')
  async deletePermission(@Param('id', PermissionByIdPipe) id: string) {
    return await this.permissionService.deletePermission(id);
  }
}