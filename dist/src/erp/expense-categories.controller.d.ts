import { ErpExpenseCategoriesService } from "src/erp/expense-categories.service";
import { CreateExpenseCategoryDto, UpdateExpenseCategoryDto } from "src/erp/dto/expense-category.dto";
export declare class ErpExpenseCategoriesController {
    private readonly categories;
    constructor(categories: ErpExpenseCategoriesService);
    findAll(all?: string): Promise<import("./entities/expense-category.entity").ExpenseCategory[]>;
    findOne(id: number): Promise<import("./entities/expense-category.entity").ExpenseCategory>;
    create(dto: CreateExpenseCategoryDto): Promise<import("./entities/expense-category.entity").ExpenseCategory>;
    update(id: number, dto: UpdateExpenseCategoryDto): Promise<import("./entities/expense-category.entity").ExpenseCategory>;
    remove(id: number): Promise<void>;
}
