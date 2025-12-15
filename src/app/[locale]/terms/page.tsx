import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions | Taramar",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <main
        style={{
          maxWidth: 1272,
          margin: "0 auto",
          padding: "80px 24px 100px",
        }}
      >
        <h1
          style={{
            fontSize: 44,
            margin: 0,
            marginBottom: 18,
            color: "#0b0b0b",
          }}
          className="font-ramillas-mediumItalic"
        >
          Terms & Conditions
        </h1>

        <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(0,0,0,0.75)", marginBottom: 32 }} className="font-worksans">
          Last updated: 2025-01-01
        </p>

        <section style={{ display: "grid", gap: 18, color: "#0b0b0b" }} className="font-worksans">
          <h2 style={{ fontSize: 18, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            1. Overview
          </h2>
          <p style={{ margin: 0, lineHeight: 1.7, color: "rgba(0,0,0,0.82)" }}>
            These Terms & Conditions govern your use of the Taramar website and services. By accessing or using our site, you agree to these terms.
          </p>

          <h2 style={{ fontSize: 18, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            2. Products and Orders
          </h2>
          <p style={{ margin: 0, lineHeight: 1.7, color: "rgba(0,0,0,0.82)" }}>
            Product descriptions and pricing may be updated at any time. Orders are subject to availability and confirmation.
          </p>

          <h2 style={{ fontSize: 18, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            3. Returns and Refunds
          </h2>
          <p style={{ margin: 0, lineHeight: 1.7, color: "rgba(0,0,0,0.82)" }}>
            If you are not satisfied with your purchase, you may be eligible for a return or refund according to our return policy.
          </p>

          <h2 style={{ fontSize: 18, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            4. Limitation of Liability
          </h2>
          <p style={{ margin: 0, lineHeight: 1.7, color: "rgba(0,0,0,0.82)" }}>
            To the maximum extent permitted by law, Taramar is not liable for indirect or consequential damages arising from your use of the site or products.
          </p>

          <h2 style={{ fontSize: 18, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            5. Contact
          </h2>
          <p style={{ margin: 0, lineHeight: 1.7, color: "rgba(0,0,0,0.82)" }}>
            For any questions about these Terms & Conditions, please contact us via the contact page.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
