import { Body, Controller, Post, Put, Get, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { ApiBody, ApiProperty, ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"; // Importar ApiOperation y ApiBearerAuth
import { UpdateUserDto, UserDto } from "../users/dto/user.dto";
import { CreateAdminDto } from "./dto/admin.dto";
import { UserStatsDto, UserStatsResponseDto } from "./dto/user-stats.dto";

@ApiTags("Endpoints de Administrador")
@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    // ========== | ADMIN Endpoints | ==========

    //  POSTs
    @Post("register")
    @ApiOperation({ summary: 'Registrar un nuevo administrador' }) 
    @ApiBody({ type: CreateAdminDto })
    @ApiResponse({ status: 201, description: "Administrador registrado exitosamente", type: UserDto }) 
    @ApiResponse({ status: 400, description: "El correo electrónico ya está en uso" })
    async registerAdmin(@Body() adminDto: CreateAdminDto): Promise<UserDto | void> {
        return this.adminService.registerAdmin(adminDto.email, adminDto.name, adminDto.password);
    }

    @Post("register-super")
    @ApiOperation({ summary: 'Registrar un nuevo superadministrador' }) 
    @ApiBody({ type: CreateAdminDto })
    @ApiResponse({ status: 201, description: "Superadministrador registrado exitosamente", type: UserDto }) 
    @ApiResponse({ status: 400, description: "El correo electrónico ya está en uso" })
    async registerSuperAdmin(@Body() adminDto: CreateAdminDto): Promise<UserDto | void> {
        return this.adminService.registerSuperAdmin(adminDto.email, adminDto.name, adminDto.password);
    }

    // ========== | USER Endpoints | ==========

    //  GETs

    @Get("user/stats")
    @ApiOperation({ summary: "Obtener estadísticas de usuarios (solo administradores)" })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: "Estadísticas de usuarios obtenidas exitosamente" })
    async getUserWithStats(): Promise<UserStatsResponseDto> {
        return this.adminService.getUsersWithStats();
    }

    @Get('user/top-active')
    @ApiOperation({ summary: 'Obtener usuarios más activos' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: "Usuarios más activos obtenidos exitosamente"})
    async getTopActiveUsers(): Promise<UserStatsDto[]> {
        return this.adminService.getTopActiveUsers(10);
    }

    @Get('user/list')
    @ApiOperation({ summary: 'Obtener lista de todos los usuarios (solo administradores)' }) 
    @ApiBearerAuth() 
    @ApiResponse({ status: 200, description: "Lista de usuarios obtenida exitosamente", type: [UserDto] }) 
    async findAllUsers(): Promise<UserDto[]> {
        return this.adminService.findAllUsers();
    }

    @Get('user/:id')
    @ApiOperation({ summary: 'Obtener un usuario por ID (solo administradores)' }) 
    @ApiBearerAuth() 
    @ApiResponse({ status: 200, description: "Usuario obtenido exitosamente", type: UserDto }) 
    @ApiResponse({ status: 404, description: "Usuario no encontrado" })
    async findUserById(@Param('id') id: string): Promise<UserDto> {
        return this.adminService.findUserById(parseInt(id, 10));
    }

    //  PUTs

    @Put("user/:id")
    @ApiOperation({ summary: 'Actualizar un usuario por ID (solo administradores)' }) 
    @ApiBearerAuth() 
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: "Usuario actualizado exitosamente", type: UserDto }) 
    @ApiResponse({ status: 404, description: "Usuario no encontrado" })
    async updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDto | void> {
        return this.adminService.updateUserById(parseInt(id, 10), updateUserDto);
    }
}