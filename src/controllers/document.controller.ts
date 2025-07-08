import { Request, Response } from "express";
import { uploadToS3 } from '../services/validation';

// export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
//     try {


//         // Get S3 file URL from multer-s3
//         // const s3File = req.file as Express.Multer.File & { location?: string };
//          let fileUrl:any = '';
//             if (req.file) {
//                 fileUrl = await uploadToS3(req.file);
//             }
//             else{
//                 res.status(400).json({
//                     msg: 'Upload a valid file',
//                     documentId: []
//                 });
//             }
//         const profileImageUrl = fileUrl;

        
//         res.status(201).json({
//             msg: 'Document upload successfully',
//             documentId: profileImageUrl
//         });
//     } catch (err: any) {
//         console.error('Error creating carrier:', err.message);
//         res.status(500).json({ msg: 'Internal server error' });
//     }
// };

export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        msg: 'Upload a valid file',
        documentId: []
      });
      return;
    }

    // Upload each file to S3 and collect their URLs
    const fileUrls: string[] = [];

    for (const file of files) {
      const url:any = await uploadToS3(file); // your existing S3 upload utility
      fileUrls.push(url);
    }

    res.status(201).json({
      msg: 'Documents uploaded successfully',
      documentId: fileUrls
    });
  } catch (err: any) {
    console.error('Error uploading documents:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
