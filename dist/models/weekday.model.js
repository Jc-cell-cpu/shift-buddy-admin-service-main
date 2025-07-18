"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const weekdaySchema = new mongoose_1.Schema({
    day: { type: String, required: true },
    dayNumber: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)('Weekday', weekdaySchema);
