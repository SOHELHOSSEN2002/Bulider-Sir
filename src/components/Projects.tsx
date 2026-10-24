import React, { useState, useMemo } from 'react';
import { 
  ExternalLink, 
  Github, 
  Star, 
  Layers, 
  Search, 
  X, 
  ArrowUpRight 
} from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectsProps {
  projects: ProjectItem[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const categories = ['All', 'Full Stack', 'Frontend', 'Backend', 'AI & Tools'];

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-10 md:py-14 relative bg-[#FFF9F2] border-t border-[#010736]/10 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#010736]">
            Successfull Story
          </h2>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map(cat => {
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

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#010736]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#010736]/15 rounded-xl text-xs sm:text-sm text-[#010736] placeholder-[#010736]/40 focus:outline-none focus:border-[#010736] shadow-sm transition-colors"
            />
          </div>

        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const tagArray = project.tags
              ? project.tags.split(/[•,]/).map(t => t.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={project.id}
                className="rounded-3xl bg-white border border-[#010736]/15 hover:border-[#010736]/40 hover:shadow-xl transition-all duration-300 overflow-hidden shadow-sm flex flex-col group"
              >
                {/* Project Image & Badge */}
                <div className="relative aspect-video overflow-hidden bg-[#F7EFE4] cursor-pointer" onClick={() => setActiveModalProject(project)}>
                  <img
                    src={project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?fit=crop&w=800&q=80"}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010736]/30 via-transparent to-transparent opacity-60" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#010736]/15 text-xs font-mono text-[#010736] font-semibold shadow-sm">
                    {project.category}
                  </div>

                  {project.featured && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-400 text-[#010736] text-xs font-bold flex items-center gap-1 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => setActiveModalProject(project)}
                      className="text-xl font-serif font-bold text-[#010736] group-hover:text-black transition-colors cursor-pointer mb-2"
                    >
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#010736]/70 leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Tags */}
                    {tagArray.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {tagArray.map((tag, tIdx) => (
                          <span 
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-md bg-[#FFF9F2] text-[11px] font-mono text-[#010736] border border-[#010736]/10 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#010736]/10 flex items-center justify-between">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="text-xs font-bold text-[#010736] hover:underline flex items-center gap-1"
                    >
                      <span>Read Overview</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-[#FFF9F2] text-[#010736] border border-[#010736]/15 hover:bg-[#010736] hover:text-[#FFF9F2] transition-colors"
                          title="View Source on GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-[#010736] text-[#FFF9F2] hover:bg-[#010736]/80 transition-colors shadow-sm"
                          title="Open Live Preview"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 p-8 rounded-2xl bg-white border border-[#010736]/15 shadow-sm">
            <p className="text-[#010736]/70">No projects found matching the criteria.</p>
          </div>
        )}

      </div>

      {/* Project Detail Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-[#010736]/50 backdrop-blur-sm"
            onClick={() => setActiveModalProject(null)}
          />
          <div className="relative w-full max-w-2xl bg-[#FFF9F2] border border-[#010736]/20 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl z-50 text-[#010736]">
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white border border-[#010736]/15 text-[#010736] hover:bg-gray-100 shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl overflow-hidden aspect-video bg-[#F7EFE4] mb-6 border border-[#010736]/15">
              <img
                src={activeModalProject.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?fit=crop&w=800&q=80"}
                alt={activeModalProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white text-xs font-mono text-[#010736] border border-[#010736]/15 font-semibold">
                {activeModalProject.category}
              </span>
              {activeModalProject.featured && (
                <span className="px-3 py-1 rounded-full bg-amber-400 text-xs font-bold text-[#010736]">
                  Featured Project
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#010736] mb-4">
              {activeModalProject.title}
            </h3>

            <p className="text-sm sm:text-base text-[#010736]/80 leading-relaxed mb-6">
              {activeModalProject.description}
            </p>

            <div className="mb-6 p-4 rounded-xl bg-white border border-[#010736]/15 shadow-sm">
              <p className="text-xs font-mono uppercase text-[#010736]/60 mb-2">Technologies Used</p>
              <div className="flex flex-wrap gap-2">
                {activeModalProject.tags.split(/[•,]/).map((t, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-[#FFF9F2] text-xs font-mono text-[#010736] border border-[#010736]/10 font-semibold">
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#010736]/15">
              {activeModalProject.liveUrl && (
                <a
                  href={activeModalProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm hover:bg-[#010736]/90 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live Site</span>
                </a>
              )}
              {activeModalProject.githubUrl && (
                <a
                  href={activeModalProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#010736] border border-[#010736]/25 font-semibold text-sm hover:border-[#010736] transition-colors shadow-sm"
                >
                  <Github className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
