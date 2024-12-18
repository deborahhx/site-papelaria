import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsArray } from 'class-validator';

export class SignUpUserDto {
  @ApiProperty({ 
    description: 'User email address', 
    example: 'user@example.com' 
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ 
    description: 'User password', 
    example: 'Password123!',
    minLength: 8 
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ 
    description: 'User first name', 
    example: 'Deborah' 
  })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ 
    description: 'User last name', 
    example: 'Soares' 
  })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;
}