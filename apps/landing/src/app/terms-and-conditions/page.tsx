import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata = {
  title: "Terms & Conditions | The Simbolo",
  description: "The terms and conditions governing the use of The Simbolo's website and services.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | The Simbolo",
    description: "The terms and conditions governing the use of The Simbolo's website and services.",
    url: "/terms-and-conditions",
    siteName: "The Simbolo",
    images: [{ url: "/api/og?title=Terms%20%26%20Conditions&subtitle=The%20Simbolo", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="August 31, 2026">
      <LegalSection title="1. Agreement to Terms">
        <p>
          These Terms & Conditions ("Terms") govern your access to and use of the website, client
          dashboard, and digital marketing services offered by The Simbolo Multimedia ("The Simbolo",
          "we", "us", "our"), based in Indore, Madhya Pradesh, India. By registering an account,
          purchasing a package, or otherwise using our services, you agree to be bound by these Terms.
        </p>
      </LegalSection>

      <LegalSection title="2. Our Services">
        <p>
          The Simbolo provides digital marketing and related services, including but not limited to
          SEO, Google Ads, Meta Ads, website design and development, e-commerce setup, graphic design,
          and video editing, delivered under the specific package or custom scope agreed with you at
          the time of purchase.
        </p>
      </LegalSection>

      <LegalSection title="3. Accounts">
        <p>
          You must provide accurate and complete information when creating an account. You are
          responsible for maintaining the confidentiality of your login credentials and for all
          activity that occurs under your account. Notify us immediately of any unauthorized use of
          your account.
        </p>
      </LegalSection>

      <LegalSection title="4. Orders, Pricing & Payment">
        <ul>
          <li>All prices displayed are in Indian Rupees (INR) and are exclusive of applicable GST unless stated otherwise.</li>
          <li>Payments are processed securely through Razorpay; by making a payment you also agree to Razorpay's applicable terms.</li>
          <li>A GST-compliant tax invoice will be generated for every completed order.</li>
          <li>Subscription-based packages renew automatically at the applicable billing cycle unless cancelled beforehand from your dashboard.</li>
          <li>We reserve the right to change package pricing at any time; changes will not affect an already-confirmed order.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Refunds & Cancellations">
        <p>
          Given the custom, service-based nature of our work, fees for work already performed or in
          progress are generally non-refundable. Refund requests are reviewed on a case-by-case basis
          — contact our support team with your order details if you believe a refund is warranted.
          Subscription packages can be cancelled at any time to stop future billing; cancellation does
          not entitle you to a refund for the current billing period already paid.
        </p>
      </LegalSection>

      <LegalSection title="6. Client Responsibilities">
        <p>
          To deliver services on schedule, we rely on you to provide timely feedback, necessary
          access (e.g. to ad accounts, website hosting, or brand assets), and accurate information
          about your business. Delays caused by missing inputs from your side may extend delivery
          timelines accordingly.
        </p>
      </LegalSection>

      <LegalSection title="7. Intellectual Property">
        <p>
          Upon full payment, final deliverables created specifically for you (e.g. a completed website,
          designed creatives) are transferred to you for your business use. The Simbolo retains
          ownership of its own pre-existing tools, frameworks, templates, and internal processes used
          to produce that work, and may showcase completed work in its portfolio unless you request
          otherwise in writing.
        </p>
      </LegalSection>

      <LegalSection title="8. Acceptable Use">
        <p>You agree not to use our website or services to:</p>
        <ul>
          <li>Violate any applicable law or regulation.</li>
          <li>Infringe on the intellectual property or privacy rights of others.</li>
          <li>Upload malicious code or attempt to disrupt or gain unauthorized access to our systems.</li>
          <li>Use our services for any fraudulent, deceptive, or unlawful marketing activity.</li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Limitation of Liability">
        <p>
          Our services are provided on an "as is" basis. While we work diligently to deliver quality
          results, we do not guarantee specific marketing outcomes (such as traffic, rankings, leads,
          or sales), as these depend on factors outside our control. To the maximum extent permitted
          by law, The Simbolo's total liability for any claim arising from our services is limited to
          the amount you paid for the specific service giving rise to the claim.
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>
          We may suspend or terminate your access to our services if you breach these Terms, engage in
          fraudulent activity, or fail to make payment. You may stop using our services at any time by
          cancelling your subscriptions and requesting account closure.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing Law">
        <p>
          These Terms are governed by the laws of India. Any disputes arising from these Terms or your
          use of our services shall be subject to the exclusive jurisdiction of the courts of Indore,
          Madhya Pradesh.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to These Terms">
        <p>
          We may revise these Terms from time to time. Material changes will be reflected by updating
          the "Last updated" date above. Continued use of our services after changes take effect
          constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact Us">
        <p>Questions about these Terms can be directed to:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:hello@thesimbolo.com">hello@thesimbolo.com</a></li>
          <li><strong>Phone:</strong> <a href="tel:+918982911880">+91 89829 11880</a></li>
          <li>
            <strong>Address:</strong> 1st Floor, The Simbolo Multimedia, Plot No. ED/149, Ring Rd,
            near Khajrana Square, IDA Scheme 94 Sector ED, Indore, Madhya Pradesh 452016
          </li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}
