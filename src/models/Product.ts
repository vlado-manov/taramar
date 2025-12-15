// src/models/Product.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export interface IProduct extends Document {
  // Stable app id (separate from Mongo _id)
  pid: string;

  // Names
  name: string;
  nameFr?: string;
  nameNl?: string;

  // Card text
  summary?: string;
  summaryFr?: string;
  summaryNl?: string;

  // Long text
  description?: string;
  descriptionFr?: string;
  descriptionNl?: string;

  // Optional punchline
  headline?: string;
  headlineFr?: string;
  headlineNl?: string;

  // Lists
  bulletPoints?: string[];
  images: string[];

  // Commerce
  price?: number;

  // Visibility toggle
  visible: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    pid: { type: String, required: true, unique: true, index: true },

    name: { type: String, required: true },
    nameFr: { type: String },
    nameNl: { type: String },

    summary: { type: String },
    summaryFr: { type: String },
    summaryNl: { type: String },

    description: { type: String },
    descriptionFr: { type: String },
    descriptionNl: { type: String },

    headline: { type: String },
    headlineFr: { type: String },
    headlineNl: { type: String },

    bulletPoints: { type: [String], default: [] },
    images: { type: [String], default: [] },

    price: { type: Number },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
