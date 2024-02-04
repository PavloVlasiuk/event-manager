import { Controller, Delete, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleByIdPipe, UserByIdPipe } from 'src/common/pipes';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':userId/roles/:roleId')
  assignRole(
    @Param('userId', UserByIdPipe) userId: string,
    @Param('roleId', RoleByIdPipe) roleId: string,
  ): void {
    this.userService.assignRole(userId, roleId);
  }

  @Delete(':userId/roles/:roleId')
  async removeRole(
    @Param('userId', UserByIdPipe) userId: string,
    @Param('roleId', RoleByIdPipe) roleId: string,
  ): Promise<void> {
    await this.userService.removeRole(userId, roleId);
  }
  
}