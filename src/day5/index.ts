import fs from "fs";
import assert from "assert";
import path from "path";

function decodeBinarySpacePartitioning(
  code: string,
  upperHalfCommand: string,
  bottomHalfCommand: string,
  minRange: number,
  maxRange: number
): number {
  return code.split("").reduce(
    (acc, command) => {
      const min = acc[0];
      const max = acc[1];

      if (command === bottomHalfCommand) {
        return [min, Math.floor(max - (max - min) / 2)];
      }

      if (command === upperHalfCommand) {
        return [Math.ceil(min + (max - min) / 2), max];
      }

      throw new Error("Invalid command");
    },
    [minRange, maxRange]
  )[0];
}

function decodeSeat(seat: string): [number, number] {
  const rowCode = seat.substr(0, 7);
  const columnCode = seat.substr(7);

  const row = decodeBinarySpacePartitioning(rowCode, "B", "F", 0, 127);
  const column = decodeBinarySpacePartitioning(columnCode, "R", "L", 0, 8);

  return [row, column];
}

assert.deepStrictEqual(decodeSeat("FBFBBFFRLR"), [44, 5]);
assert.deepStrictEqual(decodeSeat("BFFFBBFRRR"), [70, 7]);
assert.deepStrictEqual(decodeSeat("FFFBBBFRRR"), [14, 7]);
assert.deepStrictEqual(decodeSeat("BBFFBBFRLL"), [102, 4]);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day5", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.trim().split("\n");

    console.log(
      Math.max(
        ...input.map((code) => {
          const [row, column] = decodeSeat(code);
          return row * 8 + column;
        })
      )
    );
  }
);
