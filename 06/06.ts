import { FileReader } from "../utils";

type Position = [number, number];
type Direction = "up" | "down" | "left" | "right";

/**
    Checks wheter we are moving in a loop
 */
function checkLoop(
  obsPositions: Set<string>,
  startPos: Position,
  startDirection: Direction,
  mapHeight: number,
  mapWidth: number
) {
  let pos = startPos;
  let direction = startDirection;
  let visitedDirection = new Map<string, Set<string>>();

  while (true) {
    const posKey = `${pos[0]}|${pos[1]}`;
    if (visitedDirection.has(posKey)) {
      if (visitedDirection.get(posKey)?.has(direction)) return true;
      visitedDirection.get(posKey)?.add(direction);
    } else {
      visitedDirection.set(posKey, new Set([direction]));
    }

    let newPos: Position;
    if (direction === "up") {
      newPos = [pos[0] - 1, pos[1]];
    } else if (direction === "right") {
      newPos = [pos[0], pos[1] + 1];
    } else if (direction === "down") {
      newPos = [pos[0] + 1, pos[1]];
    } else {
      newPos = [pos[0], pos[1] - 1];
    }

    const newPosKey = `${newPos[0]}|${newPos[1]}`;
    if (obsPositions.has(newPosKey)) {
      if (direction === "up") direction = "right";
      else if (direction === "right") direction = "down";
      else if (direction === "down") direction = "left";
      else if (direction === "left") direction = "up";
    } else if (
      newPos[0] >= 0 &&
      newPos[0] < mapHeight &&
      newPos[1] >= 0 &&
      newPos[1] < mapWidth
    ) {
      pos = newPos;
    } else {
      return false;
    }
  }
}

/**
    Counts the number of unique fiels visited and the number of positions where an obstacle can be placed to create a loop
 */
function countGuardSteps(
  obsPositions: Set<string>,
  startPos: Position,
  startDirection: Direction,
  mapHeight: number,
  mapWidth: number
) {
  let pos = startPos;
  let direction = startDirection;
  let visitedFields = 0;
  let loopCount = 0;
  let visited = new Set<string>();

  while (true) {
    const posKey = `${pos[0]}|${pos[1]}`;
    if (!visited.has(posKey)) {
      visited.add(posKey);
      visitedFields += 1;
    }

    let newPos: Position;
    if (direction === "up") {
      newPos = [pos[0] - 1, pos[1]];
    } else if (direction === "right") {
      newPos = [pos[0], pos[1] + 1];
    } else if (direction === "down") {
      newPos = [pos[0] + 1, pos[1]];
    } else {
      newPos = [pos[0], pos[1] - 1];
    }

    const newPosKey = `${newPos[0]}|${newPos[1]}`;
    if (obsPositions.has(newPosKey)) {
      if (direction === "up") direction = "right";
      else if (direction === "right") direction = "down";
      else if (direction === "down") direction = "left";
      else if (direction === "left") direction = "up";
    } else if (
      newPos[0] >= 0 &&
      newPos[0] < mapHeight &&
      newPos[1] >= 0 &&
      newPos[1] < mapWidth
    ) {
      if (
        !visited.has(newPosKey) &&
        checkLoop(
          new Set(obsPositions).add(newPosKey),
          pos,
          direction,
          mapHeight,
          mapWidth
        )
      )
        loopCount++;

      pos = newPos;
    } else {
      break;
    }
  }
  return { visitedCount: visitedFields, loopCount: loopCount };
}

const map: string[][] = FileReader.readAs2DMap("input.txt", "");
const obsPositions = new Set<string>();
let startPos: Position = [0, 0];
const mapHeight = map.length;
const mapWidth = map[0].length;

for (let x = 0; x < mapHeight; x++) {
  for (let y = 0; y < mapWidth; y++) {
    const posKey = `${x}|${y}`;
    if (map[x][y] === "#") obsPositions.add(posKey);
    else if (map[x][y] === "^") startPos = [x, y];
  }
}
const solution = countGuardSteps(
  obsPositions,
  startPos,
  "up",
  mapHeight,
  mapWidth
);

console.log(`Part 1 solution: ${solution.visitedCount}`);
console.log(`Part 2 solution: ${solution.loopCount}`);
