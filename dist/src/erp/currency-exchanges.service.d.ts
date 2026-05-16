import { Repository } from "typeorm";
import { CurrencyExchange } from "src/erp/entities/currency-exchange.entity";
import { CreateCurrencyExchangeDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
export declare class ErpCurrencyExchangesService {
    private readonly repo;
    private readonly sequences;
    constructor(repo: Repository<CurrencyExchange>, sequences: SequenceService);
    findAll(): Promise<CurrencyExchange[]>;
    findOne(id: number): Promise<CurrencyExchange>;
    create(dto: CreateCurrencyExchangeDto): Promise<CurrencyExchange>;
}
