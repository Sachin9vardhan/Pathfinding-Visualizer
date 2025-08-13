import React from 'react';
import { Play, RotateCcw, Eraser, Zap, Target, Compass, Route, Square } from 'lucide-react';

export const ControlPanel = ({
  onRunAlgorithm,
  onStop, // ✅ Added stop handler here
  onReset,
  onClearWalls,
  isAnimating,
  currentAlgorithm,
  algorithmResult,
  animationSpeed,
  onSpeedChange
}) => {
  const algorithms = [
    { 
      key: 'bfs', 
      name: 'BFS', 
      icon: <Target className="w-4 h-4" />, 
      color: 'bg-blue-500 hover:bg-blue-600', 
      description: 'Breadth-First Search - Guarantees shortest path' 
    },
    { 
      key: 'dfs', 
      name: 'DFS', 
      icon: <Compass className="w-4 h-4" />, 
      color: 'bg-purple-500 hover:bg-purple-600', 
      description: 'Depth-First Search - Explores deeply first' 
    },
    { 
      key: 'dijkstra', 
      name: 'Dijkstra', 
      icon: <Route className="w-4 h-4" />, 
      color: 'bg-orange-500 hover:bg-orange-600', 
      description: 'Dijkstra\'s Algorithm - Weighted shortest path' 
    },
    { 
      key: 'astar', 
      name: 'A*', 
      icon: <Zap className="w-4 h-4" />, 
      color: 'bg-emerald-500 hover:bg-emerald-600', 
      description: 'A* Search - Heuristic-based optimal pathfinding' 
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* ... unchanged code above ... */}

      {/* Control Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          disabled={isAnimating}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium
                     flex items-center justify-center gap-2 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={onClearWalls}
          disabled={isAnimating}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium
                     flex items-center justify-center gap-2 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          <Eraser className="w-4 h-4" />
          Clear Walls
        </button>
        <button
          onClick={onStop}
          disabled={!isAnimating}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium
                     flex items-center justify-center gap-2 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          <Square className="w-4 h-4" />
          Stop
        </button>
      </div>

      {/* ... unchanged code below ... */}
    </div>
  );
};
