import type { Metadata } from "next";
import { previewProducts, previewStore } from "@/lib/catalog/preview";
import { CatalogView } from "../../ui/catalog-view";
export const metadata: Metadata = { title: "فروشگاه نمایشی", robots: { index: false, follow: false } };
export default function PreviewStorePage() { return <CatalogView store={previewStore} products={previewProducts} basePath="/preview/store" preview />; }
