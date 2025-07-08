import mongoose, { Document, Schema, Model } from 'mongoose';

// 1. Define the interface
export interface IXeroToken {
  tenantId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// 2. Extend with Document to get Mongoose document methods
export interface XeroTokenDocument extends IXeroToken, Document {}

// 3. Define the schema
const XeroTokenSchema: Schema<XeroTokenDocument> = new mongoose.Schema(
  {
    tenantId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// 4. Export the model
export const XeroToken: Model<XeroTokenDocument> = mongoose.model<XeroTokenDocument>('XeroToken', XeroTokenSchema);
