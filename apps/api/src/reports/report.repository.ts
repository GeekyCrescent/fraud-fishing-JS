import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

export type Report = {
    id: number;
    userId: number;
    categoryId: number;
    title: string;
    description: string;
    url: string;
    status: string;
    image: string;
    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class ReportRepository {
    constructor(private readonly dbService: DbService) {}

    async findAllReports(): Promise<Report[]> {
        const sql = `SELECT * FROM reports`;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as Report[];
    }

    async findReportByUrl(url: string): Promise<Report | void> {
        const sql = `SELECT * FROM reports WHERE url = '${url}'`;
        const [rows] = await this.dbService.getPool().query(sql);
        const reports = rows as Report[];
        return reports[0];
    }

    async findActiveReportsByUserId(userId: number): Promise<Report[]> {
    const sql = `SELECT * FROM reports WHERE userId = ${userId} AND status IN ('pending', 'in_progress')`;
    const [rows] = await this.dbService.getPool().query(sql);
    return rows as Report[];
    }

    // Reportes finalizados del usuario (resolved o rejected)
    async findCompletedReportsByUserId(userId: number): Promise<Report[]> {
        const sql = `SELECT * FROM reports WHERE userId = ${userId} AND status IN ('resolved', 'rejected')`;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as Report[];
    }

    async createReport(userId: number, categoryId: number, title: string, description: string, image: string, url: string): Promise<Report | void> {
        const sql = `INSERT INTO reports (userId, categoryId, title, description, image, url, status, created_at, updated_at) VALUES (${userId}, '${categoryId}', '${title}', '${description}', '${image}', '${url}', 'pending', NOW(), NOW())`;
        await this.dbService.getPool().query(sql);
    }

    async updateReportStatus(id: number, status: string): Promise<Report | void> {
        const sql = `UPDATE reports SET status = '${status}', updated_at = NOW() WHERE id = ${id}`;
        await this.dbService.getPool().query(sql);
    }

}