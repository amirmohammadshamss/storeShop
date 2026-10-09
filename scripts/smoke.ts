import { verifyCheckout, clearDraft } from "./smoke/checkout";
import { verifyOrders } from "./smoke/orders";
import { verifyCatalog } from "./smoke/catalog";
import { verifyWorkers } from "./smoke/workers";

const cookie = await verifyCheckout();
await verifyOrders();
await clearDraft(cookie);
await verifyCatalog();
await verifyWorkers();
