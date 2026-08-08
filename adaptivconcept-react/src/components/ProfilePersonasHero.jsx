import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const personas = [
  {
    id: 1,
    src: "/media/my-profile-pic-microsoft-original.png",
    label: "Professional Systems Developer",
    description: "Reliable systems delivery grounded in enterprise architecture, thoughtful engineering patterns, and maintainable implementation.",
  },
  {
    id: 2,
    src: "/media/my-profile-pic-microsoft-vector.png",
    label: "A Corporate Vector",
    description: "A strategic view of digital transformation, translating organisational goals into clear technical direction.",
  },
  {
    id: 3,
    src: "/media/my-profile-pic-github.jpg",
    label: "Seasoned Developer",
    description: "A practical builder focused on the details that make products resilient, useful, and ready for real teams.",
  },
  {
    id: 4,
    src: "/media/my-profile-pic-github-vector.png",
    label: "A Tech Vector",
    description: "An experimental lens on open source, local AI tooling, and rapid paths from idea to working software.",
  },
];

const getThrownLayouts = () => {
  const isMobile = window.innerWidth < 640;
  const horizontalStep = isMobile ? 22 : 38;
  const verticalStart = isMobile ? 55 : 75;
  const verticalStep = isMobile ? 82 : 105;
  const jitter = isMobile ? 8 : 14;

  return personas.map((persona, index) => ({
    id: persona.id,
    x: -Math.round(horizontalStep * (index + 0.5) + (Math.random() * jitter - jitter / 2)),
    y: Math.round(verticalStart + verticalStep * index + (Math.random() * jitter - jitter / 2)),
    rotate: (index - 1.5) * 7 + (Math.random() * 8 - 4),
    zIndex: personas.length + index,
  }));
};

const ProfilePersonasHero = ({ resetKey }) => {
  const [thrownLayouts, setThrownLayouts] = useState(null);
  const [hoveredPersonaId, setHoveredPersonaId] = useState(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const rootRef = useRef(null);

  const resetStack = () => {
    setHoveredPersonaId(null);
    setSelectedPersonaId(null);
    setThrownLayouts(null);
  };

  useEffect(() => {
    resetStack();
  }, [resetKey]);

  useEffect(() => {
    const handleClickAway = (event) => {
      const hero = rootRef.current?.parentElement;
      const clickedPersona = event.target.closest("[data-profile-persona-card]");

      if (hero?.contains(event.target) && !clickedPersona) {
        resetStack();
      }
    };

    window.addEventListener("click", handleClickAway);
    return () => window.removeEventListener("click", handleClickAway);
  }, []);

  const selectPersona = (event, persona) => {
    event.stopPropagation();
    setThrownLayouts((layouts) => layouts || getThrownLayouts());
    setSelectedPersonaId(persona.id);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectPersona(event, personas.find((persona) => persona.id === Number(event.currentTarget.dataset.personaId)));
    }
  };

  return (
    <div ref={rootRef} className="absolute inset-0 z-20 pointer-events-none" aria-label="Profile personas">
      {personas.map((persona, index) => {
        const thrownLayout = thrownLayouts?.[index];
        const isThrown = Boolean(thrownLayout);
        const isSelected = selectedPersonaId === persona.id;
        const isHovered = hoveredPersonaId === persona.id;
        const centerX = -Math.round(window.innerWidth * 0.36);
        const centerY = Math.max(110, Math.round(window.innerHeight * 0.16));

        return (
          <motion.button
            key={persona.id}
            type="button"
            data-persona-id={persona.id}
            data-profile-persona-card
            aria-label={`Show ${persona.label}`}
            onClick={(event) => selectPersona(event, persona)}
            onKeyDown={handleKeyDown}
            onHoverStart={() => setHoveredPersonaId(persona.id)}
            onHoverEnd={() => setHoveredPersonaId(null)}
            className="absolute w-32 h-44 sm:w-44 sm:h-56 md:w-52 md:h-64 rounded-2xl border-2 border-white bg-white p-2 pb-8 shadow-[0_18px_35px_rgba(0,0,0,0.48)] cursor-pointer touch-manipulation pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            style={{ top: "clamp(6.5rem, 10vw, 8rem)", right: "clamp(1.25rem, 4vw, 2rem)" }}
            initial={false}
            animate={{
              x: isSelected ? centerX : isThrown ? thrownLayout.x : index * 7,
              y: isSelected ? centerY : isThrown ? thrownLayout.y : index * 7,
              rotate: isSelected ? 0 : isThrown ? thrownLayout.rotate : index * -3,
              scale: isSelected ? 1.5 : isThrown ? 0.9 : 1,
              zIndex: isSelected ? 100 : isHovered ? 80 : isThrown ? thrownLayout.zIndex : personas.length - index,
            }}
            transition={{
              type: "spring",
              stiffness: isThrown ? 190 : 270,
              damping: isThrown ? 18 : 24,
              mass: 0.9,
            }}
          >
            <img
              src={persona.src}
              alt={persona.label}
              className={`absolute inset-x-2 top-2 w-[calc(100%-1rem)] rounded-xl object-cover grayscale-[0.25] transition duration-300 ${
                isSelected
                  ? "h-[44%] min-h-[5.5rem] sm:min-h-[6.5rem] md:min-h-[7.5rem]"
                  : "bottom-9"
              }`}
            />
            {isSelected ? (
              <span className="absolute inset-x-3 bottom-3 top-[53%] flex flex-col justify-between text-left text-neutral-800">
                <span>
                  <span className="block text-[9px] font-black uppercase tracking-[0.1em] sm:text-[10px]">
                    {persona.label}
                  </span>
                  <span className="mt-2 block text-[8px] leading-relaxed sm:text-[9px]">
                    {persona.description}
                  </span>
                </span>
                <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                  Click outside to reset
                </span>
              </span>
            ) : (
              <span className="absolute inset-x-2 bottom-2 text-center text-[8px] font-bold uppercase tracking-[0.1em] text-neutral-800 sm:text-[9px]">
                {persona.label}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ProfilePersonasHero;