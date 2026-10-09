import assert from "node:assert/strict";
import { base } from "./client";

export async function verifyCatalog() {
  async function catalog(query: string, expected: string[]) {
    const response = await fetch(`${base}/preview/store${query}`); assert.equal(response.status, 200);
    const html = await response.text();
    const cards = html.match(/<article\b[\s\S]*?<\/article>/g) ?? [];
    assert.equal(cards.length, expected.length, query);
    for (const [index, title] of expected.entries()) assert.ok(cards[index].includes(title), `Wrong order/content for ${query}`);
    console.log(`Catalog ${query || "default"}: passed`);
  }
  await catalog("", ["ماگ سرامیکی", "کیف روزمره", "چراغ رومیزی"]);
  await catalog(`?q=${encodeURIComponent("۱۰۱")}`, ["ماگ سرامیکی"]);
  await catalog("?min=300000&max=1000000", ["کیف روزمره"]);
  await catalog("?sort=price-desc", ["چراغ رومیزی", "کیف روزمره", "ماگ سرامیکی"]);
  await catalog("?q=missing", []);
  await catalog("?min=100&max=1", []);
  console.log("Shareable catalog search, range filters, sorting and empty states passed.");
}
