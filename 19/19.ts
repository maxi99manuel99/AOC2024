import { FileReader } from "../utils";

/**
 * Returns the number of designs that can actually be made from the availableTowels
 * and all total different ways there are to build all designs in total.
 */
function getNumberPossibleTowels(
  availableTowels: Set<string>,
  designs: string[]
): { possibleTowels: number; buildWays: number } {
  let possibleCount = 0;
  let totalPossibleBuildWays: number = 0;

  for (const design of designs) {
    const numWaysToBuildWithEndIdx: number[] = new Array(design.length).fill(0);

    for (let i = 1; i <= design.length; i++) {
      for (let j = 0; j < i; j++) {
        if (
          (j === 0 || numWaysToBuildWithEndIdx[j - 1] > 0) &&
          availableTowels.has(design.slice(j, i))
        ) {
          if (j === 0) numWaysToBuildWithEndIdx[i - 1]++;
          else
            numWaysToBuildWithEndIdx[i - 1] += numWaysToBuildWithEndIdx[j - 1];
        }
      }
    }

    if (numWaysToBuildWithEndIdx[design.length - 1]) {
      possibleCount++;
      totalPossibleBuildWays += numWaysToBuildWithEndIdx[design.length - 1];
    }
  }

  return { possibleTowels: possibleCount, buildWays: totalPossibleBuildWays };
}

const towelsInput = FileReader.ReadRowByRow("input.txt");
const availableTowels: Set<string> = new Set<string>(
  towelsInput[0].split(", ")
);
const designs: string[] = towelsInput.slice(2);

const solution = getNumberPossibleTowels(availableTowels, designs);
console.log(`Part 1 solution: ${solution.possibleTowels}`);
console.log(`Part 2 solution: ${solution.buildWays}`);
