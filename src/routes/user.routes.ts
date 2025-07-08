import express from 'express';
import { createUser, login, getAccessToken } from '../controllers/user.controller';
import { catchAsync } from '../utils/catchAsync';




// import { userAuthentication } from '../middlewares'

const router = express.Router();

// Register
// router.post('/create_user', createUser);
// Login
// router.post('/login', login);

// Get access token
// router.post('/get-access-token', getAccessToken);


router.post('/create_user', catchAsync(createUser));
router.post('/login', catchAsync(login));
router.post('/get-access-token', catchAsync(getAccessToken));




export default router;
