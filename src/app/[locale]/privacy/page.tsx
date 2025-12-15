import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./PrivacyPolicyPage.module.css";

export const metadata = {
  title: "Privacy Policy | Taramar",
  description:
    "A simple privacy policy explaining how Taramar handles newsletter email signups.",
};

function Divider() {
  return <div className={styles.divider} aria-hidden="true" />;
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section} style={{ scrollMarginTop: 110 }}>
      <h2 className={`${styles.sectionTitle} font-varela`}>{title}</h2>
      <div className={`${styles.sectionBody} font-worksans`}>{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />

      <main className={styles.page}>
      <div className={styles.container}>

        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.kicker}>Legal</p>

            <h1 className={`${styles.title} font-ramillas-mediumItalic`}>
              Privacy Policy
            </h1>

            <p className={`${styles.updated} font-worksans`}>
              Last updated: <strong>2025-01-01</strong>
            </p>

            <p className={`${styles.intro} font-worksans`}>
              We keep data collection minimal. On this site, we only process
              your email address if you choose to subscribe to our newsletter.
            </p>
          </div>
        </header>

        <section className={styles.contentWrap}>
          {/* TOC */}
          <aside className={styles.tocCard} aria-label="Table of contents">
            <p className={styles.tocTitle}>On this page</p>
            <nav className={styles.toc}>
              <a href="#what-we-collect">What we collect</a>
              <a href="#why-we-collect">Why we collect it</a>
              <a href="#how-we-use">How we use your email</a>
              <a href="#sharing">Sharing & processors</a>
              <a href="#retention">Retention</a>
              <a href="#your-rights">Your rights</a>
              <a href="#security">Security</a>
              <a href="#children">Children’s privacy</a>
              <a href="#changes">Changes</a>
              <a href="#cookies">Cookies</a>
              <a href="#contact">Contact</a>
            </nav>
          </aside>

          {/* BODY */}
          <article className={styles.bodyCard}>
            <Section id="what-we-collect" title="1. What we collect">
              <p>
                When you subscribe to the Taramar newsletter, we collect:
              </p>
              <ul>
                <li>Your email address</li>
              </ul>
              <p>
                We do not ask for names, addresses, phone numbers, payment
                details, or any other personal data through the newsletter form.
              </p>
            </Section>

            <Divider />

            <Section id="why-we-collect" title="2. Why we collect it">
              <p>
                We collect your email only to send you updates you requested,
                such as product news, brand updates, and occasional editorial
                content from Taramar.
              </p>
            </Section>

            <Divider />

            <Section id="how-we-use" title="3. How we use your email">
              <ul>
                <li>To send newsletters and announcements you opted into</li>
                <li>To manage your subscription preferences</li>
                <li>To respond if you contact us about your subscription</li>
              </ul>

              <div className={styles.noteCard}>
                <p className={styles.noteTitle}>Opt-out anytime</p>
                <p className={styles.noteText}>
                  Every newsletter includes an unsubscribe link. You can opt out
                  at any time and we will stop sending emails.
                </p>
              </div>
            </Section>

            <Divider />

            <Section id="sharing" title="4. Sharing & processors">
              <p>
                We do not sell your personal data.
              </p>
              <p>
                If we use a third-party email service provider to deliver the
                newsletter, that provider may process your email on our behalf
                strictly to send emails and manage unsubscribes. They are
                considered a data processor.
              </p>
            </Section>

            <Divider />

            <Section id="retention" title="5. Retention">
              <p>
                We keep your email address for as long as you remain subscribed.
                If you unsubscribe, we remove or suppress your email so you no
                longer receive marketing messages.
              </p>
              <p>
                In some cases we may keep a minimal record (for example, a
                suppression entry) to respect your unsubscribe request.
              </p>
            </Section>

            <Divider />

            <Section id="your-rights" title="6. Your rights">
              <p>
                Depending on where you live (including the EU/EEA), you may have
                rights to:
              </p>
              <ul>
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict certain processing</li>
                <li>Withdraw consent at any time (unsubscribe)</li>
              </ul>
              <p>
                To exercise these rights, use the contact page on this website.
              </p>
            </Section>

            <Divider />

            <Section id="security" title="7. Security">
              <p>
                We take reasonable measures to protect your email address from
                unauthorized access, alteration, or misuse. No method of
                transmission or storage is 100% secure, but we aim to keep
                risk low through appropriate safeguards.
              </p>
            </Section>

            <Divider />

            <Section id="children" title="8. Children’s privacy">
              <p>
                Our newsletter is not intended for children. If you believe a
                child has subscribed using their email, please contact us and we
                will take appropriate steps.
              </p>
            </Section>

            <Divider />

            <Section id="changes" title="9. Changes to this Policy">
              <p>
                We may update this Privacy Policy from time to time. The “Last
                updated” date above shows when changes were last made.
              </p>
            </Section>

            <Divider />

<Section id="cookies" title="Cookies">
  <p>
    Taramar uses a minimal number of cookies and similar technologies that are
    strictly necessary for the website to function properly.
  </p>

  <ul>
    <li>To remember language or locale preferences</li>
    <li>To ensure basic site functionality and security</li>
  </ul>

  <p>
    We do <strong>not</strong> use cookies for advertising, tracking, profiling,
    or analytics.
  </p>

  <p>
    Because these cookies are essential, they are automatically enabled and do
    not require explicit consent under applicable privacy laws.
  </p>
</Section>


            <Divider />

            <Section id="contact" title="10. Contact">
              <p>
                If you have questions about privacy or your newsletter
                subscription, contact us via the contact page.
              </p>

              <div className={styles.contactCard}>
                <p className={styles.contactTitle}>Contact</p>
                <p className={styles.contactText}>
                  Use the contact page on this site for privacy requests and
                  newsletter support.
                </p>
              </div>
            </Section>
          </article>
        </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
