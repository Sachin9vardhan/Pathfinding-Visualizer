import { useState, useCallback, useRef } from 'react';
import { PathfindingAlgorithms } from '../utils/pathfinding';

const ROWS = 20;
const COLS = 50;

export const usePathfinding = () => {
  const [grid, setGrid] = useState(() => createInitialGrid());
  const [startPos, setStartPos] = useState({ row: 10, col: 5 });
  const [endPos, setEndPos] = useState({ row: 10, col: 44 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [stopRequested, setStopRequested] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
  const [algorithmResult, setAlgorithmResult] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(50);

  // Store timeouts so we can clear them when stopping
  const timeoutsRef = useRef([]);

  function createInitialGrid() {
    const grid = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push({
          row,
          col,
          isWall: false,
          isStart: row === 10 && col === 5,
          isEnd: row === 10 && col === 44,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          previousCell: null,
        });
      }
      grid.push(currentRow);
    }
    return grid;
  }

  const resetGrid = useCallback(() => {
    setGrid((prevGrid) => {
      return prevGrid.map(row =>
        row.map(cell => ({
          ...cell,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          previousCell: null,
          fCost: undefined,
          gCost: undefined,
          hCost: undefined,
        }))
      );
    });
    setAlgorithmResult(null);
    setCurrentAlgorithm(null);
  }, []);

  const clearWalls = useCallback(() => {
    setGrid((prevGrid) => {
      return prevGrid.map(row =>
        row.map(cell => ({
          ...cell,
          isWall: false,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          previousCell: null,
        }))
      );
    });
    setAlgorithmResult(null);
    setCurrentAlgorithm(null);
  }, []);

  const toggleWall = useCallback((row, col) => {
    console.log('Toggle wall called for:', row, col);
    if (isAnimating) {
      console.log('Animation in progress, ignoring wall toggle');
      return;
    }
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[row][col];
      if (!cell.isStart && !cell.isEnd) {
        newGrid[row][col].isWall = !cell.isWall;
        // 
        // 
      }
      return newGrid;
    });
  }, [isAnimating]);

  const moveStartOrEnd = useCallback((row, col, isStart) => {
    if (isAnimating || grid[row][col].isWall) return;
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(r => r.map(c => ({ ...c })));
      newGrid.forEach(r => r.forEach(c => {
        if (isStart) c.isStart = false;
        else c.isEnd = false;
      }));
      newGrid[row][col] = {
        ...newGrid[row][col],
        [isStart ? 'isStart' : 'isEnd']: true,
        isWall: false
      };
      return newGrid;
    });
    if (isStart) setStartPos({ row, col });
    else setEndPos({ row, col });
  }, [isAnimating, grid]);

  const animateAlgorithm = useCallback(async (algorithm) => {
    if (isAnimating) return;

    resetGrid();
    setStopRequested(false);
    setIsAnimating(true);
    setCurrentAlgorithm(algorithm);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const pathfinder = new PathfindingAlgorithms(grid);
    let result;

    switch (algorithm) {
      case 'bfs': result = pathfinder.bfs(startPos, endPos); break;
      case 'dfs': result = pathfinder.dfs(startPos, endPos); break;
      case 'dijkstra': result = pathfinder.dijkstra(startPos, endPos); break;
      case 'astar': result = pathfinder.astar(startPos, endPos); break;
      default:
        result = { path: [], visitedNodes: [] };
    }

    setAlgorithmResult(result);

    // Animate visited nodes
    for (let i = 0; i < result.visitedNodes.length; i++) {
      if (stopRequested) break;
      const node = result.visitedNodes[i];
      const t = setTimeout(() => {
        if (!stopRequested) {
          setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            if (!newGrid[node.row][node.col].isStart && !newGrid[node.row][node.col].isEnd) {
              newGrid[node.row][node.col].isVisited = true;
            }
            return newGrid;
          });
        }
      }, i * (101 - animationSpeed));
      timeoutsRef.current.push(t);
    }

    // Animate path
    if (result.path.length > 0) {
      const pathDelay = result.visitedNodes.length * (101 - animationSpeed);
      result.path.forEach((node, index) => {
        const t = setTimeout(() => {
          if (!stopRequested) {
            setGrid((prevGrid) => {
              const newGrid = [...prevGrid];
              if (!newGrid[node.row][node.col].isStart && !newGrid[node.row][node.col].isEnd) {
                newGrid[node.row][node.col].isPath = true;
              }
              return newGrid;
            });
          }
        }, pathDelay + index * 50);
        timeoutsRef.current.push(t);
      });
    }

    const finalDelay = result.path.length > 0
      ? result.visitedNodes.length * (101 - animationSpeed) + result.path.length * 50
      : result.visitedNodes.length * (101 - animationSpeed);

    const endTimeout = setTimeout(() => setIsAnimating(false), finalDelay);
    timeoutsRef.current.push(endTimeout);
  }, [grid, startPos, endPos, isAnimating, animationSpeed, resetGrid, stopRequested]);

  const stopAnimation = useCallback(() => {
    setStopRequested(true);
    setIsAnimating(false);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  return {
    grid,
    startPos,
    endPos,
    isAnimating,
    currentAlgorithm,
    algorithmResult,
    animationSpeed,
    setAnimationSpeed,
    resetGrid,
    clearWalls,
    toggleWall,
    moveStartOrEnd,
    animateAlgorithm,
    stopAnimation
  };
};
