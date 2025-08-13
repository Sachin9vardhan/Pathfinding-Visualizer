import { useState, useCallback } from 'react';
import { PathfindingAlgorithms } from '../utils/pathfinding';

const ROWS = 20;
const COLS = 50;

export const usePathfinding = () => {
  const [grid, setGrid] = useState(() => createInitialGrid());
  const [startPos, setStartPos] = useState({ row: 10, col: 5 });
  const [endPos, setEndPos] = useState({ row: 10, col: 44 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
  const [algorithmResult, setAlgorithmResult] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(50);

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
      const newGrid = prevGrid.map(row =>
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
      return newGrid;
    });
    setAlgorithmResult(null);
    setCurrentAlgorithm(null);
  }, []);

  const clearWalls = useCallback(() => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(row =>
        row.map(cell => ({
          ...cell,
          isWall: false,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          previousCell: null,
        }))
      );
      return newGrid;
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
      
      console.log('Cell state:', { isStart: cell.isStart, isEnd: cell.isEnd, isWall: cell.isWall });
      
      if (!cell.isStart && !cell.isEnd) {
        const newWallState = !cell.isWall;
        newGrid[row][col] = { ...cell, isWall: newWallState };
        console.log('Wall toggled to:', newWallState);
      }
      
      return newGrid;
    });
  }, [isAnimating]);

  const moveStartOrEnd = useCallback((row, col, isStart) => {
    if (isAnimating || grid[row][col].isWall) return;

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(r => r.map(c => ({ ...c })));
      
      // Clear previous start/end
      newGrid.forEach(r => r.forEach(c => {
        if (isStart) c.isStart = false;
        else c.isEnd = false;
      }));
      
      // Set new start/end
      newGrid[row][col] = {
        ...newGrid[row][col],
        [isStart ? 'isStart' : 'isEnd']: true,
        isWall: false
      };
      
      return newGrid;
    });

    if (isStart) {
      setStartPos({ row, col });
    } else {
      setEndPos({ row, col });
    }
  }, [isAnimating, grid]);

  const animateAlgorithm = useCallback(async (algorithm) => {
    if (isAnimating) return;

    resetGrid();
    setIsAnimating(true);
    setCurrentAlgorithm(algorithm);

    const pathfinder = new PathfindingAlgorithms(grid);
    let result;

    switch (algorithm) {
      case 'bfs':
        result = pathfinder.bfs(startPos, endPos);
        break;
      case 'dfs':
        result = pathfinder.dfs(startPos, endPos);
        break;
      case 'dijkstra':
        result = pathfinder.dijkstra(startPos, endPos);
        break;
      case 'astar':
        result = pathfinder.astar(startPos, endPos);
        break;
      default:
        result = {
          path: [],
          visitedNodes: [],
          pathLength: 0,
          nodesExplored: 0,
          algorithmName: 'Unknown Algorithm'
        };
    }

    setAlgorithmResult(result);

    // Animate visited nodes
    for (let i = 0; i < result.visitedNodes.length; i++) {
      const node = result.visitedNodes[i];
      
      setTimeout(() => {
        setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          if (!newGrid[node.row][node.col].isStart && !newGrid[node.row][node.col].isEnd) {
            newGrid[node.row][node.col] = {
              ...newGrid[node.row][node.col],
              isVisited: true
            };
          }
          return newGrid;
        });
      }, i * (101 - animationSpeed));
    }

    // Animate path
    if (result.path.length > 0) {
      const pathDelay = result.visitedNodes.length * (101 - animationSpeed);
      
      result.path.forEach((node, index) => {
        setTimeout(() => {
          setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            if (!newGrid[node.row][node.col].isStart && !newGrid[node.row][node.col].isEnd) {
              newGrid[node.row][node.col] = {
                ...newGrid[node.row][node.col],
                isPath: true
              };
            }
            return newGrid;
          });
        }, pathDelay + index * 50);
      });

      setTimeout(() => {
        setIsAnimating(false);
      }, pathDelay + result.path.length * 50);
    } else {
      setTimeout(() => {
        setIsAnimating(false);
      }, result.visitedNodes.length * (101 - animationSpeed));
    }
  }, [grid, startPos, endPos, isAnimating, animationSpeed, resetGrid]);

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
  };
};