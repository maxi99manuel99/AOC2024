import { FileReader } from "../utils";

let reports: number[][] = FileReader.readAllRows("input.txt", (value) =>
  Number(value)
);

/**
    Function to check wheter a report is valid by checking the validation criteria for all entries
*/
function isValidReport(report: number[]): boolean {
  let increasing: boolean = true;
  return report.every((value, idx) => {
    if (idx === report.length - 1) return true;

    if (idx === 0) increasing = report[idx + 1] > value;

    if (increasing) {
      return report[idx + 1] > value && report[idx + 1] < value + 4;
    } else {
      return report[idx + 1] < value && report[idx + 1] > value - 4;
    }
  });
}

/**
    Function that counts all valid reports in a report array
    If allowOneLevelRemove is set to true also checks if an report would be valid when removing a level
*/
function calculateNumValidReports(
  reports: number[][],
  allowOneLvlRemove: boolean = false
): number {
  let validReportSum = 0;
  for (const report of reports) {
    let valid = isValidReport(report);

    if (!valid && allowOneLvlRemove) {
      for (let i = 0; i < report.length; i++) {
        const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];

        if (isValidReport(modifiedReport)) {
          valid = true;
          break;
        }
      }
    }
    validReportSum += valid ? 1 : 0;
  }

  return validReportSum;
}

console.log(`Part 1 solution: ${calculateNumValidReports(reports)}`);
console.log(`Part 2 solution: ${calculateNumValidReports(reports, true)}`);
