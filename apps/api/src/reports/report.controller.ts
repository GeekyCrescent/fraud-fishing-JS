import { Body, Controller, Post, Req, UseGuards, Get, Put, Param, Delete, Query } from "@nestjs/common";
import { ReportService } from "./report.service";
import { ApiResponse, ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "../common/interfaces/authenticated-request";
import { ReportDto, CreateReportDto, UpdateReportDto, UpdateReportStatusDto, TagDto } from "./dto/report.dto";
import { CommentDto } from "../comments/dto/comment.dto";
import { NotificationService } from '../notifications/notification.service';

@ApiTags("Endpoints de Reportes")
@Controller("reports")
export class ReportController {
    constructor(
        private readonly reportService: ReportService,
        private readonly notificationService: NotificationService // ← Agregar
    ) {}

    // ===== POSTS =======

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un nuevo reporte' })
    @ApiBody({ type: CreateReportDto })
    @ApiResponse({ status: 201, description: "Reporte creado exitosamente", type: ReportDto })
    @ApiResponse({ status: 400, description: "Datos inválidos" })
    @ApiResponse({ status: 401, description: "Token inválido" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async createReport(@Req() req: AuthenticatedRequest, @Body() createReportDto: CreateReportDto): Promise<ReportDto | CommentDto> {
        // Agregar userId del token al DTO
        const reportData = {
            ...createReportDto,
            userId: Number(req.user.profile.id)
        };
        
        return this.reportService.createReport(reportData);
    }

    // ===== GETS =======

    @Get()
    @ApiOperation({ summary: 'Obtener todos los reportes' })
    @ApiResponse({ status: 200, description: "Lista de reportes obtenida exitosamente", type: [ReportDto] })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async getAllReports(): Promise<ReportDto[]> {
        return this.reportService.findAllReports();
    }

    @Get('active')
    @ApiOperation({ summary: 'Obtener todos los reportes activos' })
    @ApiResponse({ status: 200, description: "Lista de reportes activos obtenida exitosamente", type: [ReportDto] })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async getAllActiveReports(): Promise<ReportDto[]> {
        return this.reportService.findAllActiveReports();
    }

    @Get("primary")
    @ApiOperation({ summary: "Obtener el reporte principal de una URL (más votado)" })
    @ApiResponse({ status: 200, description: "Reporte principal", type: ReportDto })
    async getPrimaryByUrl(@Query("url") url: string): Promise<ReportDto> {
        return this.reportService.findPrimaryByUrl(url);
    }

    // NEW: hermanos por URL (incluye al principal)
    @Get("siblings")
    @ApiOperation({ summary: "Listar todos los reportes con la misma URL" })
    @ApiResponse({ status: 200, description: "Lista de reportes de la misma URL", type: [ReportDto] })
    async getSiblingsByUrl(@Query("url") url: string): Promise<ReportDto[]> {
        return this.reportService.findSiblingsByUrl(url);
    }

    @Get('with-status')
    @ApiOperation({ summary: 'Obtener todos los reportes con información de status' })
    @ApiResponse({ status: 200, description: "Lista de reportes con status obtenida exitosamente", type: [ReportDto] })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async getAllReportsWithStatus(): Promise<ReportDto[]> {
        return this.reportService.findAllReportsWithStatus();
    }

    @Get('popular')
    @ApiOperation({ summary: 'Obtener reportes más populares' })
    @ApiResponse({ status: 200, description: "Reportes populares obtenidos exitosamente", type: [ReportDto] })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async getPopularReports(): Promise<ReportDto[]> {
        return this.reportService.findPopularReports();
    }

    @Get('user/:userId/active')
    @ApiOperation({ summary: 'Obtener reportes activos de un usuario' })
    @ApiParam({ name: 'userId', description: 'ID del usuario', type: 'number' })
    @ApiResponse({ status: 200, description: "Reportes activos obtenidos exitosamente", type: [ReportDto] })
    @ApiResponse({ status: 400, description: "ID de usuario inválido" })
    async getActiveReportsByUserId(@Param('userId') userId: string): Promise<ReportDto[]> {
        return this.reportService.findActiveReportsByUserId(Number(userId));
    }

    @Get('user/:userId/completed')
    @ApiOperation({ summary: 'Obtener reportes completados de un usuario' })
    @ApiParam({ name: 'userId', description: 'ID del usuario', type: 'number' })
    @ApiResponse({ status: 200, description: "Reportes completados obtenidos exitosamente", type: [ReportDto] })
    @ApiResponse({ status: 400, description: "ID de usuario inválido" })
    async getCompletedReportsByUserId(@Param('userId') userId: string): Promise<ReportDto[]> {
        return this.reportService.findCompletedReportsByUserId(Number(userId));
    }

    @Get('category/:categoryId')
    @ApiOperation({ summary: 'Obtener reportes por categoría' })
    @ApiParam({ name: 'categoryId', description: 'ID de la categoría', type: 'number' })
    @ApiResponse({ status: 200, description: "Reportes obtenidos exitosamente", type: [ReportDto] })
    @ApiResponse({ status: 400, description: "ID de categoría inválido" })
    async getReportsByCategory(@Param('categoryId') categoryId: string): Promise<ReportDto[]> {
        return this.reportService.findReportsByCategory(Number(categoryId));
    }

    @Get('status/:statusId')
    @ApiOperation({ summary: 'Obtener reportes por status' })
    @ApiParam({ name: 'statusId', description: 'ID del status', type: 'number' })
    @ApiResponse({ status: 200, description: "Reportes obtenidos exitosamente", type: [ReportDto] })
    @ApiResponse({ status: 400, description: "ID de status inválido" })
    async getReportsByStatus(@Param('statusId') statusId: string): Promise<ReportDto[]> {
        return this.reportService.findReportsByStatus(Number(statusId));
    }

    @Get(':id/tags')
    @ApiOperation({ summary: 'Obtener tags asociados a un reporte' })
    @ApiParam({ name: 'id', description: 'ID del reporte', type: 'number' })
    @ApiResponse({ status: 200, description: "Tags obtenidos exitosamente", type: [TagDto] })
    @ApiResponse({ status: 400, description: "ID inválido" })
    @ApiResponse({ status: 404, description: "Reporte no encontrado" })
    async getTagsByReportId(@Param('id') id: string): Promise<TagDto[]> {
        return this.reportService.findTagsByReportId(Number(id));  
    }

    @Get(':id/category')
    @ApiOperation({ summary: 'Obtener categoría asociada a un reporte' })
    @ApiParam({ name: 'id', description: 'ID del reporte', type: 'number' })
    @ApiResponse({ status: 200, description: "Categoría obtenida exitosamente", schema: { type: 'object', properties: { categoryName: { type: 'string' } } } })
    @ApiResponse({ status: 400, description: "ID inválido" })
    @ApiResponse({ status: 404, description: "Reporte no encontrado" })
    async getCategoryByReportId(@Param('id') id: string): Promise<{ categoryName: string }> {
        return this.reportService.findCategoryByReportId(Number(id)); 
    }

    @Get('url/:url')
    @ApiOperation({ summary: 'Obtener reporte por URL' })
    @ApiParam({ name: 'url', description: 'URL del reporte', type: 'string' })
    @ApiResponse({ status: 200, description: "Reporte obtenido exitosamente", type: ReportDto })
    @ApiResponse({ status: 404, description: "Reporte no encontrado" })
    async getReportByUrl(@Param('url') url: string): Promise<ReportDto> {
        return this.reportService.findReportByUrl(decodeURIComponent(url));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un reporte por ID' })
    @ApiParam({ name: 'id', description: 'ID del reporte', type: 'number' })
    @ApiResponse({ status: 200, description: "Reporte obtenido exitosamente", type: ReportDto })
    @ApiResponse({ status: 400, description: "ID inválido" })
    @ApiResponse({ status: 404, description: "Reporte no encontrado" })
    async getReportById(@Param('id') id: string): Promise<ReportDto> {
        return this.reportService.findById(Number(id));
    }

    @Get(':id/with-status')
    @ApiOperation({ summary: 'Obtener un reporte por ID con información de status' })
    @ApiParam({ name: 'id', description: 'ID del reporte', type: 'number' })
    @ApiResponse({ status: 200, description: "Reporte con status obtenido exitosamente", type: ReportDto })
    @ApiResponse({ status: 400, description: "ID inválido" })
    @ApiResponse({ status: 404, description: "Reporte no encontrado" })
    async getReportByIdWithStatus(@Param('id') id: string): Promise<ReportDto> {
        return this.reportService.findByIdWithStatus(Number(id));
    }

    // ===== PUTS =======

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar un reporte existente' })
    @ApiParam({ name: 'id', description: 'ID del reporte', type: 'number' })
    @ApiBody({ type: UpdateReportDto })
    @ApiResponse({ status: 200, description: "Reporte actualizado exitosamente", type: ReportDto })
    @ApiResponse({ status: 400, description: "ID inválido o datos inválidos" })
    @ApiResponse({ status: 401, description: "Token inválido" })
    @ApiResponse({ status: 404, description: "Reporte no encontrado" })
    async updateReport(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto): Promise<ReportDto> {
        return this.reportService.updateReportById(Number(id), updateReportDto);
    }

    @Put(':id/vote')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Votar en un reporte' })
    @ApiParam({ name: 'id', description: 'ID del reporte', type: 'number' })
    @ApiBody({ 
        schema: { 
            type: 'object', 
            properties: { 
                voteType: { type: 'string', enum: ['up', 'down'], example: 'up' } 
            } 
        } 
    })
    @ApiResponse({ status: 200, description: "Voto registrado exitosamente", type: ReportDto })
    @ApiResponse({ status: 400, description: "Tipo de voto inválido" })
    @ApiResponse({ status: 401, description: "Token inválido" })
    @ApiResponse({ status: 404, description: "Reporte no encontrado" })
    async voteReport(@Param('id') id: string, @Body() body: { voteType: 'up' | 'down' }): Promise<ReportDto> {
        return this.reportService.voteReport(Number(id), body.voteType);
    }

    @Put(':id/status')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar el status de un reporte' })
    @ApiParam({ name: 'id', description: 'ID del reporte', type: 'number' })
    @ApiBody({ type: UpdateReportStatusDto })
    @ApiResponse({ status: 200, description: "Status actualizado exitosamente", type: ReportDto })
    async updateReportStatus(
        @Param('id') id: string, 
        @Body() updateStatusDto: UpdateReportStatusDto,
        @Req() req: AuthenticatedRequest
    ): Promise<ReportDto> {
        const moderatorId = Number(req.user.profile.id);
        
        return this.reportService.updateReportStatusWithModeration(
            Number(id), 
            updateStatusDto.statusId,
            moderatorId,
            updateStatusDto.moderationNote
        );
    }

    
    @Put(':id/tags/from-text')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Agregar tags por nombre a un reporte' })
    @ApiBody({ 
        schema: { 
            type: 'object', 
            properties: { 
                tagNames: { 
                    type: 'array', 
                    items: { type: 'string' },
                    example: ["phishing", "banco", "nuevo-tag"]
                } 
            } 
        } 
    })
    async addTagsToReport(@Param('id') id: string, @Body() body: { tagNames: string[] }): Promise<TagDto[]> {
        return this.reportService.addTagsFromText(Number(id), body.tagNames);
    }

        // ===== DELETES =======

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar un reporte (Solo propietario o admin)' })
    @ApiParam({ name: 'id', description: 'ID del reporte', type: 'number' })
    @ApiResponse({ status: 200, description: "Reporte eliminado exitosamente" })
    @ApiResponse({ status: 400, description: "ID inválido" })
    @ApiResponse({ status: 401, description: "Token inválido" })
    @ApiResponse({ status: 404, description: "Reporte no encontrado" })
    async deleteReport(@Param('id') id: string): Promise<void> {
        await this.reportService.deleteReport(Number(id));
    }
}