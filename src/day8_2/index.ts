import fs from "fs";
import assert from "assert";
import path from "path";

function executeProgram(program: string[]): number | Error {
  let acc: number = 0;
  let index: number = 0;
  const executedInstructions: number[] = [];

  function innerFn(instruction: string): Error | void {
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
      throw new Error("Infinite loop");
    }

    if (typeof program[index] === "undefined") {
      throw new Error("Instruction does not exist");
    }

    innerFn(program[index]);
  }

  try {
    innerFn(program[index]);
  } catch (e) {
    return e;
  }

  return acc;
}

function bruteForceProgram(program: string[]): void {
  let lastMutatedIndex = -1;

  function innerFn() {
    const programCopy = [...program];

    const index = program.findIndex(
      (instruction, index) =>
        index > lastMutatedIndex &&
        (instruction.includes("jmp") || instruction.includes("nop"))
    );

    const operation = programCopy[index].includes("jmp") ? "jmp" : "nop";

    programCopy[index] = programCopy[index].replace(
      operation === "jmp" ? "jmp" : "nop",
      operation === "jmp" ? "nop" : "jmp"
    );

    const result = executeProgram(programCopy);

    if (typeof result === "number") {
      console.log(result);
    } else {
      lastMutatedIndex = index;
      innerFn();
    }
  }

  innerFn();
}

assert.deepStrictEqual(
  executeProgram(
    "nop +0\nacc +1\njmp +4\nacc +3\njmp -3\nacc -99\nacc +1\njmp -4\nacc +6".split(
      "\n"
    )
  ),
  new Error("Infinite loop")
);
assert.strictEqual(
  executeProgram(
    "nop +0\nacc +1\njmp +4\nacc +3\njmp -3\nacc -99\nacc +1\nnop -4\nacc +6".split(
      "\n"
    )
  ),
  8
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day8_1", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.trim().split("\n");

    bruteForceProgram(input);
  }
);
