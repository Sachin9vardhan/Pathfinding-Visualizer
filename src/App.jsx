import React, { useState, useCallback } from 'react';
// import { Grid } from './components/Grid.jsx';
// import { ControlPanel } from './components/ControlPanel.jsx';
import { usePathfinding } from './hooks/usePathfinding.js';
import { Grid } from './components/Grid';
import { ControlPanel } from "./components/ControlPanel";

function App() {
  const {
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
  } = usePathfinding();

  const [isMousePressed, setIsMousePressed] = useState(false);
  const [dragMode, setDragMode] = useState(null);

  const handleCellMouseDown = useCallback((row, col) => {
    if (isAnimating) return;

    const cell = grid[row][col];
    setIsMousePressed(true);

    if (cell.isStart) {
      setDragMode('start');
    } else if (cell.isEnd) {
      setDragMode('end');
    } else {
      setDragMode('wall');
      toggleWall(row, col);
    }
  }, [isAnimating, grid, toggleWall]);

  const handleCellMouseEnter = useCallback((row, col) => {
    if (!isMousePressed || isAnimating) return;

    if (dragMode === 'wall') {
      toggleWall(row, col);
    } else if (dragMode === 'start') {
      moveStartOrEnd(row, col, true);
    } else if (dragMode === 'end') {
      moveStartOrEnd(row, col, false);
    }
  }, [isMousePressed, isAnimating, dragMode, toggleWall, moveStartOrEnd]);

  const handleCellMouseUp = useCallback(() => {
    setIsMousePressed(false);
    setDragMode(null);
  }, []);

  const handleCellClick = useCallback((row, col) => {
    if (isAnimating) return;
    
    const cell = grid[row][col];
    if (!cell.isStart && !cell.isEnd && !isMousePressed) {
      toggleWall(row, col);
    }
  }, [isAnimating, grid, isMousePressed, toggleWall]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="flex-shrink-0">
            <Grid
              grid={grid}
              onCellClick={handleCellClick}
              onCellMouseDown={handleCellMouseDown}
              onCellMouseEnter={handleCellMouseEnter}
              onCellMouseUp={handleCellMouseUp}
              currentAlgorithm={currentAlgorithm}
            />
          </div>
          
          <div className="w-full lg:w-80 flex-shrink-0">
            <ControlPanel
              onRunAlgorithm={animateAlgorithm}
              onReset={resetGrid}
              onClearWalls={clearWalls}
              isAnimating={isAnimating}
              currentAlgorithm={currentAlgorithm}
              algorithmResult={algorithmResult}
              animationSpeed={animationSpeed}
              onSpeedChange={setAnimationSpeed}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;