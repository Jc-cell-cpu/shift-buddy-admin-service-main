import { Schema, model, Document, Types } from 'mongoose';
import { IRole } from './role.model';

// Token Subdocument Interface
export interface IToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  isActive: boolean;
}

// Token Schema
const tokenSchema = new Schema<IToken>({
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
  isActive: { type: Boolean, default: true }
}, { _id: false });

// Main User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  // role: Types.ObjectId;
  role: IRole | string; // Can be populated or just ObjectId
  status: boolean;
  webTokens?: IToken[];
  appTokens?: IToken[];
}

// User Schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
      message: (props: any) => `${props.value} is not a valid email address!`
    }
  },
  password: { type: String, required: true },

  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  },

  webTokens: [tokenSchema],
  appTokens: [tokenSchema]
}, { timestamps: true });

export default model<IUser>('User', userSchema);
