import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john.doe',
  })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: '********',
  })
  @IsNotEmpty()
  readonly password: string;
}
