import type { CustomerFieldProps } from "@/types/ui";

import { CHECKOUT_INPUT_CLASS as inputClass } from "@/constants/ui";
import { MAX_CUSTOMER_NAME_LENGTH, MAX_CUSTOMER_TEXT_LENGTH } from "@/constants/checkout";

export function CustomerField({ field, error }: CustomerFieldProps) {
  const accessibility = { "aria-invalid": Boolean(error), "aria-describedby": error ? `${field.name}-error` : undefined };
  return (
    <div>
      <label htmlFor={field.name} className="mb-2 block text-sm font-medium">{field.label}</label>
      {field.multiline ? (
        <textarea id={field.name} name={field.name} rows={3} maxLength={MAX_CUSTOMER_TEXT_LENGTH} {...accessibility} className={inputClass} />
      ) : (
        <input id={field.name} name={field.name} type={field.type} autoComplete="off" maxLength={MAX_CUSTOMER_NAME_LENGTH} {...accessibility} className={inputClass} />
      )}
      {error && <p id={`${field.name}-error`} className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
