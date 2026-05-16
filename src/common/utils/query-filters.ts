import { Between, FindOperator, LessThanOrEqual, MoreThanOrEqual } from "typeorm";

export function dateRangeWhere(
	from?: string,
	to?: string,
): FindOperator<string> | undefined {
	if (!from && !to) return undefined;
	if (from && to) return Between(from.slice(0, 10), to.slice(0, 10));
	if (from) return MoreThanOrEqual(from.slice(0, 10));
	return LessThanOrEqual(to!.slice(0, 10));
}

export function parseOptionalInt(raw?: string): number | undefined {
	if (raw === undefined || raw === "") return undefined;
	const n = parseInt(raw, 10);
	return Number.isFinite(n) ? n : undefined;
}

export function parseOptionalBool(raw?: string): boolean | undefined {
	if (raw === "true") return true;
	if (raw === "false") return false;
	return undefined;
}
