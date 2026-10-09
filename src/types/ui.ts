import type { CatalogSearch } from "@/types/catalog";
import type { ProductSummary } from "@/types/catalog";
import type { Store } from "@/types/catalog";
import type { QueryParams } from "@/types/catalog";
import type { Product } from "@/types/catalog";
import type { Draft } from "@/types/checkout";
import type { CustomerFieldDefinition } from "@/types/checkout";
import type { Invoice } from "@/types/orders";
import type { PaymentState } from "@/types/orders";
import type { TrackingRecord } from "@/types/orders";
import type { CartItem } from "@/types/shopping";
import type { ProductReference } from "@/types/shopping";

export type CatalogFiltersProps = { search: CatalogSearch; basePath: string };

export type ProductCardProps = { product: ProductSummary; storeCode: string; basePath: string; preview: boolean };

export type StoreHeaderProps = { store: Store; basePath: string };

export type CatalogViewProps = { store: Store; products: ProductSummary[]; basePath: string; preview?: boolean; params?: QueryParams };

export type CheckoutSummaryProps = { product: Product; draft: Draft };

export type CustomerFieldProps = { field: CustomerFieldDefinition; error?: string };

export type DraftActionsProps = { backPath: string };

export type CheckoutFormProps = { preview: boolean; backPath: string };

export type CodeFormProps = { basePath?: string; store?: boolean; kind?: "product" | "tracking" };

export type InvoiceDetailsProps = { invoice: Invoice; preview: boolean };

export type PaymentViewProps = { invoice: Invoice; state: PaymentState; preview?: boolean };

export type TrackingViewProps = { record: TrackingRecord; code: string; preview?: boolean };

export type ProductInformationProps = { product: Product; preview: boolean };

export type ProductOptionsProps = { features: Product["features"]; disabled: boolean };

export type ProductGalleryProps = { images: string[]; title: string };

export type ProductPurchaseProps = { product: Product; preview: boolean };

export type ProductViewProps = { product: Product; basePath: string; preview?: boolean };

export type CartContentProps = { items: CartItem[]; id: string; basePath: string; preview: boolean; unavailable: (code: string) => boolean; onQuantity: (key: string, quantity: number) => void; onRemove: (key: string) => void };

export type CartItemRowProps = { item: CartItem; quantityId: string; basePath: string; unavailable: boolean; onQuantity: (quantity: number) => void; onRemove: () => void };

export type WishlistContentProps = { items: ProductReference[]; basePath: string; unavailable: (code: string) => boolean; onRemove: (code: string) => void };

export type ShoppingPanelProps = { storeCode: string; preview: boolean; basePath: string; products?: ProductSummary[] };

export type WishlistButtonProps = { product: ProductSummary; storeCode: string; preview: boolean };
