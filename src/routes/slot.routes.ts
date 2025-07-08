import express from 'express';
const router = express.Router();

// import {loginCarrier} from '../controllers/carrier.controller';
import { createSlot, getSlot } from '../controllers/slot.controller';
import { upload, userAuthentication } from '../middlewares/auth';





// create carrier
router.post('/create_slot', userAuthentication, upload.single('file'), createSlot)
// create carrier
router.post('/get_slot', userAuthentication, getSlot)






export default router;