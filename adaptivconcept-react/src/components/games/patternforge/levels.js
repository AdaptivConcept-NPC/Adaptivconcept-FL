export const LEVELS = [
  {
    id: 1,
    title: "Arithmetic Decoupler",
    instruction: "Identify the mathematical rule governing the sequence and supply the missing node.",
    sequenceType: "numeric",
    sequence: ["3", "7", "15", "31", "63", "?"],
    options: ["95", "112", "127", "128", "131"],
    target: "127",
    meta: {
      type: "recursive_doubling",
      explanation: "Each number is calculated by multiplying the previous number by 2 and adding 1: X_n = 2 * X_{n-1} + 1"
    }
  },
  {
    id: 2,
    title: "Rotational Polygon Core",
    instruction: "Decipher the relation between the side count and clockwise rotation angle to select the missing shape.",
    sequenceType: "shapes",
    sequence: [
      { id: "s1", sides: 3, angle: 0, color: "#bc13fe" },    // Triangle pointing up (0 deg)
      { id: "s2", sides: 4, angle: 45, color: "#39ff14" },   // Square rotated 45 deg
      { id: "s3", sides: 5, angle: 90, color: "#00f2ff" },   // Pentagon rotated 90 deg
      { id: "s4", sides: 6, angle: 135, color: "#ff007f" },  // Hexagon rotated 135 deg
      "?"
    ],
    options: [
      { id: "opt_correct", sides: 7, angle: 180, color: "#fd3b12" }, // Correct Heptagon rotated 180 deg
      { id: "opt_err_angle", sides: 7, angle: 90, color: "#bc13fe" },  // Incorrect angle
      { id: "opt_err_sides_8", sides: 8, angle: 180, color: "#39ff14" }, // Incorrect sides (Octagon)
      { id: "opt_err_sides_6", sides: 6, angle: 180, color: "#00f2ff" }  // Incorrect sides (Hexagon)
    ],
    target: { sides: 7, angle: 180, color: "#fd3b12" },
    meta: {
      type: "geometric_rotation",
      explanation: "With each step, the polygon gains 1 side (3->4->5->6->7) and rotates clockwise by 45 degrees (0->45->90->135->180)."
    }
  },
  {
    id: 3,
    title: "Fibonacci Sum Grid",
    instruction: "Analyze the row-wise summation logic of the matrix to determine the missing cell.",
    sequenceType: "matrix",
    matrix: [
      ["2", "3", "5"],
      ["8", "13", "21"],
      ["34", "55", "?"]
    ],
    options: ["79", "83", "89", "91", "99"],
    target: "89",
    meta: {
      type: "matrix_fibonacci",
      explanation: "In each row, the third column is the sum of the first two columns (e.g., 2+3=5, 8+13=21, 34+55=89)."
    }
  }
];
