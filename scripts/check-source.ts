import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
async function check(directory: string): Promise<void> {
 for (const entry of await readdir(directory, { withFileTypes: true })) {
  const path = join(directory, entry.name);
  if (entry.isDirectory()) await check(path);
  else {
   if (/\.(jsx?|s[ac]ss)$/.test(entry.name) || /\.module\.css$/.test(entry.name)) throw new Error(`Disallowed source: ${path}`);
   if (/\.tsx?$/.test(entry.name)) {
    const source = await readFile(path, "utf8");
    if (/(?:from\s*|import\s*)["'](?:bootstrap|@emotion|slick-carousel)/.test(source)) throw new Error(`Disallowed styling import: ${path}`);
   }
  }
 }
}
// Legacy CRA files remain outside the active Next.js source until migration completes.
for (const directory of ["src/app", "src/lib", "scripts", "tests"]) await check(directory);
const manifest = JSON.parse(await readFile("package.json", "utf8")) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
for (const name of Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })) {
 if (/^(bootstrap|@emotion\/|slick-carousel|react-scripts|sass$)/.test(name)) throw new Error(`Disallowed dependency: ${name}`);
}
console.log("Active source meets TypeScript and styling constraints; legacy migration remains pending.");
