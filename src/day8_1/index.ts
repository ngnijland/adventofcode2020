import fs from "fs";
import assert from "assert";
import path from "path";

function executeProgram(program: string[]): number {
  let acc: number = 0;
  let index: number = 0;
  const executedInstructions: number[] = [];

  function innerFn(instruction: string): void {
    const [operation, argument] = instruction.split(" ");

    switch (operation) {
      case "acc": {
        acc = acc + Number(argument);

        executedInstructions.push(index);
        index = index + 1;
        break;
      }
      case "jmp": {
        executedInstructions.push(index);
        index = index + Number(argument);
        break;
      }
      case "nop": {
        executedInstructions.push(index);
        index = index + 1;
        break;
      }
      default: {
        throw new Error("Unknown operation");
      }
    }

    if (executedInstructions.includes(index)) {
      return;
    }

    innerFn(program[index]);
  }

  innerFn(program[index]);

  return acc;
}

assert.strictEqual(
  executeProgram(
    "nop +0\nacc +1\njmp +4\nacc +3\njmp -3\nacc -99\nacc +1\njmp -4\nacc +6".split(
      "\n"
    )
  ),
  5
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day8_1", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.trim().split("\n");

    console.log(executeProgram(input));
  }
);
