import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaModule } from 'src/database/prisma.module';
import { SecurityModule } from 'src/security/security.module';
import { CategoryByIdPipe } from 'src/common/pipes';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryByIdPipe],
  imports: [PrismaModule, SecurityModule],
})
export class CategoryModule {}