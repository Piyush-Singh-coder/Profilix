import { InfoLayout } from "@/components/layout/InfoLayout";
import { Metadata } from "next";
import { Mail, Bug, MessageSquare, LifeBuoy } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Support",
  description: "Get in touch with the Profilix team for bug reports, support, or general inquiries.",
};

export default function ContactPage() {
  return (
    <InfoLayout
      title="Contact Support"
      description="We're here to help you build the best professional identity. Reach out to us for any assistance."
      className="pb-32"
    >
      {/* Bug Report Section */}
      <section className="mb-16">
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
            <Bug className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-text-primary mb-4">Report Bugs & Issues</h2>
          <p className="text-lg text-text-secondary max-w-xl mx-auto mb-8">
            Found a bug or something not working quite right? We appreciate your help in making Profilix better for everyone.
          </p>
          <a 
            href="mailto:pmiaynushi@gmail.com?subject=Bug Report: [Short Description]"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Bug className="h-5 w-5" />
            Report a Bug
          </a>
        </div>
      </section>

      {/* Main Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="surface-panel p-8 rounded-2xl">
          <div className="h-12 w-12 rounded-xl bg-surface-high flex items-center justify-center text-primary mb-6">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-heading font-bold text-text-primary mb-3">General Inquiries</h3>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Have a question about our features or need help with your account? Send us an email and we'll get back to you within 24 hours.
          </p>
          <a 
            href="mailto:pmiaynushi@gmail.com" 
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            pmiaynushi@gmail.com
          </a>
        </div>

        <div className="surface-panel p-8 rounded-2xl">
          <div className="h-12 w-12 rounded-xl bg-surface-high flex items-center justify-center text-primary mb-6">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-heading font-bold text-text-primary mb-3">Feedback & Ideas</h3>
          <p className="text-text-secondary mb-6 leading-relaxed">
            We love hearing from our community! If you have ideas for new features or layouts, we'd love to hear them.
          </p>
          <a 
            href="mailto:pmiaynushi@gmail.com?subject=Feature Request / Feedback" 
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            Share your feedback
          </a>
        </div>
      </div>

      {/* Trust Section */}
      <section className="border-t border-border/50 pt-16 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-high text-text-secondary mb-6">
          <LifeBuoy className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">Dedicated to Developers</h2>
        <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Profilix was built by developers, for developers. We take your security, privacy, and user experience seriously. If you have any concerns, don't hesitate to reach out.
        </p>
      </section>
    </InfoLayout>
  );
}
