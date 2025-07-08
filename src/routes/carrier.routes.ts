import express from 'express';
const router = express.Router();

// import {loginCarrier} from '../controllers/carrier.controller';
import { createCarrier, getCarrierById, getCarriers, updateCarrier, updateCarrierStatus, checkCarrierAvailability } from '../controllers/carrier.controller';
import { upload, userAuthentication } from '../middlewares/auth';





// create carrier
router.post('/create_carrier', userAuthentication, createCarrier)


// create carrier
router.post('/update_carrier', userAuthentication, updateCarrier)

// get carrier list
router.post('/carrier_list', userAuthentication, getCarriers)

// get carrier details
router.post('/carrier_details', userAuthentication, getCarrierById)

// get carrier details
router.post('/update_carrier_status', userAuthentication, updateCarrierStatus)

// get carrier details
router.post('/check_carrier_availability', userAuthentication, checkCarrierAvailability)



export default router;