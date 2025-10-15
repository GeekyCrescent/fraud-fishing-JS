import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { CommentRepository } from "./comment.repository";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [AuthModule],
    controllers: [CommentController],
    providers: [CommentService, CommentRepository],
    exports: [CommentService, CommentRepository] 
})
export class CommentModule {}