import { FileReader } from "../utils";

let numberCols: { leftColumn: number[]; rightColumn: number[] } =
  FileReader.readTwoColumnsSeperately("input.txt", (value) => Number(value));

numberCols.leftColumn.sort();
numberCols.rightColumn.sort();

let totalDistance: number = 0;
let rightAppearanceSum: number = 0;
let rightColumnLowestIdx: number = 0;
let previousLeft: number = -1;
let rightAppearanceCount: number = 0;

for (let i = 0; i < numberCols.leftColumn.length; i++) {
  const leftColVal = numberCols.leftColumn[i];
  totalDistance += Math.abs(leftColVal - numberCols.rightColumn[i]);
  if (previousLeft === leftColVal) {
    rightAppearanceSum += previousLeft * rightAppearanceCount;
  } else {
    previousLeft = leftColVal;
    rightAppearanceCount = 0;
    for (let j = rightColumnLowestIdx; j < numberCols.rightColumn.length; j++) {
      const rightColVal = numberCols.rightColumn[j];
      if (rightColVal > leftColVal) break;
      else if (rightColVal === leftColVal) rightAppearanceCount++;
      rightColumnLowestIdx = j;
    }
    rightAppearanceSum += leftColVal * rightAppearanceCount;
  }
}

console.log(`Part 1 solution: ${totalDistance}`);
console.log(`Part 2 solution: ${rightAppearanceSum}`);
