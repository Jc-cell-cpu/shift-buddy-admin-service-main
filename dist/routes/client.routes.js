"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// import {loginCarrier} from '../controllers/carrier.controller';
const client_controller_1 = require("../controllers/client.controller");
const auth_1 = require("../middlewares/auth");
// create carrier
router.post('/create_client', auth_1.userAuthentication, auth_1.upload.single('file'), client_controller_1.createClient);
// create client
router.get('/get_client/:clientId', auth_1.userAuthentication, client_controller_1.getClientByClientId);
// get carrier list
// router.post('/carrier_list', userAuthentication, getCarriers)
// get carrier details
// router.post('/carrier_details', userAuthentication, getCarrierById)
// get carrier details
// router.post('/update_carrier_status', userAuthentication, updateCarrierStatus)
exports.default = router;
