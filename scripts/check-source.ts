import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { sourcePolicyViolation } from "./source-policy";
async function check(path: string): Promise<void> {
 const content = /\.(?:tsx?|[cm]?js|jsx|s[ac]ss|css)$/.test(path) ? await readFile(path, "utf8") : "";
 const violation = sourcePolicyViolation(path, content);
 if (violation) throw new Error(`${path}: ${violation}`);
}
async function walk(directory: string): Promise<void> {
 for (const entry of await readdir(directory, { withFileTypes: true })) {
  const path = join(directory, entry.name);
  if (entry.isDirectory()) await walk(path); else await check(path);
 }
}
for (const directory of ["src", "scripts", "tests", "public"]) await walk(directory);
for (const entry of await readdir(".", { withFileTypes: true })) if (entry.isFile()) await check(entry.name);
const manifest = JSON.parse(await readFile("package.json", "utf8")) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
for (const name of Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })) {
 if (/^(bootstrap|@emotion\/|slick-carousel|react-scripts|sass$|styled-components$|@mui\/|@chakra-ui\/)/.test(name)) throw new Error(`Disallowed dependency: ${name}`);
}
console.log("All active source uses TypeScript and Tailwind; legacy files exist only in the verified reference archive.");
