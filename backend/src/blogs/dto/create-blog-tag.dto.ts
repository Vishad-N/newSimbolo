import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogTagDto {
  @ApiProperty({ example: 'Growth Hacking', description: 'Tag keyword' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
