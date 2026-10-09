import { commonText } from "@/content/fa/common";
import type { PreviewStorePageProps } from "@/types/routes";
import type { Metadata } from "next";
import { previewProducts, previewStore } from "@/lib/catalog/preview";

import { CatalogView } from "../../ui/catalog-view";
export const metadata: Metadata = { title: commonText.previewStore, robots: { index: false, follow: false } };
export default async function PreviewStorePage({ searchParams }: PreviewStorePageProps) { return <CatalogView store={previewStore} products={previewProducts} basePath="/preview/store" params={await searchParams} preview />; }
