import { previewText } from "@/content/fa/preview";
import type { Product } from "@/types/catalog";
import type { Store } from "@/types/catalog";
export const previewStore: Store = { code: "sample", title: previewText.sampleStoreTitle, desc: previewText.sampleStoreDescription };
export const previewProducts: Product[] = [
 { id: "101", code: "101", title: previewText.sampleMugTitle, price: 285000, primary_price: 320000, images_url: ["/catalog/mug.svg", "/catalog/mug-detail.svg"], desc: previewText.sampleMugDescription, store: previewStore, features: [{ name: previewText.color, desc: previewText.sampleMugColors }] },
 { id: "102", code: "102", title: previewText.sampleBagTitle, price: 640000, images_url: ["/catalog/bag.svg"], desc: previewText.sampleBagDescription, store: previewStore, features: [{ name: previewText.color, desc: previewText.sampleBagColors }] },
 { id: "103", code: "103", title: previewText.sampleLampTitle, price: 1250000, images_url: ["/catalog/lamp.svg"], desc: previewText.sampleLampDescription, store: previewStore, features: [] },
];
