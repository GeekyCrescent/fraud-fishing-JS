import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { Comment, CommentRepository } from "./comment.repository";
import { CommentDto, CreateCommentDto, UpdateCommentDto } from "./dto/comment.dto";

@Injectable()
export class CommentService {
    constructor(private readonly commentRepository: CommentRepository) {}

    // --- GETS ---

    async findCommentsByReportId(reportId: number): Promise<CommentDto[]> {
        if (!reportId || reportId <= 0) {
            throw new BadRequestException("ID de reporte inválido");
        }
        const comments = await this.commentRepository.findCommentsByReportId(reportId);
        return comments.map(comment => this.mapCommentToDto(comment));
    }

    async findById(id: number): Promise<CommentDto> {
        if (!id || id <= 0) {
            throw new BadRequestException("ID de comentario inválido");
        }
        const comment = await this.commentRepository.findById(id);
        if (!comment) {
            throw new NotFoundException("Comentario no encontrado");
        }
        return this.mapCommentToDto(comment);
    }


    // --- POSTS ---

    async createComment(createCommentDto: CreateCommentDto): Promise<CommentDto> {
        const { reportId, userId, title, content, imageUrl } = createCommentDto;
        await this.commentRepository.createComment(reportId, userId, title, content, imageUrl);
        const newComment = await this.commentRepository.findLatestCommentByUserAndReport(userId, reportId);
        return this.mapCommentToDto(newComment);
    }

    // --- PUTS ---

    async updateComment(id: number, updateCommentDto: UpdateCommentDto): Promise<CommentDto> {
        if (!id || id <= 0) {
            throw new BadRequestException("ID de comentario inválido");
        }
        const existingComment = await this.commentRepository.findById(id);
        if (!existingComment) {
            throw new NotFoundException("Comentario no encontrado");
        }
        const { title, content, imageUrl } = updateCommentDto;
        const finalTitle = title || existingComment.title;
        const finalContent = content || existingComment.content;
        const finalImageUrl = imageUrl !== undefined ? imageUrl : existingComment.image_url;
        await this.commentRepository.updateComment(id, finalTitle, finalContent, finalImageUrl);
        const updatedComment = await this.commentRepository.findById(id);
        return this.mapCommentToDto(updatedComment);
    }

    // --- DELETES ---

    async deleteComment(id: number): Promise<void> {
        if (!id || id <= 0) {
            throw new BadRequestException("ID de comentario inválido");
        }
        const comment = await this.commentRepository.findById(id);
        if (!comment) {
            throw new NotFoundException("Comentario no encontrado");
        }
        await this.commentRepository.deleteComment(id);
    }

    // --- HELPER METHODS ---

    private mapCommentToDto(comment: Comment): CommentDto {
        return {
            id: comment.id,
            reportId: comment.report_id,
            userId: comment.user_id,
            title: comment.title,
            content: comment.content,
            imageUrl: comment.image_url,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at
        };
    }
}