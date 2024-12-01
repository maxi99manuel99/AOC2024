"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileReader = void 0;
var fs_1 = require("fs");
var FileReader = /** @class */ (function () {
    function FileReader() {
    }
    /*
      Function to read two columns from an input file as separate lists and returns an object of left and right column.
      Supports using a transformer to modify read values (e.g casting the type of the values). If no transform is given values will stay as the original strings.
    */
    FileReader.readColumnsSeperately = function (filePath, transform) {
        if (transform === void 0) { transform = function (value) { return value; }; }
        var fileContent = (0, fs_1.readFileSync)(filePath, "utf-8");
        var leftColumn = [];
        var rightColumn = [];
        // Split the file into lines by splitting at \n
        var lines = fileContent.trim().split("\n");
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var _a = line.split(/\s+/), left = _a[0], right = _a[1]; // Split by whitespace
            // Apply transform (e.g. type casting) and push to columns
            leftColumn.push(transform(left));
            rightColumn.push(transform(right));
        }
        return { leftColumn: leftColumn, rightColumn: rightColumn };
    };
    return FileReader;
}());
exports.FileReader = FileReader;
