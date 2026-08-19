import { Redis } from 'ioredis';
export declare const RedisService: {
    connectRedis: () => Promise<void>;
    isReady: () => boolean;
    client: Redis;
};
//# sourceMappingURL=redis.d.ts.map