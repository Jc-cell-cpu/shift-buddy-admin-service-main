"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// import {loginCarrier} from '../controllers/carrier.controller';
const carrier_controller_1 = require("../controllers/carrier.controller");
const auth_1 = require("../middlewares/auth");
// create carrier
router.post('/create_carrier', auth_1.userAuthentication, carrier_controller_1.createCarrier);
// create carrier
router.post('/update_carrier', auth_1.userAuthentication, carrier_controller_1.updateCarrier);
// get carrier list
router.post('/carrier_list', auth_1.userAuthentication, carrier_controller_1.getCarriers);
// get carrier details
router.post('/carrier_details', auth_1.userAuthentication, carrier_controller_1.getCarrierById);
// get carrier details
router.post('/update_carrier_status', auth_1.userAuthentication, carrier_controller_1.updateCarrierStatus);
// get carrier details
router.post('/check_carrier_availability', auth_1.userAuthentication, carrier_controller_1.checkCarrierAvailability);
exports.default = router;
