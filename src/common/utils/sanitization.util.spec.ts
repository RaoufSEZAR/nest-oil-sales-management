import { SanitizationUtil } from "src/common/utils/sanitization.util";

describe('SanitizationUtil', () => {
  describe('sanitizeSearchQuery', () => {
    it('should remove SQL injection characters', () => {
      const maliciousQuery = "'; DROP TABLE items; --";
      const result = SanitizationUtil.sanitizeSearchQuery(maliciousQuery);
      expect(result).toBe('DROP TABLE items --');
    });

    it('should remove XSS characters', () => {
      const xssQuery = '<script>alert("xss")</script>';
      const result = SanitizationUtil.sanitizeSearchQuery(xssQuery);
      expect(result).toBe('scriptalertxssscript');
    });

    it('should preserve safe characters', () => {
      const safeQuery = 'leather bag handmade';
      const result = SanitizationUtil.sanitizeSearchQuery(safeQuery);
      expect(result).toBe('leather bag handmade');
    });

    it('should limit length', () => {
      const longQuery = 'a'.repeat(200);
      const result = SanitizationUtil.sanitizeSearchQuery(longQuery);
      expect(result.length).toBeLessThanOrEqual(100);
    });

    it('should handle empty or null input', () => {
      expect(SanitizationUtil.sanitizeSearchQuery('')).toBe('');
      expect(SanitizationUtil.sanitizeSearchQuery(null as any)).toBe('');
      expect(SanitizationUtil.sanitizeSearchQuery(undefined as any)).toBe('');
    });
  });

  describe('sanitizeUuid', () => {
    it('should validate correct UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const result = SanitizationUtil.sanitizeUuid(validUuid);
      expect(result).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should reject invalid UUID', () => {
      const invalidUuid = 'not-a-uuid';
      const result = SanitizationUtil.sanitizeUuid(invalidUuid);
      expect(result).toBeNull();
    });

    it('should handle SQL injection in UUID', () => {
      const maliciousUuid = "'; DROP TABLE items; --";
      const result = SanitizationUtil.sanitizeUuid(maliciousUuid);
      expect(result).toBeNull();
    });
  });

  describe('validateSearchParams', () => {
    it('should sanitize all parameters', () => {
      const params = {
        q: "'; DROP TABLE items; --",
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        featured: 'true'
      };
      const result = SanitizationUtil.validateSearchParams(params);
      expect(result.query).toBe('DROP TABLE items --');
      expect(result.categoryIds).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.featured).toBe(true);
    });

    it('should handle empty parameters', () => {
      const params = {};
      const result = SanitizationUtil.validateSearchParams(params);
      expect(result).toEqual({});
    });
  });
});
