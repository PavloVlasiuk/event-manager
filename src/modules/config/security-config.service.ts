import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityCongigService {
  constructor(private readonly config: ConfigService) {}

  get secret(): string {
    return this.config.get<string>('JWT_SECRET');
  }

  get jwtTtl(): string {
    return this.config.get<string>('JWT_TTL');
  }

  get jwtRefreshTtl(): string {
    return this.config.get<string>('JWT_REFRESH_TTL');
  }
}
