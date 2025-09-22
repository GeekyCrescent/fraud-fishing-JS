import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Report, ReportRepository } from "./report.repository";

export type ReportDto = {
    userId: number;
    categoryId: number;
    title: string;
    description: string;
    image: string;
}

@Injectable()
export class ReportService {
    constructor(private readonly reportRepository: ReportRepository) {}

    async createReport(userId: number, categoryId: number, title: string, description: string, image: string): Promise<ReportDto | void> {
        return this.reportRepository.createReport(userId, categoryId, title, description, image);
    }

    async findAllReports(): Promise<ReportDto[]> {
        return this.reportRepository.findAllReports();
    }

    async updateReportById(id: number, status: string): Promise<ReportDto | void> {
        return this.reportRepository.updateReportStatus(id, status);
    }
}

