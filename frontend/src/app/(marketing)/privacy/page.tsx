import { InfoLayout } from "@/components/layout/InfoLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Profilix collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <InfoLayout
      title="Privacy Policy"
      description="Your privacy is important to us. This policy outlines how we handle your data."
      lastUpdated="April 18, 2026"
    >
      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">1. Information We Collect</h2>
        <p>
          Profilix collects information to provide better services to all our users. The types of information we collect include:
        </p>
        <ul className="list-disc pl-6 mb-8 space-y-3">
          <li><strong>Profile Data</strong>: Information you provide for your portfolio cards, including your name, bio, social links, and professional experience.</li>
          <li><strong>GitHub Data</strong>: If you choose to sync with GitHub, we collect public statistics about your repositories and contributions.</li>
          <li><strong>Usage Data</strong>: Information about how you interact with our platform to help us improve user experience.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">2. How We Use Information</h2>
        <p>
          We use the information we collect to maintain and improve our services, develop new features, and protect Profilix and our users. Specifically, we use your data to:
        </p>
        <ul className="list-disc pl-6 mb-8 space-y-3">
          <li>Generate your dynamic portfolio cards and resumes.</li>
          <li>Provide analytics on your profile views and engagement.</li>
          <li>Personalize your experience through AI-driven resume tailoring (if opted-in).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">3. Data Sharing</h2>
        <p>
          We do not share your private personal information with companies, organizations, or individuals outside of Profilix except in the following cases:
        </p>
        <ul className="list-disc pl-6 mb-8 space-y-3">
          <li><strong>With your consent</strong>: We will share personal information when we have your explicit consent to do so.</li>
          <li><strong>For legal reasons</strong>: We will share personal information if we have a good-faith belief that access, use, preservation, or disclosure of the information is reasonably necessary to meet any applicable law.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">4. Data Security</h2>
        <p>
          We work hard to protect Profilix and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use industry-standard encryption and security protocols.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information at any time through your dashboard settings. If you have any questions about your data, please contact us.
        </p>
      </section>
    </InfoLayout>
  );
}
