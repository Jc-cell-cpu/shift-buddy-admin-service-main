"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.userAuthentication = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
// import multerS3 from 'multer-s3';
// import s3 from '../config/s3';
const models_1 = require("../models");
dotenv_1.default.config();
// interface UserPayload {
//   id: string;
//   name: string;
//   role_code: string;
//   email: string;
// }
// declare global {
//   namespace Express {
//     interface Request {
//       user?: UserPayload;
//       file?: Express.Multer.File & { location?: string };
//     }
//   }
// }
// Middleware: Authenticate User
dotenv_1.default.config();
const userAuthentication = async (req, res, next) => {
    try {
        const authorization = req.cookies.accessToken;
        console.log("authorization", authorization);
        // const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({ msg: 'Authorization header missing or malformed' });
            return;
        }
        const token = authorization;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const clientType = req.header('x-client-type'); // 'web' or 'app'
        if (!['web', 'app'].includes(clientType || '')) {
            res.status(400).json({ msg: 'Client type must be "web" or "app"' });
            return;
        }
        const user = await models_1.User.findById(decoded.id).populate('role');
        if (!user) {
            res.status(401).json({ msg: 'User not found' });
            return;
        }
        const tokenList = clientType === 'web' ? user.webTokens : user.appTokens;
        const isTokenValid = tokenList?.some(t => t.accessToken === token);
        if (!isTokenValid) {
            res.status(401).json({ msg: 'Token not recognized. Please login again.' });
            return;
        }
        function isRoleObject(role) {
            return role && typeof role === 'object' && 'roleCode' in role;
        }
        req.user = {
            id: user._id?.toString?.() ?? '',
            name: user.name,
            role_code: isRoleObject(user.role) ? user.role.roleCode : '',
            email: user.email,
        };
        next();
    }
    catch (err) {
        console.error('Auth error:', err.message);
        res.status(401).json({ msg: 'Invalid or expired token' });
    }
};
exports.userAuthentication = userAuthentication;
// Multer S3 File Upload
// 👇 Store file in memory as buffer instead of saving locally
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage });
