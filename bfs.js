let floorMap = {
  SD: {
    location: [2, 2],
    roomName: 'Block'
  },
  LA: {
    location: [2, 1],
    roomName: 'Block'
  },
  SF: {
    location: [0, 3],
    roomName: '*End*'
  },
  NY: {
    location: [0, 1],
    roomName: 'Block'
  },
  NJ: {
    location: [1, 1],
    roomName: 'Block'
  },
  Lobby: {
    location: [4, 1],
    roomName: 'Block'
  },
  Start: {
    location: [4, 0],
    roomName: 'Start'
  },
  Constraint: {
    location: [1, 3]
  }
};

const grid = createGrid(4, 5, floorMap);
console.log(grid);

const navigation = navigateGrid(
  grid,
  floorMap.Start.location,
  floorMap.SF.location,
  floorMap.Constraint.location
);

console.log(navigation);
/******************************************************************************/
/**
 * createGrid function
 *
 * Creates the grid template based off vertical and horizontal dimensions and
 * loops through an object to find locations and fill in positions for start, end,
 * and barriers
 *
 * @param {integer}  horizontalSize - horizontal size of matrix
 * @param {integer}  verticalSize   - vertical size of matrix
 * @param {object}   gridPositions  - Object representing locations and names of rooms
 *
 * @return {object} Template of the grid
 */
/******************************************************************************/
function createGrid(horizontalSize, verticalSize, gridPositions) {
  const grid = [];
  for (let i = 0; i < verticalSize; i++) {
    grid[i] = [];
    for (let j = 0; j < horizontalSize; j++) {
      grid[i][j] = '     ';
    }
  }

  // Label positions specified in object
  for (position in gridPositions) {
    if (position !== 'Constraint') {
      const x = gridPositions[position].location[0];
      const y = gridPositions[position].location[1];

      grid[x][y] = gridPositions[position].roomName;
    }
  }

  return grid;
}

/******************************************************************************/
/**
 * filterDirections function
 *
 * Takes in the destination point and constraint and creates a new set of directions
 * based off their spatial relation to each other
 * @param {array}  constraint  - Position in relation to the end position
 * @param {array}  end         - Destination in floor plan
 *
 * @return {array} Potential directions to the destination
 */
/******************************************************************************/
function filterDirections(constraint, end) {
  const newDirections = [];
  const directions = [
    [constraint[0] + 1, constraint[1]],
    [constraint[0], constraint[1] + 1],
    [constraint[0] - 1, constraint[1]],
    [constraint[0], constraint[1] - 1]
  ];

  directions.forEach(direction => {
    if (JSON.stringify(end) !== JSON.stringify(direction)) {
      newDirections.push(direction);
    }
  });

  return newDirections;
}

/******************************************************************************/
/**
 * navigateGrid function
 *
 * Uses Breadth First Search to navigate a matrix and return an array of the path travelled
 *
 * @param {Array} floorMap   - Matrix filled with barriers, start, and end
 * @param {Array} start      - Start position
 * @param {Array} end        - Destination
 * @param {Array} constraint - Position relative to end in which you can't enter from
 *
 * @return {Array} Potential path from Start to End
 */
/******************************************************************************/
function navigateGrid(floorMap, start, end, constraint) {
  const queue = [];

  floorMap[start[0]][start[1]] = 1;

  // Store path
  queue.push([start]);

  while (queue.length > 0) {
    // Get the last position from the queue
    const path = queue.shift();
    const position = path[path.length - 1];

    let direction = [
      [position[0] + 1, position[1]],
      [position[0], position[1] + 1],
      [position[0] - 1, position[1]],
      [position[0], position[1] - 1]
    ];

    // Loop throuh each direction according to new position
    for (let i = 0; i < direction.length; i++) {
      // Check if one of the directions is the end and if the
      // current position is equal to the constraint
      if (
        direction[i][0] == end[0] &&
        direction[i][1] == end[1] &&
        JSON.stringify(position) === JSON.stringify(constraint)
      ) {
        // update directions according to the constraint and update queue
        direction = filterDirections(constraint, end);

        floorMap[direction[i][0]][direction[i][1]] = 1;
        queue.push(path.concat([direction[i]]));
        continue;
      } else if (direction[i][0] == end[0] && direction[i][1] == end[1]) {
        // Return path
        return path.concat([end]);
      }
      // Continue if passed the grid size or if blocked by barrier or previous position visited
      if (
        direction[i][0] < 0 ||
        direction[i][0] >= floorMap[0].length ||
        direction[i][1] < 0 ||
        direction[i][1] >= floorMap[0].length ||
        floorMap[direction[i][0]][direction[i][1]] != 0 ||
        floorMap[direction[i][0]][direction[i][1]] === 'Block'
      ) {
        continue;
      }

      floorMap[direction[i][0]][direction[i][1]] = 1;
      // extend and push the path on the queue
      queue.push(path.concat([direction[i]]));
    }
  }
}
