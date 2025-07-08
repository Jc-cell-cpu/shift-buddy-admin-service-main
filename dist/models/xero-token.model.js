"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XeroToken = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// 3. Define the schema
const XeroTokenSchema = new mongoose_1.default.Schema({
    tenantId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });
// 4. Export the model
exports.XeroToken = mongoose_1.default.model('XeroToken', XeroTokenSchema);
