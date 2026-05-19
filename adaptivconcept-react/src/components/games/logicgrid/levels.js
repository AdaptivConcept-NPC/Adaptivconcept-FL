export const LEVELS = [
  {
    id: 1,
    title: "The Hello World Conflict",
    instruction: "Three developers are working on different languages using different text editors. Match each developer to their language and editor using the clues.",
    N: 3,
    categories: {
      A: { name: "Developers", items: ["Alice", "Bob", "Charlie"] },
      B: { name: "Languages", items: ["Python", "JavaScript", "Rust"] },
      C: { name: "Editors", items: ["VS Code", "NeoVim", "Emacs"] }
    },
    clues: [
      "Alice uses VS Code.",
      "The developer who writes Python does not use Emacs.",
      "Bob writes JavaScript.",
      "Charlie does not write Python.",
      "The Rust developer uses NeoVim."
    ],
    solutions: {
      "Alice": { B: "Python", C: "VS Code" },
      "Bob": { B: "JavaScript", C: "Emacs" },
      "Charlie": { B: "Rust", C: "NeoVim" }
    },
    hint: "Bob writes JavaScript (Clue 3) and Alice uses VS Code (Clue 1). Charlie does not write Python (Clue 4), so Alice must write Python."
  },
  {
    id: 2,
    title: "Database OS Stack",
    instruction: "Four developers are running database setups on different operating systems. Match each developer to their DB and OS.",
    N: 4,
    categories: {
      A: { name: "Developers", items: ["Dave", "Elena", "Frank", "Grace"] },
      B: { name: "Databases", items: ["PostgreSQL", "MongoDB", "Redis", "SQLite"] },
      C: { name: "OS", items: ["Linux", "macOS", "Windows", "FreeBSD"] }
    },
    clues: [
      "Elena uses PostgreSQL on macOS.",
      "The developer using SQLite does not use Windows.",
      "Dave uses Redis but not on Linux.",
      "Grace uses Linux.",
      "Frank uses MongoDB.",
      "The developer using MongoDB uses Windows."
    ],
    solutions: {
      "Dave": { B: "Redis", C: "FreeBSD" },
      "Elena": { B: "PostgreSQL", C: "macOS" },
      "Frank": { B: "MongoDB", C: "Windows" },
      "Grace": { B: "SQLite", C: "Linux" }
    },
    hint: "Elena uses PostgreSQL on macOS (Clue 1) and Grace uses Linux (Clue 4). Since Frank uses MongoDB on Windows (Clue 5 & 6) and Dave uses Redis (Clue 3), Grace must use SQLite."
  },
  {
    id: 3,
    title: "Caffeine & Syntax",
    instruction: "Four languages, four cups of coffee, four programmers. Match the developers to their language and caffeine preference.",
    N: 4,
    categories: {
      A: { name: "Developers", items: ["Alice", "Bob", "Charlie", "David"] },
      B: { name: "Languages", items: ["Python", "Go", "Rust", "Haskell"] },
      C: { name: "Coffee", items: ["Espresso", "Latte", "Americano", "Cortado"] }
    },
    clues: [
      "The Go developer drinks Espresso.",
      "David drinks Cortado.",
      "The Python developer is either Bob or Charlie.",
      "Bob drinks Latte and does not write Rust.",
      "The developer who drinks Americano writes Haskell.",
      "Alice does not write Go."
    ],
    solutions: {
      "Alice": { B: "Haskell", C: "Americano" },
      "Bob": { B: "Python", C: "Latte" },
      "Charlie": { B: "Go", C: "Espresso" },
      "David": { B: "Rust", C: "Cortado" }
    },
    hint: "David drinks Cortado (Clue 2) and Bob drinks Latte (Clue 4). The Go developer drinks Espresso (Clue 1) and the Haskell developer drinks Americano (Clue 5), so Bob and David must write Python and Rust."
  }
];
