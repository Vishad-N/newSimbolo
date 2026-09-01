import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata = {
  title: "Privacy Policy | The Simbolo",
  description: "How The Simbolo collects, uses, and protects your personal data.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | The Simbolo",
    description: "How The Simbolo collects, uses, and protects your personal data.",
    url: "/privacy-policy",
    siteName: "The Simbolo",
    images: [{ url: "/api/og?title=Privacy%20Policy&subtitle=The%20Simbolo", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="August 31, 2026">
      <LegalSection title="1. Introduction">
        <p>
          The Simbolo ("we", "us", "our") is a digital marketing agency operated by The Simbolo
          Multimedia, based in Indore, Madhya Pradesh, India. This Privacy Policy explains what
          personal data we collect through our website and client dashboard, why we collect it,
          how we use it, and the choices you have.
        </p>
        <p>
          By using our website or services, you agree to the collection and use of information in
          accordance with this policy.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>We collect information in the following ways:</p>
        <ul>
          <li>
            <strong>Information you provide directly</strong> — name, email address, phone number,
            company name, billing address, GST number, and project details when you register an
            account, request a consultation, or purchase a service or package.
          </li>
          <li>
            <strong>Payment information</strong> — payments are processed by Razorpay; we do not
            store your card, UPI, or bank account details on our own servers.
          </li>
          <li>
            <strong>Account and usage data</strong> — login activity, uploaded documents, project
            communications, and support requests submitted through your client dashboard.
          </li>
          <li>
            <strong>Technical data</strong> — IP address, browser type, device information, and
            pages visited, collected automatically when you use our website.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <ul>
          <li>To create and manage your account and deliver the services you've purchased.</li>
          <li>To process payments, generate GST-compliant tax invoices, and maintain billing records.</li>
          <li>To communicate with you about your projects, orders, and support requests.</li>
          <li>To send updates, offers, or marketing communications, which you can opt out of at any time.</li>
          <li>To improve our website, services, and customer experience.</li>
          <li>To comply with applicable legal and tax obligations under Indian law.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Sharing Your Information">
        <p>
          We do not sell your personal data. We share information only with the following categories
          of third parties, and only as needed to operate our services:
        </p>
        <ul>
          <li><strong>Payment processing</strong> — Razorpay, to process transactions securely.</li>
          <li><strong>Cloud infrastructure</strong> — hosting, database, and file storage providers used to run our platform.</li>
          <li><strong>Communication tools</strong> — email and WhatsApp, to send transactional and support messages.</li>
          <li><strong>Legal compliance</strong> — government or regulatory authorities, where required by law.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Data Retention">
        <p>
          We retain your personal data for as long as your account is active or as needed to provide
          you services. Billing and tax invoice records are retained for the period required under
          Indian GST and income tax regulations. You may request deletion of your account data at any
          time, subject to our legal retention obligations.
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies">
        <p>
          We use cookies and similar technologies to keep you signed in, remember your preferences
          (such as light/dark theme), and understand how visitors use our website. You can control
          cookies through your browser settings; disabling them may affect some site functionality.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Rights">
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate or incomplete data.</li>
          <li>Request deletion of your data, subject to legal retention requirements.</li>
          <li>Opt out of marketing communications at any time.</li>
        </ul>
        <p>To exercise any of these rights, contact us using the details below.</p>
      </LegalSection>

      <LegalSection title="8. Data Security">
        <p>
          We use industry-standard technical and organizational measures — including encrypted
          connections, access controls, and secure payment processing — to protect your data.
          However, no method of transmission or storage is 100% secure, and we cannot guarantee
          absolute security.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be reflected by
          updating the "Last updated" date at the top of this page. Continued use of our services
          after changes take effect constitutes acceptance of the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact Us">
        <p>If you have questions about this Privacy Policy or how we handle your data, contact us at:</p>
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
