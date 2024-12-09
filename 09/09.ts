import { FileReader } from "../utils";

interface Block {
  startIdx: number;
  size: number;
}

/**
    Calculates the checksum of the file system after all single files are moved to free space on the left
 */
function getChckSumMoveSingleFile(
  diskArr: string[],
  leftMostFreeIdx: number,
  rightMostFileIdx: number
) {
  let diskArray = Object.assign([], diskArr);

  while (leftMostFreeIdx < rightMostFileIdx) {
    // swap values at the indices
    [diskArray[leftMostFreeIdx], diskArray[rightMostFileIdx]] = [
      diskArray[rightMostFileIdx],
      diskArray[leftMostFreeIdx],
    ];

    while (diskArray[leftMostFreeIdx] !== ".") leftMostFreeIdx++;
    while (diskArray[rightMostFileIdx] === ".") rightMostFileIdx--;
  }

  let chkSum: number = 0;

  for (let i = 0; i <= rightMostFileIdx; i++) {
    chkSum += i * Number(diskArray[i]);
  }

  return chkSum;
}

/**
    Calculates the checksum of the file system after all file blocks are moved to free space on their left
 */
function getChckSumMoveFileBlocks(
  diskArr: string[],
  freeBlocks: Block[],
  fileBlocks: Block[]
) {
  let diskArray = Object.assign([], diskArr);
  // fileBlocks are needed in reverse order to move from the right to the left
  fileBlocks.sort((a, b) => b.startIdx - a.startIdx);

  fileBlocks.forEach((fileBlock) => {
    // find will find the first occurance that matches the criteria
    // since the freeBlocks are ordered from lowerIdx to higher this will find the lowest guaranteed
    const freeSpaceIdx = freeBlocks.findIndex(
      (freeBlock) =>
        freeBlock.startIdx < fileBlock.startIdx &&
        freeBlock.size >= fileBlock.size
    );

    if (freeSpaceIdx !== -1) {
      const freeBlock = freeBlocks[freeSpaceIdx];

      for (let i = 0; i < fileBlock.size; i++) {
        // swap values at the indices
        [diskArray[fileBlock.startIdx + i], diskArray[freeBlock.startIdx + i]] =
          [
            diskArray[freeBlock.startIdx + i],
            diskArray[fileBlock.startIdx + i],
          ];
      }

      freeBlock.size -= fileBlock.size;
      freeBlock.startIdx += fileBlock.size;

      if (freeBlock.size === 0) {
        // remove the freeBlock because it has no space left
        freeBlocks.splice(freeSpaceIdx, 1);
      }
    }
  });

  let chkSum: number = 0;

  for (let i = 0; i < diskArray.length; i++) {
    if (diskArray[i] !== ".") chkSum += i * Number(diskArray[i]);
  }

  return chkSum;
}

const diskInput = FileReader.readAsSingleString("input.txt");

let diskArray: string[] = [];
let freeBlocks: Block[] = [];
let fileBlocks: Block[] = [];

for (let i = 0; i < diskInput.length; i++) {
  if (i % 2 == 0) {
    const id: string = "" + i / 2;
    const amountFile = Number(diskInput[i]);
    diskArray.push(...Array(amountFile).fill(id));
    fileBlocks.push({
      startIdx: diskArray.length - amountFile,
      size: amountFile,
    });
    // ignore trailing free space
  } else if (i !== diskInput.length - 1) {
    const amountFree = Number(diskInput[i]);
    diskArray.push(...Array(amountFree).fill("."));
    freeBlocks.push({
      startIdx: diskArray.length - amountFree,
      size: amountFree,
    });
  }
}

let leftMostFreeIdx: number = Number(diskInput[0]);
let rightMostFileIdx: number = diskArray.length - 1;

console.log(
  `Part 1 solution: ${getChckSumMoveSingleFile(
    diskArray,
    leftMostFreeIdx,
    rightMostFileIdx
  )}`
);
console.log(
  `Part 2 solution: ${getChckSumMoveFileBlocks(
    diskArray,
    freeBlocks,
    fileBlocks
  )}`
);
