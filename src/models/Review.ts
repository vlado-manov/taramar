// src/models/Review.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export interface IReview extends Document {
  name: string;
  message: string;
  messageFr: string;
  messageNl: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    name: { type: String, required: true },
    message: { type: String, required: true },
    messageFr: { type: String, required: true },
    messageNl: { type: String, required: true },
  },
  { timestamps: true }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
