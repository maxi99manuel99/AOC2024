import { readFileSync } from "fs";

class FileReader {
  /** 
    Function to read two columns from an input file as separate lists and returns an object of left and right column.
    Supports using a transformer to modify read values (e.g casting the type of the values). If no transform is given values will stay as the original strings.
  */
  static readTwoColumnsSeperately<T>(
    filePath: string,
    transform: (value: string) => T = (value: string) => value as T
  ): {
    leftColumn: T[];
    rightColumn: T[];
  } {
    const fileContent = readFileSync(filePath, "utf-8");

    const leftColumn: T[] = [];
    const rightColumn: T[] = [];

    // Split the file into lines by splitting at \n
    const lines = fileContent.trim().split("\n");
    for (const line of lines) {
      const [left, right] = line.split(/\s+/); // Split by whitespace

      // Apply transform (e.g. type casting) and push to columns
      leftColumn.push(transform(left));
      rightColumn.push(transform(right));
    }

    return { leftColumn, rightColumn };
  }
  /**
    Function to read rows from an input file, where each row is split into a list of entries.
    Supports using a transformer to modify read values (e.g. casting the type of the values). 
    If no transform is given, values will remain as their original strings.
  */
  static readAllRows<T>(
    filePath: string,
    transform: (value: string) => T = (value: string) => value as T
  ): T[][] {
    const fileContent = readFileSync(filePath, "utf-8");

    // Split the file into lines by splitting at \n
    const lines = fileContent.trim().split("\n");

    const rows: T[][] = lines.map((line) => {
      const entries = line.split(/\s+/); // Split by whitespace
      return entries.map(transform); // Apply transform to each entry
    });

    return rows;
  }
}

export { FileReader };
