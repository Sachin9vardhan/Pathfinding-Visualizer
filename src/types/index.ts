export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  previousCell: Cell | null;
  fCost?: number;
  gCost?: number;
  hCost?: number;
}

export type Algorithm = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

export interface AlgorithmResult {
  path: Position[];
  visitedNodes: Position[];
  pathLength: number;
  nodesExplored: number;
  algorithmName: string;
}