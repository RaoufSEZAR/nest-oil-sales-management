"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottleAuth = void 0;
const throttler_1 = require("@nestjs/throttler");
const ThrottleAuth = () => (0, throttler_1.Throttle)({ default: { ttl: 60000, limit: 3 } });
exports.ThrottleAuth = ThrottleAuth;
//# sourceMappingURL=throttle-auth.decorator.js.map