import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

export type Report = {
    id: number;
    userId: number;
    categoryId: number;
    title: string;
    description: string;
    status: string;
    image: string;
    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class ReportRepository {
    constructor(private readonly dbService: DbService) {}

    async createReport(userId: number, categoryId: number, title: string, description: string, image: string): Promise<Report | void> {
        const sql = `INSERT INTO reports (userId, categoryId, title, description, image, status, created_at, updated_at) VALUES (${userId}, '${categoryId}', '${title}', '${description}', '${image}', 'pending', NOW(), NOW())`;
        await this.dbService.getPool().query(sql);
    }

    async findAllReports(): Promise<Report[]> {
        const sql = `SELECT * FROM reports`;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as Report[];
    }

    async updateReportStatus(id: number, status: string): Promise<Report | void> {
        const sql = `UPDATE reports SET status = '${status}', updated_at = NOW() WHERE id = ${id}`;
        await this.dbService.getPool().query(sql);
    }

}