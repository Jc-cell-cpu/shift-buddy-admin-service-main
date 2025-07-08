"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModel = void 0;
const mongoose_1 = require("mongoose");
const OtpSchema = new mongoose_1.Schema({
    otp: { type: String, required: true },
    carrierID: { type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Carrier',
        required: true },
    status: { type: Boolean, required: true, default: true },
});
exports.OtpModel = (0, mongoose_1.model)('otpManagement', OtpSchema);
