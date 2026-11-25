// Make the AI Judge Laugh — writes the entry line to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Node 22, stdlib only, no network. The line is read verbatim from entry.txt
// shipped in this repo and gated to the competition's 1–200 character rule.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(here, "entry.txt"), "utf8");

// Gate: the sealed scorer requires 1–200 characters of non-whitespace text.
// Count in UTF-16 code units, matching how the scorer measures the file.
const trimmed = text.trim();
if (trimmed.length < 1 || trimmed.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${trimmed.length}`);
}
if (text.replace(/\n$/, "").includes("\n")) {
  // entry.txt ships as one single line; anything else is a packaging mistake.
  throw new Error("entry must be a single line of text");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, text, "utf8");

// Read-back guard: the output must be byte-identical to the shipped entry.
if (readFileSync(outPath, "utf8") !== text) {
  throw new Error("output does not match entry.txt");
}
