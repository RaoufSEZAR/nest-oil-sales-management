import { ErpCurrencyExchangesService } from "src/erp/currency-exchanges.service";
import { CreateCurrencyExchangeDto } from "src/erp/dto/documents.dto";
export declare class ExchangesLegacyController {
    private readonly exchanges;
    constructor(exchanges: ErpCurrencyExchangesService);
    findAll(): Promise<import("../entities/currency-exchange.entity").CurrencyExchange[]>;
    findOne(id: number): Promise<import("../entities/currency-exchange.entity").CurrencyExchange>;
    create(dto: CreateCurrencyExchangeDto): Promise<import("../entities/currency-exchange.entity").CurrencyExchange>;
}
