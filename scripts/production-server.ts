import { spawn, type ChildProcess } from "node:child_process";
import { randomBytes } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";

const port = "3100";
const base = `http://127.0.0.1:${port}`;
async function exitCode(child: ChildProcess): Promise<number | null> { return new Promise((resolve, reject) => { child.once("error", reject); child.once("exit", code => resolve(code)); }); }
export async function runProductionCheck(script: string, overrides: Partial<NodeJS.ProcessEnv>) {
 const env: NodeJS.ProcessEnv = { ...process.env, CHECKOUT_DRAFT_SECRET: randomBytes(32).toString("hex"), ORDER_LOOKUP_ENABLED: "false", BACKEND_CATALOG_TTL_SECONDS: "0", APP_ORIGIN: base, SMOKE_BASE_URL: base, SITE_ORIGIN: "", CATALOG_INDEXING_ENABLED: "false", PUBLIC_STORE_CODES: "", ...overrides, NODE_ENV: "production" };
 let logs = "";
 const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", port], { env, stdio: ["ignore", "pipe", "pipe"] });
 server.stdout?.on("data", (chunk: Buffer) => { logs = (logs + String(chunk)).slice(-8000); });
 server.stderr?.on("data", (chunk: Buffer) => { logs = (logs + String(chunk)).slice(-8000); });
 const serverExit = exitCode(server);
 try {
  let ready = false; const deadline = Date.now() + 30000;
  while (Date.now() < deadline && server.exitCode === null && server.signalCode === null) {
   try { const response = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(1000) }); ready = response.ok; if (ready) break; } catch { /* Wait for readiness. */ }
   await delay(100);
  }
  if (!ready) throw new Error(`Production server did not become ready. ${logs}`);
  console.log(`Production server ready; running ${script}.`);
  const smoke = spawn(process.execPath, ["--import", "tsx", script], { env, stdio: "inherit" });
  const code = await exitCode(smoke); if (code !== 0) throw new Error(`Production smoke check failed (${code}).`);
 } finally {
  if (server.exitCode === null && server.signalCode === null) { server.kill("SIGTERM"); await Promise.race([serverExit, delay(2000)]); if (server.exitCode === null && server.signalCode === null) server.kill("SIGKILL"); }
  await serverExit;
 }
}
