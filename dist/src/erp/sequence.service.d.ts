import { DataSource } from "typeorm";
export declare class SequenceService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    next(seqType: string): Promise<string>;
}
