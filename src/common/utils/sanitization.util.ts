/**
 * Input sanitization utilities to prevent SQL injection and XSS attacks
 */

export class SanitizationUtil {
  /**
   * Sanitize search query to prevent SQL injection
   * @param query - Raw search query
   * @returns Sanitized query safe for database operations
   */
  static sanitizeSearchQuery(query: string): string {
    if (!query || typeof query !== 'string') {
      return '';
    }

    // Remove potentially dangerous characters
    let sanitized = query
      .replace(/[<>'"%;()&+]/g, '') // Remove SQL injection characters
      .replace(/[^\w\s\-_.!?,]/g, '') // Keep only alphanumeric, spaces, and safe punctuation
      .trim();

    // Limit length to prevent DoS attacks
    sanitized = sanitized.substring(0, 100);

    // Remove multiple consecutive spaces
    sanitized = sanitized.replace(/\s+/g, ' ');

    return sanitized;
  }

  /**
   * Escape special regex characters in search query
   * @param query - Search query
   * @returns Escaped query safe for regex operations
   */
  static escapeRegex(query: string): string {
    if (!query || typeof query !== 'string') {
      return '';
    }

    return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Validate and sanitize UUID
   * @param uuid - UUID string
   * @returns Sanitized UUID or null if invalid
   */
  static sanitizeUuid(uuid: string): string | null {
    if (!uuid || typeof uuid !== 'string') {
      return null;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const sanitized = uuid.trim().toLowerCase();
    
    return uuidRegex.test(sanitized) ? sanitized : null;
  }

  /**
   * Sanitize string for safe database operations
   * @param input - Input string
   * @param maxLength - Maximum allowed length
   * @returns Sanitized string
   */
  static sanitizeString(input: string, maxLength: number = 255): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    return input
      .replace(/[<>'"%;()&+]/g, '') // Remove potentially dangerous characters
      .trim()
      .substring(0, maxLength);
  }

  /**
   * Sanitize array of strings
   * @param arr - Array of strings
   * @param sanitizeFn - Optional sanitization function for each element
   * @returns Sanitized array
   */
  static sanitizeStringArray(
    arr: string[] | string | undefined,
    sanitizeFn?: (val: string) => string | null
  ): string[] | undefined {
    if (!arr) return undefined;
    
    let stringArray: string[] = [];
    if (typeof arr === 'string') {
      stringArray = arr.split(',').map(v => v.trim()).filter(v => v);
    } else if (Array.isArray(arr)) {
      stringArray = arr.filter(v => typeof v === 'string' && v.trim());
    }
    
    if (stringArray.length === 0) return undefined;
    
    if (sanitizeFn) {
      const sanitized = stringArray.map(sanitizeFn).filter(v => v !== null) as string[];
      return sanitized.length > 0 ? sanitized : undefined;
    }
    
    return stringArray;
  }

  /**
   * Sanitize UUID array
   * @param arr - Array of UUIDs
   * @returns Sanitized UUID array
   */
  static sanitizeUuidArray(arr: string[] | string | undefined): string[] | undefined {
    return this.sanitizeStringArray(arr, (val) => this.sanitizeUuid(val));
  }

  /**
   * Sanitize price range string (format: "min-max")
   * @param range - Price range string
   * @returns Sanitized range or null if invalid
   */
  static sanitizePriceRange(range: string): string | null {
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

  /**
   * Validate search parameters
   * @param params - Search parameters object
   * @returns Validated and sanitized parameters
   */
  static validateSearchParams(params: any): {
    query?: string;
    categoryIds?: string[];
    featured?: boolean;
    sizes?: string[];
    colors?: string[];
    tags?: string[];
    priceRanges?: string[];
    page: number;
    limit: number;
  } {
    const result: {
      query?: string;
      categoryIds?: string[];
      featured?: boolean;
      sizes?: string[];
      colors?: string[];
      tags?: string[];
      priceRanges?: string[];
      page: number;
      limit: number;
    } = {
      page: 1,
      limit: 12,
    };

    if (params.q && typeof params.q === 'string') {
      const sanitizedQuery = this.sanitizeSearchQuery(params.q);
      if (sanitizedQuery.length > 0) {
        result.query = sanitizedQuery;
      }
    }

    // Handle categoryIds (array)
    if (params.categoryIds) {
      const sanitized = this.sanitizeUuidArray(params.categoryIds);
      if (sanitized && sanitized.length > 0) {
        result.categoryIds = sanitized;
      }
    }

    if (params.featured !== undefined) {
      result.featured = Boolean(params.featured);
    }

    // Handle sizes
    if (params.sizes) {
      const sanitized = this.sanitizeStringArray(params.sizes, (val) => {
        const cleaned = this.sanitizeString(val, 50);
        return cleaned.length > 0 ? cleaned : null;
      });
      if (sanitized && sanitized.length > 0) {
        result.sizes = sanitized;
      }
    }

    // Handle colors
    if (params.colors) {
      const sanitized = this.sanitizeStringArray(params.colors, (val) => {
        const cleaned = this.sanitizeString(val.toLowerCase(), 50);
        return cleaned.length > 0 ? cleaned : null;
      });
      if (sanitized && sanitized.length > 0) {
        result.colors = sanitized;
      }
    }

    // Handle tags
    if (params.tags) {
      const sanitized = this.sanitizeStringArray(params.tags, (val) => {
        const cleaned = this.sanitizeString(val.toLowerCase(), 100);
        return cleaned.length > 0 ? cleaned : null;
      });
      if (sanitized && sanitized.length > 0) {
        result.tags = sanitized;
      }
    }

    // Handle price ranges
    if (params.priceRanges) {
      const sanitized = this.sanitizeStringArray(params.priceRanges, (val) => 
        this.sanitizePriceRange(val)
      );
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
    } else {
      result.limit = Math.min(parsedLimit, MAX_LIMIT);
    }

    return result;
  }
}
