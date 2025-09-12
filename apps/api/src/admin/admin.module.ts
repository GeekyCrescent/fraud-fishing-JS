import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { UserService } from "../users/user.service";
import { UserRepository } from "../users/user.repository";

@Module({
  controllers: [AdminController],
  providers: [UserRepository, UserService],
  exports: [UserService]
})
export class AdminModule {}