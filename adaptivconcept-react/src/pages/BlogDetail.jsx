import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Calendar,
  Tag,
  ExternalLink,
  BookOpen,
  Share2,
} from 'lucide-react';
import blogPostsData from '../data/blog-posts.json';

/**
 * Render markdown-like content as structured JSX.
 * Handles: headers, bold, italic, list items, and paragraphs.
 */
const renderContent = (content) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let currentParagraph = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ');
      if (text.trim()) {
        elements.push(
          <p key={key++} className="mb-6 text-gray-400 leading-[2] text-base md:text-lg font-poppins">
            {formatInlineText(text)}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const formatInlineText = (text) => {
    // Handle bold and italic
    const parts = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[2]) {
        parts.push(
          <strong key={`b-${match.index}`} className="text-white font-bold">
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        parts.push(
          <em key={`i-${match.index}`} className="text-gray-300 italic">
            {match[3]}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line → flush paragraph
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    // Headers
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      flushParagraph();
      const level = headerMatch[1].length;
      const text = headerMatch[2];

      if (level <= 3) {
        elements.push(
          <div key={key++} className="flex items-center gap-4 mb-6 mt-12">
            <div className="w-10 h-10 rounded-2xl bg-adaptiv-orange/10 flex items-center justify-center text-adaptiv-orange flex-shrink-0">
              <BookOpen size={20} />
            </div>
            <h3 className="text-xl md:text-2xl font-comfortaa font-bold text-white">
              {text}
            </h3>
          </div>
        );
      } else {
        elements.push(
          <h4 key={key++} className="text-lg font-bold text-white mb-4 mt-8">
            {text}
          </h4>
        );
      }
      continue;
    }

    // List items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      const itemText = trimmed.slice(2);
      elements.push(
        <div key={key++} className="flex gap-4 items-start mb-3 ml-4">
          <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-adaptiv-orange flex-shrink-0" />
          <span className="text-gray-300 text-base leading-relaxed font-poppins">
            {formatInlineText(itemText)}
          </span>
        </div>
      );
      continue;
    }

    // Hashtag line (e.g., #Tag1 #Tag2)
    if (trimmed.startsWith('#') && !trimmed.startsWith('##') && trimmed.includes(' #')) {
      flushParagraph();
      const tags = trimmed.split(/\s+/).filter((t) => t.startsWith('#'));
      elements.push(
        <div key={key++} className="flex flex-wrap gap-2 mt-8 mb-6">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-4 py-1.5 rounded-lg bg-adaptiv-orange/10 border border-adaptiv-orange/20 text-adaptiv-orange text-xs font-bold"
            >
              {tag}
            </span>
          ))}
        </div>
      );
      continue;
    }

    // Regular text → accumulate paragraph
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  return elements;
};

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPostsData.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="container mx-auto px-6 py-20 text-center min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-4xl font-comfortaa font-bold text-white mb-6">
          Article Not Found
        </h2>
        <Link
          to="/blog"
          className="px-8 py-3 bg-adaptiv-orange text-white rounded-xl font-bold hover:bg-white hover:text-adaptiv-orange transition-all"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.date + 'T00:00:00').toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="container mx-auto px-6 py-10 md:py-24 min-h-screen"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 font-medium"
      >
        <ChevronLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Blog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Article Header */}
        <div className="lg:col-span-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] md:rounded-[40px] p-6 md:p-10 sticky top-28 group relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-adaptiv-orange/5 blur-[80px] rounded-full -mr-24 -mt-24 group-hover:bg-adaptiv-orange/10 transition-colors" />

            {/* Status */}
            {post.status === 'published' ? (
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black tracking-widest mb-6">
                PUBLISHED
              </span>
            ) : (
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-black tracking-widest mb-6">
                QUEUED
              </span>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-comfortaa font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Date */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
              <Calendar size={16} className="text-adaptiv-orange" />
              {formattedDate}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400 font-medium"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-auto">
              {post.linkedinUrl && (
                <a
                  href={post.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#0077B5] text-white font-bold flex items-center justify-center gap-3 hover:bg-[#006097] transition-all shadow-lg shadow-[#0077B5]/10"
                >
                  <ExternalLink size={18} />
                  View on LinkedIn
                </a>
              )}

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="w-full py-3.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <Share2 size={18} />
                Share Article
              </button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="lg:col-span-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] md:rounded-[40px] p-6 md:p-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-adaptiv-orange/10 flex items-center justify-center text-adaptiv-orange">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl md:text-3xl font-comfortaa font-bold text-white">
                Full Article
              </h3>
            </div>

            <div className="w-full h-px bg-white/5 mb-12" />

            <div className="max-w-4xl">{renderContent(post.content)}</div>

            {/* Author Card */}
            <div className="mt-16 bg-white/[0.02] border-l-4 border-adaptiv-orange p-6 md:p-8 rounded-r-2xl md:rounded-r-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-adaptiv-orange/20 flex items-center justify-center text-adaptiv-orange font-bold text-lg">
                  TM
                </div>
                <div>
                  <h5 className="text-white font-bold text-lg">
                    Thabang Mposula
                  </h5>
                  <p className="text-gray-500 text-sm">
                    Senior Systems Developer | AI-Engineer · Adaptivconcept FL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogDetail;
