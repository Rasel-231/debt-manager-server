"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const ioredis_1 = require("ioredis");
const config_1 = __importDefault(require("../config"));
const redisClient = new ioredis_1.Redis(config_1.default.redis_url, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => Math.min(times * 200, 2000),
});
redisClient.on('error', (err) => console.warn('Redis unavailable, falling back to in-memory store:', err.message));
redisClient.on('connect', () => console.log('Redis stream linked cache engine stable!'));
const connectRedis = async () => {
    if (redisClient.status === 'end' || redisClient.status === 'close') {
        await redisClient.connect();
    }
};
const isReady = () => redisClient.status === 'ready';
exports.RedisService = {
    connectRedis,
    isReady,
    client: redisClient,
};
//# sourceMappingURL=redis.js.map