import "server-only";
import { getFreshProduct } from "../catalog/data";
import { previewProducts } from "../catalog/preview";
import type { DraftInput } from "./validation";
export async function draftProduct(input: Pick<DraftInput, "storeCode" | "productCode" | "preview">) {
 if (input.preview) return input.storeCode === "sample" ? previewProducts.find(product => product.code === input.productCode) ?? null : null;
 return getFreshProduct(input.storeCode, input.productCode);
}
