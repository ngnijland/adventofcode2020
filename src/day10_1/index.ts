import fs from "fs";
import assert from "assert";
import path from "path";

interface Differences {
  [key: string]: number;
}

function getDifferences(joltageRatings: number[]): Differences {
  const ratings = [0, ...joltageRatings].sort((a, b) => a - b);
  ratings.push(ratings[ratings.length - 1] + 3);

  return ratings.reduce((acc: Differences, rating, index, source) => {
    if (index === 0) {
      return {};
    }

    const difference = rating - source[index - 1];

    return { ...acc, [difference]: acc[difference] ? acc[difference] + 1 : 1 };
  }, {});
}

assert.deepStrictEqual(
  getDifferences([16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4]),
  { 1: 7, 3: 5 }
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day10_1", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.trim().split("\n").map(Number);
    const differences = getDifferences(input);
    console.log(differences[1] * differences[3]);
  }
);
