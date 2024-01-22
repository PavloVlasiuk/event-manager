import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { EmailTokenRepository } from './repositories/email-token.repository';
import { PermissionRepository, RoleRepository } from './repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UserRepository,
    RefreshTokenRepository,
    EmailTokenRepository,
    RoleRepository,
    PermissionRepository,
  ],
  exports: [
    PrismaService,
    UserRepository,
    RefreshTokenRepository,
    EmailTokenRepository,
    RoleRepository,
    PermissionRepository,
  ],
})
export class PrismaModule {}
