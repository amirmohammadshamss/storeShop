import type { z } from "zod";
import type { draftSchema } from "@/lib/checkout/draft";
import type { customerSchema } from "@/lib/checkout/validation";
import type { draftInputSchema } from "@/lib/checkout/validation";

export type CustomerFieldDefinition = {
  name: keyof Customer;
  label: string;
  type: "text" | "tel" | "email";
  multiline?: boolean;
};

export type Draft = z.infer<typeof draftSchema>;

export type Customer = z.infer<typeof customerSchema>;

export type DraftInput = z.infer<typeof draftInputSchema>;
