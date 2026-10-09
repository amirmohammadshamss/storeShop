import { catalogText } from "@/content/fa/catalog";
import type { StoreHeaderProps } from "@/types/ui";

import { plainDescription } from "@/lib/catalog/schema";
import { CodeForm } from "../code-form";

export function StoreHeader({ store, basePath }: StoreHeaderProps) {
  return (
    <section className="grid gap-8 rounded-3xl bg-teal-900 p-8 text-white sm:p-12 lg:grid-cols-2">
      <div>
        <p className="mb-3 text-sm text-teal-200">{catalogText.onlineStore}</p>
        <h1 className="text-3xl font-bold sm:text-4xl">{store.title}</h1>
        <p className="mt-5 max-w-lg leading-8 text-teal-100">
          {plainDescription(store.desc) || catalogText.storeDescriptionFallback}
        </p>
      </div>
      <div className="self-end rounded-2xl bg-white p-5 text-stone-900">
        <CodeForm basePath={basePath} />
      </div>
    </section>
  );
}
