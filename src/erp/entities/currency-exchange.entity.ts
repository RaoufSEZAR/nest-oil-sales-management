import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Center } from "src/centers/entities/center.entity";
import { User } from "src/users/entities/user.entity";
import { TradeCurrency } from "src/erp/enums/trade-currency.enum";

@Entity("currency_exchanges")
export class CurrencyExchange {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "exchange_number", type: "varchar", length: 50, unique: true })
	exchangeNumber: string;

	@ManyToOne(() => Center)
	@JoinColumn({ name: "center_id" })
	center: Center;

	@Column({ name: "from_currency", type: "enum", enum: TradeCurrency })
	fromCurrency: TradeCurrency;

	@Column({ name: "from_amount", type: "decimal", precision: 15, scale: 4 })
	fromAmount: string;

	@Column({ name: "from_amount_usd", type: "decimal", precision: 15, scale: 4 })
	fromAmountUsd: string;

	@Column({ name: "to_currency", type: "enum", enum: TradeCurrency })
	toCurrency: TradeCurrency;

	@Column({ name: "to_amount", type: "decimal", precision: 15, scale: 4 })
	toAmount: string;

	@Column({ name: "to_amount_usd", type: "decimal", precision: 15, scale: 4 })
	toAmountUsd: string;

	@Column({ name: "exchange_rate", type: "decimal", precision: 12, scale: 4 })
	exchangeRate: string;

	@Column({ name: "from_weighted_rate", type: "decimal", precision: 12, scale: 4, default: 1 })
	fromWeightedRate: string;

	@Column({ name: "to_weighted_rate", type: "decimal", precision: 12, scale: 4, default: 1 })
	toWeightedRate: string;

	@Column({ name: "difference_usd", type: "decimal", precision: 15, scale: 4, default: 0 })
	differenceUsd: string;

	@Column({ type: "text", nullable: true })
	notes?: string | null;

	@ManyToOne(() => User)
	@JoinColumn({ name: "created_by" })
	createdBy: User;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
