import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ValidateEmployeeCodeDto {
  @ApiProperty({ description: 'Employee / affiliate code entered at checkout', example: 'EMP-7K2QX' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  employeeCode: string;
}
