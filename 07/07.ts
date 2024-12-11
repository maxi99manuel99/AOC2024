import PriorityQueue from "ts-priority-queue";
import { FileReader } from "../utils";

interface Equation {
  desiredResult: number;
  numbers: number[];
}

interface QueueItem {
  partialResult: number;
  equationIdx: number;
}

/**
  Evaluates if an equation is solvable using *, + and optional concat operations
 */
function checkSolvable(
  equation: Equation,
  allowConcat: boolean = false
): boolean {
  let queue = new PriorityQueue({
    comparator: function (a: QueueItem, b: QueueItem) {
      return b.partialResult - a.partialResult;
    },
    initialValues: [{ partialResult: equation.numbers[0], equationIdx: 0 }],
  });

  while (queue.length) {
    const biggestPartResultItem = queue.dequeue();
    if (
      biggestPartResultItem.equationIdx === equation.numbers.length - 1 &&
      biggestPartResultItem.partialResult === equation.desiredResult
    ) {
      return true;
    } else if (
      biggestPartResultItem.partialResult <= equation.desiredResult &&
      !(biggestPartResultItem.equationIdx === equation.numbers.length - 1)
    ) {
      const newIdx = biggestPartResultItem.equationIdx + 1;
      const newPartialResultAdd =
        biggestPartResultItem.partialResult + equation.numbers[newIdx];
      const newPartialResultMultiply =
        biggestPartResultItem.partialResult * equation.numbers[newIdx];

      queue.queue({ partialResult: newPartialResultAdd, equationIdx: newIdx });
      queue.queue({
        partialResult: newPartialResultMultiply,
        equationIdx: newIdx,
      });
      if (allowConcat) {
        const magnitude = Math.log10(equation.numbers[newIdx]);
        const shifted =
          biggestPartResultItem.partialResult *
          Math.pow(10, Math.floor(magnitude + 1));
        const newPartialResultConcat = shifted + equation.numbers[newIdx];
        queue.queue({
          partialResult: newPartialResultConcat,
          equationIdx: newIdx,
        });
      }
    }
  }
  return false;
}

const eqs: string[] = FileReader.ReadRowByRow("input.txt");
let equations: Equation[] = [];
for (const eq of eqs) {
  const splitResult = eq.split(":");
  const result = Number(splitResult[0]);
  const numbers = splitResult[1]
    .trim()
    .split(" ")
    .map((value: string) => Number(value));
  equations.push({ desiredResult: result, numbers: numbers });
}

let solvableSum: number = 0;
let solvableSumConcat: number = 0;
for (const equation of equations) {
  if (checkSolvable(equation)) solvableSum += equation.desiredResult;
  if (checkSolvable(equation, true))
    solvableSumConcat += equation.desiredResult;
}

console.log(`Part 1 solution: ${solvableSum}`);
console.log(`Part 2 solution: ${solvableSumConcat}`);
