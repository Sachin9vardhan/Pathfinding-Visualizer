import React from 'react';
import { GridCell } from './GridCell.jsx';

export const Grid = ({
  grid = [],
  onCellClick = () => {},
  onCellMouseDown = () => {},
  onCellMouseEnter = () => {},
  onCellMouseUp = () => {},
  currentAlgorithm = null,
  visitedNodes = [],   // NEW: highlight visited
  path = [],            // NEW: highlight best path
  traceProgress = 100   // 👈 new prop for slider value
}) => {
  if (!grid || grid.length === 0) {
    return <div>No grid data available</div>;
  }

  const columns = grid[0]?.length || 50;
  const rows = grid.length;
   
  // --- Trace slicing logic ---
  const totalNodes = visitedNodes.length + path.length;
  const shownCount = Math.floor((traceProgress / 100) * totalNodes);

  const shownVisited = visitedNodes.filter(
  node => !path.some(p => p.row === node.row && p.col === node.col)
  );
  const remaining = Math.max(0, shownCount - visitedNodes.length);
  const shownPath = path;

  // Build quick lookup sets for fast checks
  // const visitedSet = new Set(visitedNodes.map(pos => `${pos.row},${pos.col}`));
  // const pathSet = new Set(path.map(pos => `${pos.row},${pos.col}`));
  const visitedSet = new Set(shownVisited.map(pos => `${pos.row},${pos.col}`));
  const pathSet = new Set(shownPath.map(pos => `${pos.row},${pos.col}`));

  return (
    <div className="inline-block border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
      <div 
        className="grid gap-0 select-none"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
        }}
        onMouseLeave={onCellMouseUp}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (!cell) return null;

            // Determine visualization based on trace state
            let status = '';
            if (pathSet.has(`${rowIndex},${colIndex}`)) {
              status = 'path';        // highlight best path
            } else if (visitedSet.has(`${rowIndex},${colIndex}`)) {
              status = 'visited';     // highlight visited node
            }

            return (
              <GridCell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                status={status} // 👈 pass trace status down
                onClick={() => onCellClick(rowIndex, colIndex)}
                onMouseDown={() => onCellMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => onCellMouseEnter(rowIndex, colIndex)}
                onMouseUp={onCellMouseUp}
                currentAlgorithm={currentAlgorithm}
              />
            );
          })
        )}
      </div>
    </div>
  );
};




// import React from 'react';
// import { GridCell } from './GridCell.jsx';

// export const Grid = ({
//   grid = [],
//   onCellClick = () => {},
//   onCellMouseDown = () => {},
//   onCellMouseEnter = () => {},
//   onCellMouseUp = () => {},  // This is the correct prop name
//   currentAlgorithm = null
// }) => {
//   if (!grid || grid.length === 0) {
//     return <div>No grid data available</div>;
//   }

//   const columns = grid[0]?.length || 50;
//   const rows = grid.length;

//   return (
//     <div className="inline-block border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
//       <div 
//         className="grid gap-0 select-none"
//         style={{ 
//           gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
//           gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
//         }}
//         onMouseLeave={onCellMouseUp}  // Fixed: using the correct prop name
//       >
//         {grid.map((row, rowIndex) =>
//           row.map((cell, colIndex) => {
//             if (!cell) return null;
            
//             return (
//               <GridCell
//                 key={`${rowIndex}-${colIndex}`}
//                 cell={cell}
//                 onClick={() => onCellClick(rowIndex, colIndex)}
//                 onMouseDown={() => onCellMouseDown(rowIndex, colIndex)}
//                 onMouseEnter={() => onCellMouseEnter(rowIndex, colIndex)}
//                 onMouseUp={onCellMouseUp}  // Passing the prop correctly
//                 currentAlgorithm={currentAlgorithm}
//               />
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };