import { ApiProperty } from "@nestjs/swagger";

export class CommentDto {
    @ApiProperty({ example: 1, description: "ID del comentario" })
    id: number;

    @ApiProperty({ example: 1, description: "ID del reporte" })
    reportId: number;

    @ApiProperty({ example: 1, description: "ID del usuario" })
    userId: number;

    @ApiProperty({ example: "Mi experiencia con este sitio", description: "Título del comentario" })
    title: string;

    @ApiProperty({ example: "Este sitio también me estafó con el mismo método", description: "Contenido del comentario" })
    content: string;

    @ApiProperty({ example: "https://example.com/evidence.jpg", description: "URL de imagen", required: false })
    imageUrl?: string;

    @ApiProperty({ example: "2023-01-01T00:00:00Z", description: "Fecha de creación" })
    createdAt: Date;

    @ApiProperty({ example: "2023-01-01T00:00:00Z", description: "Fecha de actualización" })
    updatedAt: Date;
}

export class CreateCommentDto {
    @ApiProperty({ example: 1, description: "ID del reporte" })
    reportId: number;

    @ApiProperty({ example: 1, description: "ID del usuario" })
    userId: number;

    @ApiProperty({ example: "Mi experiencia con este sitio", description: "Título del comentario" })
    title: string;

    @ApiProperty({ example: "Este sitio también me estafó con el mismo método", description: "Contenido del comentario" })
    content: string;

    @ApiProperty({ example: "https://example.com/evidence.jpg", description: "URL de imagen", required: false })
    imageUrl?: string;
}

export class UpdateCommentDto {
    @ApiProperty({ example: "Título actualizado", description: "Nuevo título", required: false })
    title?: string;

    @ApiProperty({ example: "Contenido actualizado", description: "Nuevo contenido", required: false })
    content?: string;

    @ApiProperty({ example: "https://example.com/new-image.jpg", description: "Nueva URL de imagen", required: false })
    imageUrl?: string;
}