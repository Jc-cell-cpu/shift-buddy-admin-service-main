"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNdis = exports.getRepeatMode = exports.getWeekdays = void 0;
const models_1 = require("../models");
const getWeekdays = async (req, res) => {
    try {
        const weekdays = await models_1.Weekday.find();
        res.status(200).json({
            msg: 'Weekdays fetched successfully',
            data: weekdays,
        });
    }
    catch (err) {
        console.error('Error fetching weekdays:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
exports.getWeekdays = getWeekdays;
const getRepeatMode = async (req, res) => {
    try {
        const repeatModes = await models_1.SlotMode.find();
        res.status(200).json({
            msg: 'Repeat fetched successfully',
            data: repeatModes,
        });
    }
    catch (err) {
        console.error('Error fetching weekdays:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
exports.getRepeatMode = getRepeatMode;
const getNdis = async (req, res) => {
    try {
        const repeatModes = await models_1.Ndis.find();
        res.status(200).json({
            msg: 'Repeat fetched successfully',
            data: repeatModes,
        });
    }
    catch (err) {
        console.error('Error fetching weekdays:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
exports.getNdis = getNdis;
