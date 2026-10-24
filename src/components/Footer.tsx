import React from 'react';
import { 
  ArrowUp, 
  Github, 
  Linkedin, 
  Mail, 
  Lock, 
  Flame 
} from 'lucide-react';
import { ProfileData } from '../types';

interface FooterProps {
  profile: ProfileData;
  logoUrl?: string;
  onNavigate: (sectionId: string) => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  profile, 
  logoUrl,
  onNavigate, 
  onOpenLogin 
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const defaultLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 380 100' width='380' height='100'%3E%3Crect width='380' height='100' fill='%23010736' rx='16'/%3E%3Crect x='16' y='16' width='68' height='68' rx='12' fill='%23FFF9F2'/%3E%3Ctext x='50' y='60' fill='%23010736' font-family='serif' font-size='36' font-weight='bold' text-anchor='middle'%3ESH%3C/text%3E%3Ccircle cx='76' cy='76' r='7' fill='%2310B981'/%3E%3Ctext x='104' y='48' fill='%23FFF9F2' font-family='serif' font-size='26' font-weight='bold'%3ESohel Hossen%3C/text%3E%3Ctext x='105' y='72' fill='%23C69255' font-family='sans-serif' font-size='12' letter-spacing='3' text-transform='uppercase' font-weight='600'%3ECLOUD ARCHITECT &bull; DEV%3C/text%3E%3C/svg%3E";

  return (
    <footer className="relative bg-[#0D1C42] border-t border-[#FFF9F2]/15 pt-16 pb-12 text-[#FFF9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#FFF9F2]/15 items-start">
          
          {/* Brand info with 380x100 Logo */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center">
              <img
                src={logoUrl || defaultLogo}
                alt="Brand Logo"
                className="h-10 sm:h-12 w-auto max-w-[220px] sm:max-w-[280px] object-contain rounded-lg bg-[#010736]/40 p-1 border border-[#FFF9F2]/20"
                style={{ aspectRatio: '380 / 100' }}
              />
            </div>

            <p className="text-xs sm:text-sm text-[#FFF9F2]/80 max-w-sm leading-relaxed">
              Crafting resilient digital solutions with real-time Firebase backends, zero-trust security rules, and tailored responsive aesthetics.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[#FFF9F2]/10 border border-[#FFF9F2]/20 hover:bg-[#FFF9F2] hover:text-[#010736] text-[#FFF9F2] transition-colors shadow-sm"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[#FFF9F2]/10 border border-[#FFF9F2]/20 hover:bg-[#FFF9F2] hover:text-[#010736] text-[#FFF9F2] transition-colors shadow-sm"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2.5 rounded-xl bg-[#FFF9F2]/10 border border-[#FFF9F2]/20 hover:bg-[#FFF9F2] hover:text-[#010736] text-[#FFF9F2] transition-colors shadow-sm"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#FFF9F2] mb-4 font-bold">
                Navigation
              </p>
              <ul className="space-y-2.5 text-[#FFF9F2]/75">
                <li>
                  <button onClick={() => onNavigate('home')} className="hover:text-amber-300 transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('about')} className="hover:text-amber-300 transition-colors">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('skills')} className="hover:text-amber-300 transition-colors">
                    Skills
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('services')} className="hover:text-amber-300 transition-colors">
                    Services
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#FFF9F2] mb-4 font-bold">
                Explore
              </p>
              <ul className="space-y-2.5 text-[#FFF9F2]/75">
                <li>
                  <button onClick={() => onNavigate('projects')} className="hover:text-amber-300 transition-colors">
                    Projects
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('blog')} className="hover:text-amber-300 transition-colors">
                    Blog
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className="hover:text-amber-300 transition-colors">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Backend details & User requested LOGIN button at the very bottom */}
          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end">
            <div className="p-4 rounded-2xl bg-[#010736]/60 border border-[#FFF9F2]/20 text-left md:text-right w-full shadow-sm backdrop-blur-sm">
              <div className="flex items-center md:justify-end gap-2 text-xs font-mono text-amber-300 mb-1 font-semibold">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Backend Powered</span>
              </div>
              <p className="text-xs text-[#FFF9F2]/90">
                Firebase Firestore Real-time Sync
              </p>
              <p className="text-[11px] font-mono text-[#FFF9F2]/60 mt-1">
                Footer Color: #0D1C42
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {/* Login Button at bottom requested by User */}
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFF9F2] text-[#010736] hover:bg-amber-300 transition-all text-xs font-bold shadow-lg transform hover:-translate-y-0.5"
                title="Admin Dashboard Login"
              >
                <Lock className="w-3.5 h-3.5 text-[#010736]" />
                <span>Login</span>
              </button>

              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFF9F2]/10 text-[#FFF9F2] border border-[#FFF9F2]/25 hover:bg-[#FFF9F2] hover:text-[#010736] transition-all text-xs font-semibold shadow-sm"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFF9F2]/60 gap-4">
          <p>
            © {currentYear} {profile.fullName || "Sohel Hossen"}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 font-mono text-[#FFF9F2]/60">
            <span>Built with precision & elegance</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
