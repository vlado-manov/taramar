import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./TermsPage.module.css";

export const metadata = {
  title: "Terms & Conditions | Taramar",
  description:
    "Simple, transparent terms for using the Taramar website and content.",
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

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.kicker}>Legal</p>

            <h1 className={`${styles.title} font-ramillas-mediumItalic`}>
              Terms and Conditions
            </h1>

            <p className={`${styles.updated} font-worksans`}>
              Last updated: <strong>2025-12-15</strong>
            </p>

            <p className={`${styles.intro} font-worksans`}>
              These Terms apply to your use of the Taramar website, its pages,
              and any content we publish here. This version is intentionally
              simplified for this site.
            </p>
          </div>
        </header>

        <section className={styles.contentWrap}>
          {/* TOC */}
          <aside className={styles.tocCard} aria-label="Table of contents">
            <p className={styles.tocTitle}>On this page</p>
            <nav className={styles.toc}>
              <a href="#overview">Overview</a>
              <a href="#using-the-site">Using the site</a>
              <a href="#content-ip">Content &amp; intellectual property</a>
              <a href="#accuracy">Information accuracy</a>
              <a href="#health">Skincare and health disclaimer</a>
              <a href="#links">Third-party links</a>
              <a href="#privacy">Privacy</a>
              <a href="#liability">Liability</a>
              <a href="#changes">Changes</a>
              <a href="#contact">Contact</a>
            </nav>
          </aside>

          {/* BODY */}
          <article className={styles.bodyCard}>
            <Section id="overview" title="1. Overview">
              <p>
                By accessing or using this website, you agree to these Terms. If
                you do not agree, please do not use the site.
              </p>
              <p>
                “Taramar”, “we”, “our”, and “us” refer to the brand operating
                this website. “You” refers to any visitor or user.
              </p>
            </Section>

            <Divider />

            <Section id="using-the-site" title="2. Using the site">
              <ul>
                <li>
                  Use the site for lawful purposes only and in a way that does
                  not infringe the rights of others.
                </li>
                <li>
                  Do not attempt to disrupt the site, probe security, or access
                  areas that are not intended for public use.
                </li>
                <li>
                  If we provide forms or interactive features, you agree to
                  submit accurate information.
                </li>
              </ul>
            </Section>

            <Divider />

            <Section id="content-ip" title="3. Content &amp; intellectual property">
              <p>
                Unless stated otherwise, all text, visuals, branding, and layouts
                on this site are owned by Taramar or used with permission, and
                are protected by applicable intellectual property laws.
              </p>
              <ul>
                <li>You may view and share links to our pages.</li>
                <li>
                  You may not copy, republish, or commercially use our content
                  without written permission.
                </li>
              </ul>
            </Section>

            <Divider />

            <Section id="accuracy" title="4. Information accuracy">
              <p>
                We work hard to keep this website up to date, but we cannot
                guarantee that all information is always complete, current, or
                error-free. Content may be updated or changed at any time.
              </p>
              <p>
                If you notice something incorrect, please contact us so we can
                review it.
              </p>
            </Section>

            <Divider />

            <Section id="health" title="5. Skincare and health disclaimer">
              <p>
                Content on this website is provided for general information
                purposes and does not constitute medical advice. Skincare
                outcomes can vary between individuals.
              </p>
              <ul>
                <li>Always read product labels and usage instructions carefully.</li>
                <li>
                  If you have allergies, sensitive skin, or a medical condition,
                  consult a qualified professional before use.
                </li>
                <li>If irritation occurs, discontinue use and seek guidance.</li>
              </ul>
            </Section>

            <Divider />

            <Section id="links" title="6. Third-party links">
              <p>
                This site may include links to third-party websites. We do not
                control those sites and are not responsible for their content,
                policies, or practices. Visiting third-party links is at your
                own discretion.
              </p>
            </Section>

            <Divider />

            <Section id="privacy" title="7. Privacy">
              <p>
                Any personal data you submit via this website is handled in line
                with our Privacy Policy. For details on cookies, processing, and
                your rights, please refer to that page.
              </p>
            </Section>

            <Divider />

            <Section id="liability" title="8. Liability">
              <p>
                To the maximum extent permitted by law, Taramar is not liable
                for indirect, incidental, or consequential damages arising from
                your use of the site.
              </p>
              <p>We do not guarantee uninterrupted or error-free access.</p>
            </Section>

            <Divider />

            <Section id="changes" title="9. Changes to these Terms">
              <p>
                We may update these Terms from time to time. The “Last updated”
                date above shows when changes were last made. Continued use of
                the site after updates means you accept the revised Terms.
              </p>
            </Section>

            <Divider />

            <Section id="contact" title="10. Contact">
              <p>
                Questions about these Terms? Reach out via the contact page and
                we will help.
              </p>

              <div className={styles.contactCard}>
                <p className={styles.contactTitle}>Contact</p>
                <p className={styles.contactText}>
                  Use the contact page on this site for legal and general
                  inquiries.
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
