import content from '../../../shared/local-repair-content.json';

export default function LocalRepairInfo({ route }: { route: keyof typeof content }) {
  const item = content[route];
  return (
    <section className="bg-[#111111] py-12 text-white">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="mb-6 text-2xl font-bold md:text-3xl">{item.title}</h2>
        {item.paragraphs.map(text => <p key={text} className="mb-4 text-base leading-relaxed text-gray-300">{text}</p>)}
        <nav aria-label="Услуги и примеры ремонта">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {item.links.map(link => <li key={link.href}><a href={link.href} className="text-[#FFC000] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">{link.label}</a></li>)}
          </ul>
        </nav>
      </div>
    </section>
  );
}
