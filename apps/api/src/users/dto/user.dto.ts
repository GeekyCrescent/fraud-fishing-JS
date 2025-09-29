import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({ example: "user@example.com", description: "Email del usuario" })
    email: string;
    
    @ApiProperty({ example: "Nombre de Usuario", description: "Nombre del usuario" })
    name: string;
}

export class CreateUserDto {
    @ApiProperty({ example: "user@example.com", description: "Email del usuario" })
    email: string;
    
    @ApiProperty({ example: "Juan Pérez", description: "Nombre completo del usuario" })
    name: string;
    
    @ApiProperty({ example: "password123", description: "Contraseña del usuario" })
    password: string;
}

export class UpdateUserDto {
    @ApiProperty({ example: "Juan Pérez", description: "Nuevo nombre del usuario", required: false })
    name?: string;
    
    @ApiProperty({ example: "newpassword123", description: "Nueva contraseña", required: false })
    password?: string;
}

export class LoginDto {
    @ApiProperty({ example: "user@example.com", description: "Email del usuario" })
    email: string;
    
    @ApiProperty({ example: "password123", description: "Contraseña del usuario" })
    password: string;
}