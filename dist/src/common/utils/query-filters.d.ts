import { FindOperator } from "typeorm";
export declare function dateRangeWhere(from?: string, to?: string): FindOperator<string> | undefined;
export declare function parseOptionalInt(raw?: string): number | undefined;
export declare function parseOptionalBool(raw?: string): boolean | undefined;
