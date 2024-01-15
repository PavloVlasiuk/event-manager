import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { EmailTokenRepository } from './repositories/email-token.repository';

@Global()
@Module({
  providers: [PrismaService, UserRepository, RefreshTokenRepository, EmailTokenRepository],
  exports: [PrismaService, UserRepository, RefreshTokenRepository, EmailTokenRepository],
})
export class PrismaModule {}
