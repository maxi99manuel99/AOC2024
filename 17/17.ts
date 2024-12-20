import { FileReader } from "../utils";

interface Register {
  A: number;
  B: number;
  C: number;
}

let registers: Register;

class Operand {
  private _operand: number;
  private _type: "literal" | "combo";

  constructor(operand: number, type: "literal" | "combo") {
    this._operand = operand;
    this._type = type;
  }

  get value(): number {
    if (this._type === "literal" || this._operand <= 3) return this._operand;
    switch (this._operand) {
      case 4:
        return registers.A;
      case 5:
        return registers.B;
      case 6:
        return registers.C;
      default:
        throw new Error(
          "The reserved bit should not appear in a valid program"
        );
    }
  }
}

class Opcode {
  private _opcode: number;

  constructor(opcode: number) {
    this._opcode = opcode;
  }

  public performInstruction(operand: number): {
    output: number;
    newInstructionPointer: number;
  } {
    switch (this._opcode) {
      case 0:
        registers.A = Math.floor(
          registers.A / Math.pow(2, new Operand(operand, "combo").value)
        );
        return { output: -1, newInstructionPointer: -1 };
      case 1:
        registers.B = Number(
          BigInt(registers.B) ^ BigInt(new Operand(operand, "literal").value)
        );
        return { output: -1, newInstructionPointer: -1 };
      case 2:
        registers.B = new Operand(operand, "combo").value % 8;
        return { output: -1, newInstructionPointer: -1 };
      case 3:
        if (registers.A === 0) return { output: -1, newInstructionPointer: -1 };
        return {
          output: -1,
          newInstructionPointer: new Operand(operand, "literal").value,
        };
      case 4:
        registers.B = Number(BigInt(registers.B) ^ BigInt(registers.C));
        return { output: -1, newInstructionPointer: -1 };
      case 5:
        const output = new Operand(operand, "combo").value % 8;

        return {
          output: output,
          newInstructionPointer: -1,
        };
      case 6:
        registers.B = Math.floor(
          registers.A / Math.pow(2, new Operand(operand, "combo").value)
        );
        return { output: -1, newInstructionPointer: -1 };
      case 7:
        registers.C = Math.floor(
          registers.A / Math.pow(2, new Operand(operand, "combo").value)
        );
        return { output: -1, newInstructionPointer: -1 };
      default:
        throw new Error("Got an invalid opcode");
    }
  }
}

registers = { A: 0, B: 0, C: 0 };
const programLines = FileReader.ReadRowByRow("input.txt");
for (const registerStr of programLines.slice(0, 3)) {
  const registerInput: string[] = registerStr.split(" ");
  const input: number = Number(registerInput[2]);
  if (registerInput[1].includes("A")) registers.A = input;
  else if (registerInput[1].includes("B")) registers.B = input;
  else registers.C = input;
}
const registersBeforeMod: Register = Object.assign({}, registers);

const program: number[] = programLines[programLines.length - 1]
  .split(" ")[1]
  .split(",")
  .map(Number);
const programStr: string = programLines[programLines.length - 1].split(" ")[1];

let instructionPointer: number = 0;
let finalOutput: string | undefined;
while (instructionPointer < program.length) {
  const opcode: Opcode = new Opcode(program[instructionPointer]);
  const operand: number = program[instructionPointer + 1];
  const { output, newInstructionPointer } = opcode.performInstruction(operand);

  if (output !== -1) {
    if (finalOutput) finalOutput += "," + output;
    else finalOutput = "" + output;
  }

  if (newInstructionPointer !== -1) instructionPointer = newInstructionPointer;
  else instructionPointer += 2;
}

console.log(`Part 1 solution: ${finalOutput}`);

// Reset registers
registers = registersBeforeMod;

let queue = [0];
while (queue.length) {
  const testAStart: number = queue.shift()!;
  for (let i = 0; i < 8; i++) {
    const testA: number = testAStart + i;
    registers.A = testA;
    instructionPointer = 0;
    finalOutput = undefined;

    while (instructionPointer < program.length) {
      const opcode = new Opcode(program[instructionPointer]);
      const operand = program[instructionPointer + 1];
      const { output, newInstructionPointer } =
        opcode.performInstruction(operand);

      if (output !== -1) {
        if (finalOutput) finalOutput += "," + output;
        else finalOutput = "" + output;
      }

      if (newInstructionPointer !== -1)
        instructionPointer = newInstructionPointer;
      else instructionPointer += 2;
    }
    if (finalOutput === programStr) {
      console.log(`Part 2 solution: ${testA}`);
      break;
    } else if (programStr.endsWith(finalOutput!)) {
      queue.push(testA * 8);
    }
  }
}
