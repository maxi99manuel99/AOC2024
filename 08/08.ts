import { FileReader } from "../utils";

type Distance = [number, number];
type Position = [number, number];

interface FrequencyPairs {
  pos1: Position;
  pos2: Position;
  distance: Distance;
}

/**
  Counts the number of unique antinodes emerging from the pairs of same frequencies
  Counts antinodes with the exact distance of their pair as well as such that are in line of their pair
 */
function countUniqueAntiNodes(
  pairMap: Map<string, FrequencyPairs[]>,
  mapHeight: number,
  mapWidth: number
) {
  let uniqueAntinodePosStringsDistance = new Set<string>();
  let uniqueAntinodePosStringsLines = new Set<string>();
  pairMap.forEach((pairList: FrequencyPairs[], _: string) => {
    for (const pair of pairList) {
      uniqueAntinodePosStringsLines.add(`${pair.pos1[0]}|${pair.pos1[1]}`);
      uniqueAntinodePosStringsLines.add(`${pair.pos2[0]}|${pair.pos2[1]}`);

      const antinodePos1: Position = [
        pair.pos1[0] + pair.distance[0],
        pair.pos1[1] + pair.distance[1],
      ];
      let firstIteration: boolean = true;

      while (
        antinodePos1[0] >= 0 &&
        antinodePos1[0] < mapHeight &&
        antinodePos1[1] >= 0 &&
        antinodePos1[1] < mapWidth
      ) {
        if (firstIteration) {
          uniqueAntinodePosStringsDistance.add(
            `${antinodePos1[0]}|${antinodePos1[1]}`
          );
          firstIteration = false;
        }
        uniqueAntinodePosStringsLines.add(
          `${antinodePos1[0]}|${antinodePos1[1]}`
        );
        antinodePos1[0] += pair.distance[0];
        antinodePos1[1] += pair.distance[1];
      }

      const antinodePos2: Position = [
        pair.pos2[0] - pair.distance[0],
        pair.pos2[1] - pair.distance[1],
      ];
      firstIteration = true;

      while (
        antinodePos2[0] >= 0 &&
        antinodePos2[0] < mapHeight &&
        antinodePos2[1] >= 0 &&
        antinodePos2[1] < mapWidth
      ) {
        if (firstIteration) {
          uniqueAntinodePosStringsDistance.add(
            `${antinodePos2[0]}|${antinodePos2[1]}`
          );
          firstIteration = false;
        }
        uniqueAntinodePosStringsLines.add(
          `${antinodePos2[0]}|${antinodePos2[1]}`
        );
        antinodePos2[0] -= pair.distance[0];
        antinodePos2[1] -= pair.distance[1];
      }
    }
  });

  return {
    strictDistance: uniqueAntinodePosStringsDistance.size,
    inLine: uniqueAntinodePosStringsLines.size,
  };
}

const map: string[][] = FileReader.readAs2DMap("input.txt", "");
const mapHeight = map.length;
const mapWidth = map[0].length;

const posMap = new Map<string, Position[]>();
const pairMap = new Map<string, FrequencyPairs[]>();

for (let x = 0; x < mapHeight; x++) {
  for (let y = 0; y < mapWidth; y++) {
    const frequency = map[x][y];
    if (frequency !== ".") {
      const currentPosition: Position = [x, y];

      if (!pairMap.has(frequency)) {
        pairMap.set(frequency, []);
      }
      if (!posMap.has(frequency)) {
        posMap.set(frequency, []);
      }

      const pairs = pairMap.get(frequency)!;
      const positions = posMap.get(frequency)!;

      for (const pos of positions) {
        const distance: Distance = [
          pos[0] - currentPosition[0],
          pos[1] - currentPosition[1],
        ];
        pairs.push({ pos1: pos, pos2: currentPosition, distance });
      }

      positions.push(currentPosition);
    }
  }
}

const solution = countUniqueAntiNodes(pairMap, mapHeight, mapWidth);
console.log(`Part 1 solution: ${solution.strictDistance}`);
console.log(`Part 2 solution: ${solution.inLine}`);
