"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const redis_1 = require("redis");
const config_1 = __importDefault(require("../config"));
const redisClient = (0, redis_1.createClient)({ url: config_1.default.redis_url });
redisClient.on('error', (err) => console.error(' Redis Configuration Pipeline Bug Error:', err));
redisClient.on('connect', () => console.log(' Redis Stream Linked Cache Engine Stable!'));
const connectRedis = async () => {
    if (!redisClient.isOpen)
        await redisClient.connect();
};
exports.RedisService = {
    connectRedis,
    client: redisClient,
};
//# sourceMappingURL=redis.js.map