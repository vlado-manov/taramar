import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Reviews schema only (matches your Review model)
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    message: { type: String, required: true },
    messageFr: { type: String, required: true },
    messageNl: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

// Seed data (same 7 reviews + translations)
const reviews = [
  {
    name: "Dagny B.",
    message: "“Absolutely love TARAMAR. The products are perfect for my dry skin.”",
    messageFr: "« J’adore TARAMAR. Les produits sont parfaits pour ma peau sèche. »",
    messageNl: "“Ik ben helemaal weg van TARAMAR. De producten zijn perfect voor mijn droge huid.”",
  },
  {
    name: "Sigrun H.",
    message:
      "“I have sensitive skin and these products cause zero irritation. I recommend TARAMAR 100%.”",
    messageFr:
      "« J’ai la peau sensible et ces produits ne provoquent aucune irritation. Je recommande TARAMAR à 100 %. »",
    messageNl:
      "“Ik heb een gevoelige huid en deze producten veroorzaken geen enkele irritatie. Ik raad TARAMAR 100% aan.”",
  },
  {
    name: "Inga H.",
    message:
      "“After a few months my skin looks smoother, fuller, and healthier. I see a big difference.”",
    messageFr:
      "« Après quelques mois, ma peau paraît plus lisse, plus rebondie et plus saine. Je vois une vraie différence. »",
    messageNl:
      "“Na een paar maanden ziet mijn huid er gladder, voller en gezonder uit. Ik zie een groot verschil.”",
  },
  {
    name: "Maria E.",
    message:
      "“After six months my skin feels balanced and I barely need makeup anymore.”",
    messageFr:
      "« Après six mois, ma peau est plus équilibrée et je n’ai presque plus besoin de maquillage. »",
    messageNl:
      "“Na zes maanden voelt mijn huid in balans en heb ik nauwelijks nog make-up nodig.”",
  },
  {
    name: "Susan E.",
    message:
      "“Dry winter patches disappeared completely after using TARAMAR creams.”",
    messageFr:
      "« Mes plaques de sécheresse hivernale ont complètement disparu après avoir utilisé les crèmes TARAMAR. »",
    messageNl:
      "“Droge winterplekjes verdwenen volledig nadat ik de TARAMAR-crèmes gebruikte.”",
  },
  {
    name: "Skincare Awards",
    message:
      "“Light yet nourishing. Absorbs beautifully and leaves skin glowing overnight.”",
    messageFr:
      "« Léger mais nourrissant. Il pénètre magnifiquement et laisse la peau éclatante au réveil. »",
    messageNl:
      "“Licht maar voedend. Trekt prachtig in en laat de huid ’s nachts stralen.”",
  },
  {
    name: "Klara S.",
    message:
      "“The sun oil transformed my dry, itchy skin and even helped my face tan naturally.”",
    messageFr:
      "« L’huile solaire a transformé ma peau sèche et irritée, et a même aidé mon visage à bronzer naturellement. »",
    messageNl:
      "“De zonolie veranderde mijn droge, jeukende huid en hielp mijn gezicht zelfs natuurlijk te bruinen.”",
  },
];

async function seedReviews() {
  try {
    console.log("🌱 Connecting…");
    await mongoose.connect(MONGODB_URI);

    // Important: do NOT delete Products/Stores.
    // We only upsert reviews by (name + message) to avoid duplicates on reruns.
    console.log("💬 Seeding reviews (upsert)…");

    for (const r of reviews) {
      await Review.updateOne(
        { name: r.name, message: r.message },
        { $set: r },
        { upsert: true }
      );
    }

    console.log("🎉 Done! Reviews seeded (no Products/Stores touched).");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedReviews();
