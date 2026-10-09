import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";
import { BackendError, catalogCacheSeconds, requestBackend } from "../src/lib/api/transport";
import { backendFailureEvent } from "../src/lib/api/events";
const schema = z.object({ title: z.string() });
const base = "https://example.com/api/v1/";
test("private requests always bypass catalog caching and catalog caching is explicitly bounded", async () => {
 const options: RequestInit[] = [];
 const fetcher: typeof fetch = async (_input, init) => { options.push(init ?? {}); return Response.json({ title: "store" }); };
 await requestBackend(base, "store/1", schema, "private", 120, fetcher);
 assert.equal(options[0].cache, "no-store"); assert.equal(options[0].next, undefined); assert.equal(options[0].redirect, "error"); assert.ok(options[0].signal);
 await requestBackend(base, "store/1", schema, "catalog", 120, fetcher);
 assert.equal(options[1].next?.revalidate, 120); assert.equal(options[1].cache, undefined);
 await requestBackend(base, "store/1", schema, "catalog", 0, fetcher);
 assert.equal(options[2].cache, "no-store");
 assert.equal(catalogCacheSeconds(undefined), 0);
 for (const configured of ["-1", "301", "1.5", "bad"]) assert.throws(() => catalogCacheSeconds(configured));
});
test("failed reads preserve safe error categories without backend body or network details", async () => {
 const fail: typeof fetch = async () => { throw new Error("secret-credential and private URL"); };
 await assert.rejects(requestBackend(base, "store/1", schema, "private", 0, fail), (error: unknown) => error instanceof BackendError && error.kind === "network" && !error.message.includes("secret"));
 const denied: typeof fetch = async () => new Response("private backend details", { status: 403 });
 await assert.rejects(requestBackend(base, "store/1", schema, "private", 0, denied), (error: unknown) => error instanceof BackendError && error.kind === "http" && error.status === 403);
 for (const body of ["not json", JSON.stringify({ title: 123, mobile: "private" })]) {
  const malformed: typeof fetch = async () => new Response(body);
  await assert.rejects(requestBackend(base, "store/1", schema, "private", 0, malformed), (error: unknown) => error instanceof BackendError && error.kind === "schema");
 }
});
test("backend path traversal, alternate origins and embedded credentials are rejected before fetching", async () => {
 const fetcher: typeof fetch = async () => { assert.fail("Must not fetch rejected URL"); };
 for (const path of ["../../private", "https://untrusted.example/api/v1/store", "../v2/store"]) await assert.rejects(requestBackend(base, path, schema, "private", 0, fetcher), BackendError);
 for (const configured of ["https://user:secret@example.com/api/v1/", "https://example.com/api/v1/?token=secret", "https://example.com/api/v1/#fragment"]) await assert.rejects(requestBackend(configured, "store", schema, "private", 0, fetcher), BackendError);
});
test("error reporting emits only an allowlist and a correlation identifier", () => {
 const event = backendFailureEvent(new BackendError("http", 503));
 assert.deepEqual(Object.keys(event).sort(), ["correlationId", "event", "kind", "status"]);
 assert.match(event.correlationId, /^[0-9a-f-]{36}$/);
 assert.equal(event.kind, "http"); assert.equal(event.status, 503);
});
