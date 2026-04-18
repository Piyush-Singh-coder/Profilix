import { InfoLayout } from "@/components/layout/InfoLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Understand how we use cookies and tracking technologies to improve your experience.",
};

export default function CookiesPage() {
  return (
    <InfoLayout
      title="Cookie Policy"
      description="This policy explains how Profilix uses cookies and similar technologies."
      lastUpdated="April 18, 2026"
    >
      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">1. What Are Cookies?</h2>
        <p>
          Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the service or a third-party to recognize you and make your next visit easier and the service more useful to you.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">2. How Profilix Uses Cookies</h2>
        <p>When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:</p>
        <ul className="list-disc pl-6 mb-8 space-y-3">
          <li><strong>Essential Cookies</strong>: These are necessary for the authentication system to maintain your session and ensure security.</li>
          <li><strong>Analytics Cookies</strong>: We use these to understand how you navigate through the platform, which features are popular, and where we can improve.</li>
          <li><strong>Functional Cookies</strong>: These help us remember your preferences, such as your selected theme (Neon, Skeuomorphic, etc.) or language settings.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">3. Managing Cookies</h2>
        <p>
          If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8">4. More Information</h2>
        <p>
          You can learn more about cookies at <a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer">AllAboutCookies.org</a>. If you have any specific questions about our use of cookies, please reach out via our contact page.
        </p>
      </section>
    </InfoLayout>
  );
}
