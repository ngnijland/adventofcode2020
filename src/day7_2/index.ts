import fs from "fs";
import assert from "assert";
import path from "path";

interface Rule {
  type: string;
  canHold: { amount: number; type: string }[];
}

function parseRule(rule: string): Rule {
  const [typeRaw, canHoldRaw] = rule.split(" contain ");

  return {
    type: typeRaw.split(" ").slice(0, 2).join(" "),
    canHold:
      canHoldRaw === "no other bags."
        ? []
        : canHoldRaw.split(", ").map((bag) => {
            const words = bag.split(" ");

            return {
              amount: Number(words[0]),
              type: words.slice(1, 3).join(" "),
            };
          }),
  };
}

function bagsNeeded(bag: string, context: Rule[]): number {
  const { canHold } = context.find(({ type }) => type === bag);

  return canHold.reduce(
    (acc, { amount, type }) =>
      acc + amount + amount * bagsNeeded(type, context),
    0
  );
}

const bag1: Rule = {
  type: "light red",
  canHold: [
    { amount: 1, type: "bright white" },
    { amount: 2, type: "muted yellow" },
  ],
};
const bag2: Rule = {
  type: "dark orange",
  canHold: [
    { amount: 3, type: "bright white" },
    { amount: 4, type: "muted yellow" },
  ],
};
const bag3: Rule = {
  type: "bright white",
  canHold: [{ amount: 1, type: "shiny gold" }],
};
const bag4: Rule = {
  type: "muted yellow",
  canHold: [
    { amount: 2, type: "shiny gold" },
    { amount: 9, type: "faded blue" },
  ],
};
const bag5: Rule = {
  type: "shiny gold",
  canHold: [
    { amount: 1, type: "dark olive" },
    { amount: 2, type: "vibrant plum" },
  ],
};
const bag6: Rule = {
  type: "dark olive",
  canHold: [
    { amount: 3, type: "faded blue" },
    { amount: 4, type: "dotted black" },
  ],
};
const bag7: Rule = {
  type: "vibrant plum",
  canHold: [
    { amount: 5, type: "faded blue" },
    { amount: 6, type: "dotted black" },
  ],
};
const bag8: Rule = { type: "faded blue", canHold: [] };
const bag9: Rule = { type: "dotted black", canHold: [] };

assert.deepStrictEqual(
  parseRule("light red bags contain 1 bright white bag, 2 muted yellow bags."),
  bag1
);
assert.deepStrictEqual(
  parseRule("bright white bags contain 1 shiny gold bag."),
  bag3
);
assert.deepStrictEqual(
  parseRule("faded blue bags contain no other bags."),
  bag8
);

assert.strictEqual(
  bagsNeeded("shiny gold", [
    bag1,
    bag2,
    bag3,
    bag4,
    bag5,
    bag6,
    bag7,
    bag8,
    bag9,
  ]),
  32
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day7_2", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.trim().split("\n").map(parseRule);

    console.log(bagsNeeded("shiny gold", input));
  }
);
