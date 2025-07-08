import { Document, Schema, model } from 'mongoose';

export interface Indis extends Document {
  ndisType: string;
}

const IndisSchema = new Schema<Indis>({
  ndisType: { type: String, required: true },
});

export default model<Indis>('Ndis', IndisSchema);


