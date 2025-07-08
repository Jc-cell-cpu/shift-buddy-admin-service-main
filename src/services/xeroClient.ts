import dotenv from "dotenv";
import { XeroClient } from "xero-node";

dotenv.config();

if (
  !process.env.XERO_CLIENT_ID ||
  !process.env.XERO_CLIENT_SECRET ||
  !process.env.XERO_REDIRECT_URI ||
  !process.env.XERO_SCOPES
) {
  throw new Error("Missing required Xero environment variables");
}

const xero = new XeroClient({
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


export default xero;
