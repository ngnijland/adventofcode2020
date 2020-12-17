import fs from "fs";
import assert from "assert";
import path from "path";

function countPossibilities(joltageRatings: number[]): number {
  const ratings = [0, ...joltageRatings].sort((a, b) => a - b);
  ratings.push(ratings[ratings.length - 1] + 3);

  /*
   * I did not find this solution myself
   *
   * Amazing explanation here:
   * https://www.youtube.com/watch?v=_f8N7qo_5hA
   */
  function innerFn(
    ratings: number[],
    i: number = 0,
    memo: { [key: string]: number } = {}
  ): number {
    if (i in memo) {
      return memo[i];
    }

    if (i === ratings.length - 1) {
      return 1;
    }

    const possibleNextRatings = ratings
      .slice(i + 1, i + 4)
      .filter((x) => x <= ratings[i] + 3);

    return possibleNextRatings.reduce((acc, _, index) => {
      const total = acc + innerFn(ratings, i + index + 1, memo);
      memo[i] = total;
      return total;
    }, 0);
  }

  return innerFn(ratings);
}

assert.deepStrictEqual(
  countPossibilities([16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4]),
  8
);

assert.deepStrictEqual(
  countPossibilities([
    28,
    33,
    18,
    42,
    31,
    14,
    46,
    20,
    48,
    47,
    24,
    23,
    49,
    45,
    19,
    38,
    39,
    11,
    1,
    32,
    25,
    35,
    8,
    17,
    7,
    9,
    4,
    2,
    34,
    10,
    3,
  ]),
  19208
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day10_1", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.trim().split("\n").map(Number);
    console.log(countPossibilities(input));
  }
);
