import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { techApproachData } from '../data/tech-approach';
import { ArrowLeft, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TechWall = () => {
    const { themeColor, currentFont, activeFontFamily, activeFontScale } = useTheme();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 rounded-[32px] md:rounded-[60px]" style={{ marginTop: "200px" }}>
            <div className="max-w-7xl mx-auto">
                {/* Header Area — Glassmorphic Card */}
                <div className="relative mb-16 bg-[#0f0f10]/50 backdrop-blur-md border border-white/10 rounded-[32px] md:rounded-[48px] p-8 md:p-14 overflow-hidden">
                    {/* Ambient glow */}
                    <div 
                        className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full blur-[120px] opacity-15 pointer-events-none"
                        style={{ backgroundColor: themeColor.value }}
                    ></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <button 
                                onClick={() => navigate(-1)}
                                className="group/back flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-all font-poppins px-4 py-2 rounded-full border border-white/5 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-sm"
                            >
                                <ArrowLeft size={18} className="group-hover/back:-translate-x-1 transition-transform" /> 
                                <span className="text-sm font-medium">Back</span>
                            </button>
                            <h1 
                                className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-4"
                                style={{ 
                                    fontFamily: activeFontFamily,
                                    textShadow: '3px 3px 0px rgba(0,0,0,0.5)',
                                    fontSize: `calc(1em * ${activeFontScale})` 
                                }}
                            >
                                Wall of <br />
                                <span style={{ color: themeColor.value }}>Stacked-Tech🔥</span>
                            </h1>
                            <p className="text-xl text-gray-400 font-poppins max-w-2xl leading-relaxed">
                                My unique takes and strategic successes with the technologies that power my development approach.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tech Sections */}
                <div className="space-y-24">
                    {Object.entries(techApproachData).map(([category, data], catIdx) => (
                        <div key={category} className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-grow bg-white/10"></div>
                                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white/40 whitespace-nowrap">
                                    {category}
                                </h2>
                                <div className="h-px flex-grow bg-white/10"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {data.items.map((tech, i) => (
                                    <motion.div
                                        key={tech.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative bg-[#0f0f10]/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500"
                                    >
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="w-16 h-16 rounded-2xl bg-white /5 border border-white/5 flex items-center justify-center p-3 group-hover:scale-110 transition-transform duration-500">
                                                <img 
                                                    src={tech.icon} 
                                                    alt={tech.name} 
                                                    className="w-full h-full object-contain filter drop-shadow-lg"
                                                />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white tracking-tight">
                                                {tech.name}
                                            </h3>
                                        </div>
                                        
                                        <p className="text-gray-400 font-poppins leading-relaxed mb-6">
                                            {tech.approach}
                                        </p>

                                        <div 
                                            className="w-full h-1 rounded-full opacity-30"
                                            style={{ backgroundColor: themeColor.value }}
                                        ></div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Call to Action */}
                <div className="mt-32 p-12 md:p-20 rounded-[40px] md:rounded-[60px] bg-white/[0.03] border border-white/5 text-center relative overflow-hidden group">
                     {/* Subtle glow effect */}
                    <div 
                        className="absolute -top-40 -right-40 w-[400px] h-[400px] blur-[100px] rounded-full opacity-20"
                        style={{ backgroundColor: themeColor.value }}
                    ></div>
                    
                    <Rocket size={48} className="mx-auto mb-8 text-white/20 group-hover:text-white/40 transition-colors" />
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to <span className='text-adaptiv-orange' style={{ color: themeColor.value }}>Build?</span></h2>
                    <p className="text-xl text-gray-400 font-poppins mb-12 max-w-2xl mx-auto">
                        Let's leverage this stacked tech-base to engineer your next strategic advantage.
                    </p>
                    <button 
                        className="px-10 py-5 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-all shadow-xl"
                        style={{ backgroundColor: themeColor.value }}
                        onClick={() => navigate('/projects')}
                    >
                        Initiate Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TechWall;
