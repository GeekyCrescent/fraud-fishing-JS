import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Category, CategoryRepository } from "./category.repository";

export type CategoryDto = {
    id: number;
    name: string;
    description: string; 
}

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async createCategory(name: string, description: string): Promise<CategoryDto | void> {
        return this.categoryRepository.createCategory(name, description);
    }

    async findAllCategories(): Promise<CategoryDto[]> {
        return this.categoryRepository.findAllCategories();
    }

    async deleteCategory(id: number): Promise<CategoryDto | void> {
        return this.categoryRepository.deleteCategory(id);
    }
}