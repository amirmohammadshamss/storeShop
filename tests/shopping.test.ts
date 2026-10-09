import assert from "node:assert/strict";
import test from "node:test";
import { previewProducts } from "../src/lib/catalog/preview";
import { addToCart, emptyShopping, estimatedCartTotal, parseShopping, removeCartItem, setCartQuantity, shoppingStorageKey, toggleWishlist, variantKey } from "../src/lib/shopping/state";
test("cart merges matching variants and keeps different variants separate across reload", () => {
 const empty = emptyShopping("sample", true);
 const first = addToCart(empty, previewProducts[0], ["کرم"]);
 const repeated = addToCart(first, previewProducts[0], ["کرم"]);
 const different = addToCart(repeated, previewProducts[0], ["سبز"]);
 assert.equal(empty.cart.length, 0);
 assert.equal(different.cart.length, 2); assert.equal(different.cart[0].quantity, 2); assert.equal(different.cart[1].quantity, 1);
 assert.deepEqual(parseShopping(JSON.stringify(different), "sample", true), different);
 assert.equal(estimatedCartTotal(different.cart), 855000);
});
test("storage isolates stores and preview data; corrupt data cannot become cart content", () => {
 const state = addToCart(emptyShopping("sample", true), previewProducts[0], ["کرم"]);
 const raw = JSON.stringify(state);
 assert.equal(parseShopping(raw, "another-store", true).cart.length, 0);
 assert.equal(parseShopping(raw, "sample", false).cart.length, 0);
 assert.notEqual(shoppingStorageKey("sample", true), shoppingStorageKey("sample", false));
 assert.equal(parseShopping("bad-json", "sample", true).cart.length, 0);
 assert.equal(parseShopping(JSON.stringify({ ...state, mobile: "private" }), "sample", true).cart.length, 0);
 assert.equal(parseShopping(JSON.stringify({ ...state, cart: [state.cart[0], state.cart[0]] }), "sample", true).cart.length, 0);
 assert.equal(parseShopping(" ".repeat(100001), "sample", true).cart.length, 0);
 assert.throws(() => addToCart(emptyShopping("another-store", true), previewProducts[0], ["کرم"]));
 assert.throws(() => addToCart(emptyShopping("sample", true), previewProducts[0], ["invalid"]));
});
test("quantities enforce bounds, removal works and repeated adds honor the limit", () => {
 const state = addToCart(emptyShopping("sample", true), previewProducts[0], ["کرم"]);
 const key = variantKey(state.cart[0]);
 const max = setCartQuantity(state, key, 99);
 for (const quantity of [0, -1, 1.5, 100, NaN]) assert.throws(() => setCartQuantity(state, key, quantity));
 assert.throws(() => addToCart(max, previewProducts[0], ["کرم"]));
 assert.equal(removeCartItem(state, key).cart.length, 0);
 assert.equal(estimatedCartTotal([{ ...state.cart[0], price: Number.MAX_SAFE_INTEGER, quantity: 2 }]), null);
});
test("wishlist toggles persist and unsupported storage versions reset safely", () => {
 const empty = emptyShopping("sample", true);
 const saved = toggleWishlist(empty, previewProducts[0]);
 assert.equal(saved.wishlist.length, 1);
 assert.deepEqual(parseShopping(JSON.stringify(saved), "sample", true).wishlist, saved.wishlist);
 assert.equal(toggleWishlist(saved, previewProducts[0]).wishlist.length, 0);
 assert.equal(parseShopping(JSON.stringify({ ...saved, version: 2 }), "sample", true).wishlist.length, 0);
});
