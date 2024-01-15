import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegistrationDTO, UpdatePasswordDTO } from './dtos';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { State, TokenAssignment, User } from '@prisma/client';
import { JwtPayload } from './types/jwt-payload.type';
import { SecurityCongigService } from '../config/security-config.service';
import { HOUR } from 'src/common/constants';
import { EmailService } from '../email/email.service';
import { AccessTokenResponse, TokensResponse } from './responses';
import {
  UserRepository,
  RefreshTokenRepository,
  EmailTokenRepository,
} from 'src/database/repositories';
import {
  AlreadyRegisteredException,
  InvalidEntityIdException,
  InvalidEmailTokenException,
  IdenticalPasswordException,
  NotRegisteredException,
} from 'src/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private securityConfig: SecurityCongigService,
    private refreshTokenRepository: RefreshTokenRepository,
    private readonly emailService: EmailService,
    private readonly emailTokenRepository: EmailTokenRepository,
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
    const tokenBody = await this.emailTokenRepository.find({ token });

    if (!tokenBody) {
      throw new InvalidEmailTokenException();
    }

    const user = await this.userRepository.update(
      { email: tokenBody.email },
      { state: State.APPROVED },
    );

    await this.emailTokenRepository.delete({ token });

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

  async updatePassword(
    { oldPassword, newPassword }: UpdatePasswordDTO,
    userId: string,
  ): Promise<TokensResponse> {
    if (oldPassword === newPassword) {
      throw new IdenticalPasswordException();
    }

    const passwordHash = await this.hashPassword(newPassword);

    const user = await this.userRepository.update({ id: userId }, { passwordHash });

    const tokens = this.getTokens(user);
    await this.refreshTokenRepository.updateByUserId(user.id, tokens.refreshToken);

    return tokens;
  }

  async forgotPassword(email: string): Promise<void> {
    const isRegistered = await this.isRegistered('', email);

    if (!isRegistered) {
      throw new NotRegisteredException();
    }

    const token = await this.createEmailToken(email, TokenAssignment.RESETTING);

    await this.emailService.sendTemplatedEmail({
      to: email,
      subject: 'Request to change password on event manager',
      message: 'To change your password follow link below. It is valid during a hour.',
      link: `${process.env.FRONT_BASE_URL}/verify/${token}`,
    });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const tokenBody = await this.emailTokenRepository.find({ token });

    if (!tokenBody) {
      throw new InvalidEmailTokenException();
    }

    const passwordHash = await this.hashPassword(password);

    await this.userRepository.update({ email: tokenBody.email }, { passwordHash });
    await this.emailTokenRepository.delete({ token: tokenBody.token });
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

    return bcrypt.hash(password, salt);
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
    const token = await this.createEmailToken(email, TokenAssignment.VERIFICATION);

    await this.emailService.sendTemplatedEmail({
      to: email,
      subject: 'Email verification on event manager',
      message: 'To verify your email follow link below. It is valid during a hour.',
      link: `${process.env.FRONT_BASE_URL}/verify/${token}`,
    });
  }

  private async createEmailToken(email: string, tokenAssignment: TokenAssignment): Promise<string> {
    await this.checkIfTokenAlreadyExists(email, tokenAssignment);

    const { token } = await this.emailTokenRepository.create({
      email,
      tokenAssignment,
    });

    new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.emailTokenRepository.delete({ token }));
      }, HOUR);
    });

    return token;
  }

  private async checkIfTokenAlreadyExists(
    email: string,
    tokenAssignment: TokenAssignment,
  ): Promise<void> {
    const tokenExists = await this.emailTokenRepository.find({
      email,
      tokenAssignment,
    });

    if (tokenExists) {
      await this.emailTokenRepository.delete({ token: tokenExists.token });
    }
  }
}
