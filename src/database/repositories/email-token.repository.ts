import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmailTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EmailTokenCreateInput) {
    return this.prisma.emailToken.create({ data });
  }

  async find(where: Prisma.EmailTokenWhereInput) {
    return this.prisma.emailToken.findFirst({ where });
  }

  async delete(where: Prisma.EmailTokenWhereUniqueInput) {
    return this.prisma.emailToken.delete({ where });
  }
}
