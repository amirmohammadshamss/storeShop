import { catalogText } from "@/content/fa/catalog";
import type { CatalogFiltersProps } from "@/types/ui";
import Link from "next/link";

import { CATALOG_INPUT_CLASS as inputClass } from "@/constants/ui";
import { MAX_SEARCH_QUERY_LENGTH, MAX_PRICE_INPUT_LENGTH } from "@/constants/catalog";

export function CatalogFilters({ search, basePath }: CatalogFiltersProps) {
  return (
    <form action={basePath} method="get" className="mb-6 grid gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="catalog-query" className="mb-2 block text-sm font-medium">{catalogText.searchLabel}</label>
        <input id="catalog-query" name="q" maxLength={MAX_SEARCH_QUERY_LENGTH} defaultValue={search.query} className={inputClass} />
      </div>
      {([
        { id: "catalog-min", name: "min", label: catalogText.minimumPrice, value: search.minimum },
        { id: "catalog-max", name: "max", label: catalogText.maximumPrice, value: search.maximum },
      ] as const).map(field => (
        <div key={field.name}>
          <label htmlFor={field.id} className="mb-2 block text-sm font-medium">{field.label}</label>
          <input id={field.id} name={field.name} inputMode="numeric" maxLength={MAX_PRICE_INPUT_LENGTH}
            defaultValue={field.value} aria-invalid={Boolean(search.error)}
            aria-describedby={search.error ? "filter-error" : undefined} className={inputClass} />
        </div>
      ))}
      <div>
        <label htmlFor="catalog-sort" className="mb-2 block text-sm font-medium">{catalogText.sortLabel}</label>
        <select id="catalog-sort" name="sort" defaultValue={search.sort} className={inputClass}>
          <option value="default">{catalogText.defaultSort}</option>
          <option value="price-asc">{catalogText.ascendingPrice}</option>
          <option value="price-desc">{catalogText.descendingPrice}</option>
          <option value="title">{catalogText.productName}</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2 lg:col-span-4">
        <button className="rounded-xl bg-teal-800 px-6 py-3 text-sm font-medium text-white hover:bg-teal-900">{catalogText.applyFilters}</button>
        <Link href={basePath} className="text-sm text-teal-800 hover:underline">{catalogText.clearFilters}</Link>
        <p className="text-xs leading-6 text-stone-500">{catalogText.searchScope}</p>
      </div>
      {search.error && <p id="filter-error" role="alert" className="text-sm text-red-700 sm:col-span-2 lg:col-span-4">{search.error}</p>}
    </form>
  );
}
