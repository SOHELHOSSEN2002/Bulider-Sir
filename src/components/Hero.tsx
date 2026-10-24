import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  ExternalLink 
} from 'lucide-react';
import { HeroSlideItem } from '../types';

interface HeroProps {
  slides: HeroSlideItem[];
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ slides, onNavigate }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const activeSlides = slides && slides.length > 0 ? slides : [
    {
      id: "default-slide",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=1920&h=1080&q=80",
      title: "Crafting Scalable Cloud Architectures & Modern Web Apps",
      subtitle: "Sohel Hossen — Full Stack Engineer & Cloud Architect",
      description: "Specializing in high-performance web applications, distributed cloud backends, and resilient Firebase infrastructure.",
      primaryBtnText: "View Projects",
      primaryBtnLink: "#projects",
      secondaryBtnText: "Contact Me",
      secondaryBtnLink: "#contact"
    }
  ];

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const handlePrev = () => {
    setCurrentSlideIndex(prev => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex(prev => (prev + 1) % activeSlides.length);
  };

  const current = activeSlides[currentSlideIndex] || activeSlides[0];

  const handleButtonClick = (link: string) => {
    if (link.startsWith('#')) {
      onNavigate(link.replace('#', ''));
    } else {
      window.open(link, '_blank', 'noreferrer');
    }
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#FFF9F2] pt-20">
      
      {/* Background Carousel Slides */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {activeSlides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            } transition-transform duration-10000`}
          >
            <img
              src={slide.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=1920&h=1080&q=80"}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
            />
            {/* Subtle, crystal-clear gradient that keeps the slide bright and vibrant while ensuring pure text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9F2]/85 via-[#FFF9F2]/45 to-transparent md:from-[#FFF9F2]/80 md:via-[#FFF9F2]/25 md:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9F2]/40 via-transparent to-transparent h-28 bottom-0 top-auto" />
          </div>
        ))}
      </div>

      {/* Hero Content Overlay (Pure text directly over the Carousel - box removed per user request) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
        <div className="max-w-3xl">
          
          {/* Subtitle / Tagline set by Admin */}
          {current.subtitle && (
            <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-sm border border-[#010736]/15 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs sm:text-sm font-semibold text-[#010736] tracking-wide">
                {current.subtitle}
              </span>
            </div>
          )}

          {/* Main Headline set by Admin */}
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#010736] font-serif leading-[1.12]">
            {current.title}
          </h1>

          {/* Description / Bio set by Admin */}
          {current.description && (
            <p className="mt-6 text-base sm:text-xl text-[#010736]/90 font-medium leading-relaxed max-w-2xl">
              {current.description}
            </p>
          )}

          {/* Action CTA Buttons set by Admin */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {current.primaryBtnText && (
              <button
                onClick={() => handleButtonClick(current.primaryBtnLink || '#projects')}
                className="flex items-center gap-2 px-7 py-4 rounded-xl font-bold bg-[#010736] text-[#FFF9F2] hover:bg-[#010736]/90 hover:shadow-xl hover:shadow-[#010736]/15 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>{current.primaryBtnText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {current.secondaryBtnText && (
              <button
                onClick={() => handleButtonClick(current.secondaryBtnLink || '#contact')}
                className="flex items-center gap-2 px-7 py-4 rounded-xl font-bold bg-white/95 backdrop-blur-md text-[#010736] border border-[#010736]/25 hover:border-[#010736] hover:bg-[#010736] hover:text-[#FFF9F2] shadow-sm transition-all duration-300"
              >
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>{current.secondaryBtnText}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Carousel Navigation Controls */}
      {activeSlides.length > 1 && (
        <>
          {/* Arrow Left */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-[#010736]/15 text-[#010736] flex items-center justify-center hover:bg-[#010736] hover:text-[#FFF9F2] shadow-md transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Arrow Right */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-[#010736]/15 text-[#010736] flex items-center justify-center hover:bg-[#010736] hover:text-[#FFF9F2] shadow-md transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Dots / Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#010736]/15 shadow-sm">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === currentSlideIndex 
                    ? 'w-7 h-2.5 bg-[#010736]' 
                    : 'w-2.5 h-2.5 bg-[#010736]/30 hover:bg-[#010736]/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

    </section>
  );
};
