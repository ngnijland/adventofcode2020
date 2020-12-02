import fs from "fs";
import assert from "assert";
import path from "path";

function countValidPasswords(passwords: string[]): number {
  const validPasswords = passwords.filter((passwordRules) => {
    const [positionsRaw, characterRaw, password] = passwordRules.split(" ");

    const positions = positionsRaw.split("-").map((x) => parseInt(x, 10));
    const character = characterRaw.charAt(0);

    const firstCharacter = password[positions[0] - 1] === character;
    const secondCharacter = password[positions[1] - 1] === character;

    if (!firstCharacter && !secondCharacter) {
      return false;
    }

    if (firstCharacter && secondCharacter) {
      return false;
    }

    if (
      (firstCharacter && !secondCharacter) ||
      (!firstCharacter && secondCharacter)
    ) {
      return true;
    }

    return false;
  });

  return validPasswords.length;
}

assert.strictEqual(
  countValidPasswords(["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"]),
  1
);

fs.readFile(
  path.join(__dirname, "..", "..", "src", "day2", "input"),
  "utf8",
  function (err: NodeJS.ErrnoException, data: string) {
    if (err) throw err;

    const formattedData = data.split("\n");
    formattedData.pop();
    console.log(countValidPasswords(formattedData));
  }
);
