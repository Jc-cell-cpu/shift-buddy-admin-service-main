import { Document, Schema, model } from 'mongoose';

export interface ISlotMode extends Document {
  repeatType: string;
}

const SlotModeSchema = new Schema<ISlotMode>({
  repeatType: { type: String, required: true },
});

export default model<ISlotMode>('SlotMode', SlotModeSchema);


