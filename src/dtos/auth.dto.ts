import { IsDefined, IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class SignUpDto {
    @IsEmail()
    @IsDefined()
    email: string;

    @IsStrongPassword()
    @IsDefined()
    password: string;
}

export class SignInDto {
    @IsEmail()
    @IsDefined()
    email: string;

    @IsString()
    @IsDefined()
    password: string;
}
