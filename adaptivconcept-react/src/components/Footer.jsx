import React from 'react';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 mt-20 relative z-10 bg-black/80 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Logo & Info */}
          <div className="text-center md:text-left">
            <h5 className="text-xl font-comfortaa font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
              Adaptivconcept FL
            </h5>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              High-performance solutions for technical excellence. <br />
              © {new Date().getFullYear()} All Rights Reserved.
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center gap-6">
            <a href="https://github.com/iarxii" target="_blank" rel="noopener noreferrer" className="group" title="GitHub">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all text-gray-400 group-hover:text-white">
                <i className="bi bi-github text-xl"></i>
              </div>
            </a>
            <a href="https://linkedin.com/in/adaptivconcept" target="_blank" rel="noopener noreferrer" className="group" title="LinkedIn">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all text-gray-400 group-hover:text-white">
                <i className="bi bi-linkedin text-xl"></i>
              </div>
            </a>
            <a href="mailto:contact@adaptivconcept.co.za" className="group" title="Email">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all text-gray-400 group-hover:text-white">
                <Mail size={24} />
              </div>
            </a>
            <a href="https://twitter.com/adaptivconcept" target="_blank" rel="noopener noreferrer" className="group" title="Twitter">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all text-gray-400 group-hover:text-white">
                <i className="bi bi-twitter-x text-xl"></i>
              </div>
            </a>
          </div>

          {/* Tagline */}
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm font-poppins italic">
              Professional integrity in every line of code.
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
