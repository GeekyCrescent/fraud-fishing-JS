import { Body, Controller, Post, Req, UseGuards, NotFoundException, Get, Put, Param } from "@nestjs/common";
import { ReportDto, ReportService } from "./report.service";
import { ApiProperty, ApiResponse, ApiTags, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "../common/interfaces/authenticated-request";

class CreateReportDto {
    @ApiProperty({ example: 1, description: "ID de la categoría" })
    categoryId: number;
    @ApiProperty({ example: "Título del reporte", description: "Título del reporte" })
    title: string;
    @ApiProperty({ example: "Descripción del reporte", description: "Descripción del reporte" })
    description: string;
    @ApiProperty({ example: "http://example.com/image.jpg", description: "URL de la imagen del reporte" })
    image: string;
}

export class UpdateReportStatusDto {
    @ApiProperty({ example: "in_progress", description: "Nuevo status del reporte" })
    status: string;
}


@ApiTags("Endpoints de Reportes")
@Controller("reports")
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: "Reporte creado exitosamente" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async createReport(@Req() req: AuthenticatedRequest, @Body() createReportDto: CreateReportDto): Promise<ReportDto | void> {
        const userId = Number(req.user.profile.id);
        return this.reportService.createReport(userId, createReportDto.categoryId, createReportDto.title, createReportDto.description, createReportDto.image);
    }

    @Get()
    @ApiResponse({ status: 200, description: "Lista de reportes obtenida exitosamente" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async listReports(): Promise<ReportDto[]> {
        return this.reportService.findAllReports();
    }

    @Put("status/:id")
    @ApiBody({ type: UpdateReportStatusDto })
    @ApiResponse({ status: 200, description: "Reporte actualizado exitosamente" })
    @ApiResponse({ status: 404, description: "Reporte no encontrado" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async updateReportById(@Param('id') id: string, @Body() reportDto: UpdateReportStatusDto): Promise<ReportDto | void> {
        return this.reportService.updateReportById(parseInt(id, 10), reportDto.status);
    }
}