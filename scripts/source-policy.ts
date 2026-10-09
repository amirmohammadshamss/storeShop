import ts from "typescript";
const forbiddenStylePackages = /^(?:bootstrap|@emotion(?:\/|$)|slick-carousel|styled-components|@mui(?:\/|$)|@chakra-ui(?:\/|$))/;
export function sourcePolicyViolation(path: string, content: string): string | null {
 if (/\.(?:[cm]?js|jsx|s[ac]ss)$/.test(path)) return "Application source and executable configuration must use TypeScript.";
 if (path.endsWith(".css")) {
  if (path !== "src/app/globals.css") return "Only the minimal Tailwind global CSS entry is allowed.";
  for (const match of content.matchAll(/@import\s+["']([^"']+)["']/g)) if (match[1] !== "tailwindcss") return "Only Tailwind may be imported into global CSS.";
  return null;
 }
 if (!/\.tsx?$/.test(path)) return null;
 const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true, path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
 let violation: string | null = null;
 function inspectImport(value: string): void {
  if (forbiddenStylePackages.test(value)) violation = "Unsupported styling dependency import.";
  if (/\.(?:css|scss|sass)$/.test(value) && !(path === "src/app/layout.tsx" && value === "./globals.css")) violation = "Standalone component stylesheets are not allowed.";
 }
 function visit(node: ts.Node): void {
  if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) inspectImport(node.moduleSpecifier.text);
  if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) inspectImport(node.moduleSpecifier.text);
  if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require")) && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) inspectImport(node.arguments[0].text);
  if (ts.isJsxAttribute(node) && node.name.getText(source) === "style") violation = "Use Tailwind utilities instead of inline component styles.";
  ts.forEachChild(node, visit);
 }
 visit(source);
 return violation;
}
