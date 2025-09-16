
import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service"; // Importar AdminService
import { UserRepository } from "../users/user.repository";
import { ReportRepository } from "../reports/report.repository";

@Module({
  controllers: [AdminController],
  providers: [AdminService, UserRepository, ReportRepository], 
  exports: [] 
})
export class AdminModule {}