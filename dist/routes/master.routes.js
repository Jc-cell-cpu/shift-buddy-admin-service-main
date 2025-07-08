"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// import {loginCarrier} from '../controllers/carrier.controller';
const master_controller_1 = require("../controllers/master.controller");
const auth_1 = require("../middlewares/auth");
// get weekdays
router.get('/get_weekdays', auth_1.userAuthentication, master_controller_1.getWeekdays);
// get reaprt mode
router.get('/get_repeat_mode', auth_1.userAuthentication, master_controller_1.getRepeatMode);
// get NDIS
router.get('/get_ndis', auth_1.userAuthentication, master_controller_1.getNdis);
exports.default = router;
