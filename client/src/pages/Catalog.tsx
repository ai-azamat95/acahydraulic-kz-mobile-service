import { useMemo, useState } from "react";
import { ArrowRight, MessageCircle, PackageSearch, Search } from "lucide-react";
import { Link } from "wouter";

import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import {
  catalogBrands,
  catalogCategories,
  catalogProducts,
  formatKzt,
} from "@/data/catalog";

const WHATSAPP = "77714177925";

function Catalog() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return catalogProducts.filter((product) => {
      const searchable = [
        product.title,
        product.sku,
        product.brand,
        product.category,
        ...product.oem,
        ...product.machineModels,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = !normalized || searchable.includes(normalized);
      const matchesBrand = brand === "all" || product.brand === brand;
      const matchesCategory = category === "all" || product.category === category;

      return matchesQuery && matchesBrand && matchesCategory;
    });
  }, [brand, category, query]);

  const whatsappText = encodeURIComponent(
    "Здравствуйте! Нужна помощь с подбором гидравлической запчасти."
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <SEO
        title="Каталог гидравлических запчастей"
        description="Каталог гидравлических запчастей ACA Hydraulic: поиск по OEM, артикулу, бренду и модели спецтехники. Подбор, поставка и установка в Казахстане."
        canonical="/parts"
        keywords="гидравлические запчасти, запчасти экскаватора, гидронасос, гидромотор, OEM запчасти, купить запчасти спецтехники Казахстан"
        noIndex
        breadcrumbs={[{ name: "Каталог запчастей", url: "/parts" }]}
      />

      <header className="border-b border-white/10 bg-[#111111]">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-[30px] gap-[3px]">
              <div className="h-full w-[10px] bg-[#FFC000]" />
              <div className="flex h-full flex-col justify-between">
                <div className="h-[13.5px] w-[10px] bg-[#FFC000]" />
                <div className="h-[13.5px] w-[10px] bg-[#FFC000]" />
              </div>
            </div>
            <div>
              <div className="text-lg font-bold leading-none tracking-wide">ACA</div>
              <div className="mt-1 text-[11px] font-medium leading-none tracking-wider text-gray-300">
                HYDRAULIC
              </div>
            </div>
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-[#FFC000] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#ffd044]"
          >
            <MessageCircle className="h-4 w-4" />
            Подбор по WhatsApp
          </a>
        </div>
      </header>

      <main>
        <section className="border-b border-white/10 bg-gradient-to-b from-[#151515] to-[#0d0d0d]">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-4xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FFC000]/30 bg-[#FFC000]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#FFC000]">
                <PackageSearch className="h-4 w-4" />
                ACA Parts
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
                Гидравлические запчасти для спецтехники
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-gray-400 md:text-lg">
                Поиск по OEM-номеру, артикулу, бренду и модели техники. Перед отгрузкой
                совместимость подтверждаем по маркировке и исполнению узла.
              </p>
              <div className="mt-8 rounded-xl border border-[#FFC000]/20 bg-[#FFC000]/5 p-4 text-sm text-gray-300">
                Сейчас это пилотная версия каталога. Товарные позиции ниже используются для
                проверки структуры карточек и поиска и не означают подтверждённое наличие.
              </div>
            </div>

            <div className="mt-10 grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-[minmax(0,1fr)_220px_220px]">
              <label className="relative block">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="OEM, артикул, модель техники..."
                  className="h-12 w-full rounded-lg border border-white/10 bg-[#121212] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#FFC000]"
                />
              </label>
              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="h-12 rounded-lg border border-white/10 bg-[#121212] px-4 text-sm text-white outline-none focus:border-[#FFC000]"
                aria-label="Бренд"
              >
                <option value="all">Все бренды</option>
                {catalogBrands.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-12 rounded-lg border border-white/10 bg-[#121212] px-4 text-sm text-white outline-none focus:border-[#FFC000]"
                aria-label="Категория"
              >
                <option value="all">Все категории</option>
                {catalogCategories.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Найдено позиций</p>
              <p className="mt-1 text-2xl font-bold">{filteredProducts.length}</p>
            </div>
            <div className="text-right text-xs text-gray-600">
              Наценка в движке каталога: по умолчанию +50%
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-10 text-center">
              <PackageSearch className="mx-auto h-10 w-10 text-[#FFC000]" />
              <h2 className="mt-4 text-xl font-bold">Позиция не найдена</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
                Отправьте OEM-номер или фото шильдика в WhatsApp — подберём нужное исполнение.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#121212] transition hover:-translate-y-1 hover:border-[#FFC000]/50"
                >
                  <Link href={`/parts/${product.slug}`} className="block">
                    <div className="flex aspect-[16/10] items-center justify-center border-b border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0c0c0c] p-8">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-center">
                          <PackageSearch className="mx-auto h-14 w-14 text-[#FFC000]" />
                          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                            {product.brand}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#FFC000]">
                            {product.category}
                          </p>
                          <h2 className="mt-2 text-lg font-bold leading-snug transition group-hover:text-[#FFC000]">
                            {product.title}
                          </h2>
                        </div>
                      </div>
                      <dl className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                          <dt className="text-gray-600">Артикул</dt>
                          <dd className="font-medium text-gray-300">{product.sku}</dd>
                        </div>
                        <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                          <dt className="text-gray-600">OEM</dt>
                          <dd className="max-w-[60%] text-right font-medium text-gray-300">
                            {product.oem.join(", ")}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-5 flex items-center justify-between gap-4">
                        <span className="text-lg font-black">{formatKzt(product.priceKzt)}</span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#FFC000]">
                          Карточка
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="border-y border-white/10 bg-[#111111]">
          <div className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-black md:text-3xl">Нет нужной позиции в каталоге?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Пришлите OEM-номер, модель техники или фото шильдика. Подберём запчасть и
                подтвердим совместимость до заказа.
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#FFC000] px-6 font-bold text-black transition hover:bg-[#ffd044]"
            >
              <MessageCircle className="h-5 w-5" />
              Отправить запрос
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Catalog;
