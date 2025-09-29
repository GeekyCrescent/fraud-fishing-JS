import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminDto {
    @ApiProperty({ example: "admin@example.com", description: "Email del administrador" })
    email: string;
    @ApiProperty({ example: "Admin Name", description: "Nombre del administrador" })
    name: string;
    @ApiProperty({ example: "adminPassword", description: "Contraseña del administrador" })
    password: string;
}