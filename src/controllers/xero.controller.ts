import dotenv from "dotenv";
import { Request, Response } from "express";

import { Invoice } from 'xero-node';
import { Carrier, XeroToken } from "../models";
import { getValidXeroToken } from "../services/validation";
import xero from "../services/xeroClient";

dotenv.config();

// --------------------------------------
// Redirect to Xero consent URL
// --------------------------------------
export const connect = async (req: Request, res: Response) => {
  try {
    const consentUrl = await xero.buildConsentUrl();
    res.redirect(consentUrl);
  } catch (err) {
    console.error("Connect error:", err);
    res.status(500).send("Failed to initiate Xero connection");
  }
};

// --------------------------------------
// Xero OAuth callback handler
// --------------------------------------
export const callback = async (req: Request, res: Response) => {
  try {
    const tokenSet = await xero.apiCallback(req.url);
    xero.setTokenSet(tokenSet);
    await xero.updateTenants();

    const tenantId = xero.tenants[0].tenantId;

    await XeroToken.create({
      tenantId,
      accessToken: tokenSet.access_token,
      refreshToken: tokenSet.refresh_token,
      expiresAt: new Date(Date.now() + tokenSet.expires_in! * 1000),
    });

    res.send("Xero connected and token saved!");
  } catch (err) {
    console.error("Callback error:", err);
    res.status(500).send("Xero callback failed");
  }
};

//create employee in xero
//create cerrier in xero account


export const createEmployeeInXeroAU = async (req: Request, res: Response, carrierObj: any): Promise<{ status: boolean; employeeId: string }> => {
  try {
    const token = await getValidXeroToken(); // { accessToken, tenantId }

    const employeePayload: any = [
      {
        firstName: carrierObj.name.split(" ")[0],
        lastName: carrierObj.name.split(" ")[1] || 'kumar',
        email: carrierObj.email,
        dateOfBirth: carrierObj.DOB, // Use ISO format
        homeAddress: {
          addressLine1: carrierObj.address.street || "123 Main St",
          city: carrierObj.address.state || "Sydney",
          region: "NSW", // ✅ Must be one of the valid region codes above
          postalCode:  "2000",
          country: "AU"
        }
      }
    ];


    const response = await xero.payrollAUApi.createEmployee(
      token.tenantId,
      employeePayload
    );

    const createdEmployee: any = response.body?.employees?.[0];

    if (createdEmployee?.employeeID) {
      await Carrier.findByIdAndUpdate(carrierObj._id, {
        xeroEmployeeId: createdEmployee.employeeID
      });
    }

    return { status: true, employeeId: createdEmployee.employeeID }
    // res.status(200).json({ msg: 'Employee created in Xero', employeeId: createdEmployee.employeeID });

  } catch (error: any) {
    console.error('Error creating AU employee in Xero:', error?.response?.body || error.message || error);
    return {
      status: false,
      employeeId: ''
    };
  }
};



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
export const createInvoice = async (req: Request, res: Response) => {
  try {
    const token = await getValidXeroToken();

    const createInvoicePayload = {
      invoices: [
        {
          type: Invoice.TypeEnum.ACCREC,
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
          dueDate: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString().split("T")[0],
          reference: "INV-12345",
          status: Invoice.StatusEnum.AUTHORISED,
        },
      ],
    };

    const response = await xero.accountingApi.createInvoices(
      token.tenantId,
      createInvoicePayload
    );

    res.json(response.body);
  } catch (err: any) {
    console.error(err.response?.body || err);
    res.status(500).send("Error creating invoice");
  }
};

// --------------------------------------
// Get All Invoices
// --------------------------------------
export const getInvoice = async (req: Request, res: Response) => {
  try {
    const token = await getValidXeroToken();
    const response = await xero.accountingApi.getInvoices(token.tenantId);
    res.json(response.body);
  } catch (err: any) {
    console.error(err.response?.body || err);
    res.status(500).send("Error fetching invoice");
  }
};
