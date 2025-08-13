import React from 'react';
import { GridCell } from './GridCell.jsx';

export const Grid = ({
  grid = [],
  onCellClick = () => {},
  onCellMouseDown = () => {},
  onCellMouseEnter = () => {},
  onCellMouseUp = () => {},  // This is the correct prop name
  currentAlgorithm = null
}) => {
  if (!grid || grid.length === 0) {
    return <div>No grid data available</div>;
  }

  const columns = grid[0]?.length || 50;
  const rows = grid.length;

  return (
    <div className="inline-block border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
      <div 
        className="grid gap-0 select-none"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
        }}
        onMouseLeave={onCellMouseUp}  // Fixed: using the correct prop name
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (!cell) return null;
            
            return (
              <GridCell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                onClick={() => onCellClick(rowIndex, colIndex)}
                onMouseDown={() => onCellMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => onCellMouseEnter(rowIndex, colIndex)}
                onMouseUp={onCellMouseUp}  // Passing the prop correctly
                currentAlgorithm={currentAlgorithm}
              />
            );
          })
        )}
      </div>
    </div>
  );
};