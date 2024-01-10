import { Module } from '@nestjs/common';
import { SecurityCongigService } from './security-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [SecurityCongigService],
  exports: [SecurityCongigService],
})
export class AppConfigModule extends ConfigModule {}
