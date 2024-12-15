import { FileReader } from "../utils";

type Position = [number, number];

const directionMap = new Map<string, Position>([
  ["v", [1, 0]],
  ["^", [-1, 0]],
  [">", [0, 1]],
  ["<", [0, -1]],
]);

/**
   Recursively moves the robot and boxes. Can move normal boxes as well as boxes of 2 fields
 */
function attempToMove(
  position: Position,
  direction: string,
  map: string[][]
): Position {
  const [xMove, yMove] = directionMap.get(direction)!;
  const newX: number = position[0] + xMove;
  const newY: number = position[1] + yMove;
  if (map[newX][newY] === "#") return position;

  let canMove: boolean = true;

  if (
    map[newX][newY] === "O" ||
    ((map[newX][newY] === "[" || map[newX][newY] === "]") &&
      (direction === ">" || direction === "<"))
  ) {
    // recursively attemp to move the neighbor. If it works we will also be able to move
    const newBoxPos: Position = attempToMove([newX, newY], direction, map);
    canMove = newBoxPos[0] !== newX || newBoxPos[1] !== newY;
  } else if (map[newX][newY] === "[" || map[newX][newY] === "]") {
    // up and down movement for [] (2 field boxes) are more complex since we only want to move a box if both the left and the right part of the box are movable
    // deep copy the map because we might need to reset moves later.
    const mapCopy: string[][] = map.map(function (arr) {
      return arr.slice();
    });

    // first move the neighbor (aka the other part of the box)
    let neighborY: number;
    if (map[newX][newY] === "[") neighborY = newY + 1;
    else neighborY = newY - 1;

    const newNeighborPos: Position = attempToMove(
      [newX, neighborY],
      direction,
      map
    );
    const canNeighborMove: boolean =
      newNeighborPos[0] !== newX || newNeighborPos[1] !== neighborY;
    canMove = canNeighborMove;

    // if the other part of the box is not movable we dont need to even check if we could move our part
    if (canNeighborMove) {
      const newBoxPos: Position = attempToMove([newX, newY], direction, map);
      canMove = newBoxPos[0] !== newX || newBoxPos[1] !== newY;
      // if the other part of the box was able to move but we are not able to reset the position to the state before the neighbor was moved
      // the reference to the map object needs to stay the same so copy value by value
      if (!canMove) {
        for (let i = 0; i < map.length; i++) {
          for (let j = 0; j < map[0].length; j++) {
            map[i][j] = mapCopy[i][j];
          }
        }
      }
    }
  }

  // swap values of the position to move to and the position we are at
  if (canMove) {
    [map[position[0]][position[1]], map[newX][newY]] = [
      map[newX][newY],
      map[position[0]][position[1]],
    ];
    return [newX, newY];
  }

  return position;
}

/**
  Traverses all moveSequences and calls the recursive move function
 */
function moveRobot(
  startPos: Position,
  moveSeq: string[],
  map: string[][]
): void {
  let position: Position = startPos;
  for (const direction of moveSeq) {
    position = attempToMove(position, direction, map);
  }
}

/**
  Calculates the sum of the GPS coordinates of all boxes on a map
 */
function sumBoxGPS(map: string[][]): number {
  const mapHeight: number = map.length;
  const mapWidth: number = map[0].length;

  let sum: number = 0;
  for (let x = 0; x < mapHeight; x++) {
    for (let y = 0; y < mapWidth; y++) {
      if (map[x][y] === "O" || map[x][y] === "[") sum += x * 100 + y;
    }
  }
  return sum;
}

const mapDescription: string[] = FileReader.ReadRowByRow("input.txt");

let map: string[][] = [];
let bigMap: string[][] = [];
let moveSeq: string[] = [];

let readingMap: boolean = true;
let startPos: Position;
let bigStartPos: Position;

mapDescription.forEach((line, rowIdx) => {
  if (line === "") readingMap = false;
  else if (readingMap) {
    if (line.includes("@")) {
      startPos = [rowIdx, line.indexOf("@")];
      bigStartPos = [rowIdx, 2 * line.indexOf("@")];
    }
    map.push(line.split(""));
    let bigLine: string[] = [];
    for (const char of line) {
      if (char === "@") bigLine = bigLine.concat(["@", "."]);
      else if (char === "O") bigLine = bigLine.concat(["[", "]"]);
      else bigLine = bigLine.concat([char, char]);
    }
    bigMap.push(bigLine);
  } else {
    moveSeq = moveSeq.concat(line.split(""));
  }
});

moveRobot(startPos!, moveSeq, map);
moveRobot(bigStartPos!, moveSeq, bigMap);
console.log(`Part 1 solution: ${sumBoxGPS(map)}`);
console.log(`Part 2 solution: ${sumBoxGPS(bigMap)}`);
