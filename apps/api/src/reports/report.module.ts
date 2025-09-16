import { Module } from "@nestjs/common";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { ReportRepository } from "./report.repository";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [AuthModule],
    controllers: [ReportController],
    providers: [ReportService, ReportRepository],
    exports: [ReportService]
})
export class ReportModule {}