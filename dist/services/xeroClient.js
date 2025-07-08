"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const xero_node_1 = require("xero-node");
dotenv_1.default.config();
if (!process.env.XERO_CLIENT_ID ||
    !process.env.XERO_CLIENT_SECRET ||
    !process.env.XERO_REDIRECT_URI ||
    !process.env.XERO_SCOPES) {
    throw new Error("Missing required Xero environment variables");
}
const xero = new xero_node_1.XeroClient({
    clientId: process.env.XERO_CLIENT_ID,
    clientSecret: process.env.XERO_CLIENT_SECRET,
    redirectUris: [process.env.XERO_REDIRECT_URI],
    scopes: process.env.XERO_SCOPES.split(" "),
});
// const xero = new XeroClient({
//   clientId: process.env.XERO_CLIENT_ID!,
//   clientSecret: process.env.XERO_CLIENT_SECRET!,
//   redirectUris: ['http://localhost:4000/xero/v1/callback'],
//   scopes: [
//     'openid',
//     'email',
//     'profile',
//     'offline_access',
//     'payroll.employees'
//   ],
// });
exports.default = xero;
