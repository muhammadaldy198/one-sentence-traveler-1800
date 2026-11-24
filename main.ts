// One Sentence for a Traveler from 1800 — entry program.
//
// Writes one sentence (147 characters) that explains the modern
// internet to a traveler from the year 1800, using only words a
// person from that year would know, to /output/entry.txt.
// Deterministic: the same bytes on every run, no network, no clock.
import { mkdirSync, writeFileSync, readFileSync, chmodSync } from "node:fs";
import { dirname } from "node:path";

const SENTENCE =
  "A window through which you may speak with a friend three thousand miles away as if across the table, and read more books than your town has people.";

function countCodePoints(text: string): number {
  return [...text].length;
}

function assertGate(text: string): void {
  const chars = countCodePoints(text);
  if (chars < 1 || chars > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) {
      throw new Error("entry must not hold control characters");
    }
  }
}

// The bounty asks for ONE sentence: exactly one sentence-ending mark,
// and it must close the text. A stray period (an abbreviation, a decimal)
// would silently split the entry into two sentences.
function assertOneSentence(text: string): void {
  const endings = [...text].filter((ch) => ch === "." || ch === "!" || ch === "?");
  if (endings.length !== 1) {
    throw new Error(`entry must be exactly one sentence, found ${endings.length} sentence-ending marks`);
  }
  if (!text.endsWith(endings[0])) {
    throw new Error("the sentence-ending mark must close the entry");
  }
}

const OUT = "/output/entry.txt";
mkdirSync(dirname(OUT), { recursive: true });
assertGate(SENTENCE);
assertOneSentence(SENTENCE);
writeFileSync(OUT, SENTENCE, "utf8");
chmodSync(OUT, 0o644);
const written = readFileSync(OUT, "utf8");
if (written !== SENTENCE) {
  throw new Error("read-back mismatch: entry.txt does not hold the sentence");
}
