import { FileReader } from "../utils";

interface Position {
  x: number;
  y: number;
}

interface Movement {
  x: number;
  y: number;
}

/** 
    Returns the cost of the times the button A and B have to pressed to achieve the pricePostion by rearranging the equations that need to be fullfilled to reach the position
 */
function getCostCheapestButtonPresses(
  AMovement: Movement,
  BMovement: Movement,
  pricePosition: Position,
  pressLimit: number = Infinity
): number {
  let BPressed: number =
    (pricePosition.y * AMovement.x - pricePosition.x * AMovement.y) /
    (AMovement.x * BMovement.y - BMovement.x * AMovement.y);
  let APressed: number =
    (pricePosition.x - BPressed * BMovement.x) / AMovement.x;

  BPressed = Math.round(BPressed);
  APressed = Math.round(APressed);

  if (
    APressed <= pressLimit &&
    BPressed <= pressLimit &&
    APressed * AMovement.x + BPressed * BMovement.x === pricePosition.x &&
    APressed * AMovement.y + BPressed * BMovement.y === pricePosition.y
  ) {
    return APressed * 3 + BPressed;
  }

  // no solution found
  return 0;
}

const machineParts = FileReader.ReadRowByRow("input.txt");

let totalCost: number = 0;
let totalCost2: number = 0;
let AMovement: Movement;
let BMovement: Movement;
let pricePosition: Position;
let pricePosition2: Position;

for (const machinePart of machineParts) {
  if (machinePart.includes("Button A")) {
    const moves = machinePart.split(":")[1].split(",");
    const xMove = Number(moves[0].split("+")[1]);
    const yMove = Number(moves[1].split("+")[1]);
    AMovement = { x: xMove, y: yMove };
  } else if (machinePart.includes("Button B")) {
    const moves = machinePart.split(":")[1].split(",");
    const xMove = Number(moves[0].split("+")[1]);
    const yMove = Number(moves[1].split("+")[1]);
    BMovement = { x: xMove, y: yMove };
  } else if (machinePart.includes("Prize")) {
    const pricePos = machinePart.split(":")[1].split(",");
    const xPos = Number(pricePos[0].split("=")[1]);
    const yPos = Number(pricePos[1].split("=")[1]);
    pricePosition = { x: xPos, y: yPos };
    pricePosition2 = { x: xPos + 10000000000000, y: yPos + 10000000000000 };
  } else {
    totalCost += getCostCheapestButtonPresses(
      AMovement!,
      BMovement!,
      pricePosition!,
      100
    );
    totalCost2 += getCostCheapestButtonPresses(
      AMovement!,
      BMovement!,
      pricePosition2!
    );
  }
}
totalCost += getCostCheapestButtonPresses(
  AMovement!,
  BMovement!,
  pricePosition!,
  100
);
totalCost2 += getCostCheapestButtonPresses(
  AMovement!,
  BMovement!,
  pricePosition2!
);

console.log(`Part 1 solution: ${totalCost}`);
console.log(`Part 2 solution: ${totalCost2}`);
