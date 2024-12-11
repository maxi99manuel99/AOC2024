import { FileReader } from "../utils";

let map: string[][] = FileReader.readAs2DMap("input.txt", "");
const height = map.length;
const width = map[0].length;

/**
    Finds and counts occurances of the string XMAS in any direction (also diagonal) in a 2D char map
 */
function getXMasCount(map: string[][]): number {
  let xmasCount: number = 0;

  for (let x = 0; x < height; x++) {
    for (let y = 0; y < width; y++) {
      if (map[x][y] === "X") {
        // Vertical
        if (
          x - 3 >= 0 &&
          map[x - 1][y] === "M" &&
          map[x - 2][y] === "A" &&
          map[x - 3][y] === "S"
        )
          xmasCount += 1;
        if (
          x + 3 < height &&
          map[x + 1][y] === "M" &&
          map[x + 2][y] === "A" &&
          map[x + 3][y] === "S"
        )
          xmasCount += 1;

        // Horizontal
        if (
          y - 3 >= 0 &&
          map[x][y - 1] === "M" &&
          map[x][y - 2] === "A" &&
          map[x][y - 3] === "S"
        )
          xmasCount += 1;
        if (
          y + 3 < width &&
          map[x][y + 1] === "M" &&
          map[x][y + 2] === "A" &&
          map[x][y + 3] === "S"
        )
          xmasCount += 1;

        // Diagonal
        if (
          x - 3 >= 0 &&
          y - 3 >= 0 &&
          map[x - 1][y - 1] === "M" &&
          map[x - 2][y - 2] === "A" &&
          map[x - 3][y - 3] === "S"
        )
          xmasCount += 1;
        if (
          x + 3 < height &&
          y + 3 < width &&
          map[x + 1][y + 1] === "M" &&
          map[x + 2][y + 2] === "A" &&
          map[x + 3][y + 3] === "S"
        )
          xmasCount += 1;
        if (
          x - 3 >= 0 &&
          y + 3 < width &&
          map[x - 1][y + 1] === "M" &&
          map[x - 2][y + 2] === "A" &&
          map[x - 3][y + 3] === "S"
        )
          xmasCount += 1;
        if (
          x + 3 < height &&
          y - 3 >= 0 &&
          map[x + 1][y - 1] === "M" &&
          map[x + 2][y - 2] === "A" &&
          map[x + 3][y - 3] === "S"
        )
          xmasCount += 1;
      }
    }
  }
  return xmasCount;
}

/**
    Finds  and counts occurances of
    M   M
      A
    S   S
    in any rotation in a 2D char map 
 */
function getXMasCountX(map: string[][]): number {
  let xmasCount: number = 0;

  for (let x = 1; x < height - 1; x++) {
    for (let y = 1; y < width - 1; y++) {
      if (map[x][y] === "A") {
        const topLeft = map[x - 1][y - 1];
        const topRight = map[x - 1][y + 1];
        const botLeft = map[x + 1][y - 1];
        const botRight = map[x + 1][y + 1];
        const diagNeighbors = [topLeft, topRight, botLeft, botRight];
        const mCount = diagNeighbors.filter((val) => val === "M").length;
        const sCount = diagNeighbors.filter((val) => val === "S").length;

        if (mCount === 2 && sCount == 2 && topLeft != botRight) xmasCount += 1;
      }
    }
  }
  return xmasCount;
}

console.log(`Part 1 solution ${getXMasCount(map)}`);
console.log(`Part 2 solution ${getXMasCountX(map)}`);
