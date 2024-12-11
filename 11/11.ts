import { FileReader } from "../utils";

const stones = FileReader.readAs2DMap("input.txt", " ")[0] as string[];

const globalBlinkCache: Map<string, number> = new Map();

/**
    Performs [timesToBlink] blink operations on a stone and returns the amount of stones that are created by doing so
 */
function blinkAndCountStones(stone: string, timesToBlink: number): number {
  if (timesToBlink === 0) return 1;

  const cacheKey = `${stone}:${timesToBlink}`;

  if (globalBlinkCache.has(cacheKey)) return globalBlinkCache.get(cacheKey)!;

  let stonesCreated: number;
  if (stone === "0") {
    stonesCreated = blinkAndCountStones("1", timesToBlink - 1);
  } else if (stone.length % 2 !== 0) {
    stonesCreated = blinkAndCountStones(
      `${Number(stone) * 2024}`,
      timesToBlink - 1
    );
  } else {
    stonesCreated =
      blinkAndCountStones(
        `${Number(stone.slice(0, stone.length / 2))}`,
        timesToBlink - 1
      ) +
      blinkAndCountStones(
        `${Number(stone.slice(stone.length / 2))}`,
        timesToBlink - 1
      );
  }

  globalBlinkCache.set(cacheKey, stonesCreated);

  return stonesCreated;
}

let stoneCount: number = 0;
let stoneCount2: number = 0;

for (const stone of stones) {
  stoneCount += blinkAndCountStones(stone, 25);
  stoneCount2 += blinkAndCountStones(stone, 75);
}

console.log(`Part 1 solution: ${stoneCount}`);
console.log(`Part 2 solution: ${stoneCount2}`);
