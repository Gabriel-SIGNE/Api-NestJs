import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserDto {
    @ApiProperty({
        description: "User's email address",
        example: 'john.doe@example.com',
        required: true,
        format: 'email'
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "User's password",
        example: 'StrongP@ssw0rd123',
        required: true,
        minLength: 8,
        // On cache la valeur dans Swagger UI pour des raisons de sécurité
        writeOnly: true
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}