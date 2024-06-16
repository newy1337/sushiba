import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, IsString, MinLength } from "class-validator"

export class RegisterDto {
    @IsEmail()
    @ApiProperty()
    email: string;
    @MinLength(6,{'message': 'Password must be at least 6 characters'})
    @ApiProperty()
    @IsString()
    password : string
    @ApiProperty()
    @IsPhoneNumber()
    phone: string
    @IsString()
    @ApiProperty()
    name: string
}

export class LoginDto {
    @IsEmail()
    @ApiProperty()
    email: string;
    @IsString()
    @ApiProperty()
    password: string

}

export class RefreshTokenDto {
    @IsString()
    @ApiProperty()
    refreshToken: string
}