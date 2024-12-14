import { FileReader } from "../utils";

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

interface Robot {
  position: Position;
  velocity: Velocity;
}

/**
  Takes one coordinate of an axis of the map (outside or inside the map) and transforms it back to the axis of the map using modulo
  Ensures that all coords stay in range [0, axisLength-1]
 */
function transformIntoMap(coord: number, axisLength: number): number {
  return ((coord % axisLength) + axisLength) % axisLength;
}

/**
  Moves a robot the given amount of steps on the map, while taking into account the teleportation between the sides of the map
 */
function moveSteps(
  robot: Robot,
  mapHeight: number,
  mapWidth: number,
  nSteps: number = 100
): Position {
  return {
    x: transformIntoMap(
      robot.position.x + robot.velocity.x * nSteps,
      mapHeight
    ),
    y: transformIntoMap(robot.position.y + robot.velocity.y * nSteps, mapWidth),
  };
}

/**
 * 
  From a list of given robot positions on a map calculates the safety factor by checking how many robots are in each quadrant of the map
 */
function calculateSafetyFactor(
  robotPositions: Position[],
  mapHeight: number,
  mapWidth: number
) {
  const middleX: number = Math.floor(mapHeight / 2);
  const middleY: number = Math.floor(mapWidth / 2);

  let topLeftCount: number = 0;
  let topRightCount: number = 0;
  let botLeftCount: number = 0;
  let botRightCount: number = 0;

  for (const pos of robotPositions) {
    if (pos.x === middleX || pos.y === middleY) continue;
    else if (pos.x < middleX) {
      if (pos.y < middleY) topLeftCount++;
      else topRightCount++;
    } else {
      if (pos.y < middleY) botLeftCount++;
      else botRightCount++;
    }
  }

  return topLeftCount * topRightCount * botLeftCount * botRightCount;
}

const robotStrings = FileReader.ReadRowByRow("input.txt");

const mapHeight: number = 103;
const mapWidth: number = 101;
let robots: Robot[] = [];
let positionsAfter100: Position[] = [];

for (const roboString of robotStrings) {
  const positionVel = roboString.split(" ");
  const posCoords = positionVel[0].split("=")[1].split(",");
  const velocities = positionVel[1].split("=")[1].split(",");
  const robot: Robot = {
    position: { x: Number(posCoords[1]), y: Number(posCoords[0]) },
    velocity: { x: Number(velocities[1]), y: Number(velocities[0]) },
  };

  robots.push(robot);
  positionsAfter100.push(moveSteps(robot, mapHeight, mapWidth));
}

let stepsTaken: number = 0;
let found: boolean = false;

// Logic for finding a christmas tree formation in the resulting robot map
while (!found) {
  stepsTaken++;

  const map: string[][] = Array.from({ length: mapHeight }, () =>
    Array(mapWidth).fill(".")
  );

  for (let robot of robots) {
    robot.position = moveSteps(robot, mapHeight, mapWidth, 1);
    map[robot.position.x][robot.position.y] = "R";
  }

  // Asummes that contigous Rs in a row correspond to a christsmas tree
  for (let row of map) {
    let streak: number = 0;

    for (const entry of row) {
      if (entry === "R") {
        streak++;

        if (streak === 10) {
          found = true;
          break;
        }
      } else {
        streak = 0;
      }
    }
  }
}

console.log(
  `Part 1 solution: ${calculateSafetyFactor(positionsAfter100, 103, 101)}`
);
console.log(`Part 2 solution: ${stepsTaken}`);
