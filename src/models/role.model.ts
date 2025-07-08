import { Schema, model, Document } from 'mongoose';

export interface IRole extends Document {
  roleName: string;
  roleCode: string;
}

const roleSchema = new Schema<IRole>({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },
  roleCode: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true });

export default model<IRole>('Role', roleSchema);
