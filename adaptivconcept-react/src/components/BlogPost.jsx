import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag, ExternalLink, ChevronRight, BookOpen } from 'lucide-react';

const BlogPost = ({ post, index = 0 }) => {
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
        className="group relative glass-theme backdrop-blur-md border border-theme rounded-2xl p-6 md:p-8 flex flex-col h-full transition-all hover:bg-white/[0.08] hover:border-white/20 overflow-hidden"
        style={{ backgroundColor: 'var(--glass-bg)' }}
        id={`blog-post-${post.id}`}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-adaptiv-orange/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-adaptiv-orange/10 transition-colors" />

        {/* Date Badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-low text-xs font-medium uppercase tracking-widest">
            <Calendar size={14} className="text-adaptiv-orange" />
            {formattedDate}
          </div>
          {post.status === 'published' && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-tighter">
              LIVE
            </span>
          )}
          {post.status === 'ready' && (
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-black tracking-tighter">
              QUEUED
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-comfortaa font-bold text-high mb-4 group-hover:text-adaptiv-orange transition-colors leading-tight">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-low text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 border border-theme text-[11px] text-low font-medium"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
          <Link
            to={`/blog/${post.id}`}
            className="flex-grow py-3 rounded-xl border border-theme text-high font-bold flex items-center justify-center gap-2 group-hover:bg-adaptiv-orange group-hover:border-adaptiv-orange transition-all text-sm"
          >
            <BookOpen size={16} />
            Read Article
            <ChevronRight size={14} />
          </Link>

          {post.linkedinUrl && (
            <a
              href={post.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl border border-theme text-low hover:text-high hover:border-white/30 transition-all flex items-center justify-center"
              title="View on LinkedIn"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPost;
