import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background pt-16 pb-8 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Logo size={120} className="h-12 w-12" />
              <span className="font-heading text-2xl font-bold tracking-tight text-text-primary">
                Profilix
              </span>
            </Link>
            <p className="text-sm text-text-secondary pr-4 leading-relaxed">
              The modern identity platform for developers. Create a dynamic portfolio card, export ATS resumes, and share via QR instantly.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/profilix" className="text-text-secondary hover:text-primary transition-colors">
                <FaGithub className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Features / Marketing */}
          <div>
            <h3 className="font-heading font-semibold text-text-primary mb-4">Features</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link href="/github-portfolio-card" className="hover:text-primary transition-colors">GitHub Sync & Stats</Link></li>
              <li><Link href="/qr-portfolio" className="hover:text-primary transition-colors">QR Portfolio Sharing</Link></li>
              <li><Link href="/student-portfolio-creator" className="hover:text-primary transition-colors">For IT Students</Link></li>
              <li><Link href="/auth" className="hover:text-primary transition-colors">ATS Resume Generator</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading font-semibold text-text-primary mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Developer Blog</Link></li>
              <li><Link href="/blog/how-to-share-portfolio-qr" className="hover:text-primary transition-colors">QR Sharing Guide</Link></li>
              <li><Link href="/blog/best-portfolio-formats" className="hover:text-primary transition-colors">Best Portfolio Formats</Link></li>
              <li><Link href="/auth" className="hover:text-primary transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-semibold text-text-primary mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary text-center md:text-left">
            © {year} Profilix. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-text-secondary">
            Built with <Heart className="h-4 w-4 mx-1 text-danger inline-block" /> for developers
          </div>
        </div>
      </div>
    </footer>
  );
}
