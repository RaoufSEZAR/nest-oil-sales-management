import { Throttle } from '@nestjs/throttler';

export const ThrottleAuth = () => Throttle({ default: { ttl: 60000, limit: 3 } });
