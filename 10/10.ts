import { FileReader } from "../utils";

type Position = [number, number];

/**
    Returns the score of a trailhead either based on how many different height 9s it can reach
    or if allowMultiplePaths is set based on all distinct paths to a 9
 */
function getTrailheadScore(
  map: number[][],
  trailheadPos: Position,
  mapHeight: number,
  mapWidth: number,
  allowMultiplePaths: boolean = true
): number {
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  let queue: Position[] = [trailheadPos];
  let score = 0;
  const startKey = `${trailheadPos[0]}|${trailheadPos[1]}`;
  let visited = allowMultiplePaths ? null : new Set<string>([startKey]);

  while (queue.length) {
    const [x, y] = queue.shift()!;
    const currHeight = map[x][y];

    if (currHeight === 9) {
      score++;
    } else {
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        const newPosKey = `${newX}|${newY}`;

        if (
          !visited?.has(newPosKey) &&
          newX >= 0 &&
          newX < mapHeight &&
          newY >= 0 &&
          newY < mapWidth &&
          map[newX][newY] === currHeight + 1
        ) {
          visited?.add(newPosKey);
          queue.push([newX, newY]);
        }
      }
    }
  }

  return score;
}

const map: number[][] = FileReader.readAs2DMap("input.txt", "", (value) =>
  Number(value)
);

const mapHeight = map.length;
const mapWidth = map[0].length;

let scoreSum: number = 0;
let scoreSumMultiplePaths = 0;
for (let x = 0; x < mapHeight; x++) {
  for (let y = 0; y < mapWidth; y++) {
    if (map[x][y] === 0) {
      scoreSum += getTrailheadScore(map, [x, y], mapHeight, mapWidth, false);
      scoreSumMultiplePaths += getTrailheadScore(
        map,
        [x, y],
        mapHeight,
        mapWidth
      );
    }
  }
}

console.log(`Part 1 solution: ${scoreSum}`);
console.log(`Part 2 solution: ${scoreSumMultiplePaths}`);
