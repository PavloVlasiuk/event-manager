import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './security/strategies/jwt.strategy';
import { LocalStrategy } from './security/strategies/local.strategy';
import { AppConfigModule } from '../config/app-config.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
  imports: [PrismaModule, JwtModule.register({}), AppConfigModule],
})
export class AuthModule {}
