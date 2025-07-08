"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// import {loginCarrier} from '../controllers/carrier.controller';
const document_controller_1 = require("../controllers/document.controller");
const auth_1 = require("../middlewares/auth");
// create carrier
router.post('/upload_doc', auth_1.userAuthentication, auth_1.upload.array('file'), document_controller_1.uploadDocument);
exports.default = router;
