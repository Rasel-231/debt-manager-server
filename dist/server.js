"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const redis_1 = require("./shared/redis");
async function myserver() {
    let server;
    try {
        await redis_1.RedisService.connectRedis();
    }
    catch (err) {
        console.warn('Redis not reachable — continuing with in-memory token store', err);
    }
    try {
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(` Debt Manager API is running on port: ${config_1.default.port}`);
        });
    }
    catch (err) {
        console.error('Failed to start server:', err);
    }
}
myserver();
//# sourceMappingURL=server.js.map