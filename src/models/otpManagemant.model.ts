import { Document, model, Schema, Types } from 'mongoose';

export interface IOtp extends Document {
  otp: string;
  carrierID: Types.ObjectId;
  status: boolean;
}

const OtpSchema = new Schema<IOtp>({
  otp: { type: String, required: true },
  carrierID:  {type: Schema.Types.ObjectId,
    ref: 'Carrier',
    required: true},
  status: { type: Boolean, required: true, default:true },
});

export const OtpModel = model<IOtp>('otpManagement', OtpSchema);
