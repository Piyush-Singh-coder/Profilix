import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background pt-24 pb-8 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Logo size={120} className="h-8 w-8" />
              <span className="font-heading text-xl font-bold tracking-tight text-text-primary">
                Profilix
              </span>
            </Link>
            <p className="text-sm font-bold text-text-primary">Your profile. Your edge.</p>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              We help professionals create ATS-friendly resumes and stunning profile cards that open doors.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-6">Product</h3>
            <ul className="space-y-4 text-sm text-text-primary font-medium">
              <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/templates" className="hover:text-primary transition-colors">Templates</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/updates" className="hover:text-primary transition-colors">Updates</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-6">Resources</h3>
            <ul className="space-y-4 text-sm text-text-primary font-medium">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/guides" className="hover:text-primary transition-colors">Guides</Link></li>
              <li><Link href="/tips" className="hover:text-primary transition-colors">Career Tips</Link></li>
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-6">Company</h3>
            <ul className="space-y-4 text-sm text-text-primary font-medium">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Stay Updated */}
          <div className="lg:col-span-1 min-w-[240px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-6">Stay updated</h3>
            <p className="text-sm text-text-secondary mb-4">
              Subscribe to get the latest tips and product updates.
            </p>
            <div className="flex items-center gap-2 mb-6">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-surface-low border border-border text-sm rounded-lg px-4 py-2 w-full focus:outline-none focus:border-primary text-text-primary"
              />
              <button className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" className="text-text-secondary hover:text-primary transition-colors">
                <FaTwitter className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/in/piyush-singh-0927a2330/" className="text-text-secondary hover:text-primary transition-colors">
                <FaLinkedin className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/profilix.qzz.io" className="text-text-secondary hover:text-primary transition-colors">
                <FaInstagram className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-border/50 pt-8">
          <p className="text-xs text-text-secondary">
            © {year} Profilix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
