import { FileReader } from "../utils";

const stones = FileReader.readAs2DMap("input.txt", " ")[0] as string[];

function blink(stone: string, amount: number): number {
  if (amount === 0) return 1;
  else if (stone === "0") return blink("1", amount - 1);
  else if (stone.length % 2 !== 0)
    return blink("" + Number(stone) * 2024, amount - 1);
  else
    return (
      blink("" + Number(stone.slice(0, stone.length / 2)), amount - 1) +
      blink("" + Number(stone.slice(stone.length / 2)), amount - 1)
    );
}

let stoneCount = 0;
for (const stone of stones) {
  stoneCount += blink(stone, 25);
}

console.log(`Part 1 solution: ${stoneCount}`);
