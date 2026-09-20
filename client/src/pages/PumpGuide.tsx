import { Link, useLocation } from "wouter";
import { SEO } from "@/components/SEO";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";
import articles from "../../../shared/seo-articles.json";
import NotFound from "./NotFound";

export default function PumpGuide() {
  const [location] = useLocation();
  const article = articles.find(item => location.replace(/\/+$/, "") === `/blog/${item.slug}`);
  if (!article) return <NotFound />;
  const canonical = `https://acahydraulic.kz/blog/${article.slug}/`;
  const image = new URL(article.image, "https://acahydraulic.kz").href;
  return <main aria-label={article.title} className="min-h-screen bg-[#111111] text-white">
    <SEO title={article.title} description={article.description} canonical={canonical} ogImage={image}
      breadcrumbs={[{ name: "Блог", url: "/blog/" }, { name: article.title, url: `/blog/${article.slug}/` }]}
      schema={{ "@context": "https://schema.org", "@type": "Article", "@id": `${canonical}#article`, headline: article.title,
        description: article.description, image, datePublished: article.publishedDate, dateModified: article.publishedDate,
        author: { "@type": "Organization", name: "ACA Hydraulic", url: "https://acahydraulic.kz/about/" },
        publisher: { "@id": "https://acahydraulic.kz/#business" }, mainEntityOfPage: canonical, inLanguage: "ru-KZ" }} />
    <header className="border-b border-white/10">
      <nav aria-label="Основная навигация" className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-5 text-sm text-[#FFC000]">
        <Link href="/" className="py-2 font-bold">ACA Hydraulic</Link><Link href="/blog/" className="py-2 underline">Блог</Link><Link href="/catalog/" className="py-2 underline">Запчасти</Link><Link href="/services/" className="py-2 underline">Услуги</Link>
      </nav>
    </header>
    <article className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <p className="text-sm font-bold text-[#FFC000]">{article.category}</p>
      <h1 className="mt-4 font-bebas text-4xl leading-tight md:text-5xl">{article.title}</h1>
      <p className="mt-4 text-sm text-gray-400">ACA Hydraulic · <time dateTime={article.publishedDate}>19 сентября 2026</time> · {article.readTime}</p>
      <p className="mt-6 text-lg leading-relaxed text-gray-200">{article.intro}</p>
      <figure className="my-8">
        <img src={article.image} alt={article.imageAlt} width={900} height={600} className="max-h-96 w-full rounded-lg bg-[#1a1a1a] object-contain" />
        <figcaption className="mt-3 text-sm leading-relaxed text-gray-400">{article.caption}</figcaption>
      </figure>
      <nav aria-label="Содержание статьи" className="mb-10 border-y border-white/15 py-6">
        <h2 className="font-bebas text-2xl">В этой статье</h2>
        <ol className="mt-3 list-inside list-decimal space-y-3 text-[#FFC000]">{article.sections.map(section => <li key={section.id}><a className="underline underline-offset-4" href={`#${section.id}`}>{section.title}</a></li>)}</ol>
      </nav>
      {article.sections.map(section => <section key={section.id} id={section.id} className="mb-10 scroll-mt-8">
        <h2 className="font-bebas text-3xl leading-tight md:text-4xl">{section.title}</h2>
        {section.paragraphs.map(text => <p key={text} className="mt-4 leading-relaxed text-gray-300">{text}</p>)}
        {section.bullets.length > 0 && <ul className="mt-5 list-disc space-y-3 pl-6 leading-relaxed text-gray-300">{section.bullets.map(text => <li key={text}>{text}</li>)}</ul>}
      </section>)}
      <section className="border-t border-white/15 pt-8">
        <h2 className="font-bebas text-3xl">Каталог, услуги и реальные работы</h2>
        <ul className="mt-4 space-y-3">{article.related.map(link => <li key={link.href}><Link href={link.href} className="inline-block py-1 text-[#FFC000] underline underline-offset-4">{link.label}</Link></li>)}</ul>
      </section>
      <aside className="mt-10 border-l-4 border-[#FFC000] bg-[#1a1a1a] p-6">
        <h2 className="font-bebas text-3xl">Разберём вашу задачу</h2>
        <p className="mt-3 leading-relaxed text-gray-300">Пришлите модель техники, город, симптомы или номер детали. Приложите шильдик и фото подключений — по ним проверим исполнение и согласуем следующий шаг.</p>
        <a href={`https://wa.me/77714177925?text=${encodeURIComponent(article.cta)}`} target="_blank" rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-12 items-center rounded-md bg-[#FFC000] px-5 py-3 font-bold text-black hover:bg-yellow-400"
          onClick={() => trackCatalogEvent("article_whatsapp_click", { article_id: article.slug })}>Отправить данные в WhatsApp</a>
      </aside>
      <Link href="/blog/" className="mt-8 inline-block py-3 text-[#FFC000] underline">Все статьи ACA Hydraulic</Link>
    </article>
  </main>;
}
