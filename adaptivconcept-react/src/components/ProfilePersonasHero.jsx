import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

const personas = [
//   {
//     id: 1,
//     src: "/media/profile_images/" + encodeURIComponent("thabang_mp (2).jpg"),
//     label: "Professional Systems Developer",
//     description:
//       "Reliable systems delivery grounded in enterprise architecture, thoughtful engineering patterns, and maintainable implementation.",
//   },
  {
    id: 2,
    src: "/media/profile_images/" + encodeURIComponent("thabang_mp (4).jpg"),
    label: "The Strategy Vector",
    description:
      "A strategic view of digital transformation, translating organisational goals into clear technical direction.",
  },
  {
    id: 3,
    src: "/media/profile_images/" + encodeURIComponent("thabang_mp (5).jpg"),
    label: "Seasoned Developer",
    description:
      "A practical builder who sweats the details that make products resilient, usable, and ready for real teams.",
  },
//   {
//     id: 4,
//     src: "/media/profile_images/" + encodeURIComponent("thabang_mp (6).jpg"),
//     label: "The Tech Vector",
//     description:
//       "An experimental lens on open source, local AI tooling, and rapid paths from idea to working software.",
//   },
  {
    id: 5,
    src: "/media/profile_images/" + encodeURIComponent("thabang_mp (7).jpg"),
    label: "Cloud & Platform Builder",
    description:
      "Designs dependable cloud foundations, CI/CD pipelines, and platform runtimes that keep delivery fast and safe.",
  },
  {
    id: 6,
    src: "/media/profile_images/" + encodeURIComponent("thabang_mp (10).jpg"),
    label: "Diagnostic Engineer",
    description:
      "A root-cause finder that strips noisy problems down to the essentials and turns them into clean, lasting fixes.",
  },
  {
    id: 7,
    src: "/media/profile_images/" + encodeURIComponent("thabang_mp (11).jpg"),
    label: "AI Experimenter",
    description:
      "Explores local AI tooling and honest novelty, turning what is new into what is genuinely useful.",
  },
  {
    id: 8,
    src: "/media/profile_images/" + encodeURIComponent("thabang_mp (12).jpg"),
    label: "Systems Integrator",
    description:
      "Bridges ERP landscapes and modern products through careful APIs, migrations, and reversible architecture.",
  },
  {
    id: 9,
    src: "/media/profile_images/" + encodeURIComponent("thabang_mp (13).jpg"),
    label: "Team Multiplier",
    description:
      "Raises the whole team through clear patterns, readable code, and mentoring everyone can safely build on.",
  },
  {
    id: 10,
    src: "/media/profile_images/" + encodeURIComponent("thabang_mp (16).jpg"),
    label: "Consulting Mind",
    description:
      "Holds the wider context: stakeholders, trade-offs, and the shortest path from roadmap to shipped outcome.",
  },
  {
    id: 11,
    src: "/media/profile_images/" + encodeURIComponent("thabang_mp (17).jpg"),
    label: "Craft-Focused Coder",
    description:
      "Writes code the next person can trust: named intentions, typed modules, and tests that keep their promises.",
  },
  {
    id: 12,
    src: "/media/profile_images/" + encodeURIComponent("thabang_mp (18).jpg"),
    label: "Fearless Learner",
    description:
      "Constantly picks up new tools and disciplines, and adapts the promising ones into real day-to-day leverage.",
  },
];

const TOTAL = personas.length;

const getDeckMetrics = () => {
  const isMobile = window.innerWidth < 640;
  return {
    isMobile,
    horizontalStep: isMobile ? 6 : 10,
    verticalStep: isMobile ? 8 : 11,
  };
};

const getSlotTarget = (slot) => {
  const { horizontalStep, verticalStep, isMobile } = getDeckMetrics();
  const mid = (TOTAL - 1) / 2;
  return {
    x: -Math.round(slot * horizontalStep),
    y: Math.round(slot * verticalStep),
    rotate: Math.round((slot - mid) * (isMobile ? -0.8 : -1)),
    scale: 1,
    zIndex: TOTAL - slot,
  };
};

const getHoverTarget = (slot) => {
  const target = getSlotTarget(slot);
  const { isMobile } = getDeckMetrics();
  return {
    ...target,
    x: target.x - (isMobile ? 26 : 44),
    y: target.y - (isMobile ? 26 : 18),
    rotate: target.rotate - (isMobile ? 14 : 16),
    scale: isMobile ? 1.08 : 1.05,
    zIndex: TOTAL + 5,
  };
};

const PersonaCard = ({
  persona,
  slot,
  deckActive,
  selected,
  isPivot,
  onSelect,
  onCycleComplete,
}) => {
  const controls = useAnimationControls();
  const buttonRef = useRef(null);
  const flightAbortRef = useRef(0);

  useEffect(() => {
    if (selected) {
      const el = buttonRef.current;
      const rect = el?.getBoundingClientRect();
      if (!rect) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetHeight = vh * 0.7;
      const fit = Math.min(targetHeight / rect.height, (vw * 0.92) / rect.width);
      const vcx = vw / 2;
      const vcy = vh * 0.42;
      const dx = vcx - (rect.left + rect.width / 2);
      const dy = vcy - (rect.top + rect.height / 2);
      controls.start({
        x: dx,
        y: dy,
        rotate: 0,
        scale: fit,
        opacity: 1,
        zIndex: 100,
        transition: { type: "spring", stiffness: 210, damping: 20, mass: 1 },
      });
    } else if (deckActive) {
      const target = getSlotTarget(slot);
      controls.start({
        ...target,
        opacity: 1,
        transition: { type: "spring", stiffness: 180, damping: 22, mass: 0.9 },
      });
    } else {
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        zIndex: 20,
        transition: { duration: 0.25 },
      });
    }
  }, [deckActive, isPivot, selected, slot, controls]);

  useEffect(() => {
    if (!deckActive || selected || !isPivot) return undefined;
    const token = ++flightAbortRef.current;
    const target = getSlotTarget(slot);
    const sx = target.x;
    const sy = target.y;
    const tx = getSlotTarget(0).x;
    const ty = getSlotTarget(0).y;
    const { isMobile } = getDeckMetrics();

    const run = async () => {
      try {
        await controls.start([
          {
            x: sx,
            y: sy,
            rotate: target.rotate,
            scale: 1,
            zIndex: 1,
            transition: { duration: 0.01 },
          },
          {
            x: sx + (isMobile ? 48 : 76),
            y: sy + (isMobile ? 30 : 48),
            rotate: 12,
            scale: 1.12,
            zIndex: 2,
            transition: { duration: 0.42, ease: "easeOut" },
          },
          {
            x: tx - (isMobile ? 40 : 64),
            y: ty - (isMobile ? 34 : 56),
            rotate: -7,
            scale: 1.06,
            zIndex: 60,
            transition: { duration: 0.42, ease: "easeInOut" },
          },
          {
            x: tx,
            y: ty,
            rotate: getSlotTarget(0).rotate,
            scale: 1,
            zIndex: TOTAL,
            transition: { duration: 0.4, ease: "easeInOut" },
          },
        ]);
        if (flightAbortRef.current === token && !selected) {
          onCycleComplete();
        }
      } catch {
        /* aborted */
      }
    };

    run();
    return () => {
      flightAbortRef.current += 1;
    };
  }, [isPivot, deckActive, selected, slot, controls, onCycleComplete]);

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      data-persona-id={persona.id}
      data-profile-persona-card
      aria-label={`Show ${persona.label}`}
      animate={controls}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(persona.id);
      }}
      onHoverStart={() => {
        if (selected) return;
        controls.start({
          ...getHoverTarget(slot),
          transition: { type: "spring", stiffness: 220, damping: 16, mass: 0.8 },
        });
      }}
      onHoverEnd={() => {
        if (selected) return;
        controls.start(getSlotTarget(slot));
      }}
      className="absolute w-32 h-44 sm:w-44 sm:h-56 md:w-52 md:h-64 rounded-2xl border-2 border-white bg-white p-2 pb-8 shadow-[0_18px_35px_rgba(0,0,0,0.48)] cursor-pointer touch-manipulation pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      style={{ top: "clamp(6.5rem, 10vw, 8rem)", right: "clamp(1.25rem, 4vw, 2rem)" }}
    >
      <img
        src={persona.src}
        alt={persona.label}
        className={`absolute inset-0 w-full h-full object-cover rounded-xl p-2 transition duration-300 ${
          selected ? "pb-[47%]" : ""
        }`}
      />
      {selected ? (
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
      ) : null}
    </motion.button>
  );
};

const ProfilePersonasHero = () => {
  const [rotation, setRotation] = useState(0);
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleClickAway = (event) => {
      const hero = rootRef.current?.parentElement;
      const clickedPersona = event.target.closest("[data-profile-persona-card]");
      if (hero?.contains(event.target) && !clickedPersona) {
        setSelectedPersonaId(null);
        setRotation(0);
      }
    };
    window.addEventListener("click", handleClickAway);
    return () => window.removeEventListener("click", handleClickAway);
  }, []);

  const deckActive = selectedPersonaId === null;

  const handleSelect = (id) => {
    setSelectedPersonaId((current) => (current === id ? null : id));
    setRotation(0);
  };

  const handleCycleComplete = useCallback(() => {
    setRotation((r) => (r + 1) % TOTAL);
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 z-20 pointer-events-none" aria-label="Profile personas">
      {personas.map((persona, index) => {
        const slot = (rotation + index) % TOTAL;
        const isPivot = deckActive && slot === TOTAL - 1;
        return (
          <PersonaCard
            key={persona.id}
            persona={persona}
            slot={slot}
            deckActive={deckActive}
            selected={selectedPersonaId === persona.id}
            isPivot={isPivot}
            onSelect={handleSelect}
            onCycleComplete={handleCycleComplete}
          />
        );
      })}
    </div>
  );
};

export default ProfilePersonasHero;