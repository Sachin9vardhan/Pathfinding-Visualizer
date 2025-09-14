export class PathfindingAlgorithms {
  constructor(grid) {
    this.grid = grid;
    this.rows = grid.length;
    this.cols = grid[0].length;
  }

  getNeighbors(cell) {
    const neighbors = [];
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
    ];

    for (const [dRow, dCol] of directions) {
      const newRow = cell.row + dRow;
      const newCol = cell.col + dCol;

      if (
        newRow >= 0 && newRow < this.rows &&
        newCol >= 0 && newCol < this.cols &&
        !this.grid[newRow][newCol].isWall
      ) {
        neighbors.push(this.grid[newRow][newCol]);
      }
    }

    return neighbors;
  }

  reconstructPath(endCell) {
    const path = [];
    let currentCell = endCell;

    while (currentCell !== null) {
      path.unshift({ row: currentCell.row, col: currentCell.col });
      currentCell = currentCell.previousCell;
    }

    return path;
  }

  resetGrid() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.grid[row][col];
        cell.isVisited = false;
        cell.isPath = false;
        cell.distance = Infinity;
        cell.previousCell = null;
        cell.fCost = undefined;
        cell.gCost = undefined;
        cell.hCost = undefined;
      }
    }
  }

  bfs(startPos, endPos) {
    this.resetGrid();
    
    const startCell = this.grid[startPos.row][startPos.col];
    const endCell = this.grid[endPos.row][endPos.col];
    const visitedNodes = [];
    const queue = [startCell];
    
    startCell.distance = 0;
    startCell.isVisited = true;

    while (queue.length > 0) {
      const currentCell = queue.shift();
      visitedNodes.push({ row: currentCell.row, col: currentCell.col });

      if (currentCell === endCell) {
        const path = this.reconstructPath(endCell);
        return {
          path,
          visitedNodes,
          pathLength: path.length - 1,
          nodesExplored: visitedNodes.length,
          algorithmName: 'Breadth-First Search'
        };
      }

      const neighbors = this.getNeighbors(currentCell);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.isVisited = true;
          neighbor.distance = currentCell.distance + 1;
          neighbor.previousCell = currentCell;
          queue.push(neighbor);
        }
      }
    }

    return {
      path: [],
      visitedNodes,
      pathLength: 0,
      nodesExplored: visitedNodes.length,
      algorithmName: 'Breadth-First Search'
    };
  }

  dfs(startPos, endPos) {
    this.resetGrid();
    
    const startCell = this.grid[startPos.row][startPos.col];
    const endCell = this.grid[endPos.row][endPos.col];
    const visitedNodes = [];
    const stack = [startCell];
    
    startCell.isVisited = true;

    while (stack.length > 0) {
      const currentCell = stack.pop();
      visitedNodes.push({ row: currentCell.row, col: currentCell.col });

      if (currentCell === endCell) {
        const path = this.reconstructPath(endCell);
        return {
          path,
          visitedNodes,
          pathLength: path.length - 1,
          nodesExplored: visitedNodes.length,
          algorithmName: 'Depth-First Search'
        };
      }

      const neighbors = this.getNeighbors(currentCell);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.isVisited = true;
          neighbor.previousCell = currentCell;
          stack.push(neighbor);
        }
      }
    }

    return {
      path: [],
      visitedNodes,
      pathLength: 0,
      nodesExplored: visitedNodes.length,
      algorithmName: 'Depth-First Search'
    };
  }

  dijkstra(startPos, endPos) {
    this.resetGrid();
    
    const startCell = this.grid[startPos.row][startPos.col];
    const endCell = this.grid[endPos.row][endPos.col];
    const visitedNodes = [];
    const unvisitedNodes = [];

    // Initialize all cells
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.grid[row][col];
        if (!cell.isWall) {
          unvisitedNodes.push(cell);
        }
      }
    }

    startCell.distance = 0;

    while (unvisitedNodes.length > 0) {
      // Sort by distance and get the closest node
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const currentCell = unvisitedNodes.shift();
      
      if (currentCell.distance === Infinity) break;
      
      currentCell.isVisited = true;
      visitedNodes.push({ row: currentCell.row, col: currentCell.col });

      if (currentCell === endCell) {
        const path = this.reconstructPath(endCell);
        return {
          path,
          visitedNodes,
          pathLength: path.length - 1,
          nodesExplored: visitedNodes.length,
          algorithmName: 'Dijkstra\'s Algorithm'
        };
      }

      const neighbors = this.getNeighbors(currentCell);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          const distance = currentCell.distance + 1;
          if (distance < neighbor.distance) {
            neighbor.distance = distance;
            neighbor.previousCell = currentCell;
          }
        }
      }
    }

    return {
      path: [],
      visitedNodes,
      pathLength: 0,
      nodesExplored: visitedNodes.length,
      algorithmName: 'Dijkstra\'s Algorithm'
    };
  }

  manhattanDistance(pos1, pos2) {
    return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
  }

  astar(startPos, endPos) {
    this.resetGrid();
    
    const startCell = this.grid[startPos.row][startPos.col];
    const endCell = this.grid[endPos.row][endPos.col];
    const visitedNodes = [];
    const openSet = [startCell];
    const closedSet = new Set();

    startCell.gCost = 0;
    startCell.hCost = this.manhattanDistance(startPos, endPos);
    startCell.fCost = startCell.gCost + startCell.hCost;

    while (openSet.length > 0) {
      // Get node with lowest fCost
      openSet.sort((a, b) => (a.fCost || 0) - (b.fCost || 0));
      const currentCell = openSet.shift();
      
      closedSet.add(currentCell);
      visitedNodes.push({ row: currentCell.row, col: currentCell.col });

      if (currentCell === endCell) {
        const path = this.reconstructPath(endCell);
        return {
          path,
          visitedNodes,
          pathLength: path.length - 1,
          nodesExplored: visitedNodes.length,
          algorithmName: 'A* Search'
        };
      }

      const neighbors = this.getNeighbors(currentCell);
      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor)) continue;

        const tentativeGCost = (currentCell.gCost || 0) + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (tentativeGCost >= (neighbor.gCost || 0)) {
          continue;
        }

        neighbor.previousCell = currentCell;
        neighbor.gCost = tentativeGCost;
        neighbor.hCost = this.manhattanDistance(
          { row: neighbor.row, col: neighbor.col },
          endPos
        );
        neighbor.fCost = neighbor.gCost + neighbor.hCost;
      }
    }

    return {
      path: [],
      visitedNodes,
      pathLength: 0,
      nodesExplored: visitedNodes.length,
      algorithmName: 'A* Search'
    };
  }
}