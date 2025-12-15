// scripts/seed.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Workaround to resolve correct path when running from script folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from .env.local
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// --- Schemas ---

const productSchema = new mongoose.Schema(
  {
    pid: { type: String, required: true, unique: true, index: true },

    name: { type: String, required: true },
    nameFr: String,
    nameNl: String,

    summary: String,
    summaryFr: String,
    summaryNl: String,

    description: String,
    descriptionFr: String,
    descriptionNl: String,

    headline: String,
    headlineFr: String,
    headlineNl: String,

    bulletPoints: { type: [String], default: [] },
    images: { type: [String], default: [] },

    price: Number,
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const storeSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    postalCode: String,
    city: String,
    lat: Number,
    lng: Number,
    visible: Boolean,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
const Store = mongoose.model("Store", storeSchema);

// --- Seed Data ---
// IMPORTANT: Replace the image filenames with the actual filenames you have in:
// public/images/products

const products = [
  {
    pid: "the-serum",
    name: "The Serum",
    headline: "Silky hydration",
    summary: "Silky hydration with fermented sea kelp and Arctic thyme.",
    description:
      "A lightweight serum designed to support daily hydration and comfort. Use morning and evening on clean skin.",
    bulletPoints: ["Silky hydration", "Fermented sea kelp", "Arctic thyme"],
    images: [
      "/images/products/serum.png",
    ],
    price: null,
    visible: true,
  },
  {
    pid: "day-treatment",
    name: "Day Treatment",
    headline: "Daily nourishment",
    summary: "Daily nourishment that leaves the skin balanced and smooth.",
    description:
      "A daytime treatment to help your skin feel calm, supported, and ready for the day.",
    bulletPoints: ["Balances the skin", "Smooth finish", "Daily comfort"],
    images: [
      "/images/products/day.png",
    ],
    price: null,
    visible: true,
  },
  {
    pid: "night-treatment",
    name: "Night Treatment",
    headline: "Rich and nurturing",
    summary: "Rich and nurturing. Designed for comfort while you rest.",
    description:
      "A richer treatment intended for nighttime use to support a nourished, comfortable feel by morning.",
    bulletPoints: ["Rich texture", "Night support", "Comfort while you rest"],
    images: [
      "/images/products/night.png"
    ],
    price: null,
    visible: true,
  },
  {
    pid: "eye-treatment",
    name: "Eye Treatment",
    headline: "Cooling and gentle",
    summary: "Cooling, gentle, and fragrance-free. Perfect for delicate skin.",
    description:
      "A gentle, fragrance-free eye treatment made for the delicate eye area.",
    bulletPoints: ["Cooling feel", "Fragrance-free", "For delicate skin"],
    images: [
      "/images/products/eye.png",
    ],
    price: null,
    visible: true,
  },
  {
    pid: "purifying-treatment",
    name: "Purifying Treatment",
    headline: "Clarifies and refreshes",
    summary: "Clarifies and refreshes without stripping natural oils.",
    description:
      "A purifying treatment that helps the skin feel refreshed while maintaining comfort.",
    bulletPoints: ["Clarifies", "Refreshes", "Non-stripping feel"],
    images: [
      "/images/products/purify.png",
    ],
    price: null,
    visible: true,
  },
  {
    pid: "arctic-flower-treatment",
    name: "Arctic Flower Treatment",
    headline: "Softens and illuminates",
    summary: "Softens and illuminates with wildflower extracts.",
    description:
      "A treatment focused on softness and glow, powered by botanical extracts.",
    bulletPoints: ["Softens", "Illuminates", "Wildflower extracts"],
    images: [
      "/images/products/arcticflower.png",
    ],
    price: null,
    visible: true,
  },
  {
    pid: "rejuvenating-oil",
    name: "Rejuvenating Oil",
    headline: "Pure botanical oils",
    summary: "Pure botanical oils for supple, glowing skin.",
    description:
      "A face oil blend intended to support a supple feel and a healthy-looking glow.",
    bulletPoints: ["Botanical oil blend", "Supple feel", "Glow finish"],
    images: [
      "/images/products/rejuvenating.png",
    ],
    price: null,
    visible: true,
  },
];

const stores = [
  {
    name: "Taramar Store Brussels",
    address: "Rue de la Loi 16",
    postalCode: "1000",
    city: "Brussels",
    lat: 50.8466,
    lng: 4.3528,
    visible: true,
  },
  {
    name: "Taramar Store Antwerp",
    address: "Meir 50",
    postalCode: "2000",
    city: "Antwerp",
    lat: 51.2194,
    lng: 4.4025,
    visible: true,
  },
  {
    name: "Taramar Store Ghent",
    address: "Korenmarkt 10",
    postalCode: "9000",
    city: "Ghent",
    lat: 51.0543,
    lng: 3.7174,
    visible: true,
  },
  {
    name: "Taramar Store Bruges",
    address: "Markt 1",
    postalCode: "8000",
    city: "Bruges",
    lat: 51.2093,
    lng: 3.2247,
    visible: true,
  },
  {
    name: "Taramar Store Leuven",
    address: "Bondgenotenlaan 30",
    postalCode: "3000",
    city: "Leuven",
    lat: 50.8796,
    lng: 4.7009,
    visible: true,
  },
  {
    name: "Taramar Store Liège",
    address: "Place Saint-Lambert 12",
    postalCode: "4000",
    city: "Liège",
    lat: 50.6451,
    lng: 5.5734,
    visible: true,
  },
  {
    name: "Taramar Store Namur",
    address: "Rue de Fer 60",
    postalCode: "5000",
    city: "Namur",
    lat: 50.4674,
    lng: 4.8717,
    visible: true,
  },
  {
    name: "Taramar Store Hasselt",
    address: "Koning Albertstraat 20",
    postalCode: "3500",
    city: "Hasselt",
    lat: 50.9307,
    lng: 5.3326,
    visible: true,
  },
];

async function seed() {
  try {
    console.log("🌱 Connecting…");
    await mongoose.connect(MONGODB_URI);

    console.log("🧹 Clearing old data…");
    await Product.deleteMany({});
    await Store.deleteMany({});

    console.log("📦 Inserting products…");
    await Product.insertMany(products);

    console.log("📍 Inserting stores…");
    await Store.insertMany(stores);

    console.log("🎉 Done! Database seeded successfully.");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
