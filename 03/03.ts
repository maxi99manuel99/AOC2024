import { FileReader } from "../utils";

const instructions = FileReader.readAsSingleString("input.txt");

function evalMul(mulStr: string): number {
  const numberPair = mulStr.replace("mul(", "").replace(")", "").split(",");
  return Number(numberPair[0]) * Number(numberPair[1]);
}

/**
    Finds all valid mul operations.
    If considerDoDonts is enabled only executes muls after dos
*/
function mutliplyValidMulSequences(
  instructions: string,
  considerDoDonts: boolean = false
) {
  let regex: RegExp = /mul\(\d+,\d+\)/g;
  if (considerDoDonts) regex = /do\(\)|don't\(\)|mul\(\d+,\d+\)/g;
  let result: RegExpExecArray | null;
  let currentlyDo: boolean = true;
  let sum: number = 0;

  while ((result = regex.exec(instructions)) !== null) {
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
  `Part 2 solution: ${mutliplyValidMulSequences(instructions, true)}`
);
