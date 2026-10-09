import type { ProductOptionsProps } from "@/types/ui";

export function ProductOptions({ features, disabled }: ProductOptionsProps) {
  return features.map((feature, index) => (
    <fieldset key={`${feature.name}-${index}`} disabled={disabled}>
      <legend className="mb-3 text-sm font-semibold">{feature.name}</legend>
      <div className="flex flex-wrap gap-3">
        {feature.desc.split(",").map(value => value.trim()).filter(Boolean).map((option, i) => (
          <label key={`${option}-${i}`} className="flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3">
            <input required type="radio" name={`feature-${index}`} value={option} className="accent-teal-800" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  ));
}
