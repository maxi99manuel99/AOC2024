import { FileReader } from "../utils";

/**
    Sums the value at the middle index of each correct update and corrected incorrect update
 */
function sumCorrectPrints(
  updates: number[][],
  rulesVisitAfter: Map<number, Set<number>>
): { correctSum: number; incorrectSum: number } {
  let correctSum = 0;
  let incorrectSum = 0;
  for (const update of updates) {
    let correctedUpdate = Object.assign([], update);
    // sort via rules
    correctedUpdate.sort((a, b) => {
      if (rulesVisitAfter.get(a)?.has(b)) {
        return -1;
      }
      return 1;
    });

    // check if anything has changed during the sort
    if (correctedUpdate.every((value, index) => value === update[index]))
      correctSum += update[Math.floor(update.length / 2)];
    else
      incorrectSum += correctedUpdate[Math.floor(correctedUpdate.length / 2)];
  }
  return { correctSum: correctSum, incorrectSum: incorrectSum };
}

const rulesAndUpdates = FileReader.ReadRowByRow("input.txt");
let updates: number[][] = [];
let rulesVisitAfter = new Map<number, Set<number>>();
let readingRules: boolean = true;
for (const entry of rulesAndUpdates) {
  if (entry === "") readingRules = false;
  else if (readingRules) {
    const rule: number[] = entry.split("|").map(Number);
    const before: number = rule[0];
    const after: number = rule[1];
    rulesVisitAfter.set(
      before,
      (rulesVisitAfter.get(before) || new Set<number>()).add(after)
    );
  } else {
    updates.push(entry.split(",").map(Number));
  }
}

const solution = sumCorrectPrints(updates, rulesVisitAfter);
console.log(`Part 1 solution: ${solution.correctSum}`);
console.log(`Part 2 solution: ${solution.incorrectSum}`);
