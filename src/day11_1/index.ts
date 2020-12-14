import fs from "fs";
import assert from "assert";
import path from "path";
import deepEqual from "deep-equal";

type SeatingPlan = string[][];

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
        seatingPlan[y - 1]?.[x - 1],
        // Top
        seatingPlan[y - 1]?.[x],
        // Top right
        seatingPlan[y - 1]?.[x + 1],
        // Right
        seatingPlan[y]?.[x + 1],
        // Bottom right
        seatingPlan[y + 1]?.[x + 1],
        // Bottom
        seatingPlan[y + 1]?.[x],
        // Bottom left
        seatingPlan[y + 1]?.[x - 1],
        // Left
        seatingPlan[y]?.[x - 1],
      ];
      const occupiedAdjacentSeats = adjacentSeats.filter((x) => x === "#")
        .length;

      if (seat === "L") {
        newSeatingPlan[y][x] = occupiedAdjacentSeats === 0 ? "#" : "L";
        continue;
      }

      if (seat === "#") {
        newSeatingPlan[y][x] = occupiedAdjacentSeats >= 4 ? "L" : "#";
        continue;
      }
    }
  }

  return newSeatingPlan;
}

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
    ["#", ".", "L", "L", ".", "L", "#", ".", "#", "#"],
    ["#", "L", "L", "L", "L", "L", "L", ".", "L", "#"],
    ["L", ".", "L", ".", "L", ".", ".", "L", ".", "."],
    ["#", "L", "L", "L", ".", "L", "L", ".", "L", "#"],
    ["#", ".", "L", "L", ".", "L", "L", ".", "L", "L"],
    ["#", ".", "L", "L", "L", "L", "#", ".", "#", "#"],
    [".", ".", "L", ".", "L", ".", ".", ".", ".", "."],
    ["#", "L", "L", "L", "L", "L", "L", "L", "L", "#"],
    ["#", ".", "L", "L", "L", "L", "L", "L", ".", "L"],
    ["#", ".", "#", "L", "L", "L", "L", ".", "#", "#"],
  ]
);

assert.deepStrictEqual(
  applySeatingRound([
    ["#", ".", "L", "L", ".", "L", "#", ".", "#", "#"],
    ["#", "L", "L", "L", "L", "L", "L", ".", "L", "#"],
    ["L", ".", "L", ".", "L", ".", ".", "L", ".", "."],
    ["#", "L", "L", "L", ".", "L", "L", ".", "L", "#"],
    ["#", ".", "L", "L", ".", "L", "L", ".", "L", "L"],
    ["#", ".", "L", "L", "L", "L", "#", ".", "#", "#"],
    [".", ".", "L", ".", "L", ".", ".", ".", ".", "."],
    ["#", "L", "L", "L", "L", "L", "L", "L", "L", "#"],
    ["#", ".", "L", "L", "L", "L", "L", "L", ".", "L"],
    ["#", ".", "#", "L", "L", "L", "L", ".", "#", "#"],
  ]),
  [
    ["#", ".", "#", "#", ".", "L", "#", ".", "#", "#"],
    ["#", "L", "#", "#", "#", "L", "L", ".", "L", "#"],
    ["L", ".", "#", ".", "#", ".", ".", "#", ".", "."],
    ["#", "L", "#", "#", ".", "#", "#", ".", "L", "#"],
    ["#", ".", "#", "#", ".", "L", "L", ".", "L", "L"],
    ["#", ".", "#", "#", "#", "L", "#", ".", "#", "#"],
    [".", ".", "#", ".", "#", ".", ".", ".", ".", "."],
    ["#", "L", "#", "#", "#", "#", "#", "#", "L", "#"],
    ["#", ".", "L", "L", "#", "#", "#", "L", ".", "L"],
    ["#", ".", "#", "L", "#", "#", "#", ".", "#", "#"],
  ]
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day11_1", "input"),
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
