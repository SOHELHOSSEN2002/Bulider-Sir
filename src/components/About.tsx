import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  Terminal
} from 'lucide-react';
import { AboutSettings, TimelineItem } from '../types';

interface AboutProps {
  aboutSettings: AboutSettings;
  timeline: TimelineItem[];
  onNavigate: (sectionId: string) => void;
}

export const About: React.FC<AboutProps> = ({ aboutSettings, timeline, onNavigate }) => {
  const iconMap: Record<string, any> = {
    Terminal,
    ShieldCheck,
    Cpu,
    Sparkles,
    CheckCircle2
  };

  const highlights = (aboutSettings.philosophyCards && aboutSettings.philosophyCards.length > 0)
    ? aboutSettings.philosophyCards
    : [
        {
          id: "phil-1",
          title: "Full Stack Mastery",
          description: "End-to-end fluency with React 19, TypeScript, Node.js, Express, and cloud serverless architectures.",
          iconName: "Terminal"
        },
        {
          id: "phil-2",
          title: "Hardened Security",
          description: "Implementing zero-trust Firestore rules, ABAC policies, safe authentication, and input sanitization.",
          iconName: "ShieldCheck"
        },
        {
          id: "phil-3",
          title: "Performance First",
          description: "Sub-second load times, 60 FPS transitions, minimal bundle overhead, and efficient database indexing.",
          iconName: "Cpu"
        },
        {
          id: "phil-4",
          title: "Bespoke Design",
          description: "Custom UI built around purposeful contrast, editorial typography, and 100% mobile responsiveness.",
          iconName: "Sparkles"
        }
      ];

  return (
    <section id="about" className="py-10 md:py-14 relative bg-[#FFF9F2] border-t border-[#010736]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#010736]">
            {aboutSettings.title || "About My"}
          </h2>
        </div>

        {/* Top Grid: Bio & Personal Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-10">
          
          {/* Main Narrative Card (Controlled by Admin) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-[#010736]/15 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#010736]/60 font-semibold">
                Engineering Philosophy
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#010736] mt-2 mb-6">
                {aboutSettings.narrativeHeading || "Bridging elegant visual craftsmanship with uncompromising technical discipline."}
              </h3>
              
              <div className="text-[#010736]/80 text-base leading-relaxed space-y-4 font-normal whitespace-pre-line">
                <p>
                  {aboutSettings.narrativeBio}
                </p>
              </div>
            </div>

            {/* Quick Contact & Details Strip */}
            <div className="mt-8 pt-6 border-t border-[#010736]/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 text-[#010736]">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{aboutSettings.location}</span>
              </div>
              <div className="flex items-center gap-3 text-[#010736]">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{aboutSettings.email}</span>
              </div>
              <div className="flex items-center gap-3 text-[#010736]">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{aboutSettings.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-[#010736]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{aboutSettings.availability || "Available for Full-time Roles & Contracts"}</span>
              </div>
            </div>
          </div>

          {/* Highlights 4-box card */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item: any, index: number) => {
              const Icon = iconMap[item.iconName] || Terminal;
              return (
                <div 
                  key={item.id || index} 
                  className="p-6 rounded-2xl bg-white border border-[#010736]/15 hover:border-[#010736]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#010736] text-[#FFF9F2] flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#010736] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#010736]/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Experience & Education Timeline (Controlled by Admin) */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#010736]/15 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#010736]/10 gap-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#010736]/60 font-semibold">Career Trajectory</span>
              <h3 className="text-2xl font-serif font-bold text-[#010736] mt-1">
                Experience & Education Timeline
              </h3>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#010736] text-[#FFF9F2] hover:bg-[#010736]/90 transition-colors self-start sm:self-auto shadow-sm"
            >
              <span>Work With Me</span>
            </button>
          </div>

          <div className="space-y-8">
            {timeline.map((t, idx) => (
              <div key={t.id || idx} className="relative pl-8 sm:pl-10 border-l-2 border-[#010736]/20 last:border-transparent">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#010736] border-4 border-[#FFF9F2]" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className="font-serif font-bold text-lg text-[#010736]">
                    {t.role}
                  </h4>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#FFF9F2] text-[#010736] border border-[#010736]/15 self-start sm:self-auto font-medium">
                    {t.year}
                  </span>
                </div>

                <p className="text-sm font-semibold text-emerald-700 mb-2">
                  {t.company}
                </p>
                <p className="text-sm text-[#010736]/75 leading-relaxed max-w-3xl">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
