import { FileReader } from "../utils";

const stones: number[] = FileReader.readAs2DMap("input.txt", " ", (value) =>
  Number(value)
)[0];

const globalBlinkCache: Map<string, number> = new Map();

/**
    Performs [timesToBlink] blink operations on a stone and returns the amount of stones that are created by doing so
 */
function blinkAndCountStones(stone: number, timesToBlink: number): number {
  if (timesToBlink === 0) return 1;

  const cacheKey = `${stone}:${timesToBlink}`;

  if (globalBlinkCache.has(cacheKey)) return globalBlinkCache.get(cacheKey)!;

  let stonesCreated: number;

  if (stone === 0) {
    stonesCreated = blinkAndCountStones(1, timesToBlink - 1);
  } else {
    const magnitude: number = Math.floor(Math.log10(stone)) + 1;

    if (magnitude % 2 !== 0) {
      stonesCreated = blinkAndCountStones(stone * 2024, timesToBlink - 1);
    } else {
      const halfMagnitude: number = magnitude / 2;
      const divisor: number = Math.pow(10, halfMagnitude);
      const leftNumber: number = Math.floor(stone / divisor);
      const rightNumber: number = stone % divisor;

      stonesCreated =
        blinkAndCountStones(leftNumber, timesToBlink - 1) +
        blinkAndCountStones(rightNumber, timesToBlink - 1);
    }
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
