
import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service"; // Importar AdminService
import { UserRepository } from "../users/user.repository";

@Module({
  controllers: [AdminController],
  providers: [AdminService, UserRepository], // Añadir AdminService a los providers
  exports: [] // Eliminar UserService de exports, ya que no se exporta desde aquí
})
export class AdminModule {}