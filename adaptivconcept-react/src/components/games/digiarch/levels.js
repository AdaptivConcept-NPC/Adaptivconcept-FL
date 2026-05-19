export const LEVELS = [
  {
    id: 1,
    title: "Vertical Stack",
    instruction: "Stack all nodes vertically, centered in the container.",
    targetStyle: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    controls: [
      {
        property: "flexDirection",
        label: "flex-direction",
        options: ["row", "column", "row-reverse", "column-reverse"],
      },
      {
        property: "alignItems",
        label: "align-items",
        options: ["flex-start", "center", "flex-end", "stretch"],
      },
    ],
    nodes: 3,
    hint: 'Set flex-direction to "column" and align-items to "center".',
  },
  {
    id: 2,
    title: "Spread Out",
    instruction: "Spread nodes across the row with equal space between them.",
    targetStyle: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    controls: [
      {
        property: "justifyContent",
        label: "justify-content",
        options: [
          "flex-start",
          "center",
          "flex-end",
          "space-between",
          "space-around",
          "space-evenly",
        ],
      },
      {
        property: "alignItems",
        label: "align-items",
        options: ["flex-start", "center", "flex-end", "stretch"],
      },
    ],
    nodes: 4,
    hint: 'Use justify-content: "space-between" and align-items: "center".',
  },
  {
    id: 3,
    title: "Reverse Corner",
    instruction: "Reverse the row order and push everything to the bottom-right.",
    targetStyle: {
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
    controls: [
      {
        property: "flexDirection",
        label: "flex-direction",
        options: ["row", "column", "row-reverse", "column-reverse"],
      },
      {
        property: "justifyContent",
        label: "justify-content",
        options: [
          "flex-start",
          "center",
          "flex-end",
          "space-between",
          "space-around",
        ],
      },
      {
        property: "alignItems",
        label: "align-items",
        options: ["flex-start", "center", "flex-end", "stretch"],
      },
    ],
    nodes: 3,
    hint: 'Set flex-direction: "row-reverse", justify-content: "flex-start", align-items: "flex-end".',
  },
  {
    id: 4,
    title: "Wrap Grid",
    instruction: "Wrap nodes into a 2-row grid, evenly spaced.",
    targetStyle: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    controls: [
      {
        property: "flexWrap",
        label: "flex-wrap",
        options: ["nowrap", "wrap", "wrap-reverse"],
      },
      {
        property: "justifyContent",
        label: "justify-content",
        options: [
          "flex-start",
          "center",
          "flex-end",
          "space-between",
          "space-around",
          "space-evenly",
        ],
      },
      {
        property: "alignItems",
        label: "align-items",
        options: ["flex-start", "center", "flex-end", "stretch"],
      },
    ],
    nodes: 6,
    hint: 'Set flex-wrap: "wrap", justify-content: "space-evenly", align-items: "center".',
  },
];

export const NODE_COLORS = [
  "#39ff14", // Neon Green
  "#00f2ff", // Neon Cyan
  "#fd3b12", // Neon Orange-Red
  "#bc13fe", // Neon Purple
  "#ff3366", // Neon Pink
  "#ffcc00", // Neon Yellow
];
