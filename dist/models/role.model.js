"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roleSchema = new mongoose_1.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
    },
    roleCode: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Role', roleSchema);
