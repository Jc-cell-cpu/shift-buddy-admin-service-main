"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoice = exports.createInvoice = exports.createEmployeeInXeroAU = exports.callback = exports.connect = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const xero_node_1 = require("xero-node");
const models_1 = require("../models");
const validation_1 = require("../services/validation");
const xeroClient_1 = __importDefault(require("../services/xeroClient"));
dotenv_1.default.config();
// --------------------------------------
// Redirect to Xero consent URL
// --------------------------------------
const connect = async (req, res) => {
    try {
        const consentUrl = await xeroClient_1.default.buildConsentUrl();
        res.redirect(consentUrl);
    }
    catch (err) {
        console.error("Connect error:", err);
        res.status(500).send("Failed to initiate Xero connection");
    }
};
exports.connect = connect;
// --------------------------------------
// Xero OAuth callback handler
// --------------------------------------
const callback = async (req, res) => {
    try {
        const tokenSet = await xeroClient_1.default.apiCallback(req.url);
        xeroClient_1.default.setTokenSet(tokenSet);
        await xeroClient_1.default.updateTenants();
        const tenantId = xeroClient_1.default.tenants[0].tenantId;
        await models_1.XeroToken.create({
            tenantId,
            accessToken: tokenSet.access_token,
            refreshToken: tokenSet.refresh_token,
            expiresAt: new Date(Date.now() + tokenSet.expires_in * 1000),
        });
        res.send("Xero connected and token saved!");
    }
    catch (err) {
        console.error("Callback error:", err);
        res.status(500).send("Xero callback failed");
    }
};
exports.callback = callback;
//create employee in xero
//create cerrier in xero account
const createEmployeeInXeroAU = async (req, res, carrierObj) => {
    try {
        const token = await (0, validation_1.getValidXeroToken)(); // { accessToken, tenantId }
        const employeePayload = [
            {
                firstName: carrierObj.name.split(" ")[0],
                lastName: carrierObj.name.split(" ")[1] || 'kumar',
                email: carrierObj.email,
                dateOfBirth: carrierObj.DOB, // Use ISO format
                homeAddress: {
                    addressLine1: carrierObj.address.street || "123 Main St",
                    city: carrierObj.address.state || "Sydney",
                    region: "NSW", // ✅ Must be one of the valid region codes above
                    postalCode: "2000",
                    country: "AU"
                }
            }
        ];
        const response = await xeroClient_1.default.payrollAUApi.createEmployee(token.tenantId, employeePayload);
        const createdEmployee = response.body?.employees?.[0];
        if (createdEmployee?.employeeID) {
            await models_1.Carrier.findByIdAndUpdate(carrierObj._id, {
                xeroEmployeeId: createdEmployee.employeeID
            });
        }
        return { status: true, employeeId: createdEmployee.employeeID };
        // res.status(200).json({ msg: 'Employee created in Xero', employeeId: createdEmployee.employeeID });
    }
    catch (error) {
        console.error('Error creating AU employee in Xero:', error?.response?.body || error.message || error);
        return {
            status: false,
            employeeId: ''
        };
    }
};
exports.createEmployeeInXeroAU = createEmployeeInXeroAU;
// export const createEmployeeInXeroAU = async (
//   req: Request,
//   res: Response,
//   carrierObj: any
// ): Promise<void> => {
//   try {
//     const token = await getValidXeroToken(); // { accessToken, tenantId }
// const employeePayload:any = [
//   {
//     firstName: "Kundan",
//     lastName: "Kumar",
//     email: "ash7@gmail.com",
//     dateOfBirth: "1990-01-01", // Use ISO format
//     homeAddress: {
//       addressLine1: "123 Main St",
//       city: "Sydney",
//       region: "NSW", // ✅ Must be one of the valid region codes above
//       postalCode: "2000",
//       country: "AU"
//     }
//   }
// ];
//     const response = await xero.payrollAUApi.createEmployee(
//       token.tenantId,
//       employeePayload
//     );
//     const createdEmployee: any = response.body?.employees?.[0];
//     if (createdEmployee?.employeeID) {
//       await Carrier.findByIdAndUpdate(carrierObj._id, {
//         xeroEmployeeId: createdEmployee.employeeID
//       });
//     }
//     res.status(200).json({ msg: 'Employee created in Xero', employeeId: createdEmployee.employeeID });
//   } catch (error: any) {
//     console.error('Error creating AU employee in Xero:', error?.response?.body || error.message || error);
//     res.status(500).json({ msg: 'Failed to create employee in Xero AU' });
//   }
// };
// --------------------------------------
// Create Invoice
// --------------------------------------
const createInvoice = async (req, res) => {
    try {
        const token = await (0, validation_1.getValidXeroToken)();
        const createInvoicePayload = {
            invoices: [
                {
                    type: xero_node_1.Invoice.TypeEnum.ACCREC,
                    contact: {
                        name: "meeting demo",
                    },
                    lineItems: [
                        {
                            description: "Demo Demo",
                            quantity: 1.0,
                            unitAmount: 100.0,
                            accountCode: "200",
                        },
                    ],
                    date: new Date().toISOString().split("T")[0],
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    reference: "INV-12345",
                    status: xero_node_1.Invoice.StatusEnum.AUTHORISED,
                },
            ],
        };
        const response = await xeroClient_1.default.accountingApi.createInvoices(token.tenantId, createInvoicePayload);
        res.json(response.body);
    }
    catch (err) {
        console.error(err.response?.body || err);
        res.status(500).send("Error creating invoice");
    }
};
exports.createInvoice = createInvoice;
// --------------------------------------
// Get All Invoices
// --------------------------------------
const getInvoice = async (req, res) => {
    try {
        const token = await (0, validation_1.getValidXeroToken)();
        const response = await xeroClient_1.default.accountingApi.getInvoices(token.tenantId);
        res.json(response.body);
    }
    catch (err) {
        console.error(err.response?.body || err);
        res.status(500).send("Error fetching invoice");
    }
};
exports.getInvoice = getInvoice;
