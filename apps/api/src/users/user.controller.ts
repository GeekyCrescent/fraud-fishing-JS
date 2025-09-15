import { Body, Controller, Post, Put, Req, UseGuards, NotFoundException } from "@nestjs/common";
import { UserDto, UserService } from "./user.service";
import { ApiProperty, ApiResponse, ApiTags, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard"; // Ajusta la ruta si es necesario
import type { AuthenticatedRequest } from "../common/interfaces/authenticated-request"; // Ajusta la ruta si es necesario

export class CreateUserDto{
    @ApiProperty({example:"user@example.com", description:"Email del usuario"})
    email: string;
    @ApiProperty({example:"Usuario Ejemplo", description:"Nombre del usuario", required:false})
    name: string;
    @ApiProperty({example:"password123", description:"Contraseña del usuario"})
    password: string;
}

export class UpdateUserDto {
    @ApiProperty({ example: "Nuevo Nombre", description: "Nombre del usuario", required: false })
    name: string;
    @ApiProperty({ example: "nuevaPassword123", description: "Nueva contraseña del usuario" })
    password: string;
}

@ApiTags("Endpoints de Usuarios")
@Controller("users")
export class UserController{
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiResponse({status: 201, description: "Usuario creado exitosamente"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async registerUser(@Body() userDto: CreateUserDto): Promise<UserDto|void> {
        return this.userService.registerUser(userDto.email, userDto.name, userDto.password);
    }

    @Put("me")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({status: 200, description: "Usuario actualizado exitosamente"})
    @ApiResponse({status: 404, description: "Usuario no encontrado"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async updateOwnUser( @Req() req: AuthenticatedRequest, @Body() userDto: UpdateUserDto): Promise<UserDto|void> {
        const userId = req.user.profile?.id || req.user.profile.id; 
        const updated = await this.userService.updateUserById(Number(userId), userDto.name, userDto.password);
        if (!updated) throw new NotFoundException("Usuario no encontrado");
        return updated;
    }
}