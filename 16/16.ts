import { FileReader } from "../utils";
import PriorityQueue from "ts-priority-queue";

interface Position {
  x: number;
  y: number;
}

interface QueueItem {
  score: number;
  position: Position;
  direction: string;
  previousDirection: string;
}

interface BackwardsQueuItem {
  direction: string;
  position: Position;
}

const directionMap = new Map<string, Position>([
  ["N", { x: -1, y: 0 }],
  ["E", { x: 0, y: 1 }],
  ["S", { x: 1, y: 0 }],
  ["W", { x: 0, y: -1 }],
]);

const reverseDirectionMap = new Map<string, Position>([
  ["N", { x: 1, y: 0 }],
  ["E", { x: 0, y: -1 }],
  ["S", { x: -1, y: 0 }],
  ["W", { x: 0, y: 1 }],
]);

/**
    Gets a map of previousDirections that for each tile tells us all previous optimal directios of the tile before the current one when standing on a tile in a certain direction
 */
function traversePreviousDirectionmap(
  previousDirectionMap: Map<string, string[]>,
  reverseStartPos: Position,
  reverseGoalPos: Position
): number {
  let uniqueTiles: Set<string> = new Set<string>([
    `${reverseStartPos.x}|${reverseStartPos.y}`,
  ]);
  let backwardsQueue: BackwardsQueuItem[] = [];

  directionMap.forEach((_, direction) => {
    const newBackwardsPos: Position = {
      x: reverseStartPos.x + reverseDirectionMap.get(direction)!.x,
      y: reverseStartPos.y + reverseDirectionMap.get(direction)!.y,
    };
    const startKey = `${reverseStartPos.x}|${reverseStartPos.y}|${direction}`;

    if (previousDirectionMap.has(startKey))
      backwardsQueue.push({
        direction: previousDirectionMap.get(startKey)![0],
        position: newBackwardsPos,
      });
  });
  while (backwardsQueue.length) {
    const backwardsItem: BackwardsQueuItem = backwardsQueue.pop()!;
    const backWardsCurrPos: Position = backwardsItem.position;
    const backWardsCurrDirection: string = backwardsItem.direction;
    uniqueTiles.add(`${backWardsCurrPos.x}|${backWardsCurrPos.y}`);

    if (
      backWardsCurrPos.x === reverseGoalPos.x &&
      backWardsCurrPos.y == reverseGoalPos.y
    )
      continue;

    const newBackwardsPos: Position = {
      x:
        backWardsCurrPos.x + reverseDirectionMap.get(backWardsCurrDirection)!.x,
      y:
        backWardsCurrPos.y + reverseDirectionMap.get(backWardsCurrDirection)!.y,
    };

    const newBackwardDirections = previousDirectionMap.get(
      `${backWardsCurrPos.x}|${backWardsCurrPos.y}|${backWardsCurrDirection}`
    )!;

    for (const newDirection of newBackwardDirections) {
      backwardsQueue.push({
        direction: newDirection,
        position: newBackwardsPos,
      });
    }
  }

  return uniqueTiles.size;
}

/**
    For the given map determines the lowes possible score to get from start to end and also calculates the number of unique tiles that can be used to get to the end with the lowest score (by using different paths with the same score)
 */
function findLowestScoreToEndAndCountUniqueTilesOnPaths(
  startPos: Position,
  goalPos: Position,
  map: string[][]
): { lowestPathScore: number; uniqueTilesOnPaths: number } {
  let optimalScoreMap: Map<string, number> = new Map<string, number>();
  let optimalPreviousDirectionMap: Map<string, string[]> = new Map<
    string,
    string[]
  >();
  let foundEndScore: number = Infinity;

  let visited: Set<string> = new Set<string>();
  let queue = new PriorityQueue({
    comparator: function (a: QueueItem, b: QueueItem) {
      return a.score - b.score;
    },
    initialValues: [
      {
        score: 0,
        position: startPos,
        direction: "E",
        previousDirection: "X",
      },
    ],
  });

  while (queue.length) {
    const currItem: QueueItem = queue.dequeue();
    const currPos: Position = currItem.position;
    const currDirection: string = currItem.direction;
    const currKey = `${currPos.x}|${currPos.y}|${currDirection}`;
    const currPreviousDirection: string = currItem.previousDirection;

    if (currPos.x === goalPos.x && currPos.y === goalPos.y) {
      if (currItem.score > foundEndScore) {
        return {
          lowestPathScore: foundEndScore,
          uniqueTilesOnPaths: traversePreviousDirectionmap(
            optimalPreviousDirectionMap,
            goalPos,
            startPos
          ),
        };
      }
      foundEndScore = currItem.score;
    }

    if (visited.has(currKey)) {
      if (optimalScoreMap.get(currKey) === currItem.score)
        optimalPreviousDirectionMap.set(
          currKey,
          optimalPreviousDirectionMap
            .get(currKey)!
            .concat([currPreviousDirection])
        );
      continue;
    }
    visited.add(currKey);
    optimalScoreMap.set(currKey, currItem.score);
    optimalPreviousDirectionMap.set(currKey, [currPreviousDirection]);

    directionMap.forEach((delta, newDirection) => {
      const newPos: Position = {
        x: currPos.x + delta.x,
        y: currPos.y + delta.y,
      };

      if (map[newPos.x][newPos.y] !== "#") {
        let newScore: number;

        if (currDirection === newDirection) newScore = currItem.score + 1;
        else if (
          (currDirection === "E" && newDirection === "W") ||
          (currDirection === "W" && newDirection === "E") ||
          (currDirection === "N" && newDirection === "S") ||
          (currDirection === "W" && newDirection === "E")
        )
          newScore = currItem.score + 2001;
        else newScore = currItem.score + 1001;

        queue.queue({
          score: newScore,
          position: newPos,
          direction: newDirection,
          previousDirection: currDirection,
        });
      }
    });
  }
  // no path was found
  return { lowestPathScore: -1, uniqueTilesOnPaths: -1 };
}

let startPos: Position | null = null;
let endPos: Position | null = null;
const map: string[][] = FileReader.readAs2DMap("input.txt", "");

for (let x = 0; x < map.length; x++) {
  for (let y = 0; y < map[x].length; y++) {
    if (map[x][y] === "S") {
      startPos = { x: x, y: y };
    } else if (map[x][y] === "E") {
      endPos = { x: x, y: y };
    }
    if (startPos && endPos) {
      break;
    }
  }
}

const solution = findLowestScoreToEndAndCountUniqueTilesOnPaths(
  startPos!,
  endPos!,
  map
);
console.log(`Part 1 solution: ${solution.lowestPathScore}`);
console.log(`Part 2 solution: ${solution.uniqueTilesOnPaths}`);
