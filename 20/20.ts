import path = require("path");
import { FileReader } from "../utils";

type Position = [number, number];

interface QueueItem {
  position: Position;
  length: number;
  visited: Set<string>;
}

interface QueueItemNormal {
  position: Position;
  length: number;
  pastPath: string[];
}

const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

/**
  Traverses the map normally while avoiding obstacles and for each position on the path to the goal (there is only one path)
  and returns all positions on the path (ordered by their appearance on the path)
 */
function findNormalPath(
  map: string[][],
  mapWidth: number,
  mapHeight: number,
  startPos: Position,
  goalPos: Position
): string[] {
  const startKey: string = `${startPos[0]}|${startPos[1]}`;
  
  let queue: QueueItemNormal[] = [
    { position: startPos, length: 0, pastPath: [] },
  ];
  let visited: Set<string> = new Set<string>([startKey]);

  while (queue.length) {
    const { position, length, pastPath }: QueueItemNormal = queue.shift()!;

    if (position[0] === goalPos[0] && position[1] === goalPos[1]) {
      return pastPath;
    } else {
      for (const [dx, dy] of directions) {
        const newX: number = position[0] + dx;
        const newY: number = position[1] + dy;
        const newPosKey: string = `${newX}|${newY}`;

        if (
          !visited?.has(newPosKey) &&
          map[newX][newY] !== "#" &&
          newX >= 1 &&
          newX < mapWidth - 1 &&
          newY >= 1 &&
          newY < mapHeight - 1
        ) {
          visited?.add(newPosKey);
          queue.push({
            position: [newX, newY],
            length: length + 1,
            pastPath: pastPath.concat([newPosKey]),
          });
        }
      }
    }
  }

  return [];
}

/**
    Returns the number of cheat paths that save at least the given amount of picoseconds
 */
function getNumberSavingCheatPaths(
  map: string[][],
  mapWidth: number,
  mapHeight: number,
  startPos: Position,
  goalPos: Position,
  saveAtLeast: number
): number {
  const normalPath: string[] = findNormalPath(
    map,
    mapWidth,
    mapHeight,
    startPos,
    goalPos
  );

  const maxLength: number = normalPath.length - saveAtLeast;
  let fasterCheatPaths: number = 0;

  const startKey: string = `${startPos[0]}|${startPos[1]}|${false}`;
  let queue: QueueItem[] = [
    {
      position: startPos,
      length: 0,
      visited: new Set<string>([startKey]),
    },
  ];

  while (queue.length) {
    const { position, length, visited }: QueueItem = queue.shift()!;
    let visitedCopy: Set<string> = new Set<string>(visited);

    if (length + 1 > maxLength) continue;
    else {
      for (const [dx, dy] of directions) {
        const newX: number = position[0] + dx;
        const newY: number = position[1] + dy;
        const newPosKey: string = `${newX}|${newY}`;

        if (map[position[0]][position[1]] === "#") {
          if (map[newX][newY] === "#" || !normalPath.includes(newPosKey)) continue; // the path after the cheat will not lead to the goal
          else {
            const totalLength: number =
              length + normalPath.length - normalPath.indexOf(newPosKey); // the total length the path will take by using the cheat

            if (totalLength <= maxLength) fasterCheatPaths++;
          }
        } else if (
          newX >= 1 &&
          newX < mapWidth - 1 &&
          newY >= 1 &&
          newY < mapHeight - 1 &&
          !visited.has(newPosKey)
        ) {
          visitedCopy.add(newPosKey);
          queue.push({
            position: [newX, newY],
            length: length + 1,
            visited: visitedCopy,
          });
        }
      }
    }
  }

  return fasterCheatPaths;
}

const map = FileReader.readAs2DMap("input.txt", "") as string[][];
const mapHeight: number = map.length;
const mapWidth: number = map[0].length;
let startPos: Position = [0, 0];
let goalPos: Position = [0, 0];

for (let x = 0; x < mapHeight; x++) {
  for (let y = 0; y < mapWidth; y++) {
    if (map[x][y] === "S") startPos = [x, y];
    else if (map[x][y] === "E") goalPos = [x, y];
  }
}

console.log(
  `Part 1 solution: ${getNumberSavingCheatPaths(
    map,
    mapHeight,
    mapWidth,
    startPos,
    goalPos,
    100
  )}`
);
