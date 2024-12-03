import { FileReader } from "../utils";

type Interval = [number, number];

const instructions = FileReader.readAsSingleString("input.txt");

function evalMul(mulStr: string): number {
  const numberPair = mulStr.replace("mul(", "").replace(")", "").split(",");
  return Number(numberPair[0]) * Number(numberPair[1]);
}

/**
    Finds all valid mul operations and multiplies them
*/
function mutliplyValidMulSequences(instructions: string): number {
  const mulRegex: RegExp = /mul\(\d+,\d+\)/g;
  const matches: RegExpMatchArray | null = instructions.match(mulRegex);
  let sum: number = 0;

  if (matches) {
    for (const match of matches) {
      sum += evalMul(match);
    }
  }
  return sum;
}

/**
    Finds all valid mul operations considering dos and donts and mutliplies them
*/
function mutliplyValidEnabledMulSequences(instructions: string) {
  const combinedRegex: RegExp = /do\(\)|don't\(\)|mul\(\d+,\d+\)/g;
  let result: RegExpExecArray | null;

  let currentlyDo: boolean = true;
  let sum: number = 0;
  while ((result = combinedRegex.exec(instructions)) !== null) {
    switch (result[0]) {
      case "do()":
        currentlyDo = true;
        break;
      case "don't()":
        currentlyDo = false;
        break;
      default:
        if (currentlyDo) sum += evalMul(result[0]);
        break;
    }
  }
  return sum;
}

console.log(`Part 1 solution: ${mutliplyValidMulSequences(instructions)}`);
console.log(
  `Part 2 solution: ${mutliplyValidEnabledMulSequences(instructions)}`
);
