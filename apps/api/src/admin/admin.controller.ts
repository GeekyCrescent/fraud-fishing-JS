import { Body, Controller, Post, Put, Get, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UserDto } from "../users/user.service";
import { ReportDto } from "../reports/report.service";
import { ApiBody, ApiProperty, ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"; // Importar ApiOperation y ApiBearerAuth
import { UpdateUserDto } from "../users/user.controller";
import { UpdateReportStatusDto } from "../reports/report.controller";

@ApiTags("Endpoints de Administrador")
@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('user/list')
    @ApiOperation({ summary: 'Obtener lista de todos los usuarios (solo administradores)' }) // Descripción de la operación
    @ApiBearerAuth() // Indica que este endpoint requiere autenticación
    @ApiResponse({ status: 200, description: "Lista de usuarios obtenida exitosamente", type: [UserDto] }) // Especificar el tipo de retorno
    async findAllUsers(): Promise<UserDto[]> {
        return this.adminService.findAllUsers();
    }

    @Get('user/:id')
    @ApiOperation({ summary: 'Obtener un usuario por ID (solo administradores)' }) // Descripción de la operación
    @ApiBearerAuth() // Indica que este endpoint requiere autenticación
    @ApiResponse({ status: 200, description: "Usuario obtenido exitosamente", type: UserDto }) // Especificar el tipo de retorno
    @ApiResponse({ status: 404, description: "Usuario no encontrado" })
    async findUserById(@Param('id') id: string): Promise<UserDto> {
        return this.adminService.findUserById(parseInt(id, 10));
    }

    @Put("user/:id")
    @ApiOperation({ summary: 'Actualizar un usuario por ID (solo administradores)' }) // Descripción de la operación
    @ApiBearerAuth() // Indica que este endpoint requiere autenticación
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: "Usuario actualizado exitosamente", type: UserDto }) // Especificar el tipo de retorno
    @ApiResponse({ status: 404, description: "Usuario no encontrado" })
    async updateUserById(@Param('id') id: string, @Body() userDto: UpdateUserDto): Promise<UserDto | void> {
        return this.adminService.updateUserById(parseInt(id, 10), userDto.name, userDto.password);
    }

    @Get("report/list")
    @ApiResponse({ status: 200, description: "Lista de reportes obtenida exitosamente" })
    @ApiResponse({ status: 404, description: "No se encontraron reportes" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async findAllReports(): Promise<ReportDto[]> {
        return this.adminService.findAllReports();
    }

    @Put("report/status/:id")
    @ApiBody({ type: UpdateReportStatusDto })
    @ApiResponse({ status: 200, description: "Reporte actualizado exitosamente" })
    @ApiResponse({ status: 404, description: "Reporte no encontrado" })
    async updateReportById(@Param('id') id: string, @Body() reportDto: UpdateReportStatusDto): Promise<ReportDto | void> {
        return this.adminService.updateReportById(parseInt(id, 10), reportDto.status);
    }
}