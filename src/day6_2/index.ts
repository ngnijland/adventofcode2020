import fs from "fs";
import assert from "assert";
import path from "path";

function parseGroupAnswers(answers: string): string[][] {
  return answers.split("\n").map((answer) => answer.split(""));
}

function getCommonAnswers(answers: string[][]): string[] {
  if (answers.length === 1) {
    return answers[0];
  }

  const shortestIndex = answers
    .map((answer) => answer.length)
    .reduce(
      (acc, length, index) => (length < acc.length ? { index, length } : acc),
      { length: Infinity, index: Infinity }
    ).index;

  return answers[shortestIndex].reduce(
    (acc, answer) =>
      answers.every((x) => x.includes(answer)) ? [...acc, answer] : acc,
    []
  );
}

const group1 = [["a", "b", "c"]];
const group2 = [["a"], ["b"], ["c"]];
const group3 = [
  ["a", "b"],
  ["a", "c"],
];
const group4 = [["a"], ["a"], ["a"], ["a"]];
const group5 = [["b"]];

assert.deepStrictEqual(parseGroupAnswers("abc"), group1);
assert.deepStrictEqual(parseGroupAnswers("a\nb\nc"), group2);
assert.deepStrictEqual(parseGroupAnswers("ab\nac"), group3);
assert.deepStrictEqual(parseGroupAnswers("a\na\na\na"), group4);
assert.deepStrictEqual(parseGroupAnswers("b"), group5);

assert.deepStrictEqual(getCommonAnswers(group1), ["a", "b", "c"]);
assert.deepStrictEqual(getCommonAnswers(group2), []);
assert.deepStrictEqual(getCommonAnswers(group3), ["a"]);
assert.deepStrictEqual(getCommonAnswers(group4), ["a"]);
assert.deepStrictEqual(getCommonAnswers(group5), ["b"]);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day6_2", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.trim().split("\n\n").map(parseGroupAnswers);

    console.log(
      input
        .map(getCommonAnswers)
        .reduce((acc, groupAnswers) => acc + groupAnswers.length, 0)
    );
  }
);
