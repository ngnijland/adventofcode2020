import fs from "fs";
import assert from "assert";
import path from "path";

interface PassportRaw {
  byr?: string;
  iyr?: string;
  eyr?: string;
  hgt?: string;
  hcl?: string;
  ecl?: string;
  pid?: string;
  cid?: string;
}

interface MinMax {
  min: number;
  max: number;
}

function parsePassport(passportRaw: string): PassportRaw {
  const fields = passportRaw.split("\n").flatMap((line) => line.split(" "));

  return fields.reduce((acc, field) => {
    const [key, value] = field.split(":");
    return { ...acc, [key]: value };
  }, {});
}

function validateYear(yrRaw: string, { min, max }: MinMax): boolean {
  const byr = Number(yrRaw);

  return byr !== NaN && byr >= min && byr <= max;
}

function validateHeight(hgt: string): boolean {
  const height = parseInt(hgt, 10);
  const unit = hgt.substr(height.toString().length);

  if (unit === "cm" && height >= 150 && height <= 193) {
    return true;
  }

  if (unit === "in" && height >= 59 && height <= 76) {
    return true;
  }

  return false;
}

function validateHexColorCode([hashtag, ...hex]: string): boolean {
  return (
    hashtag === "#" && hex.length === 6 && !isNaN(Number("0x" + hex.join("")))
  );
}

function validateEyeColor(ecl: string): boolean {
  return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(ecl);
}

function validatePid([...numbers]: string): boolean {
  return (
    numbers.length === 9 && numbers.every((number) => !isNaN(Number(number)))
  );
}

function validatePassport(passportRaw: PassportRaw): boolean {
  if (
    !["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"].every(
      (field) => field in passportRaw
    )
  ) {
    return false;
  }

  if (!validateYear(passportRaw.byr, { min: 1920, max: 2002 })) {
    return false;
  }

  if (!validateYear(passportRaw.iyr, { min: 2010, max: 2020 })) {
    return false;
  }

  if (!validateYear(passportRaw.eyr, { min: 2020, max: 2030 })) {
    return false;
  }

  if (!validateHeight(passportRaw.hgt)) {
    return false;
  }

  if (!validateHexColorCode(passportRaw.hcl)) {
    return false;
  }

  if (!validateEyeColor(passportRaw.ecl)) {
    return false;
  }

  if (!validatePid(passportRaw.pid)) {
    return false;
  }

  return true;
}

const passport1 = {
  byr: "1937",
  iyr: "2017",
  eyr: "2020",
  hgt: "183cm",
  hcl: "#fffffd",
  ecl: "gry",
  pid: "860033327",
  cid: "147",
};

const passport2 = {
  byr: "1929",
  iyr: "2013",
  eyr: "2023",
  hcl: "#cfa07d",
  ecl: "amb",
  pid: "028048884",
  cid: "350",
};

const passport3 = {
  byr: "1931",
  iyr: "2013",
  eyr: "2024",
  hgt: "179cm",
  hcl: "#ae17e1",
  ecl: "brn",
  pid: "760753108",
};

const passport4 = {
  iyr: "2011",
  eyr: "2025",
  hgt: "59in",
  hcl: "#cfa07d",
  ecl: "brn",
  pid: "166559648",
};

assert.deepStrictEqual(
  parsePassport(
    "ecl:gry pid:860033327 eyr:2020 hcl:#fffffd\nbyr:1937 iyr:2017 cid:147 hgt:183cm"
  ),
  passport1
);

assert.deepStrictEqual(
  parsePassport(
    "iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884\nhcl:#cfa07d byr:1929"
  ),
  passport2
);

assert.deepStrictEqual(
  parsePassport(
    "hcl:#ae17e1 iyr:2013\neyr:2024\necl:brn pid:760753108 byr:1931\nhgt:179cm"
  ),
  passport3
);

assert.deepStrictEqual(
  parsePassport(
    "hcl:#cfa07d eyr:2025 pid:166559648\niyr:2011 ecl:brn hgt:59in"
  ),
  passport4
);

assert.strictEqual(validatePassport(passport1), true);
assert.strictEqual(validatePassport(passport2), false);
assert.strictEqual(validatePassport(passport3), true);
assert.strictEqual(validatePassport(passport4), false);

assert.strictEqual(validateYear("2002", { min: 1920, max: 2002 }), true);
assert.strictEqual(validateYear("2003", { min: 1920, max: 2002 }), false);
assert.strictEqual(validateYear("200", { min: 1920, max: 2002 }), false);
assert.strictEqual(validateYear("2002foo", { min: 1920, max: 2002 }), false);
assert.strictEqual(validateYear("foo", { min: 1920, max: 2002 }), false);

assert.strictEqual(validateHeight("60in"), true);
assert.strictEqual(validateHeight("190cm"), true);
assert.strictEqual(validateHeight("194cm"), false);
assert.strictEqual(validateHeight("149cm"), false);
assert.strictEqual(validateHeight("77in"), false);
assert.strictEqual(validateHeight("58in"), false);
assert.strictEqual(validateHeight("1.9m"), false);
assert.strictEqual(validateHeight("190"), false);

assert.strictEqual(validateHexColorCode("#ffffff"), true);
assert.strictEqual(validateHexColorCode("#111fff"), true);
assert.strictEqual(validateHexColorCode("#111ggg"), false);
assert.strictEqual(validateHexColorCode("#fffff"), false);
assert.strictEqual(validateHexColorCode("#fffffff"), false);
assert.strictEqual(validateHexColorCode("ffffff"), false);

assert.strictEqual(validateEyeColor("amb"), true);
assert.strictEqual(validateEyeColor("foo"), false);

assert.strictEqual(validatePid("123456789"), true);
assert.strictEqual(validatePid("012345678"), true);
assert.strictEqual(validatePid("12345678"), false);
assert.strictEqual(validatePid("1234567890"), false);
assert.strictEqual(validatePid("12345678a"), false);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day4", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const input = data.trim().split("\n\n").map(parsePassport);

    console.log(
      input.reduce(
        (acc, passport) => (validatePassport(passport) ? acc + 1 : acc),
        0
      )
    );
  }
);
