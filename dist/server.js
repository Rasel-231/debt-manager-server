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
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(` Fully secure operational grid safe on port channels: ${config_1.default.port}`);
        });
    }
    catch (err) {
        console.error('System structural entry deployment setup pipeline aborted:', err);
    }
}
myserver();
//# sourceMappingURL=server.js.map