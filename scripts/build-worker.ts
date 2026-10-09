import { readFile, writeFile, mkdir } from "node:fs/promises";
import ts from "typescript";
const source = await readFile("src/workers/retirement.ts", "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, removeComments: false }, reportDiagnostics: true });
const errors = compiled.diagnostics?.filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error) ?? [];
if (errors.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(errors, { getCurrentDirectory: () => process.cwd(), getCanonicalFileName: name => name, getNewLine: () => "\n" }));
await mkdir("src/generated", { recursive: true });
const output = `// Generated from src/workers/retirement.ts; do not edit.\nexport const retirementWorker = ${JSON.stringify(compiled.outputText)};\n`;
let existing = "";
try { existing = await readFile("src/generated/retirement-worker.ts", "utf8"); } catch { /* First build. */ }
if (existing !== output) await writeFile("src/generated/retirement-worker.ts", output);
