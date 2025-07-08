import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
// import multerS3 from 'multer-s3';
// import s3 from '../config/s3';
import { User } from '../models';

dotenv.config();

interface TokenEntry {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

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
dotenv.config();

export const userAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization = req.cookies.accessToken;
    console.log("authorization",authorization)
    // const authorization = req.headers.authorization;

    if (!authorization ) {
      res.status(401).json({ msg: 'Authorization header missing or malformed' });
      return;
    }

    const token = authorization;
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const clientType = req.header('x-client-type'); // 'web' or 'app'
    if (!['web', 'app'].includes(clientType || '')) {
      res.status(400).json({ msg: 'Client type must be "web" or "app"' });
      return;
    }

    const user = await User.findById(decoded.id).populate('role');
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



  function isRoleObject(role: any): role is { roleCode: string } {
  return role && typeof role === 'object' && 'roleCode' in role;
}

(req as any).user = {
  id: user._id?.toString?.() ?? '',
  name: user.name,
  role_code: isRoleObject(user.role) ? user.role.roleCode : '',
  email: user.email,
};



    next();
  } catch (err) {
    console.error('Auth error:', (err as Error).message);
    res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

// Multer S3 File Upload
// 👇 Store file in memory as buffer instead of saving locally
const storage = multer.memoryStorage();
export const upload = multer({ storage });
