import React, { useState, useMemo } from 'react';
import { 
  Code2, 
  Server, 
  Database, 
  Cloud, 
  Wrench, 
  Flame, 
  Sparkles,
  Search
} from 'lucide-react';
import { SkillItem } from '../types';

interface SkillsProps {
  skills: SkillItem[];
  categories: string[];
}

export const Skills: React.FC<SkillsProps> = ({ skills, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryList = useMemo(() => {
    const list = categories && categories.length > 0 
      ? categories 
      : ['Frontend', 'Backend', 'Database', 'Cloud & DevOps', 'Tools'];
    return ['All', ...list];
  }, [categories]);

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [skills, selectedCategory, searchQuery]);

  const getProficiencyLabel = (pct: number) => {
    if (pct >= 90) return 'Expert';
    if (pct >= 80) return 'Advanced';
    if (pct >= 70) return 'Proficient';
    return 'Intermediate';
  };

  const getCategoryIcon = (category: string) => {
    const catLower = (category || '').toLowerCase();
    if (catLower.includes('front')) return Code2;
    if (catLower.includes('back')) return Server;
    if (catLower.includes('data')) return Database;
    if (catLower.includes('cloud') || catLower.includes('devops')) return Cloud;
    return Wrench;
  };

  return (
    <section id="skills" className="py-10 md:py-14 relative bg-[#FFF9F2] border-t border-[#010736]/10 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#010736]">
            Programming SKills
          </h2>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Dynamic Category Tabs created and managed by Admin */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categoryList.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-[#010736] text-[#FFF9F2] font-bold shadow-md'
                      : 'bg-white text-[#010736] border border-[#010736]/15 hover:border-[#010736]/40 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#010736]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#010736]/15 rounded-xl text-xs sm:text-sm text-[#010736] placeholder-[#010736]/40 focus:outline-none focus:border-[#010736] shadow-sm transition-colors"
            />
          </div>

        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => {
            const Icon = getCategoryIcon(skill.category);
            const level = getProficiencyLabel(skill.proficiency);

            return (
              <div
                key={skill.id}
                className="p-6 rounded-2xl bg-white border border-[#010736]/15 hover:border-[#010736]/40 hover:shadow-md transition-all duration-300 shadow-sm group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#010736] text-[#FFF9F2] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                      {skill.name.toLowerCase().includes('firebase') ? (
                        <Flame className="w-5 h-5 text-amber-400" />
                      ) : (
                        <Icon className="w-5 h-5 text-[#FFF9F2]" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-[#010736] group-hover:text-black transition-colors">
                        {skill.name}
                      </h4>
                      <span className="text-[11px] font-mono text-[#010736]/60">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-[#FFF9F2] text-[11px] font-mono text-[#010736] border border-[#010736]/15 font-semibold">
                    {level}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-mono text-[#010736]/70 mb-1.5">
                    <span>Proficiency</span>
                    <span className="font-bold text-[#010736]">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EADCCB] overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-[#010736] transition-all duration-1000 ease-out"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 p-8 rounded-2xl bg-white border border-[#010736]/15 shadow-sm">
            <p className="text-[#010736]/70">No skills match your search filters.</p>
          </div>
        )}

      </div>
    </section>
  );
};
