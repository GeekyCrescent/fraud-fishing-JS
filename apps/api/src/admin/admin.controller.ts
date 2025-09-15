import { Body, Controller, Post, Put, Get, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UserDto } from "../users/user.service";
import { ApiBody, ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";

export class UpdateUserDto{
    @ApiProperty({example:"Usuario Ejemplo", description:"Nombre nuevo del usuario", required:false})
    name: string;
    @ApiProperty({example:"password123", description:"Contraseña nueva del usuario"})
    password: string;
}

@ApiTags("Endpoints de Administrador")
@Controller("admin/user")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('list')
    @ApiResponse({ status: 200, description: "Lista de usuarios obtenida exitosamente" })
    async findAllUsers(): Promise<UserDto[]> {
        return this.adminService.findAllUsers();
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: "Usuario obtenido exitosamente" })
    @ApiResponse({ status: 404, description: "Usuario no encontrado" })
    async findUserById(@Param('id') id: string): Promise<UserDto> {
        return this.adminService.findUserById(parseInt(id, 10));
    }

    @Put(":id")
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: "Usuario actualizado exitosamente" })
    @ApiResponse({ status: 404, description: "Usuario no encontrado" })
    async updateUserById(@Param('id') id: string, @Body() userDto: UpdateUserDto): Promise<UserDto | void> {
        return this.adminService.updateUserById(parseInt(id, 10), userDto.name, userDto.password);
    }
}