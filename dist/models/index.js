"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XeroToken = exports.Weekday = exports.User = exports.SlotMode = exports.Slot = exports.Role = exports.Ndis = exports.Document = exports.Client = exports.Carrier = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Explicit imports for direct access
const carrier_model_1 = __importDefault(require("./carrier.model"));
exports.Carrier = carrier_model_1.default;
const client_model_1 = __importDefault(require("./client.model"));
exports.Client = client_model_1.default;
const document_model_1 = __importDefault(require("./document.model"));
exports.Document = document_model_1.default;
const ndis_model_1 = __importDefault(require("./ndis.model"));
exports.Ndis = ndis_model_1.default;
const role_model_1 = __importDefault(require("./role.model"));
exports.Role = role_model_1.default;
const slot_model_1 = __importDefault(require("./slot.model"));
exports.Slot = slot_model_1.default;
const slotmode_model_1 = __importDefault(require("./slotmode.model"));
exports.SlotMode = slotmode_model_1.default;
const user_model_1 = __importDefault(require("./user.model"));
exports.User = user_model_1.default;
const weekday_model_1 = __importDefault(require("./weekday.model"));
exports.Weekday = weekday_model_1.default;
const xero_token_model_1 = require("./xero-token.model");
Object.defineProperty(exports, "XeroToken", { enumerable: true, get: function () { return xero_token_model_1.XeroToken; } });
// Dynamically require all models in the folder
const modelsPath = __dirname;
const models = {};
// Optional: dynamically load other models (if you add more in the future)
fs_1.default.readdirSync(modelsPath)
    .filter(file => file.endsWith(".ts") && file !== "index.ts")
    .forEach(file => {
    const model = require(path_1.default.join(modelsPath, file));
    const modelName = path_1.default.basename(file, ".ts");
    models[modelName] = model.default || model;
});
exports.default = {
    XeroToken: xero_token_model_1.XeroToken,
    User: user_model_1.default,
    Role: role_model_1.default,
    Carrier: carrier_model_1.default,
    Document: document_model_1.default,
    Client: client_model_1.default,
    Slot: slot_model_1.default,
    SlotMode: slotmode_model_1.default,
    ...models, // include dynamically loaded models if any
};
