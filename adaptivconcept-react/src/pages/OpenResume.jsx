import React from "react";
import { motion } from "framer-motion";
import {
  Download,
  Mail,
  Award,
  BookOpen,
  Briefcase,
  Code2,
  ExternalLink,
  ChevronRight,
  User,
  Rocket,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import githubStats from "../data/github-stats.json";

const OpenResume = () => {
  const { themeColor, activeFontFamily, activeFontScale } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const skills = [
    {
      name: "React (Front-end)",
      id: "react",
      icon: "/icons/icons8-react-shadow/icons8-react-96.png",
    },
    {
      name: "Vanilla PHP",
      id: "php",
      icon: "/icons/icons8-php-shadow/icons8-php-96.png",
    },
    {
      name: "Python Automation",
      id: "python",
      icon: "/icons/icons8-python-shadow/icons8-python-96.png",
    },
    {
      name: "Power BI Analytics",
      id: "power-bi",
      icon: "/icons/icons8-power-bi-2021-windows-11-color/icons8-power-bi-2021-96.png",
    },
    {
      name: "MySQL / SQL Server",
      id: "sql",
      icon: "/icons/icons8-mysql-shadow/icons8-mysql-96.png",
    },
    {
      name: "Laravel Framework",
      id: "laravel",
      icon: "/icons/icons8-react-shadow/icons8-react-96.png",
    },
    {
      name: "Microsoft Azure",
      id: "azure",
      icon: "/icons/icons8-azure-windows-11-color/icons8-azure-96.png",
    },
  ];

  // Component for the dynamic stacked bar
  const StackedTechBar = () => {
    const totalRepos = Object.values(githubStats.skills).reduce(
      (acc, s) => acc + s.repoCount,
      0,
    );
    if (totalRepos === 0) return null;

    return (
      <div className="space-y-3 mb-10">
        <div className="flex justify-between items-end text-xs mb-2">
          <span className="text-low font-bold tracking-widest uppercase">
            Ecosystem Distribution
          </span>
          <div className="text-right">
            <span className="text-high block font-bold">
              {githubStats.overview.total} Total Repos
            </span>
            <span className="text-[10px] text-low opacity-60 uppercase">
              Snapshot: {new Date(githubStats.lastUpdated).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex shadow-inner">
          {Object.entries(githubStats.skills).map(([id, info]) => {
            const percentage = (info.repoCount / totalRepos) * 100;
            if (percentage === 0) return null;
            return (
              <motion.div
                key={id}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "circOut" }}
                className="h-full relative group"
                style={{ backgroundColor: info.color }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </motion.div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
          {Object.entries(githubStats.skills).map(([id, info]) => {
            if (info.repoCount === 0) return null;
            return (
              <div key={id} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: info.color }}
                />
                <span className="text-[10px] text-low font-medium">
                  {info.name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-6 py-20 min-h-screen rounded-[32px] md:rounded-[60px] glass-theme"
      style={{ marginTop: "120px" }}
    >
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <div className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
            {/* <User size={48} style={{ color: themeColor.value }} /> */}
            <img
              src="/media/my-profile-pic-linkedin.jpg"
              alt="LinkedIn Profile Picture - Thabang Mposula"
              className="w-48 h-48 rounded-full"
            />
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold text-high tracking-tighter"
            style={{
              fontFamily: activeFontFamily,
            }}
          >
            Thabang{" "}
            <span
              style={{
                color: themeColor.value,
                WebkitTextStroke:
                  themeColor.washType === "coal"
                    ? "1px #ffffff"
                    : themeColor.washType === "light"
                      ? "1px #000000"
                      : "none",
              }}
            >
              Mposula
            </span>
          </h1>
          <p className="text-xl md:text-3xl text-low font-comfortaa">
            Senior ICT Systems Developer & Digital Architect
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-low pt-4">
            <a
              href="mailto:thabang.mposula@outlook.com"
              className="flex items-center gap-2 hover:text-high transition-colors"
            >
              <Mail size={18} /> thabang.mposula@outlook.com
            </a>
            <a
              href="https://github.com/iarxii"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-high transition-colors"
            >
              <i className="bi bi-github text-lg"></i> github.com/iarxii
            </a>
            <a
              href="https://www.linkedin.com/in/thabang-mposula-iarxii/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-high transition-colors"
            >
              <i className="bi bi-linkedin text-lg"></i> LinkedIn Profile
            </a>
          </div>
        </motion.div>

        {/* Professional Objective */}
        <motion.div
          variants={itemVariants}
          className="glass-theme border border-theme rounded-[32px] p-8 md:p-12 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Rocket size={120} style={{ color: themeColor.value }} />
          </div>
          <h2 className="text-2xl font-bold text-high mb-6 flex items-center gap-3">
            <Rocket size={24} style={{ color: themeColor.value }} />{" "}
            Professional Objective
          </h2>
          <p className="text-lg md:text-xl text-mid leading-relaxed font-poppins">
            Dedicated and result-oriented developer seeking to enhance
            professional skills and capabilities within an Information
            Technology organization. Committed to leveraging technical expertise
            in Agentic AI Engineering, digital architecture, and data analysis
            to solve complex challenges and drive organizational growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Experience Section */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-high mb-8 flex items-center gap-3">
                <Briefcase size={28} style={{ color: themeColor.value }} />{" "}
                Professional Journey
              </h2>
              <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-theme before:opacity-10">
                {[
                  {
                    title: "ICT Systems Developer",
                    org: "Gauteng Department of Health (Head Office)",
                    period: "May 2024 – Present",
                    points: [
                      "Architecting internal applications using custom stacks and Power Platform.",
                      "Streamlining processes through BI analysis and advanced automation.",
                      "Managing provincial health system user administration.",
                    ],
                  },
                  {
                    title: "QA Admin Clerk / MIS System Engineer",
                    org: "Gauteng Department of Health (Head Office)",
                    period: "June 2017 – May 2024",
                    points: [
                      "Engineered and managed Directorate Management Information Systems.",
                      "Developed insights from patient data via visualization systems.",
                      "Provided technical oversight for provincial health data administration.",
                    ],
                  },
                  {
                    title: "ICT Intern",
                    org: "Chris Hani Baragwanath Academic Hospital",
                    period: "May 2016 – June 2017",
                    points: [
                      "Hardware/Software troubleshooting and Active Directory management.",
                      "Contributed to local software development initiatives.",
                      "Database administration for hospital systems.",
                    ],
                  },
                ].map((exp, idx) => (
                  <div key={idx} className="relative pl-12 group">
                    <div
                      className="absolute left-0 top-1.5 w-9 h-9 rounded-full bg-[#0f0f10] border-2 border-white/10 flex items-center justify-center group-hover:border-white transition-colors"
                      style={{
                        borderColor: idx === 0 ? themeColor.value : undefined,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            idx === 0
                              ? themeColor.value
                              : "rgba(255,255,255,0.4)",
                        }}
                      ></div>
                    </div>
                    <div className="bg-white/[0.02] border border-theme p-6 rounded-2xl group-hover:bg-white/[0.05] transition-all">
                      <h3 className="text-xl font-bold text-high">
                        {exp.title}
                      </h3>
                      <p
                        className="text-sm font-semibold opacity-70 mb-4"
                        style={{ color: themeColor.value }}
                      >
                        {exp.org} | {exp.period}
                      </p>
                      <ul className="space-y-2">
                        {exp.points.map((p, i) => (
                          <li
                            key={i}
                            className="text-low text-sm flex items-start gap-2"
                          >
                            <ChevronRight
                              size={14}
                              className="mt-1 flex-shrink-0"
                              style={{ color: themeColor.value }}
                            />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar: Skills & Education */}
          <div className="space-y-12">
            {/* Skills */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-2xl font-bold text-high flex items-center gap-3">
                <Code2 size={24} style={{ color: themeColor.value }} />{" "}
                Inventory Stats
              </h2>

              <StackedTechBar />

              <div className="space-y-4">
                {skills.map((skill) => {
                  const stat = githubStats.skills[skill.id] || {
                    repoCount: 0,
                    forkCount: 0,
                  };
                  const sourceCount = stat.repoCount - stat.forkCount;
                  const total = githubStats.overview.total || 1;
                  const percentage = (stat.repoCount / total) * 100;

                  return (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-end text-sm">
                        <div className="flex flex-col">
                          <span className="text-mid font-bold">
                            {skill.name}
                          </span>
                          <span className="text-[10px] text-low opacity-60 uppercase">
                            {sourceCount} Source • {stat.forkCount} Forks
                          </span>
                        </div>
                        <span
                          className="text-high font-black text-lg"
                          style={{ color: themeColor.value }}
                        >
                          {stat.repoCount}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.max(percentage, 5)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: stat.color || themeColor.value,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={itemVariants} className="space-y-6 pt-6">
              <h2 className="text-2xl font-bold text-high flex items-center gap-3">
                <Award size={24} style={{ color: themeColor.value }} />{" "}
                Distinctions
              </h2>
              <div className="space-y-4">
                {[
                  "Innovator of the Year (Premiers Gold Award)",
                  "MEC's Special Award (Khanyisa Awards)",
                ].map((award, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-blend-soft-light border border-theme flex items-center gap-4 group hover:bg-white/[0.08] transition-all"
                  >
                    <Award
                      size={20}
                      className="flex-shrink-0"
                      style={{ color: themeColor.value }}
                    />
                    <span className="text-sm text-low leading-tight group-hover:text-high transition-colors">
                      {award}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div variants={itemVariants} className="space-y-6 pt-6">
              <h2 className="text-2xl font-bold text-high flex items-center gap-3">
                <BookOpen size={24} style={{ color: themeColor.value }} />{" "}
                Credentials
              </h2>
              <div className="space-y-4">
                {[
                  { name: "Diploma in Systems Development", year: "2022" },
                  { name: "NC(V) Information Technology", year: "2015" },
                  { name: "Matric / Grade 12", year: "2012" },
                ].map((edu, i) => (
                  <div
                    key={i}
                    className="pl-4 border-l-2 border-theme opacity-30 py-1"
                  >
                    <p className="text-sm font-bold text-high">{edu.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-low">
                      {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Call to Action */}
        <motion.div
          variants={itemVariants}
          className="pt-10 flex flex-col items-center gap-6"
        >
          <div className="h-px w-24 bg-theme opacity-10"></div>
          <button
            className="group flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-black font-bold text-xl hover:scale-105 transition-all shadow-2xl"
            style={{ boxShadow: `0 15px 40px -10px ${themeColor.value}80` }}
            onClick={() => window.open("/cv-public.pdf", "_blank")}
          >
            <Download size={24} /> Request full CV (PDF Version)
          </button>
          <p className="text-low text-sm font-poppins">
            References available upon request
          </p>
        </motion.div>
      </div>

      {/* Floating Action Button for Contact */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white z-50 overflow-hidden"
        style={{ backgroundColor: themeColor.value }}
        onClick={() => {
          const contactSection = document.getElementById("contact");
          if (contactSection)
            contactSection.scrollIntoView({ behavior: "smooth" });
          else window.location.href = "/#contact";
        }}
      >
        <Mail size={28} />
      </motion.button>
    </motion.div>
  );
};

export default OpenResume;
