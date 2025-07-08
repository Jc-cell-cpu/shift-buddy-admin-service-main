"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const carrier_routes_1 = __importDefault(require("./routes/carrier.routes"));
const client_routes_1 = __importDefault(require("./routes/client.routes"));
const document_routes_1 = __importDefault(require("./routes/document.routes"));
const master_routes_1 = __importDefault(require("./routes/master.routes"));
const slot_routes_1 = __importDefault(require("./routes/slot.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const xero_routes_1 = __importDefault(require("./routes/xero.routes"));
// import './types/express'; // Adjust path as needed
// import '../src/types/express/index'; // 👈 Load our custom Request type
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
// Middleware
app.use(express_1.default.json());
//origin 
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // allow requests from your frontend
    credentials: true // allow cookies if needed
}));
// UserRoutes
app.use('/user/v1', user_routes_1.default);
//CarrierRoutes
app.use('/carrier/v1', carrier_routes_1.default);
//CarrierRoutes
app.use('/client/v1', client_routes_1.default);
//Xero account
app.use('/xero/v1', xero_routes_1.default);
// Documents upload
app.use('/doc/v1', document_routes_1.default);
//slots
app.use('/slot/v1', slot_routes_1.default);
//maters
app.use('/master/v1', master_routes_1.default);
// Start Server
const PORT = process.env.PORT || 4000;
(0, db_1.default)().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
