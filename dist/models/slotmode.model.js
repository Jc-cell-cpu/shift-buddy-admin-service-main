"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SlotModeSchema = new mongoose_1.Schema({
    repeatType: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)('SlotMode', SlotModeSchema);
