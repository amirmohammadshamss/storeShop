import type { TextInterpolation } from "@/types/content";

export const technicalText = {
  invalidPath: "Invalid path",
  catalogCacheSecondsMessageTemplate: (value0: TextInterpolation) => ["Backend request failed: ", String(value0), ""].join(""),
  draftTooLarge: "Draft is too large",
  draftSecretRequired: "Draft secret must be configured",
  bodyTooLarge: "Body too large",
  missingBody: "Missing body",
  expectedJson: "Expected JSON",
  invalidProductOptions: "Invalid product options",
  orderLookupDisabled: "Order lookup is disabled",
  invalidStoreOptions: "Invalid store or options",
} as const;
