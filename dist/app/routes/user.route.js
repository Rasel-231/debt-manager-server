"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../modules/user/user.controller");
const fileUploadHelper_1 = require("../../utils/fileUploadHelper");
const router = express_1.default.Router();
router.post('/register-profile', fileUploadHelper_1.fileUploadHelper.upload.single('image'), user_controller_1.UserController.createUserAccount);
exports.default = router;
//# sourceMappingURL=user.route.js.map