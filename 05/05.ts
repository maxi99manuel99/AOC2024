import { FileReader } from "../utils";

/**
    Sums the value at the middle index of each correct update and corrected incorrect update
 */
function sumCorrectPrints(
  updates: number[][],
  rulesVisitAfter: Map<number, number[]>
) {
  let correctSum = 0;
  let incorrectSum = 0;
  for (const update of updates) {
    let visited = new Map<number, boolean>();
    let mutliplier = 1;
    let correctedUpdate = Object.assign([], update);
    for (const page of update) {
      visited.set(page, true);
      const visitAfter: number[] | undefined = rulesVisitAfter.get(page);
      if (visitAfter) {
        const badVisitIndices: number[] = visitAfter
          .filter((entry) => visited.get(entry))
          .map((entry) => correctedUpdate.indexOf(entry));
        if (badVisitIndices.length > 0) {
          mutliplier = 0;
          const minIdx: number = Math.min(...badVisitIndices);
          correctedUpdate.splice(correctedUpdate.indexOf(page), 1);
          correctedUpdate.splice(minIdx, 0, page);
        }
      }
    }
    correctSum += mutliplier * update[Math.floor(update.length / 2)];
    incorrectSum +=
      (1 - mutliplier) *
      correctedUpdate[Math.floor(correctedUpdate.length / 2)];
  }
  return { correctSum: correctSum, incorrectSum: incorrectSum };
}

const rulesAndUpdates = FileReader.ReadRowByRow("input.txt");
let updates: number[][] = [];
let rulesVisitAfter = new Map<number, number[]>();
let readingRules: boolean = true;
for (const entry of rulesAndUpdates) {
  if (entry === "") readingRules = false;
  else if (readingRules) {
    const rule: number[] = entry.split("|").map(Number);
    const before: number = rule[0];
    const after: number = rule[1];
    rulesVisitAfter.set(
      before,
      (rulesVisitAfter.get(before) || []).concat(after)
    );
  } else {
    updates.push(entry.split(",").map(Number));
  }
}

const solution = sumCorrectPrints(updates, rulesVisitAfter);
console.log(`Part 1 solution: ${solution.correctSum}`);
console.log(`Part 2 solution: ${solution.incorrectSum}`);
