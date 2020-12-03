import fs from "fs";
import assert from "assert";
import path from "path";

function treesEncountered(
  map: string[][],
  [velocityRight, velocityDown]: number[]
): number {
  let x = 0;
  let y = 0;
  const end = map.length - 1;

  let trees = 0;

  while (y < end) {
    y = y + velocityDown;
    x =
      x + velocityRight > map[y].length - 1
        ? x + velocityRight - map[y].length
        : x + velocityRight;

    if (map[y][x] === "#") {
      trees = trees + 1;
    }
  }

  return trees;
}

assert.strictEqual(
  treesEncountered(
    [
      [".", ".", "#", "#", ".", ".", ".", ".", ".", ".", "."],
      ["#", ".", ".", ".", "#", ".", ".", ".", "#", ".", "."],
      [".", "#", ".", ".", ".", ".", "#", ".", ".", "#", "."],
      [".", ".", "#", ".", "#", ".", ".", ".", "#", ".", "#"],
      [".", "#", ".", ".", ".", "#", "#", ".", ".", "#", "."],
      [".", ".", "#", ".", "#", "#", ".", ".", ".", ".", "."],
      [".", "#", ".", "#", ".", "#", ".", ".", ".", ".", "#"],
      [".", "#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", ".", "#", "#", ".", ".", ".", "#", ".", ".", "."],
      ["#", ".", ".", ".", "#", "#", ".", ".", ".", ".", "#"],
      [".", "#", ".", ".", "#", ".", ".", ".", "#", ".", "#"],
    ],
    [3, 1]
  ),
  7
);

assert.strictEqual(
  treesEncountered(
    [
      [".", ".", "#", "#", ".", ".", ".", ".", ".", ".", "."],
      ["#", ".", ".", ".", "#", ".", ".", ".", "#", ".", "."],
      [".", "#", ".", ".", ".", ".", "#", ".", ".", "#", "."],
      [".", ".", "#", ".", "#", ".", ".", ".", "#", ".", "#"],
      [".", "#", ".", ".", ".", "#", "#", ".", ".", "#", "."],
      [".", ".", "#", ".", "#", "#", ".", ".", ".", ".", "."],
      [".", "#", ".", "#", ".", "#", ".", ".", ".", ".", "#"],
      [".", "#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", ".", "#", "#", ".", ".", ".", "#", ".", ".", "."],
      ["#", ".", ".", ".", "#", "#", ".", ".", ".", ".", "#"],
      [".", "#", ".", ".", "#", ".", ".", ".", "#", ".", "#"],
    ],
    [1, 1]
  ),
  2
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day3", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data
      .trim()
      .split("\n")
      .map((line) => line.split(""));

    const routes = [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ];

    console.log(
      routes.reduce((acc, route) => acc * treesEncountered(input, route), 1)
    );
  }
);
