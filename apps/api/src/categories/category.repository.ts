import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

export type Category= {
    id: number;
    name: string;
    description: string; 
}

@Injectable()
export class CategoryRepository{
    constructor(private readonly dbService: DbService) {}

    async createCategory(name: string, description: string): Promise<Category | void> {
        const sql = `INSERT INTO categories (name, description) VALUES ('${name}', '${description}')`;
        await this.dbService.getPool().query(sql);
    }

    async findAllCategories(): Promise<Category[]> {
        const sql = `SELECT * FROM categories`;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as Category[];
    }

    async deleteCategory(id: number): Promise<Category | void> {
        const sql = `DELETE FROM categories WHERE id = ${id}`;
        await this.dbService.getPool().query(sql);
    }
    
}