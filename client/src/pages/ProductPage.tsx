import { ArrowLeft, CheckCircle2, MessageCircle, PackageSearch, Phone } from "lucide-react";
import { Link, useParams } from "wouter";

import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { findCatalogProduct, formatKzt } from "@/data/catalog";

const WHATSAPP = "77714177925";
const PHONE = "+77714177925";

function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = findCatalogProduct(params.slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        <SEO
          title="Запчасть не найдена"
          description="Запрошенная товарная позиция не найдена в каталоге ACA Hydraulic."
          canonical={`/parts/${params.slug}`}
          noIndex
        />
        <main className="container mx-auto px-4 py-24 text-center">
          <PackageSearch className="mx-auto h-14 w-14 text-[#FFC000]" />
          <h1 className="mt-5 text-3xl font-black">Позиция не найдена</h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Проверьте артикул или вернитесь в каталог и воспользуйтесь поиском по OEM.
          </p>
          <Link
            href="/parts"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#FFC000] px-5 py-3 font-bold text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Вернуться в каталог
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const whatsappText = encodeURIComponent(
    `Здравствуйте! Интересует ${product.title}, артикул ${product.sku}. Нужна цена и проверка совместимости.`
  );

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.sku,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    url: `https://acahydraulic.kz/parts/${product.slug}/`,
    ...(product.priceKzt
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "KZT",
            price: product.priceKzt,
            availability:
              product.availability === "in_stock"
                ? "https://schema.org/InStock"
                : "https://schema.org/PreOrder",
            url: `https://acahydraulic.kz/parts/${product.slug}/`,
          },
        }
      : {}),
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <SEO
        title={`${product.title} ${product.sku} — купить в Казахстане`}
        description={`${product.title}, артикул ${product.sku}. Подбор по OEM и модели техники, проверка совместимости, поставка и установка ACA Hydraulic.`}
        canonical={`/parts/${product.slug}`}
        keywords={`${product.title}, ${product.sku}, ${product.oem.join(", ")}, купить гидравлические запчасти Казахстан`}
        schema={productSchema}
        noIndex={Boolean(product.isDemo)}
        breadcrumbs={[
          { name: "Каталог запчастей", url: "/parts" },
          { name: product.title, url: `/parts/${product.slug}` },
        ]}
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
          <Link
            href="/parts"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-[#FFC000]"
          >
            <ArrowLeft className="h-4 w-4" />
            Каталог
          </Link>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-8 md:py-14">
          <nav className="mb-7 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <Link href="/" className="hover:text-[#FFC000]">
              Главная
            </Link>
            <span>/</span>
            <Link href="/parts" className="hover:text-[#FFC000]">
              Запчасти
            </Link>
            <span>/</span>
            <span className="text-gray-400">{product.sku}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#191919] to-[#0b0b0b]">
              <div className="flex aspect-square items-center justify-center p-10">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <PackageSearch className="mx-auto h-24 w-24 text-[#FFC000]" />
                    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                      {product.brand}
                    </p>
                    <p className="mt-2 text-xs text-gray-700">Фото будет загружаться при импорте товара</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[#FFC000]/30 bg-[#FFC000]/10 px-3 py-1 text-xs font-semibold text-[#FFC000]">
                  {product.category}
                </span>
                {product.isDemo && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-400">
                    Демо-карточка
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">{product.title}</h1>
              <p className="mt-3 text-lg font-semibold text-gray-400">Артикул: {product.sku}</p>

              <div className="mt-7 flex flex-wrap items-end gap-x-6 gap-y-3 border-y border-white/10 py-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-600">Цена</p>
                  <p className="mt-1 text-3xl font-black text-[#FFC000]">{formatKzt(product.priceKzt)}</p>
                </div>
                <div className="pb-1 text-sm text-gray-500">
                  Финальная стоимость подтверждается после проверки исполнения и наличия.
                </div>
              </div>

              <p className="mt-6 leading-7 text-gray-400">{product.description}</p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-[#FFC000] px-5 py-3 font-bold text-black transition hover:bg-[#ffd044]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Узнать цену в WhatsApp
                </a>
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-3 font-bold text-white transition hover:border-[#FFC000]/50"
                >
                  <Phone className="h-5 w-5 text-[#FFC000]" />
                  Позвонить
                </a>
              </div>

              <div className="mt-7 rounded-xl border border-white/10 bg-[#111111] p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FFC000]" />
                  <div>
                    <p className="font-bold">Проверяем совместимость до заказа</p>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Для гидронасосов и гидромоторов сверяем полный номер, регулятор, вал,
                      фланец, порты и направление вращения. Для других узлов — OEM и серийный
                      номер техники.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#111111]">
          <div className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="text-2xl font-black">Характеристики позиции</h2>
              <dl className="mt-6 divide-y divide-white/10 rounded-xl border border-white/10 bg-[#0d0d0d] px-5">
                <div className="flex justify-between gap-5 py-4 text-sm">
                  <dt className="text-gray-600">Бренд</dt>
                  <dd className="text-right font-semibold text-gray-300">{product.brand}</dd>
                </div>
                <div className="flex justify-between gap-5 py-4 text-sm">
                  <dt className="text-gray-600">Категория</dt>
                  <dd className="text-right font-semibold text-gray-300">{product.category}</dd>
                </div>
                <div className="flex justify-between gap-5 py-4 text-sm">
                  <dt className="text-gray-600">Артикул</dt>
                  <dd className="text-right font-semibold text-gray-300">{product.sku}</dd>
                </div>
                <div className="flex justify-between gap-5 py-4 text-sm">
                  <dt className="text-gray-600">OEM</dt>
                  <dd className="max-w-[65%] text-right font-semibold text-gray-300">
                    {product.oem.join(", ")}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-2xl font-black">Применяемость</h2>
              <div className="mt-6 rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
                <ul className="space-y-3">
                  {product.machineModels.map((model) => (
                    <li key={model} className="flex items-start gap-3 text-sm leading-6 text-gray-400">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#FFC000]" />
                      {model}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-gray-600">
                  Список применяемости справочный. Перед оплатой ACA Hydraulic подтверждает
                  совместимость конкретной детали с вашей техникой.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProductPage;
