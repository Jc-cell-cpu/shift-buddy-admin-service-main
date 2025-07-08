import express from 'express';
const router = express.Router();

// import {loginCarrier} from '../controllers/carrier.controller';
import { getRepeatMode, getWeekdays, getNdis } from '../controllers/master.controller';
import { userAuthentication } from '../middlewares/auth';





// get weekdays
router.get('/get_weekdays', userAuthentication,  getWeekdays)
// get reaprt mode
router.get('/get_repeat_mode', userAuthentication, getRepeatMode)
// get NDIS
router.get('/get_ndis', userAuthentication, getNdis)







export default router;