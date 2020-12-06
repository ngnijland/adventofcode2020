import fs from "fs";
import assert from "assert";
import path from "path";

function parseGroupAnswers(answers: string): string[] {
  return answers.split("\n").flatMap((answer) => answer.split(""));
}

function getUniqueAnswers(answers: string[]): string[] {
  return Array.from(new Set(answers));
}

const group1 = ["a", "b", "c"];
const group2 = ["a", "b", "c"];
const group3 = ["a", "b", "a", "c"];
const group4 = ["a", "a", "a", "a"];
const group5 = ["b"];

assert.deepStrictEqual(parseGroupAnswers("abc"), group1);
assert.deepStrictEqual(parseGroupAnswers("a\nb\nc"), group2);
assert.deepStrictEqual(parseGroupAnswers("ab\nac"), group3);
assert.deepStrictEqual(parseGroupAnswers("a\na\na\na"), group4);
assert.deepStrictEqual(parseGroupAnswers("b"), group5);

assert.deepStrictEqual(getUniqueAnswers(group1), ["a", "b", "c"]);
assert.deepStrictEqual(getUniqueAnswers(group2), ["a", "b", "c"]);
assert.deepStrictEqual(getUniqueAnswers(group3), ["a", "b", "c"]);
assert.deepStrictEqual(getUniqueAnswers(group4), ["a"]);
assert.deepStrictEqual(getUniqueAnswers(group5), ["b"]);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day6", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.trim().split("\n\n").map(parseGroupAnswers);

    console.log(
      input
        .map(getUniqueAnswers)
        .reduce((acc, groupAnswers) => acc + groupAnswers.length, 0)
    );
  }
);
