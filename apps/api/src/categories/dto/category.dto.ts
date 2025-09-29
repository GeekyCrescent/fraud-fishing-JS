import { ApiProperty } from "@nestjs/swagger";

export class CategoryDto {
    @ApiProperty({ example: 1, description: "ID de la categoría" })
    id: number;
    
    @ApiProperty({ example: "Phishing", description: "Nombre de la categoría" })
    name: string;
    
    @ApiProperty({ example: "Reportes de sitios de phishing", description: "Descripción de la categoría" })
    description: string;
}

export class CreateCategoryDto {
    @ApiProperty({ example: "Phishing", description: "Nombre de la categoría" })
    name: string;
    
    @ApiProperty({ example: "Reportes de sitios de phishing", description: "Descripción de la categoría" })
    description: string;
}

export class UpdateCategoryDto {
    @ApiProperty({ example: "Phishing", description: "Nuevo nombre de la categoría", required: false })
    name?: string;
    
    @ApiProperty({ example: "Reportes de sitios de phishing", description: "Nueva descripción de la categoría", required: false })
    description?: string;
}

export class DeleteCategoryDto {
    @ApiProperty({ example: 1, description: "ID de la categoría a eliminar" })
    id: number;
}