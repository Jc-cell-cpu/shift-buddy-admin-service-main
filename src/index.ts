import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db';
import carrierRoutes from './routes/carrier.routes';
import clientroutes from './routes/client.routes';
import docroutes from './routes/document.routes';
import mastersroutes from './routes/master.routes';
import slotroutes from './routes/slot.routes';
import userRoutes from './routes/user.routes';
import xeroroutes from './routes/xero.routes';

// import './types/express'; // Adjust path as needed

// import '../src/types/express/index'; // 👈 Load our custom Request type



dotenv.config();
const app = express();
app.use(cookieParser());

// Middleware
app.use(express.json());

//origin 
app.use(cors({
    origin: 'http://localhost:3000', // allow requests from your frontend
    credentials: true // allow cookies if needed
}))
// UserRoutes
app.use('/admin/v1', userRoutes);
//CarrierRoutes
app.use('/carrier/v1', carrierRoutes);
//CarrierRoutes
app.use('/client/v1', clientroutes);
//Xero account
app.use('/xero/v1', xeroroutes);
// Documents upload
app.use('/doc/v1', docroutes);
//slots
app.use('/slot/v1', slotroutes);
//maters
app.use('/master/v1', mastersroutes);



// Start Server
const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
