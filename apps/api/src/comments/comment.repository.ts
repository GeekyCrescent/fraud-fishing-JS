import { Injectable } from "@nestjs/common";
import { DbService } from "../db/db.service";

export type Comment = {
    id: number;
    report_id: number;
    user_id: number;
    title: string;        
    content: string;      
    image_url?: string;
    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class CommentRepository {
    constructor(private readonly dbService: DbService) {}

    // --- GETS ---

    async findCommentsByReportId(reportId: number): Promise<Comment[]> {
        const sql = `SELECT * FROM comment WHERE report_id = ? ORDER BY created_at ASC`;
        const [rows] = await this.dbService.getPool().query(sql, [reportId]);
        return rows as Comment[];
    }

    async findById(id: number): Promise<Comment> {
        const sql = `SELECT * FROM comment WHERE id = ? LIMIT 1`;
        const [rows] = await this.dbService.getPool().query(sql, [id]);
        const result = rows as Comment[];
        return result[0];
    }

    async findLatestCommentByUserAndReport(userId: number, reportId: number): Promise<Comment> {
        const sql = `
            SELECT * FROM comment 
            WHERE user_id = ? AND report_id = ? 
            ORDER BY created_at DESC 
            LIMIT 1
        `;
        const [rows] = await this.dbService.getPool().query(sql, [userId, reportId]);
        const result = rows as Comment[];
        return result[0];
    }

    // --- POSTS ---

    async createComment(reportId: number, userId: number, title: string, content: string, imageUrl?: string): Promise<void> {
        const sql = `
            INSERT INTO comment (report_id, user_id, title, content, image_url) 
            VALUES (?, ?, ?, ?, ?)
        `;
        await this.dbService.getPool().query(sql, [reportId, userId, title, content, imageUrl || null]);
    }

    // --- PUTS ---

    async updateComment(id: number, title: string, content: string, imageUrl?: string): Promise<void> {
        const sql = `
            UPDATE comment 
            SET title = ?, content = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await this.dbService.getPool().query(sql, [title, content, imageUrl || null, id]);
    }

    // --- DELETES ---

    async deleteComment(id: number): Promise<void> {
        const sql = `DELETE FROM comment WHERE id = ?`;
        await this.dbService.getPool().query(sql, [id]);
    }
}