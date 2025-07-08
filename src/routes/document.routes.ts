import express from 'express';
const router = express.Router();

// import {loginCarrier} from '../controllers/carrier.controller';
import { uploadDocument } from '../controllers/document.controller';
import { upload, userAuthentication } from '../middlewares/auth';





// create carrier
router.post('/upload_doc', userAuthentication, upload.array('file'), uploadDocument)






export default router;