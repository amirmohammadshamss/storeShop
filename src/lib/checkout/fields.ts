import type { Customer } from "./validation";

export type CustomerFieldDefinition = {
  name: keyof Customer;
  label: string;
  type: "text" | "tel" | "email";
  multiline?: boolean;
};

export const customerFields: CustomerFieldDefinition[] = [
  { name: "full_name", label: "نام و نام خانوادگی", type: "text" },
  { name: "mobile", label: "شماره موبایل", type: "tel" },
  { name: "email", label: "ایمیل (اختیاری)", type: "email" },
  { name: "address", label: "آدرس", type: "text", multiline: true },
  { name: "description", label: "توضیحات سفارش (اختیاری)", type: "text", multiline: true },
];
