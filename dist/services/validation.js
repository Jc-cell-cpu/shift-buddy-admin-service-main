"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = exports.getValidXeroToken = void 0;
exports.compareFacesInS3 = compareFacesInS3;
exports.getImageLocationFromS3 = getImageLocationFromS3;
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const exif_parser_1 = __importDefault(require("exif-parser"));
const models_1 = require("../models"); // assuming models/index.ts exports XeroToken
const xeroClient_1 = __importDefault(require("./xeroClient"));
const rekognition = new aws_sdk_1.default.Rekognition();
const s3 = new aws_sdk_1.default.S3();
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
dotenv_1.default.config();
// If XeroToken is a Mongoose model:
const getValidXeroToken = async () => {
    // Get the latest token
    const tokenRecord = await models_1.XeroToken.findOne()
        .sort({ createdAt: -1 })
        .exec();
    if (!tokenRecord) {
        throw new Error('No Xero token found. Please connect first.');
    }
    // Check if expired
    if (new Date() >= tokenRecord.expiresAt) {
        console.log('Token expired → refreshing...');
        const tokenSet = await xeroClient_1.default.refreshWithRefreshToken(process.env.XERO_CLIENT_ID, process.env.XERO_CLIENT_SECRET, tokenRecord.refreshToken);
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
    xeroClient_1.default.setTokenSet({
        access_token: tokenRecord.accessToken,
        refresh_token: tokenRecord.refreshToken,
        expires_in: Math.floor((tokenRecord.expiresAt.getTime() - Date.now()) / 1000),
        token_type: 'Bearer',
        scope: process.env.XERO_SCOPES,
    });
    return tokenRecord;
};
exports.getValidXeroToken = getValidXeroToken;
//upload file
const uploadToS3 = async (file) => {
    const key = `carriers/${Date.now()}-${file.originalname}`;
    const upload = new lib_storage_1.Upload({
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
};
exports.uploadToS3 = uploadToS3;
//Attandence face matching
async function compareFacesInS3(sourceKey, targetKey, bucket) {
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
            return data.FaceMatches[0].Similarity;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error('Error comparing faces:', error);
        throw error;
    }
}
//Attandence for location tracking
async function getImageLocationFromS3(bucket, key) {
    try {
        const file = await s3.getObject({ Bucket: bucket, Key: key }).promise();
        const buffer = file.Body;
        const parser = exif_parser_1.default.create(buffer);
        const result = parser.parse();
        const latitude = result.tags.GPSLatitude;
        const longitude = result.tags.GPSLongitude;
        if (latitude && longitude) {
            return { latitude, longitude };
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error('Error reading image location from S3:', error);
        throw error;
    }
}
