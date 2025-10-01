import { Body, Controller, Post, Get, Delete, Param, Put } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ApiResponse, ApiTags, ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";

@ApiTags("Endpoints de Categorías")
@Controller("categories")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    // ===== GETS =====

    @Get()
    @ApiOperation({ summary: 'Obtener todas las categorías' })
    @ApiResponse({ status: 200, description: "Lista de categorías obtenida exitosamente", type: [CategoryDto] })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async getAllCategories(): Promise<CategoryDto[]> {
        return this.categoryService.findAllCategories();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una categoría por ID' })
    @ApiParam({ name: 'id', description: 'ID de la categoría', type: 'number' })
    @ApiResponse({ status: 200, description: "Categoría obtenida exitosamente", type: CategoryDto })
    @ApiResponse({ status: 400, description: "ID inválido" })
    @ApiResponse({ status: 404, description: "Categoría no encontrada" })
    async getCategoryById(@Param('id') id: string): Promise<CategoryDto> {
        return this.categoryService.findById(Number(id));
    }

    @Get('name/:name')
    @ApiOperation({ summary: 'Obtener una categoría por nombre' })
    @ApiParam({ name: 'name', description: 'Nombre de la categoría', type: 'string' })
    @ApiResponse({ status: 200, description: "Categoría obtenida exitosamente", type: CategoryDto })
    @ApiResponse({ status: 400, description: "Nombre inválido" })
    @ApiResponse({ status: 404, description: "Categoría no encontrada" })
    async getCategoryByName(@Param('name') name: string): Promise<CategoryDto> {
        return this.categoryService.findByName(name);
    }


    // ===== POSTS =====

    @Post()
    @ApiOperation({ summary: 'Crear una nueva categoría' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({ status: 201, description: "Categoría creada exitosamente", type: CategoryDto })
    @ApiResponse({ status: 400, description: "Datos inválidos o categoría ya existe" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
        return this.categoryService.createCategory(createCategoryDto);
    }

    // ===== PUTS =====

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una categoría existente' })
    @ApiParam({ name: 'id', description: 'ID de la categoría', type: 'number' })
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({ status: 200, description: "Categoría actualizada exitosamente", type: CategoryDto })
    @ApiResponse({ status: 400, description: "ID inválido o datos inválidos" })
    @ApiResponse({ status: 404, description: "Categoría no encontrada" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryDto> {
        return this.categoryService.updateCategory(Number(id), updateCategoryDto);
    }

    // ===== DELETES =====

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una categoría' })
    @ApiParam({ name: 'id', description: 'ID de la categoría', type: 'number' })
    @ApiResponse({ status: 200, description: "Categoría eliminada exitosamente" })
    @ApiResponse({ status: 400, description: "ID inválido" })
    @ApiResponse({ status: 404, description: "Categoría no encontrada" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    async deleteCategory(@Param('id') id: string): Promise<void> {
        await this.categoryService.deleteCategory(Number(id));
    }
}