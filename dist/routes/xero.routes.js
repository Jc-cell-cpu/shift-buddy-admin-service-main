"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/auth.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const xero_controller_1 = require("../controllers/xero.controller");
const router = express_1.default.Router();
// Connect to Xero
router.get('/connect', xero_controller_1.connect);
// Xero callback
router.get('/callback', xero_controller_1.callback);
// Get invoices
router.get('/get_invoice', xero_controller_1.getInvoice);
// Create invoice
router.post('/create_invoice', xero_controller_1.createInvoice);
// Export the router
exports.default = router;
