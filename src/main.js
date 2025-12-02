import { generateMaze, editMaze, loadMazeFromFile } from './maze_generator.js';
import { bfsSequential, dfsSequential, dijkstraSequential, aStarSequential } from './sequential_algorithms.js';
import { bfsParallel, dfsParallel, dijkstraParallel, aStarParallel } from './parallel_algorithms.js';
import { syncLocalFrontier, syncGlobalBestNode, syncGoalFound } from './synchronization.js';
import { visualizeMaze, animateAlgorithm } from './visualizer.js';
import { showStats, compareAlgorithms } from './comparison.js';

const mazeChoice = document.getElementById('maze-choice');
const algorithmChoice = document.getElementById('algorithm-choice');
const modeChoice = document.getElementById('mode-choice');
const startBtn = document.getElementById('start-btn');
const visualizationDiv = document.getElementById('visualization');
const comparisonDiv = document.getElementById('comparison');

let maze = null;
let result = null;

startBtn.onclick = async () => {
  // Step 1: Maze setup
  if (mazeChoice.value === 'random') {
    maze = generateMaze(20, 20); // Example size
  } else if (mazeChoice.value === 'upload') {
    // ...handle file upload
  } else if (mazeChoice.value === 'draw') {
    // ...handle manual drawing
  }
  visualizeMaze(maze, { container: visualizationDiv });

  // Step 2: Algorithm selection
  const start = { x: 0, y: 0 };
  const goal = { x: 19, y: 19 };
  let stats = {};
  if (modeChoice.value === 'sequential') {
    if (algorithmChoice.value === 'bfs') {
      result = bfsSequential(maze, start, goal);
    } else if (algorithmChoice.value === 'dfs') {
      result = dfsSequential(maze, start, goal);
    } else if (algorithmChoice.value === 'dijkstra') {
      result = dijkstraSequential(maze, start, goal);
    } else if (algorithmChoice.value === 'astar') {
      result = aStarSequential(maze, start, goal);
    }
  } else {
    if (algorithmChoice.value === 'bfs') {
      result = await bfsParallel(maze, start, goal, { syncLocalFrontier, syncGoalFound });
    } else if (algorithmChoice.value === 'dfs') {
      result = await dfsParallel(maze, start, goal, { syncLocalFrontier, syncGoalFound });
    } else if (algorithmChoice.value === 'dijkstra') {
      result = await dijkstraParallel(maze, start, goal, { syncLocalFrontier, syncGlobalBestNode, syncGoalFound });
    } else if (algorithmChoice.value === 'astar') {
      result = await aStarParallel(maze, start, goal, { syncLocalFrontier, syncGlobalBestNode, syncGoalFound });
    }
  }
  animateAlgorithm(result.steps, { container: visualizationDiv });
  showStats(result.stats);
  compareAlgorithms([result.stats]);
};
