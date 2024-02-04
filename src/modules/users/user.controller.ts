import { Controller, Delete, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleByIdPipe, UserByIdPipe } from 'src/common/pipes';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAccess } from 'src/common/decorators';
import { Permissions } from 'src/security/PERMISSIONS';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @CheckAccess(Permissions.USER_ROLE_CREATE)
  @Post(':userId/roles/:roleId')
  assignRole(
    @Param('userId', UserByIdPipe) userId: string,
    @Param('roleId', RoleByIdPipe) roleId: string,
  ): void {
    this.userService.assignRole(userId, roleId);
  }

  @ApiBearerAuth()
  @CheckAccess(Permissions.USER_ROLE_DELETE)
  @Delete(':userId/roles/:roleId')
  async removeRole(
    @Param('userId', UserByIdPipe) userId: string,
    @Param('roleId', RoleByIdPipe) roleId: string,
  ): Promise<void> {
    await this.userService.removeRole(userId, roleId);
  }
  
}