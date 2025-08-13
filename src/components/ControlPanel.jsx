import React from 'react';
import { Play, RotateCcw, Eraser, Zap, Target, Compass, Route } from 'lucide-react';

export const ControlPanel = ({
  onRunAlgorithm,
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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pathfinding Visualizer</h2>
        <div className="text-gray-600 text-sm space-y-1">
          <p><strong>Click</strong> empty cells to add/remove walls</p>
          <p><strong>Drag</strong> green/red points to move start/end</p>
          <p><strong>Click & drag</strong> to draw multiple walls</p>
        </div>
      </div>

      {/* Algorithm Buttons */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Choose Algorithm</h3>
        <div className="grid grid-cols-2 gap-3">
          {algorithms.map((algo) => (
            <button
              key={algo.key}
              onClick={() => onRunAlgorithm(algo.key)}
              disabled={isAnimating}
              className={`
                ${algo.color} text-white px-4 py-3 rounded-lg font-medium
                flex items-center justify-center gap-2 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-105 active:scale-95
                ${currentAlgorithm === algo.key ? 'ring-2 ring-offset-2 ring-gray-400' : ''}
              `}
              title={algo.description}
            >
              {algo.icon}
              <span>{algo.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Animation Speed Control */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Animation Speed</h3>
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="100"
            value={animationSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={isAnimating}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Slow</span>
            <span className="font-medium">Speed: {animationSpeed}%</span>
            <span>Fast</span>
          </div>
        </div>
      </div>

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
      </div>

      {/* Algorithm Results */}
      {algorithmResult && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Results</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{algorithmResult.pathLength}</div>
              <div className="text-gray-600">Path Length</div>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{algorithmResult.nodesExplored}</div>
              <div className="text-gray-600">Nodes Explored</div>
            </div>
          </div>
          <div className="text-center pt-2">
            <span className="text-sm font-medium text-gray-700">
              Algorithm: {algorithmResult.algorithmName}
            </span>
          </div>
          {algorithmResult.pathLength === 0 && (
            <div className="text-center text-red-600 text-sm font-medium">
              No path found!
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Legend</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>End</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black rounded border border-gray-300"></div>
            <span>Wall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span>Path</span>
          </div>
        </div>
      </div>

      {isAnimating && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-blue-600">
            <Play className="w-4 h-4 animate-pulse" />
            <span className="font-medium">Running {currentAlgorithm?.toUpperCase()}...</span>
          </div>
        </div>
      )}
    </div>
  );
};