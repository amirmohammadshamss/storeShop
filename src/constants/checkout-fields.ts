import { checkoutText } from "@/content/fa/checkout";
import type { CustomerFieldDefinition } from "@/types/checkout";

export const customerFields: CustomerFieldDefinition[] = [
  { name: "full_name", label: checkoutText.fullName, type: "text" },
  { name: "mobile", label: checkoutText.mobile, type: "tel" },
  { name: "email", label: checkoutText.optionalEmail, type: "email" },
  { name: "address", label: checkoutText.address, type: "text", multiline: true },
  { name: "description", label: checkoutText.optionalComment, type: "text", multiline: true },
];

export type { CustomerFieldDefinition } from "@/types/checkout";
