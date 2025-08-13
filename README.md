# Pathfinding Visualizer

This is a React-based **Pathfinding Algorithm Visualizer** created as a learning project.  
It allows users to interactively explore how popular pathfinding algorithms work by visualizing their step-by-step execution on a grid.

---

## Features

- **Interactive Grid**
  - Add or remove walls by clicking or dragging.
  - Drag the start or end node to reposition it.
- **Algorithm Visualization**
  - Animates pathfinding algorithms implemented in `usePathfinding.js`.
- **Customizable Speed**
  - Adjust animation speed for better understanding.
- **Grid Management**
  - Reset the grid completely.
  - Clear only walls while keeping start/end positions fixed.
- **Responsive UI**
  - Designed to work on different screen sizes.

---
##Usage
```
Left-click on a cell → Toggle wall.
Click & drag start or end node → Move them.
Click & drag elsewhere → Draw walls.
Use the Control Panel to:
Run the chosen algorithm.
Change animation speed.
Reset or clear the grid.
```
---
## Project Structure
```
Pathfinding-Visualizer/
├── src/
│   ├── components/
│   │   ├── Grid.jsx
│   │   ├── ControlPanel.jsx
│   ├── hooks/
│   │   ├── usePathfinding.js
│   ├── App.jsx
│   ├── index.js
├── public/
│   ├── index.html
├── package.json
└── README.md

```
---

