import fs from "fs";
import assert from "assert";
import path from "path";

function fixExpenseReport(expenses: number[]): number {
  for (let i = 0; i < expenses.length; i++) {
    for (let j = i + 1; j < expenses.length; j++) {
      for (let k = j + 1; k < expenses.length; k++) {
        if (expenses[i] + expenses[j] + expenses[k] === 2020) {
          return expenses[i] * expenses[j] * expenses[k];
        }
      }
    }
  }
}

assert.strictEqual(
  fixExpenseReport([1721, 979, 366, 299, 675, 1456]),
  241861950
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day1", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.split("\n").map((x) => parseInt(x, 10));
    console.log(fixExpenseReport(input));
  }
);
