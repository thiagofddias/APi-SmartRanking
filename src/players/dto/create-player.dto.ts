import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly phoneNumber: string;
}
