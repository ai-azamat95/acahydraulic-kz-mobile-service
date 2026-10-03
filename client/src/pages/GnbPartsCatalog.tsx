import data from "@shared/gnb-parts.json";
import { SEO } from "@/components/SEO";
import SiteHomeLink from "@/components/SiteHomeLink";
import { Link } from "wouter";

export default function GnbPartsCatalog() {
  return <div className="min-h-[100dvh] bg-[#101010] font-roboto text-white">
    <SEO title={data.title} description={data.description} canonical={data.path}
      breadcrumbs={[{name:"Каталог запчастей",url:"/catalog/"},{name:data.title,url:data.path}]}
      schema={{"@context":"https://schema.org","@type":"CollectionPage",name:data.title,description:data.description,url:`https://acahydraulic.kz${data.path}`,inLanguage:"ru-KZ",mainEntity:{"@type":"ItemList",numberOfItems:1,itemListElement:[{"@type":"ListItem",position:1,name:"Гидравлический насос 803001730 для XCMG XZ200 / XZ200E",url:`https://acahydraulic.kz${data.productPath}`}]}}} />
    <header className="border-b border-white/15">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-5 px-4 py-5" aria-label="Навигация каталога">
        <SiteHomeLink className="font-bold text-[#FFC000]">ACA Hydraulic</SiteHomeLink>
        <Link href="/catalog/" className="inline-flex min-h-11 items-center underline underline-offset-4">Каталог запчастей</Link>
      </nav>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-14" data-gnb-parts>
      <p className="text-sm font-bold uppercase tracking-wider text-[#FFC000]">Подбор для буровых установок</p>
      <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{data.title}</h1>
      <p className="mt-5 max-w-3xl leading-7 text-gray-300">{data.intro}</p>
      <a href="#gnb-request" className="mt-6 inline-flex min-h-12 items-center justify-center rounded bg-[#FFC000] px-5 py-3 font-bold text-black">Что отправить для подбора</a>
      <section className="mt-12" aria-labelledby="gnb-groups">
        <h2 id="gnb-groups" className="text-2xl font-bold">Какие запчасти ищем по запросу</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.groups.map(group => <article key={group.id} data-gnb-group={group.id} className="min-w-0 rounded border border-white/15 bg-[#181818] p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#FFC000]">Подбор под заказ</p>
            <h3 className="mt-3 text-lg font-bold">{group.title}</h3>
            <p className="mt-3 leading-6 text-gray-300">{group.text}</p>
          </article>)}
        </div>
        <p className="mt-5 max-w-4xl leading-7 text-gray-300">{data.fitment}</p>
      </section>
      <section className="mt-12 border-l-2 border-[#FFC000] bg-[#181818] p-5 md:p-7" aria-labelledby="gnb-example">
        <h2 id="gnb-example" className="text-2xl font-bold">{data.exampleTitle}</h2>
        <p className="mt-4 max-w-4xl leading-7 text-gray-300">{data.exampleText}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <Link href={data.productPath} className="inline-flex min-h-11 items-center text-[#FFC000] underline underline-offset-4">Карточка насоса 803001730</Link>
          <Link href={data.casePath} className="inline-flex min-h-11 items-center text-[#FFC000] underline underline-offset-4">Поставка и установка на XCMG XZ200</Link>
        </div>
      </section>
      <section id="gnb-request" className="mt-12 scroll-mt-20" aria-labelledby="gnb-request-title">
        <h2 id="gnb-request-title" className="text-2xl font-bold">Что нужно для точного подбора</h2>
        <p className="mt-4 max-w-3xl leading-7 text-gray-300">{data.selection}</p>
        <a data-gnb-cta href={data.whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 max-w-full items-center justify-center rounded bg-[#FFC000] px-5 py-3 text-center font-bold text-black">{data.cta}</a>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">{data.note}</p>
      </section>
      <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-5" aria-label="Связанные разделы каталога">
        {data.related.map(item => <Link key={item.path} href={item.path} className="inline-flex min-h-11 items-center underline underline-offset-4">{item.title}</Link>)}
      </nav>
    </main>
  </div>;
}
