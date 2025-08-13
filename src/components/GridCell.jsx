import React from 'react';

export const GridCell = ({
  cell,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  currentAlgorithm
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick();
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    onMouseDown();
  };

  const getCellClasses = () => {
    let baseClasses = "w-5 h-5 border border-gray-200 cursor-pointer transition-all duration-200 ease-in-out";
    
    if (cell.isStart) return `${baseClasses} bg-green-500 hover:bg-green-600 shadow-md`;
    if (cell.isEnd) return `${baseClasses} bg-red-500 hover:bg-red-600 shadow-md`;
    if (cell.isWall) return `${baseClasses} bg-black hover:bg-gray-900 border-gray-900`;
    if (cell.isPath) return `${baseClasses} bg-yellow-400 shadow-sm animate-pulse`;
    
    if (cell.isVisited) {
      const algorithmColors = {
        'bfs': 'bg-blue-300',
        'dfs': 'bg-purple-300', 
        'dijkstra': 'bg-orange-300',
        'astar': 'bg-emerald-300'
      };
      
      const colorClass = algorithmColors[currentAlgorithm?.toLowerCase()] || 'bg-blue-300';
      return `${baseClasses} ${colorClass} shadow-sm`;
    }
    
    return `${baseClasses} bg-white hover:bg-gray-50`;
  };

  return (
    <div
      className={getCellClasses()}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
    />
  );
};