import "server-only";
import { cache } from "react";
import { readBackend, BackendError } from "../api/client";
import { catalogSchema, productSchema, storeSchema } from "./schema";
import { normalizeIdentifier, normalizeStoreCode } from "./identifiers";
export const getStore = cache(async (code: string) => {
 const normalized = normalizeStoreCode(code);
 if (!normalized) return null;
 try {
  const store = await readBackend(`AdminChannel/store/get_store/${encodeURIComponent(normalized)}`, storeSchema, "catalog");
  if (normalizeStoreCode(store.code) !== normalized) throw new BackendError("schema");
  return store;
 }
 catch (error) { if (error instanceof BackendError && error.status === 404) return null; throw error; }
});
export const getCatalog = cache(async (storeCode: string) => {
 const code = normalizeStoreCode(storeCode);
 if (!code) return [];
 return (await readBackend(`Adminchannel/product/get_products/${encodeURIComponent(code)}`, catalogSchema, "catalog")).Products;
});
async function readProduct(storeCode: string, productCode: string, policy: "catalog" | "private") {
 const store = normalizeStoreCode(storeCode); const product = normalizeIdentifier(productCode);
 if (!store || !product) return null;
 try {
  const result = await readBackend(`AdminChannel/product/get_product/${encodeURIComponent(store)}/${encodeURIComponent(product)}`, productSchema, policy);
  if (normalizeStoreCode(result.store.code) !== store || normalizeIdentifier(result.code) !== product) throw new BackendError("schema");
  return result;
 } catch (error) { if (error instanceof BackendError && error.status === 404) return null; throw error; }
}
export const getProduct = cache((storeCode: string, productCode: string) => readProduct(storeCode, productCode, "catalog"));
export const getFreshProduct = (storeCode: string, productCode: string) => readProduct(storeCode, productCode, "private");
