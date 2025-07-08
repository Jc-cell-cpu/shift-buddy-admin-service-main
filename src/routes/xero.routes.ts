// routes/auth.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import {
  getInvoice,
  createInvoice,
  connect,
  callback
} from '../controllers/xero.controller';


const router = express.Router();

// Connect to Xero
router.get('/connect', connect);

// Xero callback
router.get('/callback', callback);

// Get invoices
router.get('/get_invoice', getInvoice);

// Create invoice
router.post('/create_invoice', createInvoice);

// Export the router
export default router;
