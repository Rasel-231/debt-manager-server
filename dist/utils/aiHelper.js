"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiHelper = void 0;
const config_1 = __importDefault(require("../config"));
const generateAiResponse = async (prompt) => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config_1.default.ai_api_key}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'meta-llama/llama-3-8b-instruct:free',
            messages: [{ role: 'user', content: prompt }],
        }),
    });
    const rawJsonOutput = await response.json();
    return rawJsonOutput.choices[0].message.content;
};
exports.aiHelper = {
    generateAiResponse,
};
//# sourceMappingURL=aiHelper.js.map