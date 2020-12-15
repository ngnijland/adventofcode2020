import fs from "fs";
import assert from "assert";
import path from "path";
import deepEqual from "deep-equal";

type SeatingPlan = string[][];
type Direction =
  | "TOP"
  | "TOP_RIGHT"
  | "RIGHT"
  | "BOTTOM_RIGHT"
  | "BOTTOM"
  | "BOTTOM_LEFT"
  | "LEFT"
  | "TOP_LEFT";

function findNearestSeat(
  seatingPlan: SeatingPlan,
  seat: number[],
  direction: Direction
): "#" | "L" | undefined {
  let x = seat[0];
  let y = seat[1];

  function innerFn(): "#" | "L" | undefined {
    switch (direction) {
      case "TOP": {
        y = y - 1;
        break;
      }
      case "TOP_RIGHT": {
        x = x + 1;
        y = y - 1;
        break;
      }
      case "RIGHT": {
        x = x + 1;
        break;
      }
      case "BOTTOM_RIGHT": {
        x = x + 1;
        y = y + 1;
        break;
      }
      case "BOTTOM": {
        y = y + 1;
        break;
      }
      case "BOTTOM_LEFT": {
        x = x - 1;
        y = y + 1;
        break;
      }
      case "LEFT": {
        x = x - 1;
        break;
      }
      case "TOP_LEFT": {
        x = x - 1;
        y = y - 1;
        break;
      }
      default: {
        throw new Error("Invalid direction");
      }
    }

    if (
      y >= 0 &&
      y <= seatingPlan.length &&
      x >= 0 &&
      x <= seatingPlan[y]?.length
    ) {
      const currentSeat = seatingPlan[y][x];

      if (currentSeat === "L" || currentSeat === "#") {
        return currentSeat;
      }

      return innerFn();
    }

    return undefined;
  }

  return innerFn();
}

function applySeatingRound(seatingPlan: SeatingPlan): SeatingPlan {
  const newSeatingPlan: SeatingPlan = [];

  for (let y = 0; y < seatingPlan.length; y++) {
    newSeatingPlan[y] = [];

    for (let x = 0; x < seatingPlan[y].length; x++) {
      const seat = seatingPlan[y][x];

      if (seat === ".") {
        newSeatingPlan[y][x] = ".";
        continue;
      }

      const adjacentSeats = [
        // Top left
        findNearestSeat(seatingPlan, [x, y], "TOP_LEFT"),
        // Top
        findNearestSeat(seatingPlan, [x, y], "TOP"),
        // Top right
        findNearestSeat(seatingPlan, [x, y], "TOP_RIGHT"),
        // Right
        findNearestSeat(seatingPlan, [x, y], "RIGHT"),
        // Bottom right
        findNearestSeat(seatingPlan, [x, y], "BOTTOM_RIGHT"),
        // Bottom
        findNearestSeat(seatingPlan, [x, y], "BOTTOM"),
        // Bottom left
        findNearestSeat(seatingPlan, [x, y], "BOTTOM_LEFT"),
        // Left
        findNearestSeat(seatingPlan, [x, y], "LEFT"),
      ];

      const occupiedAdjacentSeats = adjacentSeats.filter((x) => x === "#")
        .length;

      if (seat === "L") {
        newSeatingPlan[y][x] = occupiedAdjacentSeats === 0 ? "#" : "L";
        continue;
      }

      if (seat === "#") {
        newSeatingPlan[y][x] = occupiedAdjacentSeats >= 5 ? "L" : "#";
        continue;
      }
    }
  }

  return newSeatingPlan;
}

assert.strictEqual(
  findNearestSeat(
    [
      [".", ".", ".", ".", ".", ".", ".", "#", "."],
      [".", ".", ".", "#", ".", ".", ".", ".", "."],
      [".", "#", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", "#", "L", ".", ".", ".", ".", "#"],
      [".", ".", ".", ".", "#", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", "."],
      ["#", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", "#", ".", ".", ".", ".", "."],
    ],
    [3, 4],
    "TOP"
  ),
  "#"
);

assert.strictEqual(
  findNearestSeat(
    [
      [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", "L", ".", "L", ".", "#", ".", "#", ".", "#", ".", "#", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    ],
    [1, 1],
    "RIGHT"
  ),
  "L"
);

assert.strictEqual(
  findNearestSeat(
    [
      [".", "#", "#", ".", "#", "#", "."],
      ["#", ".", "#", ".", "#", ".", "#"],
      ["#", "#", ".", ".", ".", "#", "#"],
      [".", ".", ".", "L", ".", ".", "."],
      ["#", "#", ".", ".", ".", "#", "#"],
      ["#", ".", "#", ".", "#", ".", "#"],
      [".", "#", "#", ".", "#", "#", "."],
    ],
    [3, 3],
    "TOP_LEFT"
  ),
  undefined
);

assert.strictEqual(
  findNearestSeat(
    [
      [".", "#", "#", ".", "#", "#", "."],
      ["#", ".", "#", ".", "#", ".", "#"],
      ["#", "#", ".", ".", ".", "#", "#"],
      [".", ".", ".", "L", ".", ".", "."],
      ["#", "#", ".", ".", ".", "#", "#"],
      ["#", ".", "#", ".", "#", ".", "#"],
      [".", "#", "#", ".", "#", "#", "."],
    ],
    [3, 3],
    "BOTTOM"
  ),
  undefined
);

assert.deepStrictEqual(
  applySeatingRound([
    ["L", ".", "L", "L", ".", "L", "L", ".", "L", "L"],
    ["L", "L", "L", "L", "L", "L", "L", ".", "L", "L"],
    ["L", ".", "L", ".", "L", ".", ".", "L", ".", "."],
    ["L", "L", "L", "L", ".", "L", "L", ".", "L", "L"],
    ["L", ".", "L", "L", ".", "L", "L", ".", "L", "L"],
    ["L", ".", "L", "L", "L", "L", "L", ".", "L", "L"],
    [".", ".", "L", ".", "L", ".", ".", ".", ".", "."],
    ["L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
    ["L", ".", "L", "L", "L", "L", "L", "L", ".", "L"],
    ["L", ".", "L", "L", "L", "L", "L", ".", "L", "L"],
  ]),
  [
    ["#", ".", "#", "#", ".", "#", "#", ".", "#", "#"],
    ["#", "#", "#", "#", "#", "#", "#", ".", "#", "#"],
    ["#", ".", "#", ".", "#", ".", ".", "#", ".", "."],
    ["#", "#", "#", "#", ".", "#", "#", ".", "#", "#"],
    ["#", ".", "#", "#", ".", "#", "#", ".", "#", "#"],
    ["#", ".", "#", "#", "#", "#", "#", ".", "#", "#"],
    [".", ".", "#", ".", "#", ".", ".", ".", ".", "."],
    ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ["#", ".", "#", "#", "#", "#", "#", "#", ".", "#"],
    ["#", ".", "#", "#", "#", "#", "#", ".", "#", "#"],
  ]
);

assert.deepStrictEqual(
  applySeatingRound([
    ["#", ".", "#", "#", ".", "#", "#", ".", "#", "#"],
    ["#", "#", "#", "#", "#", "#", "#", ".", "#", "#"],
    ["#", ".", "#", ".", "#", ".", ".", "#", ".", "."],
    ["#", "#", "#", "#", ".", "#", "#", ".", "#", "#"],
    ["#", ".", "#", "#", ".", "#", "#", ".", "#", "#"],
    ["#", ".", "#", "#", "#", "#", "#", ".", "#", "#"],
    [".", ".", "#", ".", "#", ".", ".", ".", ".", "."],
    ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ["#", ".", "#", "#", "#", "#", "#", "#", ".", "#"],
    ["#", ".", "#", "#", "#", "#", "#", ".", "#", "#"],
  ]),
  [
    ["#", ".", "L", "L", ".", "L", "L", ".", "L", "#"],
    ["#", "L", "L", "L", "L", "L", "L", ".", "L", "L"],
    ["L", ".", "L", ".", "L", ".", ".", "L", ".", "."],
    ["L", "L", "L", "L", ".", "L", "L", ".", "L", "L"],
    ["L", ".", "L", "L", ".", "L", "L", ".", "L", "L"],
    ["L", ".", "L", "L", "L", "L", "L", ".", "L", "L"],
    [".", ".", "L", ".", "L", ".", ".", ".", ".", "."],
    ["L", "L", "L", "L", "L", "L", "L", "L", "L", "#"],
    ["#", ".", "L", "L", "L", "L", "L", "L", ".", "L"],
    ["#", ".", "L", "L", "L", "L", "L", ".", "L", "#"],
  ]
);

assert.deepStrictEqual(
  applySeatingRound([
    ["#", ".", "L", "#", ".", "L", "#", ".", "L", "#"],
    ["#", "L", "L", "L", "L", "L", "L", ".", "L", "L"],
    ["L", ".", "L", ".", "L", ".", ".", "#", ".", "."],
    ["#", "#", "L", "#", ".", "#", "L", ".", "L", "#"],
    ["L", ".", "L", "#", ".", "L", "L", ".", "L", "#"],
    ["#", ".", "L", "L", "L", "L", "#", ".", "L", "L"],
    [".", ".", "#", ".", "L", ".", ".", ".", ".", "."],
    ["L", "L", "L", "#", "#", "#", "L", "L", "L", "#"],
    ["#", ".", "L", "L", "L", "L", "L", "#", ".", "L"],
    ["#", ".", "L", "#", "L", "L", "#", ".", "L", "#"],
  ]),
  [
    ["#", ".", "L", "#", ".", "L", "#", ".", "L", "#"],
    ["#", "L", "L", "L", "L", "L", "L", ".", "L", "L"],
    ["L", ".", "L", ".", "L", ".", ".", "#", ".", "."],
    ["#", "#", "L", "#", ".", "#", "L", ".", "L", "#"],
    ["L", ".", "L", "#", ".", "L", "L", ".", "L", "#"],
    ["#", ".", "L", "L", "L", "L", "#", ".", "L", "L"],
    [".", ".", "#", ".", "L", ".", ".", ".", ".", "."],
    ["L", "L", "L", "#", "#", "#", "L", "L", "L", "#"],
    ["#", ".", "L", "L", "L", "L", "L", "#", ".", "L"],
    ["#", ".", "L", "#", "L", "L", "#", ".", "L", "#"],
  ]
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day11_2", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data
      .trim()
      .split("\n")
      .map((line) => line.split(""));

    let prevSeatingPlan: SeatingPlan = [];
    let seatingPlan: SeatingPlan = input;

    while (!deepEqual(prevSeatingPlan, seatingPlan)) {
      prevSeatingPlan = seatingPlan;
      seatingPlan = applySeatingRound(seatingPlan);
    }

    console.log(
      seatingPlan.flatMap((row) => row.filter((seat) => seat === "#")).length
    );
  }
);
