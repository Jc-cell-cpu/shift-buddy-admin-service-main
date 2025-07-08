import { Document, Schema, model } from 'mongoose';

export interface Iweekday extends Document {
  day: string;
  dayNumber: string;
}

const weekdaySchema = new Schema<Iweekday>({
  day: { type: String, required: true },
  dayNumber: { type: String, required: true },
});

export default model<Iweekday>('Weekday', weekdaySchema);


