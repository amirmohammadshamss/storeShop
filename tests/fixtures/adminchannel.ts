import { previewProducts, previewStore } from "../../src/lib/catalog/preview";
export const fixtureStore = { ...previewStore, code: "fixture", title: "فروشگاه قرارداد آزمایشی" };
export const fixtureProducts = previewProducts.map(product => ({ ...product, store: fixtureStore }));
export const fixtureTracking = { record_date_unix_time: "1791504000", status_desc: "در حال آماده‌سازی", store_title: fixtureStore.title, price: "285000", mobile: "SHOULD_NOT_LEAK", address: "SHOULD_NOT_LEAK" };
export const fixtureInvoice = { invoice_id: "fixture-invoice", done: false, create_date_unix_time: "1791504000", amount: "285000", order_tracking_code: "fixture-track", store_code: "fixture", mobile: "SHOULD_NOT_LEAK" };
