"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var numberCols = utils_1.FileReader.readColumnsSeperately("input.txt", function (value) { return Number(value); });
numberCols.leftColumn.sort();
numberCols.rightColumn.sort();
var totalDistance = 0;
var rightAppearanceSum = 0;
var rightColumnLowestIdx = 0;
var previous_left = -1;
var rightAppearanceCount = 0;
for (var i = 0; i < numberCols.leftColumn.length; i++) {
    var leftColVal = numberCols.leftColumn[i];
    totalDistance += Math.abs(leftColVal - numberCols.rightColumn[i]);
    if (previous_left === leftColVal) {
        rightAppearanceSum += previous_left * rightAppearanceCount;
        continue;
    }
    previous_left = leftColVal;
    rightAppearanceCount = 0;
    for (var j = rightColumnLowestIdx; j < numberCols.rightColumn.length; j++) {
        var rightColVal = numberCols.rightColumn[j];
        if (rightColVal > leftColVal)
            break;
        else if (rightColVal === leftColVal)
            rightAppearanceCount++;
        rightColumnLowestIdx = j;
    }
    rightAppearanceSum += leftColVal * rightAppearanceCount;
}
console.log("Part 1 solution: ".concat(totalDistance));
console.log("Part 2 solution: ".concat(rightAppearanceSum));
