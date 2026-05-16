"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangeWhere = dateRangeWhere;
exports.parseOptionalInt = parseOptionalInt;
exports.parseOptionalBool = parseOptionalBool;
const typeorm_1 = require("typeorm");
function dateRangeWhere(from, to) {
    if (!from && !to)
        return undefined;
    if (from && to)
        return (0, typeorm_1.Between)(from.slice(0, 10), to.slice(0, 10));
    if (from)
        return (0, typeorm_1.MoreThanOrEqual)(from.slice(0, 10));
    return (0, typeorm_1.LessThanOrEqual)(to.slice(0, 10));
}
function parseOptionalInt(raw) {
    if (raw === undefined || raw === "")
        return undefined;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : undefined;
}
function parseOptionalBool(raw) {
    if (raw === "true")
        return true;
    if (raw === "false")
        return false;
    return undefined;
}
//# sourceMappingURL=query-filters.js.map