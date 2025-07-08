"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// import {loginCarrier} from '../controllers/carrier.controller';
const slot_controller_1 = require("../controllers/slot.controller");
const auth_1 = require("../middlewares/auth");
// create carrier
router.post('/create_slot', auth_1.userAuthentication, auth_1.upload.single('file'), slot_controller_1.createSlot);
// create carrier
router.post('/get_slot', auth_1.userAuthentication, slot_controller_1.getSlot);
exports.default = router;
