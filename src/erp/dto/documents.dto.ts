import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsDateString,
	IsEnum,
	IsInt,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	ValidateNested,
} from "class-validator";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";
import { SalesReturnType } from "src/erp/enums/sales-return-type.enum";
import { ReturnItemCondition } from "src/erp/enums/return-item-condition.enum";
import { TripStatus } from "src/erp/enums/trip-status.enum";
import { TransferLocationType } from "src/erp/enums/transfer-location-type.enum";
import { TransferStatus } from "src/erp/enums/transfer-status.enum";
import { CashHandoverStatus } from "src/erp/enums/cash-handover-status.enum";

export class InvoiceLineDto {
	@ApiProperty()
	@IsInt()
	productId: number;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	quantity: number;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Type(() => Number)
	unitPrice: number;
}

export class CreateInvoiceDto {
	@ApiProperty()
	@IsInt()
	customerId: number;

	@ApiProperty()
	@IsUUID()
	salesRepId: string;

	@ApiProperty()
	@IsDateString()
	date: string;

	@ApiProperty({ type: [InvoiceLineDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => InvoiceLineDto)
	items: InvoiceLineDto[];

	@ApiPropertyOptional({ enum: TradeCurrency })
	@IsOptional()
	@IsEnum(TradeCurrency)
	currency?: TradeCurrency;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	exchangeRate?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Type(() => Number)
	discount?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Type(() => Number)
	taxRate?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	tripId?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;
}

export class ReturnLineDto {
	@ApiProperty()
	@IsInt()
	productId: number;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	quantity: number;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Type(() => Number)
	unitPrice: number;

	@ApiPropertyOptional({ enum: ReturnItemCondition })
	@IsOptional()
	@IsEnum(ReturnItemCondition)
	condition?: ReturnItemCondition;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	reasonDetail?: string;
}

export class CreateSalesReturnDto {
	@ApiProperty({ enum: SalesReturnType })
	@IsEnum(SalesReturnType)
	returnType: SalesReturnType;

	@ApiProperty()
	@IsInt()
	customerId: number;

	@ApiProperty()
	@IsUUID()
	salesRepId: string;

	@ApiProperty()
	@IsDateString()
	date: string;

	@ApiProperty({ type: [ReturnLineDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ReturnLineDto)
	items: ReturnLineDto[];

	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	originalInvoiceId?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	reason?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;
}

export class CreatePaymentDto {
	@ApiProperty()
	@IsInt()
	customerId: number;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	amount: number;

	@ApiPropertyOptional({ enum: TradeCurrency })
	@IsOptional()
	@IsEnum(TradeCurrency)
	currency?: TradeCurrency;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	exchangeRate?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(20)
	paymentMethod?: string;

	@ApiProperty()
	@IsDateString()
	paymentDate: string;

	@ApiProperty()
	@IsUUID()
	receivedById: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	referenceNumber?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsObject()
	relatedInvoices?: Record<string, unknown>;
}

export class CreateVehicleTripDto {
	@ApiProperty()
	@IsInt()
	vehicleId: number;

	@ApiProperty()
	@IsUUID()
	salesRepId: string;

	@ApiProperty({ example: "2026-04-19" })
	@IsDateString()
	tripDate: string;

	@ApiProperty()
	@IsInt()
	odometerStart: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	odometerStartPhoto?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;
}

export class UpdateVehicleTripDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	odometerEnd?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	odometerEndPhoto?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Type(() => Number)
	fuelCompensation?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;

	@ApiPropertyOptional({ enum: TripStatus })
	@IsOptional()
	@IsEnum(TripStatus)
	status?: TripStatus;

	@ApiPropertyOptional()
	@IsOptional()
	@IsDateString()
	endedAt?: string;
}

export class CreateExpenseDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	centerId?: number;

	@ApiProperty()
	@IsString()
	@MaxLength(50)
	category: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	amount: number;

	@ApiPropertyOptional({ enum: TradeCurrency })
	@IsOptional()
	@IsEnum(TradeCurrency)
	currency?: TradeCurrency;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	exchangeRate?: number;

	@ApiProperty({ example: "2026-04-19" })
	@IsDateString()
	date: string;

	@ApiProperty()
	@IsUUID()
	paidById: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;
}

export class PurchaseLineDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	productId?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	quantity: number;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	unitPriceUsd: number;
}

export class CreatePurchaseDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	centerId?: number;

	@ApiProperty()
	@IsString()
	@MaxLength(150)
	supplierName: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(30)
	supplierPhone?: string;

	@ApiProperty({ example: "2026-04-19" })
	@IsDateString()
	date: string;

	@ApiPropertyOptional({ enum: TradeCurrency })
	@IsOptional()
	@IsEnum(TradeCurrency)
	currency?: TradeCurrency;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	exchangeRate?: number;

	@ApiProperty()
	@IsUUID()
	createdById: string;

	@ApiProperty({ type: [PurchaseLineDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PurchaseLineDto)
	items: PurchaseLineDto[];

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	customsCost?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	shippingCost?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;

	@ApiPropertyOptional({ example: "main" })
	@IsOptional()
	@IsString()
	@MaxLength(20)
	purchaseType?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	paidAmount?: number;
}

export class CreateCurrencyExchangeDto {
	@ApiProperty()
	@IsInt()
	centerId: number;

	@ApiProperty({ enum: TradeCurrency })
	@IsEnum(TradeCurrency)
	fromCurrency: TradeCurrency;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	fromAmount: number;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	fromAmountUsd: number;

	@ApiProperty({ enum: TradeCurrency })
	@IsEnum(TradeCurrency)
	toCurrency: TradeCurrency;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	toAmount: number;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	toAmountUsd: number;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	exchangeRate: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	fromWeightedRate?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	toWeightedRate?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	differenceUsd?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;

	@ApiProperty()
	@IsUUID()
	createdById: string;
}

export class TransferLineDto {
	@ApiProperty()
	@IsInt()
	productId: number;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	quantity: number;
}

export class CreateInventoryTransferDto {
	@ApiProperty({ enum: TransferLocationType })
	@IsEnum(TransferLocationType)
	fromLocationType: TransferLocationType;

	@ApiProperty()
	@IsInt()
	fromLocationId: number;

	@ApiProperty({ enum: TransferLocationType })
	@IsEnum(TransferLocationType)
	toLocationType: TransferLocationType;

	@ApiProperty()
	@IsInt()
	toLocationId: number;

	@ApiProperty({ example: "2026-04-19" })
	@IsDateString()
	date: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsUUID()
	transferredById?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsUUID()
	receivedById?: string;

	@ApiPropertyOptional({ enum: TransferStatus })
	@IsOptional()
	@IsEnum(TransferStatus)
	status?: TransferStatus;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;

	@ApiProperty({ type: [TransferLineDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TransferLineDto)
	items: TransferLineDto[];
}

export class UpdateInventoryTransferDto {
	@ApiPropertyOptional({ enum: TransferStatus })
	@IsOptional()
	@IsEnum(TransferStatus)
	status?: TransferStatus;

	@ApiPropertyOptional()
	@IsOptional()
	@IsUUID()
	receivedById?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsDateString()
	completedAt?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;
}

export class CreateCashHandoverDto {
	@ApiProperty()
	@IsString()
	@MaxLength(20)
	fromType: string;

	@ApiProperty()
	@IsInt()
	fromId: number;

	@ApiProperty()
	@IsString()
	@MaxLength(20)
	toType: string;

	@ApiProperty()
	@IsInt()
	toId: number;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	amount: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(10)
	originalCurrency?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	originalAmount?: number;

	@ApiProperty()
	@IsDateString()
	handoverDate: string;

	@ApiProperty()
	@IsUUID()
	handedById: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;
}

export class UpdateCashHandoverDto {
	@ApiPropertyOptional({ enum: CashHandoverStatus })
	@IsOptional()
	@IsEnum(CashHandoverStatus)
	status?: CashHandoverStatus;

	@ApiPropertyOptional()
	@IsOptional()
	@IsUUID()
	receivedById?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsDateString()
	confirmedAt?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;
}

export class CreatePurchaseDistributionDto {
	@ApiProperty()
	@IsInt()
	centerId: number;

	@ApiProperty()
	@IsInt()
	productId: number;

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 4 })
	@Type(() => Number)
	quantity: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsUUID()
	distributedById?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;
}

export class UpdatePurchaseDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(150)
	supplierName?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(30)
	supplierPhone?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	notes?: string;
}
