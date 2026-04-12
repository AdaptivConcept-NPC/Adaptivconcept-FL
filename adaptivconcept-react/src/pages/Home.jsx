import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Rocket, ChevronRight, ExternalLink } from 'lucide-react';
import projectsData from '../data/projects.json';

const Home = () => {
  const heroProjects = projectsData.filter(p => p.isHero);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full relative"
      style={{ backgroundColor: "rgb(51 51 51 / 80%)"}}
    >
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="max-w-5xl z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-vietnam mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-adaptiv-orange animate-pulse"></span>
              Available for Freelance & Consultation
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-comfortaa font-bold mb-8 tracking-tight text-white leading-tight">
              Senior <span className="text-adaptiv-orange relative">AI Engineer <span className="absolute bottom-0 left-0 w-full h-[6px] bg-adaptiv-orange/20 rounded-full"></span></span> & <br />
              Freelance Architect
            </h1>
            <p className="text-xl md:text-2xl font-poppins text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Specializing in high-performance pipelines, medical data systems, and browser-based 3D applications. 
              Bridging legacy complexity with automated intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 rounded-2xl bg-adaptiv-orange text-white text-lg font-bold hover:bg-white hover:text-adaptiv-orange transition-all shadow-lg shadow-adaptiv-orange/20 flex items-center gap-3">
                Start a Conversation <ChevronRight size={22} />
              </button>
              <button className="px-8 py-4 rounded-2xl border-2 border-white/10 text-white text-lg font-bold hover:bg-white/5 transition-all backdrop-blur-sm">
                View Project Board
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Freelancer Strategy Section */}
      <section className="py-24 relative px-6">
        <div className="container mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-16 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-adaptiv-orange/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-comfortaa font-bold text-white mb-8">
                  The Freelance <br /><span className="text-adaptiv-orange">Strategy</span>
                </h2>
                <p className="text-lg text-gray-400 font-poppins mb-12 leading-relaxed">
                  After years of leading public sector health innovations and AI research at AdaptivConcept NPC, 
                  I am opening my expertise to help teams build scalable, automated futures.
                </p>
                
                <div className="space-y-8">
                  {[
                    { icon: <Terminal size={24} />, title: "Automation & LLM Dev", desc: "Custom RAG pipelines and workload optimization." },
                    { icon: <Cpu size={24} />, title: "Fullstack Architecture", desc: "React/Node/Laravel enterprise systems." },
                    { icon: <Rocket size={24} />, title: "Experimental 3D", desc: "Three.js and WebGL integration for products." }
                  ].map((service, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-adaptiv-orange/10 flex items-center justify-center text-adaptiv-orange group-hover:scale-110 group-hover:bg-adaptiv-orange group-hover:text-white transition-all">
                        {service.icon}
                      </div>
                      <div>
                        <h6 className="text-xl font-bold text-white mb-2">{service.title}</h6>
                        <p className="text-gray-400">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="aspect-square rounded-[40px] bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
                  <span className="material-icons-round text-white/20 text-[200px] select-none">
                    psychology
                  </span>
                  {/* Decorative element */}
                  <div className="absolute inset-0 bg-adaptiv-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[40px]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Showcase Grid */}
      <section className="py-24 px-6 mb-20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-2xl text-center md:text-left">
              <h3 className="text-4xl md:text-5xl font-comfortaa font-bold text-white mb-4">Latest Projects</h3>
              <p className="text-xl text-gray-400">Selection of high-impact engineering work</p>
            </div>
            <button className="group flex items-center gap-2 text-adaptiv-orange font-bold text-lg hover:text-white transition-colors">
               View All <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {heroProjects.map((project, idx) => (
              <motion.div 
                key={project.id}
                whileHover={{ y: -12 }}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col h-full transition-all hover:bg-white/[0.08] hover:border-white/20"
              >
                <div className="flex justify-between items-start mb-8">
                  <span className="px-4 py-1.5 rounded-lg bg-adaptiv-orange/10 text-adaptiv-orange text-sm font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                  <div className="flex gap-3">
                    <a 
                      href={project.github} 
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-adaptiv-orange hover:border-adaptiv-orange transition-all"
                      title="View Source"
                    >
                      <i className="bi bi-github"></i>
                    </a>
                    <a 
                      href={project.live} 
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-adaptiv-orange hover:border-adaptiv-orange transition-all"
                      title="Live Demo"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
                
                <h4 className="text-2xl font-comfortaa font-bold text-white mb-4 group-hover:text-adaptiv-orange transition-colors">
                  {project.title}
                </h4>
                
                <p className="text-gray-400 line-clamp-3 mb-8 flex-grow">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-500 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button className="w-full py-3 rounded-xl border border-white/10 text-white font-bold group-hover:border-adaptiv-orange group-hover:bg-adaptiv-orange transition-all">
                  Read Detailed Story
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
