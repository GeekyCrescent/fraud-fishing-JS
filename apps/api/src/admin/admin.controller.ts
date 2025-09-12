import { Body, Controller, Post, Put, Get, Param } from "@nestjs/common";
import { UserDto, UserService } from "../users/user.service";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Endpoints de Administradores")
@Controller("admin")
export class AdminController{
    constructor(private readonly userService: UserService) {}

    @Get("user/list")
    @ApiResponse({status: 200, description: "Lista de usuarios"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async getUsersList(): Promise<UserDto[]> {
        return this.userService.getUsers();
    }

    @Get("user/:id")
    @ApiResponse({status: 200, description: "Usuario por id encontrado"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async getUserById(@Param("id") id: number): Promise<UserDto|void> {
        const user = await this.userService.findById(id);
        if (!user) return;
        return { email: user.email, name: user.name };
    }
}