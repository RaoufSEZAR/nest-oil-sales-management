export declare class SanitizationUtil {
    static sanitizeSearchQuery(query: string): string;
    static escapeRegex(query: string): string;
    static sanitizeUuid(uuid: string): string | null;
    static sanitizeString(input: string, maxLength?: number): string;
    static sanitizeStringArray(arr: string[] | string | undefined, sanitizeFn?: (val: string) => string | null): string[] | undefined;
    static sanitizeUuidArray(arr: string[] | string | undefined): string[] | undefined;
    static sanitizePriceRange(range: string): string | null;
    static validateSearchParams(params: any): {
        query?: string;
        categoryIds?: string[];
        featured?: boolean;
        sizes?: string[];
        colors?: string[];
        tags?: string[];
        priceRanges?: string[];
        page: number;
        limit: number;
    };
}
