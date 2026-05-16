import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Payment } from "src/erp/entities/payment.entity";
import { CashHandover } from "src/erp/entities/cash-handover.entity";
import { Invoice } from "src/erp/entities/invoice.entity";
import { CashHandoverStatus } from "src/erp/enums/cash-handover-status.enum";

type LedgerRow = {
	recv_orig: number;
	recv_usd: number;
	handed_orig: number;
	handed_usd: number;
};

@Injectable()
export class CashFlowService {
	constructor(
		@InjectRepository(Payment) private readonly payments: Repository<Payment>,
		@InjectRepository(CashHandover)
		private readonly handovers: Repository<CashHandover>,
		@InjectRepository(Invoice) private readonly invoices: Repository<Invoice>,
	) {}

	private async buildLedger(userId: string): Promise<Record<string, LedgerRow>> {
		const [payments, handoverRows, invoiceCash] = await Promise.all([
			this.payments.find({
				where: { receivedBy: { id: userId } },
				relations: { receivedBy: true },
			}),
			this.handovers.find({
				where: {
					handedBy: { id: userId },
					fromType: "vehicle",
					status: In([
						CashHandoverStatus.PENDING,
						CashHandoverStatus.CONFIRMED,
					]),
				},
			}),
			this.invoices
				.createQueryBuilder("inv")
				.where("inv.sales_rep_id = :userId", { userId })
				.andWhere("CAST(inv.paid_amount AS DECIMAL) > 0")
				.getMany(),
		]);

		const ledger: Record<string, LedgerRow> = {};

		const addReceipt = (currency: string, origAmt: number, usdAmt: number) => {
			const cur = currency || "USD";
			if (!ledger[cur]) {
				ledger[cur] = {
					recv_orig: 0,
					recv_usd: 0,
					handed_orig: 0,
					handed_usd: 0,
				};
			}
			ledger[cur].recv_orig += origAmt;
			ledger[cur].recv_usd += usdAmt;
		};

		for (const p of payments) {
			addReceipt(
				p.currency,
				parseFloat(p.amount || "0"),
				parseFloat(p.amountUsd || p.amount || "0"),
			);
		}

		for (const inv of invoiceCash) {
			const cur = inv.currency || "USD";
			const orig = parseFloat(inv.paidAmount || "0");
			const rate = parseFloat(inv.exchangeRate || "1");
			addReceipt(cur, orig, cur === "USD" ? orig : orig / rate);
		}

		for (const h of handoverRows) {
			const cur = h.originalCurrency || "USD";
			const origAmt = parseFloat(h.originalAmount || h.amount || "0");
			const handedUsd = parseFloat(h.amount || "0");
			if (!ledger[cur]) {
				ledger[cur] = {
					recv_orig: 0,
					recv_usd: 0,
					handed_orig: 0,
					handed_usd: 0,
				};
			}
			ledger[cur].handed_orig += origAmt;
			ledger[cur].handed_usd += handedUsd;
		}

		return ledger;
	}

	async getMyCashFlow(userId: string) {
		const ledger = await this.buildLedger(userId);
		const breakdown: Record<string, unknown> = {};
		let totalReceivedUsd = 0;
		let totalHandedUsd = 0;
		let totalBalanceUsd = 0;

		for (const [cur, v] of Object.entries(ledger)) {
			const balance_orig = v.recv_orig - v.handed_orig;
			const balance_usd = v.recv_usd - v.handed_usd;
			const weighted_rate =
				balance_usd > 0.001 ? balance_orig / balance_usd : null;

			breakdown[cur] = {
				received_orig: v.recv_orig,
				received_usd: v.recv_usd,
				handed_orig: v.handed_orig,
				handed_usd: v.handed_usd,
				balance_orig,
				balance_usd,
				weighted_rate,
			};

			totalReceivedUsd += v.recv_usd;
			totalHandedUsd += v.handed_usd;
			totalBalanceUsd += balance_usd;
		}

		return {
			user_id: userId,
			breakdown,
			totals: {
				received_usd: totalReceivedUsd,
				handed_usd: totalHandedUsd,
				balance_usd: totalBalanceUsd,
			},
		};
	}

	async validateHandover(
		userId: string,
		body: { currency?: string; amount?: number },
	) {
		const ledger = await this.buildLedger(userId);
		const cur = (body.currency || "USD").toUpperCase();
		const requested = parseFloat(String(body.amount ?? 0));
		const row = ledger[cur] || {
			recv_orig: 0,
			recv_usd: 0,
			handed_orig: 0,
			handed_usd: 0,
		};
		const availableUsd = row.recv_usd - row.handed_usd;
		const ok = requested <= availableUsd + 0.01;

		return {
			valid: ok,
			currency: cur,
			requested_usd: requested,
			available_usd: availableUsd,
			message: ok
				? "المبلغ متاح للتسليم"
				: "المبلغ يتجاوز الرصيد المتاح",
		};
	}
}
