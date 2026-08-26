import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { PERSON_NAME_MESSAGE, PERSON_NAME_PATTERN } from '../../common/constants/name.constant';

export class CreateStaffUserDto {
  @ApiProperty({ example: 'jane@thesimbolo.com', description: 'Team member email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @ApiProperty({
    example: 'StrongPass@123',
    description: 'Password (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, and numeric characters',
  })
  password!: string;

  @ApiProperty({ example: 'Jane', description: 'Team member first name' })
  @IsString()
  @IsNotEmpty()
  @Matches(PERSON_NAME_PATTERN, { message: `First ${PERSON_NAME_MESSAGE.toLowerCase()}` })
  @Transform(({ value }) => value?.trim())
  firstName!: string;

  @ApiProperty({ example: 'Doe', description: 'Team member last name' })
  @IsString()
  @IsNotEmpty()
  @Matches(PERSON_NAME_PATTERN, { message: `Last ${PERSON_NAME_MESSAGE.toLowerCase()}` })
  @Transform(({ value }) => value?.trim())
  lastName!: string;

  @ApiProperty({ example: 'c8a2272c-798b-45b4-a89f-0aa1461158f8', description: 'Role to assign the new team account' })
  @IsUUID()
  @IsNotEmpty()
  roleId!: string;
}
