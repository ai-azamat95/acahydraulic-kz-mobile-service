import { Link } from "wouter";
import { groupCatalogModels, type DirectoryModel } from "@shared/catalog-directory.mjs";

type Props = {
  models: DirectoryModel[];
  brands: { slug: string; name: string; count: number }[];
  home: boolean;
};

export default function CatalogDirectory({ models, brands, home }: Props) {
  return (
    <section data-catalog-directory className="mx-auto max-w-[1600px] border-t border-gray-200 bg-white px-4 py-10 text-[#17242b] md:py-14" aria-labelledby="catalog-directory-title">
      <h2 id="catalog-directory-title" className="text-2xl font-bold">{home ? "Запчасти по брендам и моделям" : "Модели в этом разделе"}</h2>
      <p className="mt-3 max-w-4xl leading-relaxed text-gray-700">Выберите модель, чтобы перейти к связанным позициям. Упоминание модели в каталоге не заменяет проверку OEM-номера, шильдика и исполнения перед заказом.</p>
      {home && <nav aria-label="Бренды запчастей" className="mt-5 flex flex-wrap gap-x-5 gap-y-1">
        {brands.map(brand => <Link key={brand.slug} href={`/catalog/brand/${brand.slug}/`} className="inline-flex min-h-11 items-center text-sm text-[#795809] underline underline-offset-4">{brand.name} · {brand.count}</Link>)}
      </nav>}
      <div className="mt-6 grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
        {groupCatalogModels(models).map(group => (
          <details key={group.brand} className="min-w-0 rounded border border-gray-200 bg-white p-4" data-model-brand={group.brand}>
            <summary className="min-h-11 cursor-pointer py-2 font-semibold">{group.brand} · модели: {group.models.length}</summary>
            <nav aria-label={`Модели ${group.brand}`} className="mt-2 grid gap-1">
              {group.models.map(model => <Link key={model.slug} href={`/catalog/model/${model.slug}/`} className="flex min-h-11 items-center break-words text-sm text-[#795809] underline underline-offset-4">{model.brand} {model.label} · {model.count}</Link>)}
            </nav>
          </details>
        ))}
      </div>
      {!home && <Link href="/catalog/" className="mt-5 inline-flex min-h-11 items-center text-sm text-[#795809] underline underline-offset-4">Все бренды и модели каталога</Link>}
    </section>
  );
}
