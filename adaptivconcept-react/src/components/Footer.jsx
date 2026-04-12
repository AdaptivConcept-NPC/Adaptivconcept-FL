import React from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-12 mt-20 relative z-10 bg-black/80 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Brand & LinkedIn Card */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-6 group cursor-default">
                  <img
                    src="/media/Adaptiv Media Concept Logo.png"
                    className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                    alt="adaptivconcept fl logo"
                  />
                  <h5 className="text-xl font-comfortaa font-bold text-white tracking-tight">
                    AdaptivConcept <span className="text-adaptiv-orange">FL</span>
                  </h5>
                </div>
                
                <motion.div
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="group relative flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[24px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:border-[#0077b5]/50 transition-all duration-500 max-w-lg w-full overflow-hidden"
                >
                  {/* LinkedIn-branded accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#0077b5]/10 blur-[60px] -mr-10 -mt-10 group-hover:bg-[#0077b5]/20 transition-all duration-700"></div>
                  
                  <div className="relative w-24 h-24 rounded-2xl bg-[#0077b5] flex items-center justify-center text-white border border-[#0077b5]/30 overflow-hidden shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                    <i className="bi bi-linkedin text-5xl"></i>
                    <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0077b5] shadow-sm animate-pulse"></span>
                  </div>

                  <div className="flex-grow z-10 text-center sm:text-left">
                    <div className="flex flex-col">
                      <h6 className="text-2xl font-bold text-white mb-0.5 font-comfortaa">
                        Thabang Mposula
                      </h6>
                      <p className="text-[#0077b5] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Founder & Senior AI Engineer
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                      <a 
                        href="https://www.linkedin.com/in/thabang-mposula-iarxii/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#0077b5] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-white hover:text-[#0077b5] transition-all flex items-center gap-2 shadow-lg"
                      >
                        Profile <ExternalLink size={12} />
                      </a>
                      <a 
                        href="https://www.linkedin.com/company/adaptivconcept-fl" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-white/5 border border-[#0077b5]/30 text-[#0077b5] text-[11px] font-bold uppercase tracking-wider hover:bg-[#0077b5]/10 transition-all flex items-center gap-2"
                      >
                        Company <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 text-[#0077b5] items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <ChevronRight size={20} />
                  </div>
                </motion.div>
                
                <p className="text-gray-400 text-sm leading-relaxed mt-8 mx-auto md:mx-0 font-poppins font-medium opacity-80">
                  Engineering high-performance solutions for technical excellence. <br />
                  <span className="text-xs opacity-60">© {new Date().getFullYear()} AdaptivConcept FL. All Rights Reserved.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Socials & Action */}
          <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
            <div className="flex gap-4">
              {[
                {
                  icon: <i className="bi bi-github text-xl"></i>,
                  href: "https://github.com/iarxii",
                  title: "GitHub",
                },
                {
                  icon: <i className="bi bi-envelope-at text-xl"></i>,
                  href: "mailto:contact@adaptivconcept.co.za",
                  title: "Email",
                },
                {
                  icon: <i className="bi bi-twitter-x text-lg"></i>,
                  href: "https://twitter.com/adaptivconcept",
                  title: "Twitter",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-adaptiv-orange hover:text-white hover:border-adaptiv-orange hover:-translate-y-1 transition-all duration-300 shadow-xl"
                  title={social.title}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-xs font-poppins italic max-w-[200px] border-r-2 border-adaptiv-orange pr-4 py-1">
              "Professional integrity in every line of code."
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-white:hover {
          color: white !important;
          transform: translateY(-3px);
        }
        .text-primary-accent {
          color: var(--primary);
        }
        .bg-primary-accent {
          background-color: var(--primary);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
