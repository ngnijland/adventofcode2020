import fs from "fs";
import assert from "assert";
import path from "path";

interface ParsedLine {
  positionOne: number;
  positionTwo: number;
  character: string;
  password: string;
}

function parseLine(line: string): ParsedLine {
  const [positionsRaw, [character], password] = line.split(" ");
  const positions = positionsRaw.split("-").map((x) => parseInt(x, 10));

  return {
    positionOne: positions[0],
    positionTwo: positions[1],
    character,
    password,
  };
}

function isValidPassword({
  positionOne,
  positionTwo,
  character,
  password,
}: ParsedLine): boolean {
  const firstCharacter = password[positionOne - 1] === character;
  const secondCharacter = password[positionTwo - 1] === character;

  return (
    (firstCharacter && !secondCharacter) || (!firstCharacter && secondCharacter)
  );
}

assert.deepStrictEqual(parseLine("1-3 a: abcde"), {
  positionOne: 1,
  positionTwo: 3,
  character: "a",
  password: "abcde",
});
assert.deepStrictEqual(parseLine("1-3 b: cdefg"), {
  positionOne: 1,
  positionTwo: 3,
  character: "b",
  password: "cdefg",
});
assert.deepStrictEqual(parseLine("2-9 c: ccccccccc"), {
  positionOne: 2,
  positionTwo: 9,
  character: "c",
  password: "ccccccccc",
});

assert.strictEqual(
  isValidPassword({
    positionOne: 1,
    positionTwo: 3,
    character: "a",
    password: "abcde",
  }),
  true
);
assert.strictEqual(
  isValidPassword({
    positionOne: 1,
    positionTwo: 3,
    character: "b",
    password: "cdefg",
  }),
  false
);
assert.strictEqual(
  isValidPassword({
    positionOne: 2,
    positionTwo: 9,
    character: "c",
    password: "ccccccccc",
  }),
  false
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day2", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.trim().split("\n").map(parseLine);
    const validPasswords = input.filter(isValidPassword);

    console.log(validPasswords.length);
  }
);
