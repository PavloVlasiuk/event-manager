import { ApiProperty } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { validationOptionsMsg } from 'src/common/utils';

export class CreateRoleDTO {
  @ApiProperty({
    enum: RoleName,
    description: 'Name of the role',
  })
  @IsEnum(RoleName, validationOptionsMsg('Name must be RoleName unum type'))
  @IsNotEmpty(validationOptionsMsg('Name cannot be empty'))
    name: RoleName;
}