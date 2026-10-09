import type { QueryParams } from "@/types/catalog";

export type ProductPageProps = { params: Promise<{ idStore: string; idProduct: string }> };

export type StorePageProps = { params: Promise<{ idStore: string }>; searchParams: Promise<QueryParams> };

export type ErrorPageProps = { reset: () => void };

export type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

export type PreviewResultPageProps = { params: Promise<{ status: string }> };

export type PreviewProductPageProps = { params: Promise<{ idProduct: string }> };

export type PreviewStorePageProps = { searchParams: Promise<QueryParams> };

export type PreviewTrackingPageProps = { params: Promise<{ idPursuit: string }> };

export type InvoicePageProps = { params: Promise<{ invoice_id: string }> };

export type TrackingPageProps = { params: Promise<{ idPursuit: string }> };
