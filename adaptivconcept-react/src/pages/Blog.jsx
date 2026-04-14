import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PenLine, Filter } from "lucide-react";
import blogPostsData from "../data/blog-posts.json";
import BlogPost from "../components/BlogPost";

const Blog = () => {
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique tags from all posts
  const allTags = useMemo(() => {
    const tagSet = new Set();
    blogPostsData.forEach((post) =>
      post.tags.forEach((tag) => tagSet.add(tag)),
    );
    return ["All", ...Array.from(tagSet).sort()];
  }, []);

  // Filter and sort posts (newest first for display)
  const filteredPosts = useMemo(() => {
    return blogPostsData
      .filter((post) => {
        const matchesTag = activeTag === "All" || post.tags.includes(activeTag);
        const matchesSearch =
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        return matchesTag && matchesSearch;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [activeTag, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 py-10 md:py-20 min-h-screen rounded-[32px] md:rounded-[60px] glass-theme"
      style={{ marginTop: "200px" }}
    >
      {/* Hero Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-comfortaa font-bold text-white mb-6">
            <span className="text-adaptiv-orange">Blog</span> & Insights
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-poppins max-w-2xl mx-auto">
            Technical deep dives, career updates, and insights from the
            Adaptivconcept FL ecosystem.
          </p>
        </motion.div>

        {/* Post count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm font-medium"
        >
          <PenLine size={16} className="text-adaptiv-orange" />
          {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
        </motion.div>
      </div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-5xl mx-auto mb-20"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] md:rounded-[32px] p-3 md:p-4 flex flex-col lg:flex-row items-center gap-4 md:gap-6 shadow-2xl">
          <div className="w-full lg:flex-grow relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-adaptiv-orange transition-colors"
              size={20}
            />
            <input
              type="text"
              className="w-full bg-black/20 border border-white/5 text-white pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:border-adaptiv-orange/40 transition-all font-poppins placeholder:text-gray-600"
              placeholder="Search articles by title, tag, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="blog-search"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTag === tag
                    ? "bg-adaptiv-orange text-white shadow-lg shadow-adaptiv-orange/20"
                    : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white"
                }`}
                id={`blog-filter-${tag.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {tag !== "All" && <Filter size={10} />}
                {tag}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <BlogPost key={post.id} post={post} index={index} />
          ))}
        </AnimatePresence>

        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-20"
          >
            <p className="text-gray-500 text-lg font-poppins">
              No articles match your search.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Blog;
