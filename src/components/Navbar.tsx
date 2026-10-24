import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ArrowUpRight
} from 'lucide-react';

interface NavbarProps {
  logoUrl?: string;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  logoUrl,
  activeSection,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const defaultLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 380 100' width='380' height='100'%3E%3Crect width='380' height='100' fill='%23010736' rx='16'/%3E%3Crect x='16' y='16' width='68' height='68' rx='12' fill='%23FFF9F2'/%3E%3Ctext x='50' y='60' fill='%23010736' font-family='serif' font-size='36' font-weight='bold' text-anchor='middle'%3ESH%3C/text%3E%3Ccircle cx='76' cy='76' r='7' fill='%2310B981'/%3E%3Ctext x='104' y='48' fill='%23FFF9F2' font-family='serif' font-size='26' font-weight='bold'%3ESohel Hossen%3C/text%3E%3Ctext x='105' y='72' fill='%23C69255' font-family='sans-serif' font-size='12' letter-spacing='3' text-transform='uppercase' font-weight='600'%3ECLOUD ARCHITECT &bull; DEV%3C/text%3E%3C/svg%3E";

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-40 bg-[#F5EFE3] border-b border-[#010736]/10 shadow-sm transition-all duration-300 py-3.5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* 380x100 Logo Image Area (No old monogram text, only 380x100 logo image) */}
            <div 
              onClick={() => handleLinkClick('home')}
              className="flex items-center cursor-pointer select-none group"
            >
              <img
                src={logoUrl || defaultLogo}
                alt="Brand Logo"
                className="h-10 sm:h-12 w-auto max-w-[220px] sm:max-w-[280px] md:max-w-[340px] object-contain rounded-lg shadow-sm group-hover:scale-102 transition-transform duration-300"
                style={{ aspectRatio: '380 / 100' }}
              />
            </div>

            {/* Desktop Navigation Links (Admin Dashboard removed from Navbar per user request) */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'text-[#FFF9F2] bg-[#010736] shadow-sm font-semibold' 
                        : 'text-[#010736]/80 hover:text-[#010736] hover:bg-[#010736]/5'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              {/* Hire Me CTA Button */}
              <button
                onClick={() => handleLinkClick('contact')}
                className="ml-3 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-[#010736] text-[#FFF9F2] hover:bg-[#010736]/85 hover:shadow-md transition-all shadow-sm"
              >
                <span>Hire Me</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </nav>

            {/* Mobile Actions & Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-white text-[#010736] border border-[#010736]/20 hover:bg-[#010736]/5 transition-colors shadow-sm"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#010736]/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-[#F5EFE3] border-l border-[#010736]/15 p-6 flex flex-col justify-between shadow-2xl z-50">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-5 border-b border-[#010736]/15">
                <img
                  src={logoUrl || defaultLogo}
                  alt="Logo"
                  className="h-9 w-auto max-w-[200px] object-contain rounded"
                  style={{ aspectRatio: '380 / 100' }}
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-white border border-[#010736]/20 text-[#010736] hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links list */}
              <div className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-left text-base font-medium transition-all ${
                        isActive
                          ? 'bg-[#010736] text-[#FFF9F2] font-bold shadow-md'
                          : 'text-[#010736] hover:bg-white'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-[#FFF9F2]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-[#010736]/15 text-xs text-[#010736]/70 text-center">
              <p className="font-mono">Theme: #FFF9F2 & #010736</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
