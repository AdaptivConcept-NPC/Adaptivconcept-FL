import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag, ExternalLink, ChevronRight, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const BlogPost = ({ post, index = 0 }) => {
  const { themeColor } = useTheme();
  const formattedDate = new Date(post.date + 'T00:00:00').toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div
        className="group glass-theme glass-theme-hover rounded-2xl p-6 md:p-8 flex flex-col h-full transition-all relative overflow-hidden"
        id={`blog-post-${post.id}`}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-adaptiv-orange/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-adaptiv-orange/10 transition-colors" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header Row */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-adaptiv-orange">
                <BookOpen size={20} />
              </div>
              <div className="flex items-center gap-2 text-low text-[10px] font-bold uppercase tracking-[0.2em]">
                <Calendar size={12} className="text-adaptiv-orange/60" />
                {formattedDate}
              </div>
            </div>
            {post.status === 'published' && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-tighter border border-emerald-500/30">
                LIVE
              </span>
            )}
            {post.status === 'ready' && (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-black tracking-tighter border border-amber-500/30">
                QUEUED
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-2xl font-comfortaa font-bold text-high mb-4 transition-colors leading-tight ${
            themeColor.washType === 'coal' 
              ? 'group-hover:text-white' 
              : themeColor.washType === 'light' 
                ? 'group-hover:text-black' 
                : 'group-hover:text-adaptiv-orange'
          }`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-low text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg bg-white/5 border border-theme text-[11px] text-low font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              to={`/blog/${post.id}`}
              className="flex-grow py-3.5 rounded-xl border border-theme text-high font-bold flex items-center justify-center gap-2 btn-adaptive-hover transition-all text-sm"
              style={{
                backgroundColor: 'var(--theme-color)',
                color: 'contrast-color(var(--theme-color))',
                borderColor: 'transparent',
              }}
            >
              Read Article
              <ChevronRight size={16} />
            </Link>

            {post.linkedinUrl && (
              <a
                href={post.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 rounded-xl border border-theme text-low btn-adaptive-hover transition-all flex items-center justify-center hover:text-adaptiv-orange"
                title="View on LinkedIn"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPost;
