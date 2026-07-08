import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

// Root of the examples folder.
const EXAMPLES_DIR = resolve(__dirname, "..");
const EDITOR_HTML = resolve(__dirname, "../../../..", "public/make-ig-post/editor.html");
const ASPECTS = ["square", "portrait", "story"] as const;

/**
 * Parse public/make-ig-post/editor.html and extract the field-id list for each
 * template. The templates are declared as blocks like:
 *
 *   T.player = {
 *     label: 'Player intro',
 *     fields: [
 *       { id:'eyebrow', label:'Eyebrow', type:'text', default:'…' },
 *       …
 *     ],
 *     …
 *   };
 *
 * We only need the `T.<key>` header + the ordered list of `{ id:'…' , … }`
 * entries inside its `fields:` array — enough to catch a rename/addition/
 * removal of a template field without needing to eval the whole file.
 */
function sliceBalanced(src: string, openIdx: number): string {
  // openIdx points at an opening `[` or `{`. Returns the substring between it
  // and its matching closer, respecting nested brackets and quoted strings.
  const open = src[openIdx];
  const close = open === "[" ? "]" : open === "{" ? "}" : null;
  if (!close) throw new Error("sliceBalanced: not on a bracket");
  let depth = 0;
  let inStr: string | null = null;
  let esc = false;
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (ch === "\\") { esc = true; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === "`") { inStr = ch; continue; }
    if (ch === "[" || ch === "{") depth++;
    else if (ch === "]" || ch === "}") {
      depth--;
      if (depth === 0) return src.slice(openIdx + 1, i);
    }
  }
  throw new Error("sliceBalanced: unbalanced");
}

function extractTemplateSchemas(): Record<string, string[]> {
  const src = readFileSync(EDITOR_HTML, "utf8");
  const out: Record<string, string[]> = {};
  const headerRe = /\n\s*T\.([a-zA-Z0-9_]+)\s*=\s*\{/g;
  let match: RegExpExecArray | null;
  while ((match = headerRe.exec(src)) !== null) {
    const key = match[1];
    // Find `fields:` inside the template body and grab its balanced array.
    const after = src.slice(match.index);
    const fm = /\bfields\s*:\s*\[/.exec(after);
    if (!fm) continue;
    const bracketIdx = match.index + fm.index + fm[0].length - 1;
    let fieldsBody: string;
    try { fieldsBody = sliceBalanced(src, bracketIdx); }
    catch { continue; }
    // Match every `id:'…'` or `id:"…"` inside the fields array. This ignores
    // nested `item:` sub-fields on list types — those aren't top-level slide
    // values, so we don't need to check them here.
    const ids: string[] = [];
    let depth = 0;
    let cursor = 0;
    // Walk brace-by-brace so a `{ id:'…' }` from a nested `item:` array on a
    // list-type field is only counted once (at depth 0 relative to fieldsBody).
    for (let j = 0; j < fieldsBody.length; j++) {
      const ch = fieldsBody[j];
      if (ch === "{") {
        if (depth === 0) cursor = j;
        depth++;
      } else if (ch === "}") {
        depth--;
        if (depth === 0) {
          const entry = fieldsBody.slice(cursor, j + 1);
          const idm = /(?:^|[^a-zA-Z0-9_])id\s*:\s*['"]([^'"]+)['"]/.exec(entry);
          if (idm) ids.push(idm[1]);
        }
      }
    }
    out[key] = ids;
  }
  return out;
}

describe("IG editor examples — drift check", () => {
  const schemas = extractTemplateSchemas();
  const templateKeys = Object.keys(schemas);

  it("editor.html declares at least one template", () => {
    expect(templateKeys.length).toBeGreaterThan(0);
  });

  it("manifest.json exists and lists every template", () => {
    const manifestPath = join(EXAMPLES_DIR, "manifest.json");
    expect(existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const manifestKeys = Object.keys(manifest.templates || {});
    // Every template in the editor must have a manifest entry, and vice versa.
    expect(new Set(manifestKeys)).toEqual(new Set(templateKeys));
  });

  it("README.md has a section per template", () => {
    const readmePath = join(EXAMPLES_DIR, "README.md");
    expect(existsSync(readmePath)).toBe(true);
    const readme = readFileSync(readmePath, "utf8");
    for (const key of templateKeys) {
      expect(readme, `README missing section for ${key}`).toContain(`\`${key}\``);
    }
  });

  for (const key of Object.keys(schemas)) {
    describe(`template: ${key}`, () => {
      const tplDir = join(EXAMPLES_DIR, key);
      const jsonPath = join(tplDir, `${key}.json`);

      it("example JSON file exists", () => {
        expect(existsSync(jsonPath), `missing ${jsonPath} — run \`npm run ig:examples\``).toBe(true);
      });

      it("example JSON field ids match the current editor schema", () => {
        if (!existsSync(jsonPath)) return;
        const payload = JSON.parse(readFileSync(jsonPath, "utf8"));
        const values = payload.values || payload.data || {};
        const exampleIds = Object.keys(values).sort();
        const schemaIds = [...schemas[key]].sort();
        expect(
          exampleIds,
          `Example ${key}.json is stale — run \`npm run ig:examples\` to regenerate.`
        ).toEqual(schemaIds);
      });

      for (const asp of ASPECTS) {
        it(`${asp} PNG exists and is non-empty`, () => {
          const png = join(tplDir, `${key}-${asp}.png`);
          expect(existsSync(png), `missing ${png} — run \`npm run ig:examples\``).toBe(true);
          expect(statSync(png).size).toBeGreaterThan(1000);
        });
      }

      it("manifest snapshot matches current schema", () => {
        const manifest = JSON.parse(readFileSync(join(EXAMPLES_DIR, "manifest.json"), "utf8"));
        const snap = manifest.templates?.[key]?.fields || [];
        expect(
          snap,
          `manifest snapshot for ${key} is stale — run \`npm run ig:examples\``
        ).toEqual(schemas[key]);
      });
    });
  }

  it("no orphan template folders under examples/", () => {
    const entries = readdirSync(EXAMPLES_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith("__"))
      .map((e) => e.name);
    for (const dir of entries) {
      expect(templateKeys, `orphan folder examples/${dir} — template no longer exists in editor.html`).toContain(dir);
    }
  });
});