import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Globe, Info } from 'lucide-react';
import projectsData from '../data/projects.json';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectsData.find(p => p.id === id);

  if (!project) {
    return (
      <div className="container mx-auto px-6 py-20 text-center min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-4xl font-comfortaa font-bold text-white mb-6">Project Not Found</h2>
        <Link to="/projects" className="px-8 py-3 bg-adaptiv-orange text-white rounded-xl font-bold hover:bg-white hover:text-adaptiv-orange transition-all">
          Back to Board
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="container mx-auto px-6 py-10 md:py-24 min-h-screen"
      style={{paddingTop:"120px"}}
    >
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 font-medium"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Projects
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Project Visual Section */}
        <div className="lg:col-span-7">
          <div className="glass-theme rounded-[24px] md:rounded-[40px] overflow-hidden relative group aspect-video lg:aspect-auto lg:h-[500px]">
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/40">
              <div className="text-center">
                 <div className="text-adaptiv-orange mb-6 flex justify-center">
                    <span className="material-icons-round text-[120px] select-none">
                      {project.category === 'Game Dev' ? 'sports_esports' : 
                       project.category === 'Automation' ? 'terminal' : 'layers'}
                    </span>
                 </div>
                 <h2 className="text-xl md:text-3xl font-comfortaa font-bold text-white/50">{project.title}</h2>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black/80 to-transparent">
               <div className="flex flex-wrap gap-3">
                 {project.tags.map(tag => (
                   <span key={tag} className="px-4 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest">
                     {tag}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Project Meta Section */}
        <div className="lg:col-span-5">
          <div className="glass-theme rounded-[24px] md:rounded-[40px] p-6 md:p-10 h-full flex flex-col group relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-adaptiv-orange/5 blur-[80px] rounded-full -mr-24 -mt-24 group-hover:bg-adaptiv-orange/10 transition-colors"></div>

            <span className="inline-block px-4 py-1.5 rounded-full bg-adaptiv-orange/10 text-adaptiv-orange text-xs font-black tracking-widest mb-6">
              {project.category.toUpperCase()}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-comfortaa font-bold text-white mb-8 leading-tight">
              {project.title}
            </h1>
            
            <p className="text-base md:text-lg text-gray-400 font-poppins mb-10 leading-relaxed">
              {project.description}
            </p>

            <div className="space-y-4 mt-auto">
              <div className="flex flex-wrap gap-4 mb-6">
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-grow py-3.5 rounded-xl bg-adaptiv-orange text-white font-bold flex items-center justify-center gap-3 hover:bg-white hover:text-adaptiv-orange transition-all shadow-lg shadow-adaptiv-orange/10"
                >
                  <i className="bi bi-github text-xl"></i> View Repository
                </a>
                <a 
                  href="#" 
                  className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                >
                  <Globe size={20} /> Project Link
                </a>
              </div>
              <button className="w-full py-3.5 rounded-xl border border-white/5 bg-white/5 text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-all">
                Request Full Documentation
              </button>
            </div>
          </div>
        </div>

        {/* Deep Dive Content Section */}
        <div className="lg:col-span-12">
          <div className="glass-theme rounded-[24px] md:rounded-[40px] p-6 md:p-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-adaptiv-orange/10 flex items-center justify-center text-adaptiv-orange">
                <Info size={28} />
              </div>
              <h3 className="text-xl md:text-3xl font-comfortaa font-bold text-white">Project Deep Dive</h3>
            </div>
            
            <div className="w-full h-px bg-white/5 mb-12"></div>
            
            <div className="max-w-4xl text-gray-400 leading-[2] text-base md:text-lg font-poppins">
              <p className="mb-10 first-letter:text-6xl md:first-letter:text-5xl first-letter:font-bold first-letter:font-grindy first-letter:italic first-letter:text-adaptiv-orange first-letter:mr-3 first-letter:float-left first-letter:[text-shadow:3px_3px_0px_rgba(0,0,0,0.8)]">
                {project.detailedStory}
              </p>
              
              <p className="mb-10 text-white/70">
                This project focuses on the intersection of user experience and technical efficiency. By leveraging modern frameworks 
                and performance-first architecture, we achieve seamless interactivity without compromising on the robustness 
                required for professional applications.
              </p>

              <div className="glass-theme border-l-4 !border-theme-accent p-6 md:p-8 rounded-r-2xl md:rounded-r-3xl mb-12">
                <h5 className="text-white text-xl font-bold mb-6">Impact & Key Outcomes</h5>
                <ul className="space-y-4 list-none p-0 m-0">
                  {[
                    "Optimized rendering pipeline for heterogeneous hardware environments.",
                    "Modular architecture designed for long-term maintainability.",
                    "Strategic integration of AI to augment human workflows."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-adaptiv-orange flex-shrink-0"></div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
