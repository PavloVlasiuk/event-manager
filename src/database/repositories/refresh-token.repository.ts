import { Injectable } from '@nestjs/common';
import { Prisma, RefreshToken } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.RefreshTokenUncheckedCreateInput,
  ): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.findUnique({
      where: {
        userId,
      },
    });
  }

  async updateByUserId(userId: string, token: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.update({
      data: {
        token,
      },
      where: {
        userId,
      },
    });
  }

  async deleteByUserId(userId: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.delete({
      where: {
        userId,
      },
    });
  }
}
