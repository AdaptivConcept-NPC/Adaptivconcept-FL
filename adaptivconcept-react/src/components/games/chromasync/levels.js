export const LEVELS = [
  {
    id: 1,
    title: "Direct Vector Alignment",
    instruction: "Align your color mixing deck directly with the target vector.",
    mode: "direct", // Direct color matching
    baseColor: null,
    targets: [
      { name: "Target Vector", H: 135, S: 85, L: 45 }
    ],
    hint: "The target is a rich emerald green. Move the Hue slider to the green band (around 120-140 degrees), pump up the saturation to 80-90%, and set lightness to about 40-50%."
  },
  {
    id: 2,
    title: "Complementary Resonance",
    instruction: "Given the sunset orange base color, mix the exact complementary opposite to stabilize the field.",
    mode: "complementary", // 180 degrees away in Hue
    baseColor: { name: "Sunset Base", H: 15, S: 90, L: 50 },
    targets: [
      { name: "Complementary Opposite", H: 195, S: 90, L: 50 }
    ],
    hint: "Complementary colors lie directly opposite on the color wheel (+180 degrees). With the base color at 15 degrees, your target hue must be 195 degrees (sunset orange vs cool ocean cyan)."
  },
  {
    id: 3,
    title: "Triadic Triad Stabilizer",
    instruction: "Given the neon purple base color, mix the two secondary elements to complete the triadic harmony triad.",
    mode: "triadic", // +120 and +240 degrees away in Hue
    baseColor: { name: "Neon Purple Base", H: 280, S: 80, L: 50 },
    targets: [
      { name: "Triad Vertex A (+120°)", H: 40, S: 80, L: 50 },
      { name: "Triad Vertex B (+240°)", H: 160, S: 80, L: 50 }
    ],
    hint: "Triadic harmonies divide the color wheel into thirds (+120 and +240 degrees). With the base color at 280 degrees, you must mix one color at 40 degrees (280 + 120 = 400 = 40) and the second color at 160 degrees."
  }
];
