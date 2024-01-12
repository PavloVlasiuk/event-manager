import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegistrationDTO } from './dtos';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/database/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { State, User } from '@prisma/client';
import { JwtPayload } from './types/jwt-payload.type';
import { RefreshTokenRepository } from 'src/database/repositories/refresh-token.repository';
import { SecurityCongigService } from '../config/security-config.service';
import { PrismaService } from 'src/database/prisma.service';
import { HOUR } from 'src/common/constants/time.constans';
import { EmailService } from '../email/email.service';
import {
  AlreadyRegisteredException,
  InvalidEntityIdException,
  InvalidEmailTokenException,
} from 'src/common/exceptions/index';
import { AccessTokenResponse, TokensResponse } from './responses';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private securityConfig: SecurityCongigService,
    private refreshTokenRepository: RefreshTokenRepository,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.find({ username });

    if (!user) {
      throw new InvalidEntityIdException('User');
    }

    const matchPassword = await this.checkPassword(password, user.passwordHash);

    if (!matchPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    delete user.passwordHash;

    return user;
  }

  async register({ username, email, password }: RegistrationDTO): Promise<void> {
    if (await this.isRegistered(username, email)) {
      throw new AlreadyRegisteredException();
    }

    await this.requestEmailVerification(email);

    const passwordHash = await this.hashPassword(password);
    const data = { username, email, passwordHash };
    await this.userRepository.create(data);
  }

  async verify(token: string): Promise<TokensResponse> {
    const tokenBody = await this.prisma.verifyEmailToken.findFirst({
      where: { token },
    });

    if (!tokenBody) {
      throw new InvalidEmailTokenException();
    }

    const user = await this.userRepository.update(
      { email: tokenBody.email },
      { state: State.APPROVED },
    );

    await this.prisma.verifyEmailToken.delete({ where: { token } });

    const tokens = this.getTokens(user);
    await this.refreshTokenRepository.create({
      userId: user.id,
      token: tokens.refreshToken,
    });

    return tokens;
  }

  async login(user: User): Promise<TokensResponse> {
    if (user.state !== State.APPROVED) {
      throw new UnauthorizedException('Email address is not verified yet');
    }

    const tokens = this.getTokens(user);

    await this.refreshTokenRepository.updateByUserId(user.id, tokens.refreshToken);

    return tokens;
  }

  async refresh(user: User, refreshToken: string): Promise<AccessTokenResponse> {
    const token = await this.refreshTokenRepository.findByUserId(user.id);
    if (!token) {
      throw new UnauthorizedException();
    }

    if (refreshToken !== token.token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.getAccessToken(user);
  }

  private async isRegistered(username: string, email: string): Promise<boolean> {
    const user = await this.userRepository.find({
      OR: [{ username }, { email }],
    });

    return !!user;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password, salt);
  }

  private getAccessToken(user: User): AccessTokenResponse {
    const payload = this.createPayload(user);

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.securityConfig.jwtTtl,
      secret: this.securityConfig.secret,
    });

    return {
      accessToken,
    };
  }

  private getTokens(user: User): TokensResponse {
    const payload = this.createPayload(user);

    const secret = this.securityConfig.secret;

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.securityConfig.jwtTtl,
      secret,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.securityConfig.jwtRefreshTtl,
      secret,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async checkPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private createPayload(user: User): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
    };
  }

  private async requestEmailVerification(email: string): Promise<void> {
    const tokenExists = await this.prisma.verifyEmailToken.findFirst({
      where: { email },
    });

    if (tokenExists) {
      await this.prisma.verifyEmailToken.deleteMany({
        where: { email },
      });
    }

    const { token } = await this.prisma.verifyEmailToken.create({
      data: {
        email,
      },
    });

    await this.emailService.sendTemplatedEmail({
      to: email,
      subject: 'Email verification on event manager',
      message: 'To verify your email follow link below. It is valid during a hour.',
      link: `${process.env.FRONT_BASE_URL}/verify/${token}`,
    });

    new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.prisma.verifyEmailToken.delete({ where: { token } }));
      }, HOUR);
    });
  }
}
