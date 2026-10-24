import React from 'react';
import { 
  Code, 
  Flame, 
  Layout, 
  Zap, 
  Check, 
  ArrowRight, 
  Sparkles,
  Server,
  ShieldCheck
} from 'lucide-react';
import { ServiceItem, ServicesHeader } from '../types';

interface ServicesProps {
  services: ServiceItem[];
  header: ServicesHeader;
  onSelectService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ services, header, onSelectService }) => {
  const getServiceIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'flame': return Flame;
      case 'layout': return Layout;
      case 'zap': return Zap;
      case 'server': return Server;
      case 'shieldcheck': return ShieldCheck;
      default: return Code;
    }
  };

  return (
    <section id="services" className="py-10 md:py-14 relative bg-[#FFF9F2] border-t border-[#010736]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#010736]">
            {header.title || "My Services"}
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = getServiceIcon(service.iconName);
            const featureList = service.features
              ? service.features.split(/[•,\n]/).map(f => f.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={service.id || index}
                className="p-8 sm:p-10 rounded-3xl bg-white border border-[#010736]/15 hover:border-[#010736]/40 hover:shadow-lg transition-all duration-300 shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#010736] text-[#FFF9F2] flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-md">
                      <Icon className="w-7 h-7" />
                    </div>
                    {service.priceRange && (
                      <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-[#FFF9F2] text-[#010736] border border-[#010736]/15 font-semibold">
                        {service.priceRange}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-[#010736] mb-3 group-hover:text-black transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#010736]/75 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Feature checklist */}
                  {featureList.length > 0 && (
                    <div className="space-y-2.5 pt-4 border-t border-[#010736]/10 mb-6">
                      {featureList.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#010736]/85">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-[#010736]/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#010736]/60">Custom Tailored</span>
                  <button
                    onClick={() => onSelectService(service.title)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#010736] text-[#FFF9F2] hover:bg-[#010736]/85 transition-all duration-300 group/btn shadow-sm"
                  >
                    <span>Inquire Now</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
