import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { Report, ReportRepository, ReportWithStatus } from "./report.repository";
import { ReportDto, CreateReportDto, UpdateReportDto, ReportStatusDto } from "./dto/report.dto";
import { CommentDto, CreateCommentDto } from "src/comments/dto/comment.dto";
import { CommentService } from "src/comments/comment.service";
import { NotificationService } from '../notifications/notification.service'; // ← Agregar

@Injectable()
export class ReportService {
    constructor(
        private readonly reportRepository: ReportRepository,
        private readonly commentService: CommentService,
        private readonly notificationService: NotificationService // ← Agregar
    ) {}

    // --- GETS ---

    async findAllReports(): Promise<ReportDto[]> {
        const reports = await this.reportRepository.findAllReports();
        return reports.map(report => this.mapReportToDto(report));
    }

    async findAllReportsWithStatus(): Promise<ReportDto[]> {
        const reports = await this.reportRepository.findAllReportsWithStatus();
        return reports.map(report => this.mapReportWithStatusToDto(report));
    }

    async findById(id: number): Promise<ReportDto> {
        if (!id || id <= 0) {
            throw new BadRequestException("ID de reporte inválido");
        }

        const report = await this.reportRepository.findById(id);
        if (!report) {
            throw new NotFoundException("Reporte no encontrado");
        }

        return this.mapReportToDto(report);
    }

    async findByIdWithStatus(id: number): Promise<ReportDto> {
        if (!id || id <= 0) {
            throw new BadRequestException("ID de reporte inválido");
        }

        const report = await this.reportRepository.findByIdWithStatus(id);
        if (!report) {
            throw new NotFoundException("Reporte no encontrado");
        }

        return this.mapReportWithStatusToDto(report);
    }

    async findReportByUrl(url: string): Promise<ReportDto> {
        if (!url || url.trim() === "") {
            throw new BadRequestException("URL es requerida");
        }

        const report = await this.reportRepository.findReportByUrl(url.trim());
        if (!report) {
            throw new NotFoundException("Reporte no encontrado");
        }

        return this.mapReportToDto(report);
    }

    async findReportsByCategory(categoryId: number): Promise<ReportDto[]> {
        if (!categoryId || categoryId <= 0) {
            throw new BadRequestException("ID de categoría inválido");
        }

        const reports = await this.reportRepository.findReportsByCategory(categoryId);
        return reports.map(report => this.mapReportToDto(report));
    }

    async findReportsByStatus(statusId: number): Promise<ReportDto[]> {
        if (!statusId || statusId <= 0) {
            throw new BadRequestException("ID de status inválido");
        }

        const reports = await this.reportRepository.findReportsByStatusId(statusId);
        return reports.map(report => this.mapReportToDto(report));
    }

    async findPopularReports(limit: number = 10): Promise<ReportDto[]> {
        if (limit <= 0 || limit > 100) {
            throw new BadRequestException("Límite debe estar entre 1 y 100");
        }

        const reports = await this.reportRepository.findPopularReports(limit);
        return reports.map(report => this.mapReportToDto(report));
    }

    async findActiveReportsByUserId(userId: number): Promise<ReportDto[]> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        const reports = await this.reportRepository.findActiveReportsByUserId(userId);
        return reports.map(report => this.mapReportToDto(report));
    }

    async findCompletedReportsByUserId(userId: number): Promise<ReportDto[]> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        const reports = await this.reportRepository.findCompletedReportsByUserId(userId);
        return reports.map(report => this.mapReportToDto(report));
    }

    // --- POSTS ---

    async createReport(createReportDto: CreateReportDto): Promise<ReportDto> {
        const { userId, categoryId, title, description, url, imageUrl } = createReportDto;

        // Validaciones existentes...
        if (!userId || typeof userId !== "number" || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        await this.reportRepository.createReport(
            userId, 
            categoryId, 
            title.trim(), 
            description.trim(), 
            url.trim(), 
            imageUrl
        );
        
        const newReport = await this.reportRepository.findLatestReportByUserAndUrl(userId, url.trim());
        
        if (!newReport) {
            throw new Error("Error al crear el reporte");
        }
        
        return this.mapReportToDto(newReport);
    }

    // --- PUTS ---

    async updateReportById(id: number, updateReportDto: UpdateReportDto): Promise<ReportDto> {
        if (!id || id <= 0) {
            throw new BadRequestException("ID de reporte inválido");
        }

        const existingReport = await this.reportRepository.findById(id);
        if (!existingReport) {
            throw new NotFoundException("Reporte no encontrado");
        }

        const { title, description, url, categoryId, imageUrl } = updateReportDto;

        const finalTitle = title || existingReport.title;
        const finalDescription = description || existingReport.description;
        const finalUrl = url || existingReport.url;
        const finalCategoryId = categoryId || existingReport.category_id;
        const finalImageUrl = imageUrl !== undefined ? imageUrl : existingReport.image_url;

        await this.reportRepository.updateReport(id, finalTitle, finalDescription, finalUrl, finalCategoryId, finalImageUrl);

        const updatedReport = await this.reportRepository.findById(id);
        return this.mapReportToDto(updatedReport);
    }

    

    // --- VOTING ---

    async voteReport(reportId: number, voteType: 'up' | 'down'): Promise<ReportDto> {
        if (!reportId || reportId <= 0) {
            throw new BadRequestException("ID de reporte inválido");
        }

        const report = await this.reportRepository.findById(reportId);
        if (!report) {
            throw new NotFoundException("Reporte no encontrado");
        }

        if (voteType === 'up') {
            await this.reportRepository.incrementVoteCount(reportId);
        } else {
            await this.reportRepository.decrementVoteCount(reportId);
        }

        const updatedReport = await this.reportRepository.findById(reportId);
        return this.mapReportToDto(updatedReport);
    }

    // --- DELETES ---

    async deleteReport(id: number): Promise<void> {
        if (!id || id <= 0) {
            throw new BadRequestException("ID de reporte inválido");
        }

        const report = await this.reportRepository.findById(id);
        if (!report) {
            throw new NotFoundException("Reporte no encontrado");
        }

        await this.reportRepository.deleteReport(id);
    }

    // --- STATUS MANAGEMENT ---

    async getAllReportStatuses(): Promise<ReportStatusDto[]> {
        const statuses = await this.reportRepository.getAllReportStatuses();
        return statuses.map(status => ({
            id: status.id,
            name: status.name,
            description: status.description
        }));
    }

    // ===== NUEVO MÉTODO PARA ACTUALIZAR STATUS =====

    async updateReportStatusWithModeration(
        reportId: number, 
        newStatusId: number, 
        moderatorId: number,
        moderationNote?: string
    ): Promise<ReportDto> {
        // 1. Validaciones básicas
        if (!reportId || reportId <= 0) {
            throw new BadRequestException("ID de reporte inválido");
        }

        if (!newStatusId || newStatusId <= 0) {
            throw new BadRequestException("ID de status inválido");
        }

        // 2. Obtener el reporte actual
        const currentReport = await this.reportRepository.findByIdWithStatus(reportId);
        if (!currentReport) {
            throw new NotFoundException("Reporte no encontrado");
        }

        // 3. Verificar que el status existe
        const newStatus = await this.reportRepository.findStatusById(newStatusId);
        if (!newStatus) {
            throw new BadRequestException("Status inválido");
        }

        // 4. No actualizar si ya tiene el mismo status
        if (currentReport.status_id === newStatusId) {
            throw new BadRequestException("El reporte ya tiene ese status");
        }

        // 5. Obtener el status anterior
        const previousStatus = await this.reportRepository.findStatusById(currentReport.status_id);

        // 6. Actualizar el status en la base de datos
        await this.reportRepository.updateReportStatusWithModeration(
            reportId, 
            newStatusId, 
            moderatorId, 
            moderationNote
        );

        // 7. Registrar en historial
        await this.reportRepository.addStatusHistoryEntry(
            reportId,
            currentReport.status_id,
            newStatusId,
            moderationNote || `Status cambiado de ${previousStatus?.name} a ${newStatus.name}`,
            `Status actualizado por moderador`,
            moderatorId
        );

        // 8. Crear comentario automático para status "completed"
        if (newStatus.name.toLowerCase() === 'completed') {
            await this.createCompletionComment(currentReport, moderatorId, moderationNote);
        }

        // 9. Enviar notificación al autor del reporte
        await this.sendStatusChangeNotification(currentReport, newStatus.name);

        // 10. Obtener el reporte actualizado
        const updatedReport = await this.reportRepository.findByIdWithStatus(reportId);
        return this.mapReportWithStatusToDto(updatedReport);
    }

    // ===== MÉTODOS HELPER =====

    private async createCompletionComment(
        report: ReportWithStatus,
        moderatorId: number,
        moderationNote?: string
    ): Promise<void> {
        try {
            let commentContent = '✅ **Reporte Completado**\n\n';
            commentContent += 'Este reporte ha sido marcado como **completado** por nuestro equipo de moderación. ';
            commentContent += 'Las acciones necesarias han sido tomadas para abordar esta amenaza de seguridad.\n\n';
            
            if (moderationNote && moderationNote.trim()) {
                commentContent += `**Nota del moderador:** ${moderationNote.trim()}\n\n`;
            }
            
            commentContent += '¡Gracias por ayudar a mantener internet más seguro! 🛡️';

            const createCommentDto: CreateCommentDto = {
                reportId: report.id,
                userId: moderatorId,
                title: '✅ Reporte Completado',
                content: commentContent,
                imageUrl: undefined
            };

            await this.commentService.createComment(createCommentDto);
        } catch (error) {
            // Log del error pero no fallar la operación principal
            console.error('Error creando comentario de completación:', error);
        }
    }

    private async sendStatusChangeNotification(
        report: ReportWithStatus,
        newStatusName: string
    ): Promise<void> {
        try {
            await this.notificationService.notifyReportStatusChange(
                report.user_id,
                report.id,
                report.title || report.url,
                newStatusName
            );
        } catch (error) {
            // Log del error pero no fallar la operación principal
            console.error('Error enviando notificación de cambio de status:', error);
        }
    }

    // --- HELPER METHODS ---

    private mapReportToDto(report: Report): ReportDto {
        return {
            id: report.id,
            userId: report.user_id,
            categoryId: report.category_id,
            title: report.title,
            description: report.description,
            url: report.url,
            statusId: report.status_id,
            imageUrl: report.image_url,
            voteCount: report.vote_count,
            commentCount: report.comment_count,
            createdAt: report.created_at,
            updatedAt: report.updated_at
        };
    }

    private mapReportWithStatusToDto(report: ReportWithStatus): ReportDto {
        return {
            id: report.id,
            userId: report.user_id,
            categoryId: report.category_id,
            title: report.title,
            description: report.description,
            url: report.url,
            statusId: report.status_id,
            statusName: report.status_name,
            statusDescription: report.status_description,
            imageUrl: report.image_url,
            voteCount: report.vote_count,
            commentCount: report.comment_count,
            createdAt: report.created_at,
            updatedAt: report.updated_at
        };
    }
}

