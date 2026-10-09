import assert from "node:assert/strict";
import test from "node:test";
import { sourcePolicyViolation } from "../scripts/source-policy";
test("policy rejects executable JavaScript and extra stylesheets but allows minimal Tailwind entry", () => {
 for (const path of ["src/forgotten.js", "scripts/old.cjs", "public/worker.js", "src/component.module.css", "src/styles.scss"]) assert.ok(sourcePolicyViolation(path, ""));
 assert.equal(sourcePolicyViolation("src/app/globals.css", '@import "tailwindcss";'), null);
 assert.ok(sourcePolicyViolation("src/app/globals.css", '@import "bootstrap";'));
 assert.equal(sourcePolicyViolation("src/app/layout.tsx", 'import "./globals.css";'), null);
 assert.ok(sourcePolicyViolation("src/app/layout.tsx", 'import "./globals.css"; import "./extra.css";'));
});
test("actual imports and inline JSX styles are rejected without interpreting string fixtures as code", () => {
 for (const source of ['import "bootstrap";', 'import("@emotion/core");', 'require("slick-carousel");', 'export * from "styled-components";', 'const element = <div style={{ color: "red" }} />;']) assert.ok(sourcePolicyViolation("src/app/example.tsx", source));
 assert.equal(sourcePolicyViolation("tests/example.ts", `const fixture = 'import "bootstrap";';`), null);
 assert.equal(sourcePolicyViolation("src/app/example.tsx", 'const element = <div className="text-red-700" />;'), null);
});
