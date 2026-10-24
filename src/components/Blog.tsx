import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Heart, 
  ArrowRight, 
  X
} from 'lucide-react';
import { BlogPostItem } from '../types';

interface BlogProps {
  blogs: BlogPostItem[];
  onLikePost: (blogId: string) => void;
}

export const Blog: React.FC<BlogProps> = ({ blogs, onLikePost }) => {
  const [selectedBlog, setSelectedBlog] = useState<BlogPostItem | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handleLike = (e: React.MouseEvent, blogId: string) => {
    e.stopPropagation();
    if (likedMap[blogId]) return;
    setLikedMap(prev => ({ ...prev, [blogId]: true }));
    onLikePost(blogId);
  };

  return (
    <section id="blog" className="py-10 md:py-14 relative bg-[#FFF9F2] border-t border-[#010736]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#010736]">
            Blog & Notes
          </h2>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => {
            const isLiked = likedMap[post.id];

            return (
              <article
                key={post.id}
                onClick={() => setSelectedBlog(post)}
                className="rounded-3xl bg-white border border-[#010736]/15 hover:border-[#010736]/40 hover:shadow-xl transition-all duration-300 overflow-hidden shadow-sm flex flex-col cursor-pointer group"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#F7EFE4]">
                  <img
                    src={post.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?fit=crop&w=800&q=80"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010736]/30 via-transparent to-transparent opacity-60" />
                  
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#010736]/15 text-xs font-mono text-[#010736] font-semibold shadow-sm">
                    {post.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs font-mono text-[#010736]/60 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.createdAt || 'Recent'}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime || '4 min'}</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-[#010736] group-hover:text-black transition-colors mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#010736]/75 leading-relaxed line-clamp-3 mb-6">
                      {post.summary}
                    </p>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-4 border-t border-[#010736]/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#010736] group-hover:underline flex items-center gap-1">
                      <span>Read Full Post</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>

                    <button
                      onClick={(e) => handleLike(e, post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all ${
                        isLiked 
                          ? 'bg-rose-100 text-rose-700 border border-rose-300' 
                          : 'bg-[#FFF9F2] text-[#010736] border border-[#010736]/15 hover:border-[#010736]/30'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{post.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

      </div>

      {/* Article Reader Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-[#010736]/50 backdrop-blur-sm"
            onClick={() => setSelectedBlog(null)}
          />
          <div className="relative w-full max-w-3xl bg-[#FFF9F2] border border-[#010736]/20 rounded-3xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto shadow-2xl z-50 text-[#010736]">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white border border-[#010736]/15 text-[#010736] hover:bg-gray-100 shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-white text-xs font-mono text-[#010736] border border-[#010736]/15 font-semibold">
                {selectedBlog.category}
              </span>
              <span className="text-xs font-mono text-[#010736]/60">
                {selectedBlog.createdAt} • {selectedBlog.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#010736] mb-6 leading-tight">
              {selectedBlog.title}
            </h1>

            {selectedBlog.coverImage && (
              <div className="rounded-2xl overflow-hidden aspect-[16/8] bg-[#F7EFE4] mb-8 border border-[#010736]/15">
                <img
                  src={selectedBlog.coverImage}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article content */}
            <div className="text-[#010736]/85 text-base sm:text-lg leading-relaxed space-y-5 font-normal">
              {selectedBlog.content.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Modal Bottom Strip */}
            <div className="mt-10 pt-6 border-t border-[#010736]/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleLike(e, selectedBlog.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    likedMap[selectedBlog.id]
                      ? 'bg-rose-500 text-white'
                      : 'bg-white text-[#010736] border border-[#010736]/20 hover:border-[#010736]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedMap[selectedBlog.id] ? 'fill-current' : ''}`} />
                  <span>{selectedBlog.likes + (likedMap[selectedBlog.id] ? 1 : 0)} Likes</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedBlog(null)}
                className="px-5 py-2 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm hover:bg-[#010736]/90 transition-colors shadow-sm"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
