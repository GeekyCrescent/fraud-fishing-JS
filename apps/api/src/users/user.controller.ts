import { Body, Controller, Post, Put, Req, UseGuards, NotFoundException, Get } from "@nestjs/common";
import { UserDto, UserService } from "./user.service";
import { ApiProperty, ApiResponse, ApiTags, ApiBearerAuth, ApiBody, ApiOperation } from "@nestjs/swagger"; // Importar ApiOperation
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "../common/interfaces/authenticated-request"; 

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

    // ===== GETS =======

    // Conseguir información personal del propio usuario
    @Get("me")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "Usuario obtenido exitosamente", type: UserDto})
    @ApiResponse({status: 404, description: "Usuario no encontrado"})
    async getOwnUser(@Req() req: AuthenticatedRequest): Promise<UserDto|void> {
        const userId = req.user.profile?.id || req.user.profile.id;
        return this.userService.findById(Number(userId));
    }

    // Ver reportes hechos por el usuario
    @Get('me/reports/completed')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "Reportes obtenidos exitosamente"})
    @ApiResponse({status: 404, description: "Usuario no encontrado"})
    async getOwnCompletedReports(@Req() req: AuthenticatedRequest): Promise<any[]> {
        const userId = req.user.profile?.id || req.user.profile.id;
        return this.userService.getUserReportsCompleted(Number(userId));
    }

    // Ver reportes en proceso del usuario autenticado
    @Get('me/reports/active')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "Reportes obtenidos exitosamente"})
    @ApiResponse({status: 404, description: "Usuario no encontrado"})
    async getOwnActiveReports(@Req() req: AuthenticatedRequest): Promise<any[]> {
        const userId = req.user.profile?.id || req.user.profile.id;
        return this.userService.getUserReportsActive(Number(userId));
    }

    // ===== POSTS =======

    // Registrar un nuevo usuario
    @Post()
    @ApiOperation({ summary: 'Registrar un nuevo usuario' }) // Descripción de la operación
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({status: 201, description: "Usuario creado exitosamente", type: UserDto}) // Especificar el tipo de retorno
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async registerUser(@Body() userDto: CreateUserDto): Promise<UserDto|void> {
        return this.userService.registerUser(userDto.email, userDto.name, userDto.password);
    }

    // ===== PUTS =======

    // Actualizar la información del propio usuario
    @Put("me")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Actualizar la información del usuario autenticado' }) // Descripción de la operación
    @ApiBearerAuth()
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({status: 200, description: "Usuario actualizado exitosamente", type: UserDto}) // Especificar el tipo de retorno
    @ApiResponse({status: 404, description: "Usuario no encontrado"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async updateOwnUser( @Req() req: AuthenticatedRequest, @Body() userDto: UpdateUserDto): Promise<UserDto|void> {
        const userId = req.user.profile?.id || req.user.profile.id; 
        const updated = await this.userService.updateUserById(Number(userId), userDto.name, userDto.password);
        if (!updated) throw new NotFoundException("Usuario no encontrado");
        return updated;
    }
}