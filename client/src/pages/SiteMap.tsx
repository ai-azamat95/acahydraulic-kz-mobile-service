import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import directory from "../../../shared/site-directory.json";

export default function SiteMap() {
  const [query, setQuery] = useState("");
  const term = query.trim().toLocaleLowerCase("ru-RU").replace(/ё/g, "е");
  const sections = directory.map(section => ({
    ...section,
    links: section.links.filter(link => `${section.title} ${link.label}`.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").includes(term)),
  })).filter(section => section.links.length);

  return <main className="min-h-screen bg-[#111111] px-4 py-12 text-white md:py-16">
    <SEO title="Разделы сайта — ремонт, запчасти и двигатели"
      description="Найдите услугу, регион выезда, бренд или модель спецтехники в ACA Hydraulic. Каталог запчастей, двигатели Cummins, реальные кейсы и руководства по диагностике."
      canonical="/sitemap/" breadcrumbs={[{ name: "Разделы сайта", url: "/sitemap/" }]} />
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold md:text-5xl">Все разделы ACA Hydraulic</h1>
      <p className="mt-5 max-w-3xl text-white/75">Выберите задачу: ремонт на объекте, подбор запчасти по номеру и модели или двигатель в сборе. Условия выезда, совместимость, цену и срок подтверждаем для конкретного заказа.</p>
      <p className="mt-3 text-white/75">Для поиска конкретной детали используйте <Link href="/catalog/" className="text-[#FFC000] underline">каталог запчастей</Link>. Если номер неизвестен, отправьте модель и фото шильдика в <a href="https://wa.me/77714177925" className="text-[#FFC000] underline">WhatsApp</a>.</p>
      <label htmlFor="site-directory-search" className="mt-8 block font-semibold">Поиск по разделам сайта</label>
      <input id="site-directory-search" type="search" value={query} onChange={event => setQuery(event.target.value)}
        placeholder="Например: Komatsu, двигатель, Караганда"
        className="mt-2 w-full rounded-lg border border-white/25 bg-black p-4 focus-visible:outline-2 focus-visible:outline-[#FFC000]" />
      <div className="mt-9 space-y-9">
        {sections.map(section => <section key={section.title}>
          <h2 className="mb-4 text-xl font-bold text-[#FFC000]">{section.title}</h2>
          <ul className="grid gap-x-8 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
            {section.links.map(link => <li key={link.href}><Link href={link.href} className="inline-flex min-h-11 items-center break-words py-2 text-sm text-white/85 underline decoration-white/25 underline-offset-4 hover:text-[#FFC000]">{link.label}</Link></li>)}
          </ul>
        </section>)}
        {sections.length === 0 && <p role="status">Такого раздела нет. Попробуйте модель или название узла, либо перейдите в каталог для подбора.</p>}
      </div>
    </div>
  </main>;
}
