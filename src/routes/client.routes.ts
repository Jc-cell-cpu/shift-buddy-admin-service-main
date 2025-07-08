import express from 'express';
const router = express.Router();

// import {loginCarrier} from '../controllers/carrier.controller';
import { createClient, getClientByClientId } from '../controllers/client.controller';
import { upload, userAuthentication } from '../middlewares/auth';





// create carrier
router.post('/create_client', userAuthentication, upload.single('file'), createClient)


// create client
router.get('/get_client/:clientId', userAuthentication, getClientByClientId)

// get carrier list
// router.post('/carrier_list', userAuthentication, getCarriers)

// get carrier details
// router.post('/carrier_details', userAuthentication, getCarrierById)

// get carrier details
// router.post('/update_carrier_status', userAuthentication, updateCarrierStatus)



export default router;