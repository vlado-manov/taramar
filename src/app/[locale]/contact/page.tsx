import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactStoresSection from "./ContactsStoreSection";
import styles from "./ContactsPage.module.css";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact | Taramar",
  description: "Contact Taramar and find partner stores that sell Taramar products.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <div className={styles.container}>
          {/* HERO */}
          <header className={styles.hero}>
            <div className={styles.heroInner}>
              <p className={styles.kicker}>Support</p>

              <h1 className={`${styles.title} font-ramillas-mediumItalic`}>
                Contact
              </h1>

              <p className={`${styles.intro} font-worksans`}>
                For product questions, partnerships, press, or general support, reach
                us using the details below. Prefer in-store? Scroll down to find a
                partner location that sells Taramar.
              </p>
            </div>
          </header>

          {/* BODY */}
          <article className={styles.bodyCard}>
            <section className={styles.contactSection}>
              <h2 className={`${styles.sectionTitle} font-varela`}>
                CONTACT US
              </h2>

              <p className={`${styles.sectionLead} font-worksans`}>
                We typically respond within 1–2 business days. For the fastest help,
                include a short description of your request.
              </p>

              <div className={styles.contactGrid}>
                <div className={styles.contactItem}>
                  <div className={styles.iconWrap} aria-hidden="true">
                    <Mail size={22} />
                  </div>

                  <div className={styles.contactMeta}>
                    <p className={`${styles.contactLabel} font-varela`}>
                      Email us
                    </p>
                    <a
                      className={`${styles.contactValue} font-worksans`}
                      href="mailto:info@taramar.is"
                    >
                      info@taramar.is
                    </a>
                    <p className={`${styles.contactHint} font-worksans`}>
                      Best for support, collaborations, and press.
                    </p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.iconWrap} aria-hidden="true">
                    <Phone size={22} />
                  </div>

                  <div className={styles.contactMeta}>
                    <p className={`${styles.contactLabel} font-varela`}>
                      Call us
                    </p>
                    <a
                      className={`${styles.contactValue} font-worksans`}
                      href="tel:003545707100"
                    >
                      00-354-570-7100
                    </a>
                    <p className={`${styles.contactHint} font-worksans`}>
                      Phone support during opening hours.
                    </p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.iconWrap} aria-hidden="true">
                    <Clock size={22} />
                  </div>

                  <div className={styles.contactMeta}>
                    <p className={`${styles.contactLabel} font-varela`}>
                      Opening hours
                    </p>
                    <p className={`${styles.contactValue} font-worksans`}>
                      Mon–Fri, 9am–4pm
                    </p>
                    <p className={`${styles.contactHint} font-worksans`}>
                      Iceland time.
                    </p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.iconWrap} aria-hidden="true">
                    <MapPin size={22} />
                  </div>

                  <div className={styles.contactMeta}>
                    <p className={`${styles.contactLabel} font-varela`}>
                      Head office
                    </p>
                    <p className={`${styles.contactValue} font-worksans`}>
                      Miðnestorg 3, 245 Suðurnesjabær, Iceland
                    </p>
                    <p className={`${styles.contactHint} font-worksans`}>
                      Administration and operations.
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.noteCard}>
                <p className={styles.noteTitle}>In-store availability</p>
                <p className={styles.noteText}>
                  The stores below are partner locations that sell Taramar products.
                  Use the map to explore, or search to find the closest store.
                </p>
              </div>
            </section>

            <div className={styles.divider} aria-hidden="true" />

            {/* MAP (bottom) */}
            <section className={styles.mapSection}>
              <h2 className={`${styles.sectionTitle} font-varela`}>
                Partner stores
              </h2>

              <p className={`${styles.sectionLead} font-worksans`}>
                Find a store near you. The “Find nearest store” button lets you search
                by city, postal code, or full address.
              </p>

              <div className={styles.mapWrap}>
                <ContactStoresSection />
              </div>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
