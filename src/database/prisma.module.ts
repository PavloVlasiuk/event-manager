import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  UserRepository,
  RefreshTokenRepository,
  EmailTokenRepository,
  CategoryRepository,
  PermissionRepository,
  RoleRepository,
} from './repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UserRepository,
    RefreshTokenRepository,
    EmailTokenRepository,
    RoleRepository,
    PermissionRepository,
    CategoryRepository,
  ],
  exports: [
    PrismaService,
    UserRepository,
    RefreshTokenRepository,
    EmailTokenRepository,
    RoleRepository,
    PermissionRepository,
    CategoryRepository,
  ],
})
export class PrismaModule {}
