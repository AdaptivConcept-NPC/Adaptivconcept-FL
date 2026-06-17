import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Send, 
  MapPin, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { submitToNetlify } from "../utils/form";
import FLFontCarousel from "../components/FLFontCarousel";

const Contact = () => {
  const { themeColor, activeFontFamily, activeFontScale } = useTheme();
  
  const isHighContrast =
    themeColor.washType === "coal" || themeColor.washType === "light";
  const contrastColor = themeColor.washType === "coal" ? "white" : "black";
  const accentColor = isHighContrast ? contrastColor : themeColor.value;

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("submitting");

    submitToNetlify("contact", formState)
      .then(() => {
        setStatus("success");
        setFormState({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-6 relative"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none opacity-5 select-none overflow-hidden">
            <FLFontCarousel size="text-[20vw]" speed={30} />
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-theme text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <span className="w-2 h-2 rounded-full bg-adaptiv-orange animate-pulse"></span>
              Secure Communication Link
            </span>
            <h1 
              className="text-5xl md:text-8xl font-comfortaa font-bold mb-6 tracking-tighter"
              style={{ color: "var(--text-h)" }}
            >
              Initiate <br />
              <span 
                className="italic"
                style={{ 
                  fontFamily: activeFontFamily,
                  color: "var(--heading-color)",
                  textShadow: "var(--heading-shadow)",
                  fontSize: `${activeFontScale}em`,
                  lineHeight: 1
                }}
              >
                Collaboration
              </span>
            </h1>
            <p className="text-lg md:text-xl text-low font-poppins max-w-2xl mx-auto leading-relaxed">
              Have a complex technical challenge or a visionary project? 
              Let's architect the future together.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="glass-card rounded-[40px] p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-adaptiv-orange/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-adaptiv-orange/10 transition-all duration-700"></div>
              
              <h3 className="text-2xl font-bold text-high mb-8 font-comfortaa">Connect Directly</h3>
              
              <div className="space-y-8">
                {[
                  {
                    icon: <Mail className="text-adaptiv-orange" size={24} />,
                    label: "Professional Email",
                    value: "contact@adaptivconcept.co.za",
                    href: "mailto:contact@adaptivconcept.co.za"
                  },
                  {
                    icon: <i className="bi bi-linkedin text-adaptiv-orange text-2xl"></i>,
                    label: "LinkedIn Professional",
                    value: "Thabang Mposula",
                    href: "https://www.linkedin.com/in/thabang-mposula-iarxii/"
                  },
                  {
                    icon: <i className="bi bi-github text-adaptiv-orange text-2xl"></i>,
                    label: "Open Source Lab",
                    value: "iarxii / AdaptivConcept",
                    href: "https://github.com/iarxii"
                  }
                ].map((item, i) => (
                  <a 
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-5 group/item"
                  >
                    <div className="w-14 h-14 rounded-2xl glass-theme flex items-center justify-center shrink-0 transition-all duration-500 group-hover/item:bg-adaptiv-orange/20 group-hover/item:scale-110">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-low uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-high font-medium group-hover/item:text-adaptiv-orange transition-colors">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>


            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="glass-card rounded-[40px] p-10"
            >
              <h3 className="text-2xl font-bold text-high mb-8 font-comfortaa">Availability</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-low">
                  <Clock size={20} className="text-adaptiv-orange" />
                  <span>Monday — Friday, 9AM — 6PM SAST</span>
                </div>
                <div className="flex items-center gap-4 text-low">
                  <MapPin size={20} className="text-adaptiv-orange" />
                  <span>Remote / Global Collaboration</span>
                </div>
                <div className="pt-6 border-t border-theme mt-6">
                  <p className="text-sm italic opacity-70">
                    Typically responding within 24-48 hours for serious technical inquiries.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="glass-card rounded-[40px] md:rounded-[60px] p-8 md:p-16 relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-adaptiv-orange/5 blur-[100px] -ml-32 -mb-32"></div>
              
              <form 
                name="contact" 
                method="POST" 
                data-netlify="true" 
                className="space-y-8 relative z-10"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="contact" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-high uppercase tracking-[0.2em] ml-2">
                      Your Identity
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Full Name / Company"
                        className="w-full bg-white/5 border border-theme rounded-2xl px-6 py-4 text-high placeholder:text-high/20 focus:border-adaptiv-orange/50 transition-all outline-none font-poppins"
                        style={{ backgroundColor: "var(--input-bg)" }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-high uppercase tracking-[0.2em] ml-2">
                      Return Link (Email)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      required
                      placeholder="email@example.com"
                      className="w-full bg-white/5 border border-theme rounded-2xl px-6 py-4 text-high placeholder:text-high/20 focus:border-adaptiv-orange/50 transition-all outline-none font-poppins"
                      style={{ backgroundColor: "var(--input-bg)" }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-high uppercase tracking-[0.2em] ml-2">
                    Mission Objective (Subject)
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="Briefly describe the project or inquiry"
                    className="w-full bg-white/5 border border-theme rounded-2xl px-6 py-4 text-high placeholder:text-high/20 focus:border-adaptiv-orange/50 transition-all outline-none font-poppins"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-high uppercase tracking-[0.2em] ml-2">
                    Briefing Details (Message)
                  </label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="Describe the architectural challenge, goals, and any relevant constraints..."
                    className="w-full bg-white/5 border border-theme rounded-2xl px-6 py-4 text-high placeholder:text-high/20 focus:border-adaptiv-orange/50 transition-all outline-none font-poppins resize-none"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  ></textarea>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === "submitting"}
                    className={`group relative overflow-hidden px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 min-w-[240px] ${
                      status === "submitting" ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    style={{ 
                      backgroundColor: themeColor.value,
                      color: themeColor.washType === "light" ? "#111111" : "#ffffff",
                      boxShadow: `0 20px 40px -10px ${themeColor.value}4d`
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    
                    {status === "idle" && (
                      <>
                        Deploy Transmission <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                    {status === "submitting" && "Transmitting..."}
                    {status === "success" && "Sent Successfully"}
                    {status === "error" && "Error Encountered"}
                  </motion.button>

                  <div className="flex-grow">
                    {status === "success" && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 text-adaptiv-orange font-bold text-sm"
                      >
                        <CheckCircle2 size={18} />
                        Protocol accepted. I'll get back to you shortly.
                      </motion.div>
                    )}
                    {status === "error" && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 text-red-500 font-bold text-sm"
                      >
                        <AlertCircle size={18} />
                        Transmission failed. Please check your link.
                      </motion.div>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="fixed top-0 right-0 w-[50%] h-full -z-10 bg-gradient-to-l from-adaptiv-orange/5 to-transparent pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[30%] h-[30%] -z-10 bg-adaptiv-orange/5 blur-[120px] rounded-full pointer-events-none"></div>
    </motion.div>
  );
};

export default Contact;
