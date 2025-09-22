import { Body, Controller, Post, Req, UseGuards, NotFoundException, Get, Delete, Param } from "@nestjs/common";
import { CategoryService, CategoryDto } from "./category.service";
import { ApiProperty, ApiResponse, ApiTags, ApiBearerAuth, ApiBody } from "@nestjs/swagger";

class CreateCategoryDto {
    @ApiProperty({ example: "Phishing", description: "Nombre de la categoría" })
    name: string
    @ApiProperty({ example: "Categoría para reportes de phishing", description: "Descripción de la categoría" })
    description: string
}

@ApiTags("Endpoints de Categorías")
@Controller("categories")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({ status: 201, description: "Categoría creada exitosamente" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDto | void> {
        return this.categoryService.createCategory(createCategoryDto.name, createCategoryDto.description);
    }

    @Get()
    @ApiResponse({ status: 200, description: "Lista de categorías obtenida exitosamente" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async listCategories(): Promise<CategoryDto[]> {
        return this.categoryService.findAllCategories();
    }

    @Delete(":id")
    @ApiResponse({ status: 200, description: "Categoría eliminada exitosamente" })
    @ApiResponse({ status: 404, description: "Categoría no encontrada" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async deleteCategory(@Param('id') id: string): Promise<CategoryDto | void> {
        const category = await this.categoryService.deleteCategory(Number(id));
        return category;
    }

}