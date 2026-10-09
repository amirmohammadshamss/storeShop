import Link from "next/link";
import type { CatalogSearch } from "@/lib/catalog/search";

const inputClass = "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20";

export function CatalogFilters({ search, basePath }: { search: CatalogSearch; basePath: string }) {
  return (
    <form action={basePath} method="get" className="mb-6 grid gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="catalog-query" className="mb-2 block text-sm font-medium">نام یا کد محصول</label>
        <input id="catalog-query" name="q" maxLength={100} defaultValue={search.query} className={inputClass} />
      </div>
      {([
        { id: "catalog-min", name: "min", label: "حداقل قیمت", value: search.minimum },
        { id: "catalog-max", name: "max", label: "حداکثر قیمت", value: search.maximum },
      ] as const).map(field => (
        <div key={field.name}>
          <label htmlFor={field.id} className="mb-2 block text-sm font-medium">{field.label}</label>
          <input id={field.id} name={field.name} inputMode="numeric" maxLength={16}
            defaultValue={field.value} aria-invalid={Boolean(search.error)}
            aria-describedby={search.error ? "filter-error" : undefined} className={inputClass} />
        </div>
      ))}
      <div>
        <label htmlFor="catalog-sort" className="mb-2 block text-sm font-medium">مرتب‌سازی</label>
        <select id="catalog-sort" name="sort" defaultValue={search.sort} className={inputClass}>
          <option value="default">ترتیب فروشگاه</option>
          <option value="price-asc">ارزان‌ترین</option>
          <option value="price-desc">گران‌ترین</option>
          <option value="title">نام محصول</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2 lg:col-span-4">
        <button className="rounded-xl bg-teal-800 px-6 py-3 text-sm font-medium text-white hover:bg-teal-900">جستجو و اعمال فیلتر</button>
        <Link href={basePath} className="text-sm text-teal-800 hover:underline">پاک کردن فیلترها</Link>
        <p className="text-xs leading-6 text-stone-500">جستجو فقط در محصولات همین فهرست است؛ موجودی و دسته‌بندی تأیید نشده‌اند.</p>
      </div>
      {search.error && <p id="filter-error" role="alert" className="text-sm text-red-700 sm:col-span-2 lg:col-span-4">{search.error}</p>}
    </form>
  );
}
