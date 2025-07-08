"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekdaysBetween = exports.getMonthlyDatesBetween = exports.getDatesByWeekdayBetweenRange = exports.getSlotRecurring = exports.isReapetValid = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const models_1 = require("../models"); // 👈 update path if needed
dotenv_1.default.config();
const isReapetValid = async (repeatId, dayOfWeek, dayOfMonth, customSlotArray) => {
    // Get the latest token
    const slotRecord = await models_1.SlotMode.findOne({ _id: repeatId });
    if (!slotRecord) {
        throw new Error('Invaild Repeat Mode');
    }
    // checking the repeat condition here
    let result = [];
    if (slotRecord.repeatType == 'Weekly on the Day') {
        if (!dayOfWeek) {
            return { status: false, message: 'dayOfWeek is required' };
        }
    }
    else if (slotRecord.repeatType == 'Monthly on the Day') {
        if (!dayOfMonth) {
            return { status: false, message: 'dayOfMonth is required' };
        }
    }
    else if (slotRecord.repeatType == 'Custom') {
        if (customSlotArray.length == 0) {
            return { status: false, message: 'customSlotArray is required' };
        }
    }
    return { status: true, message: '' };
};
exports.isReapetValid = isReapetValid;
const getSlotRecurring = async (startDate, endDate, repeatId, dayOfWeek, dayOfMonth, customSlotArray) => {
    // Get the latest token
    const slotRecord = await models_1.SlotMode.findOne({ _id: repeatId });
    if (!slotRecord) {
        throw new Error('Invaild Repeat Mode');
    }
    // checking the repeat condition here
    let result = [];
    if (slotRecord.repeatType == 'Weekly on the Day') {
        // if (!dayOfWeek) {
        //         return {status : false , message  :'dayOfWeek is required'};
        // }
        result = await (0, exports.getDatesByWeekdayBetweenRange)(startDate, endDate, dayOfWeek);
    }
    else if (slotRecord.repeatType == 'Monthly on the Day') {
        // if (!dayOfMonth) {  
        //         throw new Error('dayOfMonth is required');
        // }
        result = await (0, exports.getMonthlyDatesBetween)(startDate, endDate, dayOfMonth);
    }
    else if (slotRecord.repeatType == 'Every weekday(Monday to Friday)') {
        result = await (0, exports.getWeekdaysBetween)(startDate, endDate);
    }
    else if (slotRecord.repeatType == 'Custom') {
        result = customSlotArray;
    }
    else {
        result = [startDate];
    }
    return result;
};
exports.getSlotRecurring = getSlotRecurring;
//In case of weekdays
const getDatesByWeekdayBetweenRange = (startDate, endDate, targetWeekday // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
) => {
    const result = [];
    let current = (0, moment_1.default)(startDate);
    const end = (0, moment_1.default)(endDate);
    // Start from the first occurrence of the target weekday
    while (current.day() !== targetWeekday) {
        current.add(1, 'day');
    }
    // Add all matching weekdays until the end date
    while (current.isSameOrBefore(end, 'day')) {
        result.push(current.format('YYYY-MM-DD'));
        current.add(7, 'days'); // jump to next week
    }
    return result;
};
exports.getDatesByWeekdayBetweenRange = getDatesByWeekdayBetweenRange;
//In case of monthly
const getMonthlyDatesBetween = (startDate, endDate, dayOfMonth) => {
    const dates = [];
    const start = (0, moment_1.default)(startDate).startOf('month');
    const end = (0, moment_1.default)(endDate).endOf('month');
    let current = start.clone();
    while (current.isSameOrBefore(end)) {
        const targetDate = current.clone().date(dayOfMonth);
        if (targetDate.isSameOrAfter(startDate, 'day') &&
            targetDate.isSameOrBefore(endDate, 'day') &&
            targetDate.date() === dayOfMonth // only push valid dates
        ) {
            dates.push(targetDate.format('YYYY-MM-DD'));
        }
        current.add(1, 'month');
    }
    return dates;
};
exports.getMonthlyDatesBetween = getMonthlyDatesBetween;
//Every weekday(Monday to Friday)
const getWeekdaysBetween = (startDateStr, endDateStr) => {
    const startDate = (0, moment_1.default)(startDateStr);
    const endDate = (0, moment_1.default)(endDateStr);
    const weekdays = [];
    while (startDate.isSameOrBefore(endDate)) {
        const day = startDate.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        if (day >= 1 && day <= 5) {
            weekdays.push(startDate.format('YYYY-MM-DD'));
        }
        startDate.add(1, 'day');
    }
    return weekdays;
};
exports.getWeekdaysBetween = getWeekdaysBetween;
