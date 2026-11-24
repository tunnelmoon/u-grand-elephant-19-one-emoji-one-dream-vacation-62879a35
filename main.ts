import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: 🏝 DESERT ISLAND (U+1F3DD) — one emoji, the dream vacation
// in a single postcard glyph: island, palm and sea, a faraway place.
const ENTRY = "🏝";

// The gate: entry.txt must be UTF-8 text of 1 to 8 characters, not only
// white space, and exactly one emoji. Count in code points, not UTF-16
// units or bytes, so one emoji counts as one character.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 8) {
  throw new Error(`entry must be 1-8 characters, got ${chars.length}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only white space");
}
if (chars.length !== 1) {
  throw new Error(`entry must be exactly one emoji, got ${chars.length} characters`);
}
const code = chars[0].codePointAt(0) ?? 0;
// Emoji live in several blocks; cover them all so the check stays correct
// for any single-emoji entry, not just this one.
const isEmoji =
  (code >= 0x1f300 && code <= 0x1f5ff) ||
  (code >= 0x1f600 && code <= 0x1f64f) ||
  (code >= 0x1f680 && code <= 0x1f6ff) ||
  (code >= 0x1f900 && code <= 0x1f9ff) ||
  (code >= 0x1fa70 && code <= 0x1faff) ||
  (code >= 0x2600 && code <= 0x27bf) ||
  (code >= 0x2b00 && code <= 0x2bff);
if (!isEmoji) {
  throw new Error("entry must be an emoji");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const dst = join(outDir, "entry.txt");
writeFileSync(dst, ENTRY, "utf8");
// Self-check: what landed on disk must be exactly the emoji above.
if (readFileSync(dst, "utf8") !== ENTRY) {
  throw new Error(`write mismatch: ${dst} does not hold the entry`);
}
console.log(`wrote ${dst} (${chars.length} character)`);
