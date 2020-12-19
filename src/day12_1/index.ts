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
  let direction = 1;

  for (let i = 0; i < instructions.length; i++) {
    const action =
      instructions[i].action === "F"
        ? directions[direction]
        : instructions[i].action;

    switch (action) {
      case "N": {
        y = y - instructions[i].value;
        break;
      }
      case "E": {
        x = x + instructions[i].value;
        break;
      }
      case "S": {
        y = y + instructions[i].value;
        break;
      }
      case "W": {
        x = x - instructions[i].value;
        break;
      }
      case "R": {
        const turns = instructions[i].value / 90;
        const newDirection = direction + turns;

        if (newDirection > directions.length - 1) {
          direction = newDirection - directions.length;
        } else {
          direction = newDirection;
        }
        break;
      }
      case "L": {
        const turns = instructions[i].value / 90;
        const newDirection = direction - turns;

        if (newDirection < 0) {
          direction = newDirection + directions.length;
        } else {
          direction = newDirection;
        }
        break;
      }
      default: {
        console.log(instructions[i]);
        throw new Error("Invalid action");
      }
    }
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
  25
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
