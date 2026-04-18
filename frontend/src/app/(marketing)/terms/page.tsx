import { InfoLayout } from "@/components/layout/InfoLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read our terms and conditions for using the Profilix platform.",
};

export default function TermsPage() {
  return (
    <InfoLayout
      title="Terms of Service"
      description="By using Profilix, you agree to these terms. Please read them carefully."
      lastUpdated="April 18, 2026"
    >
      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Profilix platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or software) on Profilix for personal, non-commercial transitory viewing only.
        </p>
        <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Profilix at any time.</p>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">3. User Conduct</h2>
        <p>
          You are responsible for your own content and communications and for any consequences thereof. You agree to use Profilix only for purposes that are legal, proper and in accordance with the Terms and any applicable policies or guidelines.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">4. Intellectual Property</h2>
        <p>
          The service and its original content, features, and functionality are and will remain the exclusive property of Profilix and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Profilix.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">5. Limitation of Liability</h2>
        <p>
          In no event shall Profilix, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">6. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Profilix operates, without regard to its conflict of law provisions.
        </p>
      </section>
    </InfoLayout>
  );
}
