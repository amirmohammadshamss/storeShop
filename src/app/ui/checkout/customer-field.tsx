import type { CustomerFieldDefinition } from "@/lib/checkout/fields";

const inputClass = "w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-700/30";

export function CustomerField({ field, error }: { field: CustomerFieldDefinition; error?: string }) {
  const accessibility = { "aria-invalid": Boolean(error), "aria-describedby": error ? `${field.name}-error` : undefined };
  return (
    <div>
      <label htmlFor={field.name} className="mb-2 block text-sm font-medium">{field.label}</label>
      {field.multiline ? (
        <textarea id={field.name} name={field.name} rows={3} maxLength={1000} {...accessibility} className={inputClass} />
      ) : (
        <input id={field.name} name={field.name} type={field.type} autoComplete="off" maxLength={150} {...accessibility} className={inputClass} />
      )}
      {error && <p id={`${field.name}-error`} className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
