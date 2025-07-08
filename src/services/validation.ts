import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import ExifParser from 'exif-parser';
import { TokenSet } from 'xero-node';
import { XeroToken } from '../models'; // assuming models/index.ts exports XeroToken
import { XeroTokenDocument } from '../models/xero-token.model'; // 👈 update path if needed
import xero from './xeroClient';


const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


dotenv.config();

// If XeroToken is a Mongoose model:

export const getValidXeroToken = async (): Promise<XeroTokenDocument> => {
  // Get the latest token
  const tokenRecord = await XeroToken.findOne()
    .sort({ createdAt: -1 })
    .exec();

  if (!tokenRecord) {
    throw new Error('No Xero token found. Please connect first.');
  }

  // Check if expired
  if (new Date() >= tokenRecord.expiresAt) {
    console.log('Token expired → refreshing...');

    const tokenSet: TokenSet = await xero.refreshWithRefreshToken(
      process.env.XERO_CLIENT_ID!,
      process.env.XERO_CLIENT_SECRET!,
      tokenRecord.refreshToken
    );

    // const tokenSet: TokenSet = await xero.refreshWithRefreshToken(
    //   tokenRecord.tenantId,
    //   tokenRecord.refreshToken,
    //   process.env.XERO_CLIENT_ID // 👈 add your client_id or required third argument here
    // );

    // Update DB with new token
    tokenRecord.accessToken = tokenSet.access_token ?? '';
    tokenRecord.refreshToken = tokenSet.refresh_token ?? '';
    tokenRecord.expiresAt = new Date(Date.now() + ((tokenSet.expires_in ?? 3600) * 1000));
    await tokenRecord.save();

    console.log('Token refreshed!');
  }

  // Update SDK token
  xero.setTokenSet({
    access_token: tokenRecord.accessToken,
    refresh_token: tokenRecord.refreshToken,
    expires_in: Math.floor((tokenRecord.expiresAt.getTime() - Date.now()) / 1000),
    token_type: 'Bearer',
    scope: process.env.XERO_SCOPES,
  });

  return tokenRecord;
};



//upload file
export const uploadToS3 = async (file: Express.Multer.File) => {
  const key = `carriers/${Date.now()}-${file.originalname}`;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  const result = await upload.done();
  return result.Location; // URL to the uploaded file
}


//Attandence face matching
export async function compareFacesInS3(
  sourceKey: string,
  targetKey: string,
  bucket: string
): Promise<number | null> {
  const params = {
    SourceImage: {
      S3Object: {
        Bucket: bucket,
        Name: sourceKey
      }
    },
    TargetImage: {
      S3Object: {
        Bucket: bucket,
        Name: targetKey
      }
    },
    SimilarityThreshold: 90
  };

  try {
    const data = await rekognition.compareFaces(params).promise();

    if (data.FaceMatches && data.FaceMatches.length > 0) {
      return data.FaceMatches[0].Similarity!;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error comparing faces:', error);
    throw error;
  }
}


//Attandence for location tracking
export async function getImageLocationFromS3(
  bucket: string,
  key: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const file = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    const buffer = file.Body as Buffer;

    const parser = ExifParser.create(buffer);
    const result = parser.parse();

    const latitude = result.tags.GPSLatitude;
    const longitude = result.tags.GPSLongitude;

    if (latitude && longitude) {
      return { latitude, longitude };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error reading image location from S3:', error);
    throw error;
  }
}





