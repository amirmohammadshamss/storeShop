import type { Metadata } from "next";
import { previewProducts, previewStore } from "@/lib/catalog/preview";
import type { QueryParams } from "@/lib/catalog/search";
import { CatalogView } from "../../ui/catalog-view";
export const metadata: Metadata = { title: "فروشگاه نمایشی", robots: { index: false, follow: false } };
export default async function PreviewStorePage({ searchParams }: { searchParams: Promise<QueryParams> }) { return <CatalogView store={previewStore} products={previewProducts} basePath="/preview/store" params={await searchParams} preview />; }
