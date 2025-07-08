"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Token Schema
const tokenSchema = new mongoose_1.Schema({
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
    isActive: { type: Boolean, default: true }
}, { _id: false });
// User Schema
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: (props) => `${props.value} is not a valid email address!`
        }
    },
    password: { type: String, required: true },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    webTokens: [tokenSchema],
    appTokens: [tokenSchema]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('User', userSchema);
