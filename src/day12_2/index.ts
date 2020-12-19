import fs from "fs";
import assert from "assert";
import path from "path";

type Action = "N" | "E" | "S" | "W" | "F" | "R" | "L";

interface Instruction {
  action: Action;
  value: number;
}

const directions = ["N", "E", "S", "W"];

function parseLine(line: string): Instruction {
  const [action, ...valueRaw] = line;

  return {
    action: action as Action,
    value: Number(valueRaw.join("")),
  };
}

function getManhattanDistance(instructions: Instruction[]): number {
  let x = 0;
  let y = 0;
  let waypoint = [10, -1];

  for (let i = 0; i < instructions.length; i++) {
    switch (instructions[i].action) {
      case "N": {
        waypoint[1] = waypoint[1] - instructions[i].value;
        break;
      }
      case "E": {
        waypoint[0] = waypoint[0] + instructions[i].value;
        break;
      }
      case "S": {
        waypoint[1] = waypoint[1] + instructions[i].value;
        break;
      }
      case "W": {
        waypoint[0] = waypoint[0] - instructions[i].value;
        break;
      }
      case "F": {
        x = x + waypoint[0] * instructions[i].value;
        y = y + waypoint[1] * instructions[i].value;
        break;
      }
      case "R":
      case "L": {
        const { action, value } = instructions[i];
        const prevWaypoint = [...waypoint];

        if (value === 180) {
          waypoint[0] = prevWaypoint[0] * -1;
          waypoint[1] = prevWaypoint[1] * -1;
          break;
        }

        if (
          (action === "R" && value === 90) ||
          (action === "L" && value === 270)
        ) {
          waypoint[0] = prevWaypoint[1] * -1;
          waypoint[1] = prevWaypoint[0];
          break;
        }

        if (
          (action === "L" && value === 90) ||
          (action === "R" && value === 270)
        ) {
          waypoint[0] = prevWaypoint[1];
          waypoint[1] = prevWaypoint[0] * -1;
          break;
        }

        throw new Error("Invalid rotation or action");
      }
      default: {
        throw new Error("Invalid action");
      }
    }
  }

  if (x < 0) {
    x = x * -1;
  }

  if (y < 0) {
    y = y * -1;
  }

  return x + y;
}

assert.deepStrictEqual(parseLine("F10"), { action: "F" as Action, value: 10 });

assert.strictEqual(
  getManhattanDistance([
    { action: "F", value: 10 },
    { action: "N", value: 3 },
    { action: "F", value: 7 },
    { action: "R", value: 90 },
    { action: "F", value: 11 },
  ]),
  286
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day12_1", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.trim().split("\n").map(parseLine);
    console.log(getManhattanDistance(input));
  }
);
