export declare class BulkUpsertProductErrorDto {
    sku: string;
    message: string;
}
export declare class BulkUpsertProductsResultDto {
    created: number;
    updated: number;
    skipped: number;
    total: number;
    errors: BulkUpsertProductErrorDto[];
}
