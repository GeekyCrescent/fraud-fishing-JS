import { Injectable } from "@nestjs/common";
import { DbService } from "../db/db.service";

export type Report = {
    id: number;
    user_id: number;
    category_id: number;
    title: string;
    description: string;
    url: string;
    status_id: number; 
    image_url: string;
    vote_count: number;
    comment_count: number;
    created_at: Date;
    updated_at: Date;
}

export type ReportWithStatus = Report & {
    status_name: string;
    status_description?: string;
}

@Injectable()
export class ReportRepository {
    constructor(private readonly dbService: DbService) {}

    // --- GETS ---

    async findAllReports(): Promise<Report[]> {
        const sql = `SELECT * FROM report`;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as Report[];
    }

    // Obtener reportes con nombre del status (JOIN)
    async findAllReportsWithStatus(): Promise<ReportWithStatus[]> {
        const sql = `
            SELECT r.*, rs.name as status_name, rs.description as status_description 
            FROM report r 
            LEFT JOIN report_status rs ON r.status_id = rs.id
        `;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as ReportWithStatus[];
    }

    async findById(id: number): Promise<Report> {
        const sql = `SELECT * FROM report WHERE id = ? LIMIT 1`;
        const [rows] = await this.dbService.getPool().query(sql, [id]);
        const result = rows as Report[];
        return result[0];
    }

    async findByIdWithStatus(id: number): Promise<ReportWithStatus> {
        const sql = `
            SELECT r.*, rs.name as status_name, rs.description as status_description 
            FROM report r 
            LEFT JOIN report_status rs ON r.status_id = rs.id 
            WHERE r.id = ? LIMIT 1
        `;
        const [rows] = await this.dbService.getPool().query(sql, [id]);
        const result = rows as ReportWithStatus[];
        return result[0];
    }

    async findReportByUrl(url: string): Promise<Report> {
        const sql = `SELECT * FROM report WHERE url = ? LIMIT 1`;
        const [rows] = await this.dbService.getPool().query(sql, [url]);
        const result = rows as Report[];
        return result[0];
    }

    async findActiveReportsByUserId(userId: number): Promise<Report[]> {
        const sql = `SELECT * FROM report WHERE user_id = ? AND status_id IN (1, 2)`;
        const [rows] = await this.dbService.getPool().query(sql, [userId]);
        return rows as Report[];
    }

    async findCompletedReportsByUserId(userId: number): Promise<Report[]> {
        const sql = `SELECT * FROM report WHERE user_id = ? AND status_id IN (3, 4)`;
        const [rows] = await this.dbService.getPool().query(sql, [userId]);
        return rows as Report[];
    }

    async findReportsByCategory(categoryId: number): Promise<Report[]> {
        const sql = `SELECT * FROM report WHERE category_id = ?`;
        const [rows] = await this.dbService.getPool().query(sql, [categoryId]);
        return rows as Report[];
    }

    async findReportsByStatusId(statusId: number): Promise<Report[]> {
        const sql = `SELECT * FROM report WHERE status_id = ?`;
        const [rows] = await this.dbService.getPool().query(sql, [statusId]);
        return rows as Report[];
    }

    async findPopularReports(limit: number = 10): Promise<Report[]> {
        const sql = `SELECT * FROM report ORDER BY vote_count DESC, created_at DESC LIMIT ?`;
        const [rows] = await this.dbService.getPool().query(sql, [limit]);
        return rows as Report[];
    }

    async findLatestReportByUserAndUrl(userId: number, url: string): Promise<Report> {
        const sql = `SELECT * FROM report WHERE user_id = ? AND url = ? ORDER BY created_at DESC LIMIT 1`;
        const [rows] = await this.dbService.getPool().query(sql, [userId, url]);
        const result = rows as Report[];
        return result[0];
    }

    // --- POSTS ---

    async createReport(userId: number, categoryId: number, title: string, description: string, url: string, imageUrl?: string): Promise<void> {
        const sql = `
            INSERT INTO report (user_id, category_id, title, description, url, image_url, status_id) 
            VALUES (?, ?, ?, ?, ?, ?, 1)
        `; // status_id = 1 (default, probablemente 'pending')
        await this.dbService.getPool().query(sql, [userId, categoryId, title, description, url, imageUrl || null]);
    }

    // --- PUTS ---

    async updateReportStatus(id: number, statusId: number): Promise<void> {
        const sql = `UPDATE report SET status_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        await this.dbService.getPool().query(sql, [statusId, id]);
    }

    async updateReport(
        id: number,
        title: string,
        description: string,
        url: string,
        categoryId: number,
        imageUrl?: string
    ): Promise<void> {
        const sql = `
            UPDATE report 
            SET title = ?, description = ?, url = ?, category_id = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await this.dbService.getPool().query(sql, [title, description, url, categoryId, imageUrl || null, id]);
    }

    async incrementVoteCount(reportId: number): Promise<void> {
        const sql = `UPDATE report SET vote_count = vote_count + 1 WHERE id = ?`;
        await this.dbService.getPool().query(sql, [reportId]);
    }

    async decrementVoteCount(reportId: number): Promise<void> {
        const sql = `UPDATE report SET vote_count = vote_count - 1 WHERE id = ?`;
        await this.dbService.getPool().query(sql, [reportId]);
    }

    async incrementCommentCount(reportId: number): Promise<void> {
        const sql = `UPDATE report SET comment_count = comment_count + 1 WHERE id = ?`;
        await this.dbService.getPool().query(sql, [reportId]);
    }

    async decrementCommentCount(reportId: number): Promise<void> {
        const sql = `UPDATE report SET comment_count = comment_count - 1 WHERE id = ?`;
        await this.dbService.getPool().query(sql, [reportId]);
    }

    // --- DELETES ---

    async deleteReport(id: number): Promise<void> {
        const sql = `DELETE FROM report WHERE id = ?`;
        await this.dbService.getPool().query(sql, [id]);
    }

    // --- REPORT STATUS HELPERS ---

    async getAllReportStatuses(): Promise<{id: number, name: string, description?: string}[]> {
        const sql = `SELECT * FROM report_status ORDER BY id`;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as {id: number, name: string, description?: string}[];
    }

    async getReportStatusById(statusId: number): Promise<{id: number, name: string, description?: string}> {
        const sql = `SELECT * FROM report_status WHERE id = ? LIMIT 1`;
        const [rows] = await this.dbService.getPool().query(sql, [statusId]);
        const result = rows as {id: number, name: string, description?: string}[];
        return result[0];
    }
}