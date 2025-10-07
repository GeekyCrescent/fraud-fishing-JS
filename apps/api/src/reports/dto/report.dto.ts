import { ApiProperty } from "@nestjs/swagger";

export class TagDto {
    @ApiProperty({ example: 1, description: "ID del tag" })
    id: number;

    @ApiProperty({ example: "Phishing", description: "Nombre del tag" })
    name: string;

    @ApiProperty({ example: "#FF5733", description: "Color del tag en formato hexadecimal", required: false })
    color?: string;
}

export class ReportDto {
    @ApiProperty({ example: 1, description: "ID del reporte" })
    id: number;

    @ApiProperty({ example: 1, description: "ID del usuario que creó el reporte" })
    userId: number;

    @ApiProperty({ example: 1, description: "ID de la categoría" })
    categoryId: number;

    @ApiProperty({ 
        type: [TagDto], 
        description: "Lista de tags asociados al reporte", 
        required: false,
        example: [
            { id: 1, name: "Phishing", color: "#FF5733" },
            { id: 2, name: "Banco", color: "#33FF57" }
        ]
    })
    tags?: TagDto[];

    @ApiProperty({ example: "Sitio de phishing detectado", description: "Título del reporte" })
    title: string;

    @ApiProperty({ example: "Este sitio está suplantando a un banco", description: "Descripción del reporte" })
    description: string;

    @ApiProperty({ example: "https://fake-bank.com", description: "URL reportada" })
    url: string;

    @ApiProperty({ example: 1, description: "ID del status del reporte" })
    statusId: number;

    @ApiProperty({ example: "pending", description: "Nombre del status", required: false })
    statusName?: string;

    @ApiProperty({ example: "En espera de revisión", description: "Descripción del status", required: false })
    statusDescription?: string;

    @ApiProperty({ example: "https://example.com/image.jpg", description: "URL de la imagen", required: false })
    imageUrl?: string;

    @ApiProperty({ example: 5, description: "Cantidad de votos" })
    voteCount: number;

    @ApiProperty({ example: 3, description: "Cantidad de comentarios" })
    commentCount: number;

    @ApiProperty({ example: "2023-01-01T00:00:00Z", description: "Fecha de creación" })
    createdAt: Date;

    @ApiProperty({ example: "2023-01-01T00:00:00Z", description: "Fecha de última actualización" })
    updatedAt: Date;
}

export class CreateReportDto {
    @ApiProperty({ example: 1, description: "ID de la categoría" })
    categoryId: number;

    @ApiProperty({ example: "Sitio de phishing detectado", description: "Título del reporte" })
    title: string;

    @ApiProperty({ example: "Este sitio está suplantando a un banco", description: "Descripción del reporte" })
    description: string;

    @ApiProperty({ example: "https://fake-bank.com", description: "URL a reportar" })
    url: string;

    @ApiProperty({ 
        type: [Number], 
        description: "Array de IDs de tags a asociar al reporte", 
        required: false,
        example: [1, 2, 3]
    })
    tagIds?: number[];

    @ApiProperty({ example: "https://example.com/image.jpg", description: "URL de la imagen", required: false })
    imageUrl?: string;
    
    // Nota: userId se agrega automáticamente desde el token JWT en el controller
    userId?: number;
}

export class UpdateReportDto {
    @ApiProperty({ example: "Sitio de phishing actualizado", description: "Nuevo título", required: false })
    title?: string;

    @ApiProperty({ example: "Descripción actualizada", description: "Nueva descripción", required: false })
    description?: string;

    @ApiProperty({ example: "https://new-fake-site.com", description: "Nueva URL", required: false })
    url?: string;

    @ApiProperty({ example: 2, description: "Nuevo ID de categoría", required: false })
    categoryId?: number;

    @ApiProperty({ 
        type: [Number], 
        description: "Nuevo array de IDs de tags", 
        required: false,
        example: [1, 3, 5]
    })
    tagIds?: number[];

    @ApiProperty({ example: "https://example.com/new-image.jpg", description: "Nueva URL de imagen", required: false })
    imageUrl?: string;
}

export class UpdateReportStatusDto {
    @ApiProperty({ example: 3, description: "ID del nuevo status" })
    statusId: number;

    @ApiProperty({ example: "El reporte ha sido verificado y las acciones correspondientes han sido tomadas", description: "Nota opcional del moderador",})
    moderationNote?: string;
}

export class ReportStatusDto {
    @ApiProperty({ example: 1, description: "ID del status" })
    id: number;

    @ApiProperty({ example: "pending", description: "Nombre del status" })
    name: string;

    @ApiProperty({ example: "En espera de revisión", description: "Descripción del status", required: false })
    description?: string;
}

// DTO adicional para manejar la asociación de tags
export class AddTagsToReportDto {
    @ApiProperty({ 
        type: [Number], 
        description: "Array de IDs de tags a agregar al reporte",
        example: [1, 2, 3]
    })
    tagIds: number[];
}

export class RemoveTagsFromReportDto {
    @ApiProperty({ 
        type: [Number], 
        description: "Array de IDs de tags a remover del reporte",
        example: [2, 3]
    })
    tagIds: number[];
}