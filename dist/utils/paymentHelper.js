"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentHelper = void 0;
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const config_1 = __importDefault(require("../config"));
const initPayment = async (paymentData) => {
    const sslcz = new sslcommerz_lts_1.default(config_1.default.sslcommerz.store_id, config_1.default.sslcommerz.store_password, config_1.default.sslcommerz.is_live);
    const requestPayload = {
        ...paymentData,
        currency: 'BDT',
        success_url: `${config_1.default.base_url}/payments/success?tran_id=${paymentData.tran_id}`,
        fail_url: `${config_1.default.base_url}/payments/fail?tran_id=${paymentData.tran_id}`,
        cancel_url: `${config_1.default.base_url}/payments/cancel`,
        shipping_method: 'NO',
        product_name: 'System Checkout Processing',
        product_category: 'E-commerce Asset',
        product_profile: 'general',
    };
    const response = await sslcz.init(requestPayload);
    return response.GatewayPageURL;
};
exports.paymentHelper = {
    initPayment,
};
//# sourceMappingURL=paymentHelper.js.map