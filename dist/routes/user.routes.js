"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const catchAsync_1 = require("../utils/catchAsync");
// import { userAuthentication } from '../middlewares'
const router = express_1.default.Router();
// Register
// router.post('/create_user', createUser);
// Login
// router.post('/login', login);
// Get access token
// router.post('/get-access-token', getAccessToken);
router.post('/create_user', (0, catchAsync_1.catchAsync)(user_controller_1.createUser));
router.post('/login', (0, catchAsync_1.catchAsync)(user_controller_1.login));
router.post('/get-access-token', (0, catchAsync_1.catchAsync)(user_controller_1.getAccessToken));
exports.default = router;
