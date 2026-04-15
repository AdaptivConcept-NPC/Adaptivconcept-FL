import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Save, Plus, Trash2, Eye, Edit3, ExternalLink, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Admin = () => {
  const { themeColor } = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Data State
  const [links, setLinks] = useState([]);
  const [stubs, setStubs] = useState({ projects: null, blog: null });
  const [activeTab, setActiveTab] = useState("links"); // links, stubs

  const handleLogin = (e) => {
    e.preventDefault();
    // Verification will happen on first API call, 
    // but we store it locally for now.
    setIsAuthenticated(true);
    localStorage.setItem("admin_code", accessCode);
    fetchData(accessCode);
  };

  const fetchData = async (code) => {
    setLoading(true);
    try {
      const linksRes = await fetch("/.netlify/functions/admin/links", {
        headers: { "x-admin-code": code }
      });
      const stubsRes = await fetch("/.netlify/functions/admin/stubs", {
        headers: { "x-admin-code": code }
      });

      if (linksRes.ok) setLinks(await linksRes.json());
      if (stubsRes.ok) setStubs(await stubsRes.json());
      
      if (!linksRes.ok && linksRes.status === 401) {
        setIsAuthenticated(false);
        setError("Invalid access parameters.");
      }
    } catch (err) {
      setError("Failed to connect to secure relay.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedCode = localStorage.getItem("admin_code");
    if (savedCode) {
      setAccessCode(savedCode);
      setIsAuthenticated(true);
      fetchData(savedCode);
    }
  }, []);

  const saveLinks = async () => {
    setLoading(true);
    try {
      await fetch("/.netlify/functions/admin/links", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-code": accessCode 
        },
        body: JSON.stringify(links)
      });
      alert("Links Board synchronized.");
    } catch (err) {
      alert("Sync failed.");
    } finally {
      setLoading(false);
    }
  };

  const addLink = () => {
    setLinks([...links, { title: "New Link", url: "https://", category: "General" }]);
  };

  const deleteLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-theme p-10 rounded-[40px] text-center"
        >
          <div className="w-20 h-20 bg-adaptiv-orange/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-adaptiv-orange/20">
            <Lock className="text-adaptiv-orange" size={32} />
          </div>
          <h1 className="text-3xl font-comfortaa font-bold text-white mb-2">Secure Access</h1>
          <p className="text-gray-400 mb-8 font-poppins">Enter authorization code to access the lab backend.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center text-white text-xl tracking-widest outline-none focus:border-adaptiv-orange/50 transition-all"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              className="w-full py-4 bg-adaptiv-orange text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-adaptiv-orange/20 transition-all"
            >
              Unlock Terminal
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Exit to Perimeter
          </button>
          <h1 className="text-4xl md:text-5xl font-comfortaa font-bold text-white">Lab <span className="text-adaptiv-orange">Backend</span></h1>
        </div>
        
        <div className="flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab("links")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "links" ? "bg-adaptiv-orange text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
          >
            Links Board
          </button>
          <button 
            onClick={() => setActiveTab("stubs")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "stubs" ? "bg-adaptiv-orange text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
          >
            JSON Stubs
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "links" ? (
          <motion.div 
            key="links"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Global Resource Links</h2>
              <div className="flex gap-4">
                <button 
                  onClick={addLink}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white flex items-center gap-2 transition-all"
                >
                  <Plus size={18} /> Add Resource
                </button>
                <button 
                  onClick={saveLinks}
                  disabled={loading}
                  className="px-6 py-2 bg-adaptiv-orange text-white rounded-xl flex items-center gap-2 font-bold hover:shadow-lg hover:shadow-adaptiv-orange/20 disabled:opacity-50 transition-all"
                >
                  <Save size={18} /> {loading ? "Syncing..." : "Sync Changes"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map((link, index) => (
                <div key={index} className="glass-theme p-6 rounded-[24px] border border-white/10 relative group">
                  <button 
                    onClick={() => deleteLink(index)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <input 
                    type="text" 
                    value={link.title}
                    onChange={(e) => {
                      const newLinks = [...links];
                      newLinks[index].title = e.target.value;
                      setLinks(newLinks);
                    }}
                    placeholder="Link Title"
                    className="bg-transparent border-b border-white/10 text-white font-bold w-full mb-4 pb-1 outline-none focus:border-adaptiv-orange"
                  />
                   <input 
                    type="text" 
                    value={link.category}
                    onChange={(e) => {
                      const newLinks = [...links];
                      newLinks[index].category = e.target.value;
                      setLinks(newLinks);
                    }}
                    placeholder="Category"
                    className="bg-transparent text-[10px] text-adaptiv-orange font-bold uppercase tracking-widest w-full mb-4 outline-none"
                  />
                  <div className="flex gap-2 items-center bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                    <ExternalLink size={16} className="text-gray-500 flex-shrink-0" />
                    <input 
                      type="text" 
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[index].url = e.target.value;
                        setLinks(newLinks);
                      }}
                      className="bg-transparent text-gray-400 text-sm w-full outline-none"
                    />
                  </div>
                </div>
              ))}
              {links.length === 0 && (
                <div className="col-span-full py-20 text-center glass-theme rounded-[32px] border border-dashed border-white/10">
                  <p className="text-gray-500">No resources deployed. Click "Add Resource" to begin.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="stubs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="glass-theme p-8 rounded-[32px] border border-white/10 backdrop-blur-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Projects Stub</h3>
                  <p className="text-xs text-gray-500">Overrides local projects.json data</p>
                </div>
                {!stubs.projects ? (
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] text-gray-500 border border-white/10">Using Local File</span>
                ) : (
                  <span className="px-3 py-1 bg-adaptiv-orange/10 rounded-lg text-[10px] text-adaptiv-orange border border-adaptiv-orange/20">Active Override</span>
                )}
              </div>
              <textarea 
                readOnly
                placeholder="JSON View Only for now..."
                className="w-full h-[400px] bg-black/40 border border-white/10 rounded-2xl p-6 text-adaptiv-orange font-mono text-sm resize-none outline-none"
                value={stubs.projects ? JSON.stringify(stubs.projects, null, 2) : "// No cloud override active. Viewing local data requires build inspection."}
              ></textarea>
            </div>

            <div className="glass-theme p-8 rounded-[32px] border border-white/10 backdrop-blur-2xl">
              <div className="flex justify-between items-center mb-6">
                 <div>
                  <h3 className="text-xl font-bold text-white mb-1">Blog Posts Stub</h3>
                  <p className="text-xs text-gray-500">Overrides local blog-posts.json data</p>
                </div>
                {!stubs.blog ? (
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] text-gray-500 border border-white/10">Using Local File</span>
                ) : (
                  <span className="px-3 py-1 bg-adaptiv-orange/10 rounded-lg text-[10px] text-adaptiv-orange border border-adaptiv-orange/20">Active Override</span>
                )}
              </div>
               <textarea 
                readOnly
                placeholder="JSON View Only for now..."
                className="w-full h-[400px] bg-black/40 border border-white/10 rounded-2xl p-6 text-adaptiv-orange font-mono text-sm resize-none outline-none"
                value={stubs.blog ? JSON.stringify(stubs.blog, null, 2) : "// No cloud override active. Viewing local data requires build inspection."}
              ></textarea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
