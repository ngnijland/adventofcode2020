import fs from "fs";
import assert from "assert";
import path from "path";

function validatePart(numbers: number[], sum: number): boolean {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const a = numbers[i];
      const b = numbers[j];

      if (a !== b && a + b === sum) {
        return true;
      }
    }
  }

  return false;
}

function findWeakness(program: number[], preamble: number): number {
  for (let i = preamble; i < program.length; i++) {
    if (!validatePart(program.slice(i - preamble, i), program[i])) {
      return program[i];
    }
  }

  throw new Error("No weaknesses");
}

function contiguousSum(program: number[], sum: number): number[] {
  for (let i = 0; i < program.length; i++) {
    let total: number = 0;
    const list: number[] = [];

    while (total < sum) {
      const number = program[i + list.length];

      total = total + number;
      list.push(number);

      if (total === sum) {
        return list;
      }
    }
  }

  throw new Error(`No contiguous list of numbers add up to ${sum}`);
}

const program = [
  35,
  20,
  15,
  25,
  47,
  40,
  62,
  55,
  65,
  95,
  102,
  117,
  150,
  182,
  127,
  219,
  299,
  277,
  309,
  576,
];
const weakness = 127;

assert.strictEqual(findWeakness(program, 5), weakness);

assert.deepStrictEqual(contiguousSum(program, weakness), [15, 25, 47, 40]);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day9", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.split("\n").map(Number);
    const solutionA = findWeakness(input, 25);

    const weakness = contiguousSum(input, solutionA).sort((a, b) => a - b);
    const solutionB = weakness[0] + weakness[weakness.length - 1];

    console.log({ solutionA, solutionB });
  }
);
