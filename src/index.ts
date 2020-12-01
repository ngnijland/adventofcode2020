const assert = require("assert").strict;

function fixExpenseReport(expenses: number[]): number {
  for (let i = 0; i < expenses.length; i++) {
    for (let j = i + 1; j < expenses.length; j++) {
      if (expenses[i] + expenses[j] === 2020) {
        return expenses[i] * expenses[j];
      }
    }
  }
}

assert.strictEqual(fixExpenseReport([1721, 979, 366, 299, 675, 1456]), 514579);
