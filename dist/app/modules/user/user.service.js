"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const redis_1 = require("../../../shared/redis");
const sendEmailHelper_1 = require("../../../utils/sendEmailHelper");
const aiHelper_1 = require("../../../utils/aiHelper");
const paymentHelper_1 = require("../../../utils/paymentHelper");
const processComplexUserWorkspace = async (userData, fileUrl) => {
    // 1. Transactional Postgres Entry Execution
    const newUserRecord = await prisma_1.default.user.create({
        data: {
            email: userData.email,
            name: userData.name,
            avatarUrl: fileUrl,
        },
    });
    // 2. Cache invalidation layer operations context via Redis Instance directly
    await redis_1.RedisService.client.set(`user_session:${newUserRecord.id}`, JSON.stringify(newUserRecord), {
        EX: 3600,
    });
    // 3. Triggering Isolated Background Engine processes
    const generatedInsightWelcomeText = await aiHelper_1.aiHelper.generateAiResponse(`Write a short 1-line welcoming phrase for our active premium platform buyer client named ${userData.name}.`);
    await sendEmailHelper_1.sendEmailHelper.sendEmail(userData.email, 'Welcome onboard transaction active record logger notification email setup!', `<h1>Welcome!</h1><p>${generatedInsightWelcomeText}</p>`);
    // 4. Instantiate payment payload registration token pipeline parameters reference tracking object mapping layout standard structures
    const targetPaymentGatewayRedirectAddressUrl = await paymentHelper_1.paymentHelper.initPayment({
        total_amount: 1500,
        tran_id: `TXN-${Date.now()}`,
        cus_name: userData.name,
        cus_email: userData.email,
        cus_phone: '01700000000',
    });
    return {
        user: newUserRecord,
        checkoutUrl: targetPaymentGatewayRedirectAddressUrl,
    };
};
exports.UserService = {
    processComplexUserWorkspace,
};
//# sourceMappingURL=user.service.js.map