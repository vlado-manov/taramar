import Navbar from "@/components/Navbar";
import MapSection from "@/components/MapSection";
import ProductsSection from "@/components/ProductsSection";
import type { Metadata } from "next";
import { type Locale, landingPageTitles } from "@/../i18n";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import DagnyRitualSection from "@/components/DagnyRitualSection";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import QuoteSection from "@/components/QuoteSection";
import FoundersSection from "@/components/FoundersSection";
import RitualSection from "@/components/RitualSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import ReviewsSection from "@/components/ReviewSection";

type PageParams = {
  params: { locale: Locale } | Promise<{ locale: Locale }>;
};

export async function generateMetadata(
  props: PageParams
): Promise<Metadata> {
  const resolved = await props.params;
  const { locale } = resolved;

  return {
    title: landingPageTitles[locale],
  };
}

export default function LandingPage() {
  return (
    <div style={{ background: '#fff'}}>
      <Navbar />

      <FadeInOnScroll>
        <HeroSection />
      </FadeInOnScroll>

      <FadeInOnScroll delayMs={15}>
        <AboutSection />
      </FadeInOnScroll>
      <FadeInOnScroll delayMs={15}>
        <QuoteSection />
      </FadeInOnScroll>
      <FadeInOnScroll delayMs={15}>
        <FoundersSection />
      </FadeInOnScroll>
      <FadeInOnScroll delayMs={15}>
        <ProductsSection />
      </FadeInOnScroll>
      <FadeInOnScroll delayMs={15}>
        <RitualSection />
      </FadeInOnScroll>

      <FadeInOnScroll delayMs={15}>
        <DagnyRitualSection />
      </FadeInOnScroll>
      <FadeInOnScroll delayMs={15}>
        <ReviewsSection />
      </FadeInOnScroll>
        <div  id="stores">
        <MapSection />
        </div>
        <NewsletterSection />
      <Footer />


    </div>
  );
}
