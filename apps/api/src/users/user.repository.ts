import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

export type User = {
    id: number;
    email: string;
    name: string;
    password_hash: string;
    salt: string;
    is_admin: boolean; 
    created_at: Date; 
}

@Injectable()
export class UserRepository {
    constructor(private readonly dbService: DbService) {}

    // --- GETS ---

    async findAll(): Promise<User[]> {
        const sql = `SELECT * FROM user`;
        const [rows] = await this.dbService.getPool().query(sql);
        const result = rows as User[];
        return result;
    }

    async findByEmail(email: string): Promise<User> {
        const sql = `SELECT * FROM user WHERE email = ? LIMIT 1`;  
        const [rows] = await this.dbService.getPool().query(sql, [email]);
        const result = rows as User[];
        return result[0];
    }

    async findById(id: number): Promise<User> {
        const sql = `SELECT * FROM user WHERE id = ? LIMIT 1`; 
        const [rows] = await this.dbService.getPool().query(sql, [id]);
        const result = rows as User[];
        return result[0];
    }

    // --- PUTS ---

    async updateUser(user: User): Promise<void> {
        const sql = `UPDATE user SET name = ?, password_hash = ? WHERE id = ?`;  
        await this.dbService.getPool().query(sql, [user.name, user.password_hash, user.id]);
    }

    // --- POSTS ---

    async registerUser(email: string, name: string, hashedPassword: string, salt: string, isAdmin: boolean = false): Promise<void> {
        const sql = `
            INSERT INTO user (name, email, password_hash, salt, is_admin) 
            VALUES (?, ?, ?, ?, ?)
        `;
        await this.dbService.getPool().query(sql, [name, email, hashedPassword, salt, isAdmin]);
    }
}