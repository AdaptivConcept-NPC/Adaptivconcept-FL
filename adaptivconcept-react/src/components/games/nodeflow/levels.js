export const LEVELS = [
  {
    id: 1,
    title: "Dijkstra Optimizer",
    instruction: "Find the path from S to T with the lowest total edge cost.",
    type: "shortest_path",
    nodes: [
      { id: "S", label: "S", x: 15, y: 50, type: "source" },
      { id: "A", label: "A", x: 45, y: 20 },
      { id: "B", label: "B", x: 45, y: 80 },
      { id: "C", label: "C", x: 70, y: 50 },
      { id: "T", label: "T", x: 85, y: 50, type: "sink" }
    ],
    edges: [
      { from: "S", to: "A", weight: 3 },
      { from: "S", to: "B", weight: 1 },
      { from: "A", to: "C", weight: 2 },
      { from: "B", to: "C", weight: 5 },
      { from: "A", to: "T", weight: 6 },
      { from: "C", to: "T", weight: 1 }
    ],
    target: ["S", "A", "C", "T"],
    meta: {
      explanation: "Cost of S->A->C->T is 3 + 2 + 1 = 6. S->B->C->T is 1 + 5 + 1 = 7. S->A->T is 3 + 6 = 9. Thus, S->A->C->T is the shortest path."
    }
  },
  {
    id: 2,
    title: "BFS Queue Explorer",
    instruction: "Trace the exact queue visitation sequence of a Breadth-First Search (BFS) algorithm starting from S. Resolve alphabetical ties.",
    type: "bfs_traversal",
    nodes: [
      { id: "S", label: "S", x: 15, y: 50, type: "source" },
      { id: "A", label: "A", x: 40, y: 20 },
      { id: "B", label: "B", x: 40, y: 80 },
      { id: "C", label: "C", x: 65, y: 20 },
      { id: "D", label: "D", x: 65, y: 80 },
      { id: "T", label: "T", x: 85, y: 50, type: "sink" }
    ],
    edges: [
      { from: "S", to: "A" },
      { from: "S", to: "B" },
      { from: "A", to: "C" },
      { from: "A", to: "D" },
      { from: "B", to: "T" }
    ],
    target: ["S", "A", "B", "C", "D", "T"],
    meta: {
      explanation: "Starting from S, visit adjacent nodes A and B (alphabetical order). Then visit neighbors of A (C and D), and then neighbors of B (T). Resulting sequence is S -> A -> B -> C -> D -> T."
    }
  },
  {
    id: 3,
    title: "Capacity Bottleneck Resolver",
    instruction: "Find the route from S to T that has the maximum bottleneck capacity (the capacity of the path is the minimum edge weight along it).",
    type: "max_flow_path",
    nodes: [
      { id: "S", label: "S", x: 15, y: 50, type: "source" },
      { id: "A", label: "A", x: 40, y: 20 },
      { id: "B", label: "B", x: 40, y: 80 },
      { id: "C", label: "C", x: 65, y: 20 },
      { id: "D", label: "D", x: 65, y: 80 },
      { id: "T", label: "T", x: 85, y: 50, type: "sink" }
    ],
    edges: [
      { from: "S", to: "A", weight: 10 },
      { from: "S", to: "B", weight: 4 },
      { from: "A", to: "C", weight: 8 },
      { from: "B", to: "D", weight: 3 },
      { from: "C", to: "T", weight: 6 },
      { from: "D", to: "T", weight: 5 },
      { from: "A", to: "D", weight: 7 }
    ],
    target: ["S", "A", "C", "T"],
    meta: {
      explanation: "S->A->C->T bottleneck is min(10, 8, 6) = 6. S->A->D->T bottleneck is min(10, 7, 5) = 5. S->B->D->T bottleneck is min(4, 3, 5) = 3. The path with max bottleneck capacity is S->A->C->T."
    }
  }
];
