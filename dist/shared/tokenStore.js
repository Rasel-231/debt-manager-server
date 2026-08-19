"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenStore = void 0;
const redis_1 = require("./redis");
const memoryStore = new Map();
const isExpired = (entry) => entry.expiresAt > 0 && entry.expiresAt < Date.now();
exports.tokenStore = {
    async get(key) {
        if (redis_1.RedisService.isReady()) {
            return redis_1.RedisService.client.get(key);
        }
        const entry = memoryStore.get(key);
        if (!entry)
            return null;
        if (isExpired(entry)) {
            memoryStore.delete(key);
            return null;
        }
        return entry.value;
    },
    async set(key, value, ttlSeconds) {
        if (redis_1.RedisService.isReady()) {
            await redis_1.RedisService.client.set(key, value, 'EX', ttlSeconds);
            return;
        }
        memoryStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
    },
    async del(key) {
        if (redis_1.RedisService.isReady()) {
            await redis_1.RedisService.client.del(key);
            return;
        }
        memoryStore.delete(key);
    },
};
//# sourceMappingURL=tokenStore.js.map