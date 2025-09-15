import { Body, Controller, Post, Put, Get, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UserDto } from "../users/user.service";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";

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
}