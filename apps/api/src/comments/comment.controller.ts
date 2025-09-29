import { Body, Controller, Post, Get, Delete, Param, Put } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { ApiResponse, ApiTags, ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";
import { CommentDto, CreateCommentDto, UpdateCommentDto } from "./dto/comment.dto";

@ApiTags("Endpoints de Comentarios")
@Controller("comments")
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    // ===== POSTS =====

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo comentario' })
    @ApiBody({ type: CreateCommentDto })
    @ApiResponse({ status: 201, description: "Comentario creado exitosamente", type: CommentDto })
    @ApiResponse({ status: 400, description: "Datos inválidos" })
    @ApiResponse({ status: 404, description: "Reporte no encontrado" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async createComment(@Body() createCommentDto: CreateCommentDto): Promise<CommentDto> {
        return this.commentService.createComment(createCommentDto);
    }

    // ===== GETS =====

    @Get('report/:reportId')
    @ApiOperation({ summary: 'Obtener todos los comentarios de un reporte' })
    @ApiParam({ name: 'reportId', description: 'ID del reporte', type: 'number' })
    @ApiResponse({ status: 200, description: "Comentarios obtenidos exitosamente", type: [CommentDto] })
    @ApiResponse({ status: 400, description: "ID de reporte inválido" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async getCommentsByReportId(@Param('reportId') reportId: string): Promise<CommentDto[]> {
        return this.commentService.findCommentsByReportId(Number(reportId));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un comentario por ID' })
    @ApiParam({ name: 'id', description: 'ID del comentario', type: 'number' })
    @ApiResponse({ status: 200, description: "Comentario obtenido exitosamente", type: CommentDto })
    @ApiResponse({ status: 400, description: "ID inválido" })
    @ApiResponse({ status: 404, description: "Comentario no encontrado" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async getCommentById(@Param('id') id: string): Promise<CommentDto> {
        return this.commentService.findById(Number(id));
    }

    // ===== PUTS =====

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un comentario existente' })
    @ApiParam({ name: 'id', description: 'ID del comentario', type: 'number' })
    @ApiBody({ type: UpdateCommentDto })
    @ApiResponse({ status: 200, description: "Comentario actualizado exitosamente", type: CommentDto })
    @ApiResponse({ status: 400, description: "ID inválido o datos inválidos" })
    @ApiResponse({ status: 404, description: "Comentario no encontrado" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async updateComment(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto): Promise<CommentDto> {
        return this.commentService.updateComment(Number(id), updateCommentDto);
    }

    // ===== DELETES =====

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un comentario' })
    @ApiParam({ name: 'id', description: 'ID del comentario', type: 'number' })
    @ApiResponse({ status: 200, description: "Comentario eliminado exitosamente" })
    @ApiResponse({ status: 400, description: "ID inválido" })
    @ApiResponse({ status: 404, description: "Comentario no encontrado" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async deleteComment(@Param('id') id: string): Promise<void> {
        await this.commentService.deleteComment(Number(id));
    }
}