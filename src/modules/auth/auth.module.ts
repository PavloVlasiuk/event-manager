import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../../security/strategies';
import { AppConfigModule } from '../config/app-config.module';
import { EmailModule } from '../email/email.module';
import { LocalAuthGuard } from 'src/security/guards';
import { SecurityModule } from 'src/security/security.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalAuthGuard],
  exports: [AuthService],
  imports: [PrismaModule, JwtModule.register({}), AppConfigModule, EmailModule, SecurityModule],
})
export class AuthModule {}
