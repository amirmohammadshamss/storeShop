export const BACKEND_TIMEOUT_MS = 10000;
export const MAX_CATALOG_CACHE_SECONDS = 300;
export const API_PATHS = {
  store: "AdminChannel/store/get_store/",
  catalog: "Adminchannel/product/get_products/",
  product: "AdminChannel/product/get_product/",
  tracking: "AdminChannel/purchase/track_order/",
  invoice: "AdminChannel/purchase/get_payment_result/",
} as const;
