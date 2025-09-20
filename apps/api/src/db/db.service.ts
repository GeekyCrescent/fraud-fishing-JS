import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Pool, createPool } from "mysql2/promise";

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    onModuleInit(): void {
        this.pool = createPool({
            host: Number(process.env.DB_HOST),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        })
    }
    onModuleDestroy() {
        void this.pool.end();
    }

    getPool(): Pool {
        return this.pool;
    }

}
