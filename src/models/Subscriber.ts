import mongoose, { Schema, Model, Document } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  locale: string;
  subscribedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    locale: { type: String, default: "en" },
    subscribedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false }
);

export const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);

export default Subscriber;
