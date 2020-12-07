import fs from "fs";
import assert from "assert";
import path from "path";

interface Rule {
  type: string;
  canHold: string[];
}

function parseRule(rule: string): Rule {
  const [typeRaw, canHoldRaw] = rule.split(" contain ");

  return {
    type: typeRaw.split(" ").slice(0, 2).join(" "),
    canHold:
      canHoldRaw === "no other bags."
        ? []
        : canHoldRaw
            .split(", ")
            .map((bag) => bag.split(" ").slice(1, 3).join(" ")),
  };
}

function canHoldBag(bag: string, context: Rule[]): Rule[] {
  const canHoldDirectly = context.filter(({ canHold }) =>
    canHold.includes(bag)
  );

  return Array.from(
    new Set([
      ...canHoldDirectly,
      ...canHoldDirectly.flatMap(({ type }) => canHoldBag(type, context)),
    ])
  );
}

const bag1: Rule = {
  type: "light red",
  canHold: ["bright white", "muted yellow"],
};
const bag2: Rule = {
  type: "dark orange",
  canHold: ["bright white", "muted yellow"],
};
const bag3: Rule = { type: "bright white", canHold: ["shiny gold"] };
const bag4: Rule = {
  type: "muted yellow",
  canHold: ["shiny gold", "faded blue"],
};
const bag5: Rule = {
  type: "shiny gold",
  canHold: ["dark olive", "vibrant plum"],
};
const bag6: Rule = {
  type: "dark olvie",
  canHold: ["faded blue", "dotted black"],
};
const bag7: Rule = {
  type: "vribrant plum",
  canHold: ["faded blue", "dotted black"],
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

assert.deepStrictEqual(
  canHoldBag("shiny gold", [
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
  [bag3, bag4, bag1, bag2]
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day7_1", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.trim().split("\n").map(parseRule);

    console.log(canHoldBag("shiny gold", input).length);
  }
);
