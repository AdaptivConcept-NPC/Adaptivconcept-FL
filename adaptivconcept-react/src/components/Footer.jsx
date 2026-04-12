import React from 'react';
import { Mail, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-12 mt-20 relative z-10 bg-black/80 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Brand & LinkedIn Card */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="text-center md:text-left">
                <h5 className="text-3xl font-comfortaa font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                  Adaptivconcept FL
                </h5>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 font-poppins">
                  High-performance solutions for technical excellence. <br />
                  © {new Date().getFullYear()} All Rights Reserved.
                </p>
              </div>

              {/* Distinct LinkedIn Card */}
              <motion.a 
                href="https://linkedin.com/in/adaptivconcept" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative flex items-center gap-6 p-6 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl hover:border-adaptiv-orange/40 transition-all duration-500 max-w-md w-full"
              >
                <div className="absolute inset-0 bg-adaptiv-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[32px]"></div>
                
                <div className="relative w-20 h-20 rounded-2xl bg-adaptiv-orange/20 flex items-center justify-center text-adaptiv-orange border border-adaptiv-orange/30 overflow-hidden shadow-2xl">
                   <i className="bi bi-linkedin text-4xl"></i>
                   {/* Animated pulse for 'Connected' feel */}
                   <span className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f10] animate-pulse"></span>
                </div>

                <div className="flex-grow">
                  <h6 className="text-xl font-bold text-white mb-1 font-comfortaa">Thabang M.</h6>
                  <p className="text-adaptiv-orange text-xs font-bold uppercase tracking-widest mb-3 opacity-80">Senior AI Engineer</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-poppins whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 line-clamp-1">Digital Architect</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 line-clamp-1">Expert Hub</span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full bg-adaptiv-orange text-white flex items-center justify-center shadow-lg transform group-hover:rotate-45 transition-transform duration-500">
                  <ChevronRight size={24} />
                </div>
              </motion.a>
            </div>
          </div>
          
          {/* Secondary Socials & Action */}
          <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
            <div className="flex gap-4">
              {[
                { icon: <i className="bi bi-github"></i>, href: "https://github.com/iarxii", title: "GitHub" },
                { icon: <Mail size={20} />, href: "mailto:contact@adaptivconcept.co.za", title: "Email" },
                { icon: <i className="bi bi-twitter-x"></i>, href: "https://twitter.com/adaptivconcept", title: "Twitter" }
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-adaptiv-orange hover:text-white hover:border-adaptiv-orange transition-all duration-300" title={social.title}>
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-xs font-poppins italic max-w-[200px]">
              "Professional integrity in every line of code."
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .hover-white:hover { color: white !important; transform: translateY(-3px); }
        .text-primary-accent { color: var(--primary); }
        .bg-primary-accent { background-color: var(--primary); }
      `}</style>
    </footer>
  );
};

export default Footer;
