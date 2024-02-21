import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDTO } from './dtos';
import { CategoryEntity } from 'src/database/entities';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryByIdPipe } from 'src/common/pipes';
import { CheckAccess } from 'src/common/decorators';
import { Permissions } from 'src/security/PERMISSIONS';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth()
  @CheckAccess(Permissions.CATEGORY_CREATE)
  @Post()
  async create(@Body() body: CategoryDTO): Promise<CategoryEntity> {
    return this.categoryService.create(body);
  }

  @Get()
  async getAll(): Promise<CategoryEntity[]> {
    return this.categoryService.getAll();
  }

  @ApiBearerAuth()
  @CheckAccess(Permissions.CATEGORY_UPDATE)
  @Patch(':id')
  async update(
    @Param('id', CategoryByIdPipe) id: string,
    @Body() body: CategoryDTO,
  ): Promise<CategoryEntity> {
    return this.categoryService.update(id, body);
  }

  @ApiBearerAuth()
  @CheckAccess(Permissions.CATEGORY_DELETE)
  @Delete(':id')
  async delete(@Param('id', CategoryByIdPipe) id: string): Promise<CategoryEntity> {
    return this.categoryService.delete(id);
  }
}