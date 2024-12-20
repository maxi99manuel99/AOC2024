import { FileReader } from "../utils";

type Position = [number, number];

interface QueueItem {
  position: Position;
  length: number;
}

/**
    Returns the fastest path from start to end considering byte obstacles
    If no path is found returns -1
 */
function getFastestPath(
  bytePositions: Set<string>,
  mapWidth: number,
  mapHeight: number,
  startPos: Position,
  goalPos: Position
): number {
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  let queue: QueueItem[] = [{ position: startPos, length: 0 }];
  const startKey: string = `0,0`;
  let visited: Set<string> = new Set<string>([startKey]);

  while (queue.length) {
    const { position, length }: QueueItem = queue.shift()!;

    if (position[0] === goalPos[0] && position[1] === goalPos[1]) {
      return length;
    } else {
      for (const [dx, dy] of directions) {
        const newX: number = position[0] + dx;
        const newY: number = position[1] + dy;
        const newPosKey: string = `${newX},${newY}`;

        if (
          !visited?.has(newPosKey) &&
          !bytePositions.has(newPosKey) &&
          newX >= 0 &&
          newX < mapWidth &&
          newY >= 0 &&
          newY < mapHeight
        ) {
          visited?.add(newPosKey);
          queue.push({ position: [newX, newY], length: length + 1 });
        }
      }
    }
  }
  return -1;
}

const allBytes = FileReader.ReadRowByRow("input.txt");
const mapHeight: number = 71;
const mapWidth: number = 71;
const bytePositions: Set<string> = new Set<string>();

for (let i = 0; i < 1024; i++) {
  const bytePosStr: string = allBytes[i];
  bytePositions.add(bytePosStr);
}

console.log(
  `Part 1 solution: ${getFastestPath(
    bytePositions,
    mapHeight,
    mapWidth,
    [0, 0],
    [70, 70]
  )}`
);

for (let i = 1024; i < allBytes.length; i++) {
  const bytePosStr: string = allBytes[i];
  bytePositions.add(bytePosStr);
  if (
    getFastestPath(bytePositions, mapHeight, mapWidth, [0, 0], [70, 70]) === -1
  ) {
    console.log(`Part 2 solution: ${bytePosStr}`);
    break;
  }
}
