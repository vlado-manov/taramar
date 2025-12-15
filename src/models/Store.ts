// src/models/Store.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export interface IStore extends Document {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  lat: number;
  lng: number;
  visible: boolean;
}

const StoreSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Store: Model<IStore> =
  mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);

export default Store;
