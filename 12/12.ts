import { FileReader } from "../utils";

type Position = [number, number];
interface Region {
  area: number;
  perimeter: number;
  sides: number;
}

interface Side {
  minIdx: number;
  maxIdx: number;
}

const directionMap = new Map<string, Position>([
  ["DOWN", [1, 0]],
  ["UP", [-1, 0]],
  ["RIGHT", [0, 1]],
  ["LEFT", [0, -1]],
]);

/**
    By a given primaryIdx (can be row or column idx) and secondaryIdx (which should be the other of the two) of a position
    and a sideMap checks if this index introduces a new side to a region or if it merges two sides or if it just
    enlongs a side.
    Returns 1 on new side (because a side was added), -1 on merge (because in total there is one less side now) and 0
    if a side was enlonged (because no side was created or removed).
 */
function updateSideMap(
  sideMap: Map<number, Side[]>,
  primaryIdx: number,
  secondaryIdx: number
): number {
  if (!sideMap.has(primaryIdx)) {
    // There are no sides in primaryIdx (row or col) so far
    sideMap.set(primaryIdx, [{ minIdx: secondaryIdx, maxIdx: secondaryIdx }]);
    return 1;
  }

  let allSides: Side[] = sideMap.get(primaryIdx)!;
  let attachedSideMin: Side | undefined = allSides.find(
    (side) => side.minIdx === secondaryIdx + 1
  );
  let attachedSideMax: Side | undefined = allSides.find(
    (side) => side.maxIdx === secondaryIdx - 1
  );

  // Enlarge / merge already existing sides in primary row/col if they are connected to our given position (given by primaryIdx and secondaryIdx)
  if (attachedSideMin && attachedSideMax) {
    // The two sides need to be merged into one
    attachedSideMin.minIdx = attachedSideMax.minIdx;
    allSides.splice(allSides.indexOf(attachedSideMax), 1);
    // Remove one side count because we previously added 1 to much
    return -1;
  } else if (attachedSideMin) {
    attachedSideMin.minIdx--;
    return 0;
  } else if (attachedSideMax) {
    attachedSideMax.maxIdx++;
    return 0;
  }

  // Completly new side found in primaryIdx (row or col)
  allSides.push({ minIdx: secondaryIdx, maxIdx: secondaryIdx });
  return 1;
}

/**
    Traverses a single region from its startPos and on the way calculates its properties (area, perimeter, and sides).
    Also adds all positions of the area to the given visited set.
 */
function discoverRegion(
  map: string[][],
  visited: Set<string>,
  startPos: Position,
  mapHeight: number,
  mapWidth: number
): Region {
  const [startX, startY] = startPos;
  const plant: string = map[startX][startY];
  visited.add(`${startX}|${startY}`);

  let perimeter: number = 0;
  let area: number = 1;
  let sides: number = 0;
  let topSidesByRow: Map<number, Side[]> = new Map<number, Side[]>();
  let bottomSidesByRow: Map<number, Side[]> = new Map<number, Side[]>();
  let rightSidesByCol: Map<number, Side[]> = new Map<number, Side[]>();
  let lefSidesByCol: Map<number, Side[]> = new Map<number, Side[]>();
  let queue: Position[] = [startPos];

  while (queue.length) {
    const [currX, currY]: Position = queue.shift()!;

    directionMap.forEach(([dx, dy], direction) => {
      const newX: number = currX + dx;
      const newY: number = currY + dy;
      const newPosKey: string = `${newX}|${newY}`;

      if (
        newX < 0 ||
        newX >= mapHeight ||
        newY < 0 ||
        newY >= mapWidth ||
        map[newX][newY] !== plant
      ) {
        perimeter += 1;

        if (direction === "UP") {
          sides += updateSideMap(topSidesByRow, currX, currY);
        } else if (direction === "DOWN") {
          sides += updateSideMap(bottomSidesByRow, currX, currY);
        } else if (direction === "RIGHT") {
          sides += updateSideMap(rightSidesByCol, currY, currX);
        } else {
          sides += updateSideMap(lefSidesByCol, currY, currX);
        }
      } else if (!visited.has(newPosKey)) {
        area += 1;
        visited.add(newPosKey);
        queue.push([newX, newY]);
      }
    });
  }

  return { area, perimeter, sides };
}

/**
    Find all regions on the map and returns a list of them with their properties (area, perimeter, and sides).
 */
function extractAllRegions(map: string[][]): Region[] {
  const mapHeight = map.length;
  const mapWidth = map[0].length;

  let regions: Region[] = [];
  let visited: Set<string> = new Set<string>();

  for (let x = 0; x < mapHeight; x++) {
    for (let y = 0; y < mapWidth; y++) {
      if (!visited.has(`${x}|${y}`)) {
        regions.push(discoverRegion(map, visited, [x, y], mapHeight, mapWidth));
      }
    }
  }

  return regions;
}

const map = FileReader.readAs2DMap("input.txt", "") as string[][];

const regions: Region[] = extractAllRegions(map);

let totalPrice: number = 0;
let totalPriceSides: number = 0;

for (const region of regions) {
  totalPrice += region.area * region.perimeter;
  totalPriceSides += region.area * region.sides;
}

console.log(`Part 1 solution: ${totalPrice}`);
console.log(`Part 2 solution: ${totalPriceSides}`);
