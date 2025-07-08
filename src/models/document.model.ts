import mongoose, { Document, Schema } from "mongoose";

// 1. Define the TypeScript interface
export interface IDocument extends Document {
  carrier: mongoose.Types.ObjectId;
  documentName: string;
  documentType: string;
  fileUrl: string;
  uploadedAt: Date;
  expiryDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Define the Mongoose schema
const documentSchema = new Schema<IDocument>(
  {
    carrier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrier",
      required: true,
    },
    documentName: { type: String, required: true },
    documentType: { type: String, required: true }, // e.g., "ID", "License"
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// 3. Export the model
export default mongoose.model<IDocument>("Document", documentSchema);
