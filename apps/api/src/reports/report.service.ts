import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { Report, ReportRepository, ReportWithStatus } from "./report.repository";
import { ReportDto, CreateReportDto, UpdateReportDto, ReportStatusDto } from "./dto/report.dto";
import { CommentDto, CreateCommentDto } from "src/comments/dto/comment.dto";
import { CommentService } from "src/comments/comment.service";

@Injectable()
export class ReportService {
    constructor(
        private readonly reportRepository: ReportRepository,
        private readonly commentService: CommentService
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

