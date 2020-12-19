import fs from "fs";
import assert from "assert";
import path from "path";

interface ParsedInput {
  time: number;
  busses: number[];
}

function parseInput(input: string): ParsedInput {
  const [timeRaw, bussesRaw] = input.split("\n");

  return {
    time: Number(timeRaw),
    busses: bussesRaw
      .split(",")
      .map(Number)
      .filter((x) => !isNaN(x)),
  };
}

function solve({ time: minTime, busses }: ParsedInput): number {
  for (let time = minTime; time < Infinity; time++) {
    for (let i = 0; i < busses.length; i++) {
      if (time % busses[i] === 0) {
        return busses[i] * (time - minTime);
      }
    }
  }
}

assert.deepStrictEqual(parseInput("939\n7,13,x,x,59,x,31,19"), {
  time: 939,
  busses: [7, 13, 59, 31, 19],
});

assert.strictEqual(
  solve({
    time: 939,
    busses: [7, 13, 59, 31, 19],
  }),
  295
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day13_1", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = parseInput(data.trim());
    console.log(solve(input));
  }
);
