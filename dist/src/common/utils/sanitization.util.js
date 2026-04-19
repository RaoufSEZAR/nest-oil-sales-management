"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizationUtil = void 0;
class SanitizationUtil {
    static sanitizeSearchQuery(query) {
        if (!query || typeof query !== 'string') {
            return '';
        }
        let sanitized = query
            .replace(/[<>'"%;()&+]/g, '')
            .replace(/[^\w\s\-_.!?,]/g, '')
            .trim();
        sanitized = sanitized.substring(0, 100);
        sanitized = sanitized.replace(/\s+/g, ' ');
        return sanitized;
    }
    static escapeRegex(query) {
        if (!query || typeof query !== 'string') {
            return '';
        }
        return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    static sanitizeUuid(uuid) {
        if (!uuid || typeof uuid !== 'string') {
            return null;
        }
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const sanitized = uuid.trim().toLowerCase();
        return uuidRegex.test(sanitized) ? sanitized : null;
    }
    static sanitizeString(input, maxLength = 255) {
        if (!input || typeof input !== 'string') {
            return '';
        }
        return input
            .replace(/[<>'"%;()&+]/g, '')
            .trim()
            .substring(0, maxLength);
    }
    static sanitizeStringArray(arr, sanitizeFn) {
        if (!arr)
            return undefined;
        let stringArray = [];
        if (typeof arr === 'string') {
            stringArray = arr.split(',').map(v => v.trim()).filter(v => v);
        }
        else if (Array.isArray(arr)) {
            stringArray = arr.filter(v => typeof v === 'string' && v.trim());
        }
        if (stringArray.length === 0)
            return undefined;
        if (sanitizeFn) {
            const sanitized = stringArray.map(sanitizeFn).filter(v => v !== null);
            return sanitized.length > 0 ? sanitized : undefined;
        }
        return stringArray;
    }
    static sanitizeUuidArray(arr) {
        return this.sanitizeStringArray(arr, (val) => this.sanitizeUuid(val));
    }
    static sanitizePriceRange(range) {
        if (!range || typeof range !== 'string') {
            return null;
        }
        const trimmed = range.trim();
        const match = trimmed.match(/^(\d+)-(\d+)$/);
        if (!match) {
            return null;
        }
        const min = parseInt(match[1], 10);
        const max = parseInt(match[2], 10);
        if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
            return null;
        }
        return `${min}-${max}`;
    }
    static validateSearchParams(params) {
        const result = {
            page: 1,
            limit: 12,
        };
        if (params.q && typeof params.q === 'string') {
            const sanitizedQuery = this.sanitizeSearchQuery(params.q);
            if (sanitizedQuery.length > 0) {
                result.query = sanitizedQuery;
            }
        }
        if (params.categoryIds) {
            const sanitized = this.sanitizeUuidArray(params.categoryIds);
            if (sanitized && sanitized.length > 0) {
                result.categoryIds = sanitized;
            }
        }
        if (params.featured !== undefined) {
            result.featured = Boolean(params.featured);
        }
        if (params.sizes) {
            const sanitized = this.sanitizeStringArray(params.sizes, (val) => {
                const cleaned = this.sanitizeString(val, 50);
                return cleaned.length > 0 ? cleaned : null;
            });
            if (sanitized && sanitized.length > 0) {
                result.sizes = sanitized;
            }
        }
        if (params.colors) {
            const sanitized = this.sanitizeStringArray(params.colors, (val) => {
                const cleaned = this.sanitizeString(val.toLowerCase(), 50);
                return cleaned.length > 0 ? cleaned : null;
            });
            if (sanitized && sanitized.length > 0) {
                result.colors = sanitized;
            }
        }
        if (params.tags) {
            const sanitized = this.sanitizeStringArray(params.tags, (val) => {
                const cleaned = this.sanitizeString(val.toLowerCase(), 100);
                return cleaned.length > 0 ? cleaned : null;
            });
            if (sanitized && sanitized.length > 0) {
                result.tags = sanitized;
            }
        }
        if (params.priceRanges) {
            const sanitized = this.sanitizeStringArray(params.priceRanges, (val) => this.sanitizePriceRange(val));
            if (sanitized && sanitized.length > 0) {
                result.priceRanges = sanitized;
            }
        }
        const DEFAULT_PAGE = 1;
        const DEFAULT_LIMIT = 12;
        const MAX_LIMIT = 100;
        const parsedPage = Number.parseInt(params.page, 10);
        result.page = Number.isNaN(parsedPage) || parsedPage < 1 ? DEFAULT_PAGE : parsedPage;
        const parsedLimit = Number.parseInt(params.limit, 10);
        if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
            result.limit = DEFAULT_LIMIT;
        }
        else {
            result.limit = Math.min(parsedLimit, MAX_LIMIT);
        }
        return result;
    }
}
exports.SanitizationUtil = SanitizationUtil;
//# sourceMappingURL=sanitization.util.js.map