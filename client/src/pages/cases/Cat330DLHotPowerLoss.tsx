import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, ExternalLink, Gauge, MessageCircle, Phone, PlayCircle, Thermometer } from "lucide-react";

export default function Cat330DLHotPowerLoss() {
  const videoUrl = "https://www.tiktok.com/@acaservice01/video/7648329720278289672";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      <SEO
        title="Экскаватор теряет мощность на горячую — реальный ремонт CAT 330DL | ACA Hydraulic"
        description="Реальный кейс Caterpillar 330DL: после прогрева экскаватор терял мощность, была проблема поворота и высокий расход топлива. Выездная диагностика и ремонт ACA Hydraulic. Видео ремонта."
        keywords="экскаватор теряет мощность на горячую, CAT 330DL теряет мощность, экскаватор глохнет после прогрева, диагностика гидравлики экскаватора, ремонт Caterpillar Казахстан"
        canonical="/cases/cat-330dl-teryaet-moshchnost-na-goryachuyu"
      />

      <main>
        <section className="py-14 md:py-20 border-b border-white/10 bg-[#111]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-[#FFC000] text-sm font-bold uppercase tracking-widest mb-4">Реальный кейс • Caterpillar 330DL</div>
            <h1 className="font-bebas text-5xl md:text-7xl leading-none mb-6">
              Экскаватор терял мощность <span className="text-[#FFC000]">после прогрева</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl">
              После выхода машины на рабочую температуру гидравлическая мощность пропадала. Дополнительно была проблема с поворотом и повышенный расход топлива. Показываем реальный процесс диагностики и ремонта, а не теоретический список причин.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-[1fr_360px] gap-8">
            <article className="space-y-10">
              <div>
                <h2 className="font-bebas text-3xl md:text-4xl mb-5">Симптомы машины</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    [Thermometer, "Проблема проявлялась после прогрева"],
                    [Gauge, "Терялась рабочая мощность"],
                    [AlertTriangle, "Нарушалась работа поворота"],
                    [AlertTriangle, "Был высокий расход топлива"],
                  ].map(([Icon, text], i) => {
                    const C = Icon as typeof Thermometer;
                    return <div key={i} className="bg-[#141414] border border-white/10 rounded-lg p-5 flex gap-3"><C className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-gray-300">{text as string}</span></div>;
                  })}
                </div>
              </div>

              <div>
                <h2 className="font-bebas text-3xl md:text-4xl mb-4">Почему такой дефект нельзя определять «по телефону»</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Потеря мощности после прогрева может быть связана не с одной деталью. Важно воспроизвести неисправность на рабочей температуре и проверить машину под нагрузкой: гидравлическую часть, управление, двигатель и связанные параметры.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  В этом случае диагностика выявила в том числе некорректную работу форсунки. После устранения выявленных неисправностей машина была возвращена в нормальную работу.
                </p>
              </div>

              <div className="bg-[#141414] border border-[#FFC000]/30 rounded-xl p-6 md:p-8">
                <h2 className="font-bebas text-3xl mb-4">Результат подтверждён видео</h2>
                <p className="text-gray-400 mb-6">Финальная часть этого ремонта набрала более 89 000 просмотров в TikTok и дала реальные обращения по телефону.</p>
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#FFC000] hover:bg-[#eab000] text-black h-12 px-6 font-bold">
                    <PlayCircle className="w-5 h-5 mr-2"/> Смотреть реальный ремонт <ExternalLink className="w-4 h-4 ml-2"/>
                  </Button>
                </a>
              </div>

              <div>
                <h2 className="font-bebas text-3xl md:text-4xl mb-4">Если ваша техника тоже слабеет на горячую</h2>
                <p className="text-gray-300 leading-relaxed">
                  Не меняйте насос, распределитель или форсунки наугад. Сначала нужно зафиксировать симптомы, измерить параметры именно в момент появления неисправности и определить, какая система создаёт потерю мощности.
                </p>
              </div>
            </article>

            <aside className="lg:sticky lg:top-24 h-fit bg-[#141414] border border-white/10 rounded-xl p-6">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Выездная диагностика</div>
              <div className="font-bebas text-4xl text-[#FFC000] mb-3">от 200 000 ₸</div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">Стоимость зависит от города, модели техники и характера неисправности. Ремонт и запчасти рассчитываются отдельно после диагностики.</p>
              <Link href="/contacts">
                <Button className="w-full bg-[#FFC000] hover:bg-[#eab000] text-black h-12 font-bold mb-3">Отправить данные техники</Button>
              </Link>
              <a href="https://wa.me/77714177925?text=CAT%20330DL%20теряет%20мощность%20после%20прогрева" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-transparent border border-white/20 hover:border-[#25D366] h-12"><MessageCircle className="w-5 h-5 mr-2"/>WhatsApp</Button>
              </a>
              <a href="tel:+77714177925" className="mt-4 flex items-center justify-center gap-2 text-[#FFC000] font-bold"><Phone className="w-4 h-4"/>+7 (771) 417-79-25</a>
            </aside>
          </div>
        </section>

        <section className="py-12 border-t border-white/10 bg-[#111]">
          <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between gap-4 flex-wrap">
            <div><div className="font-bebas text-3xl">Другие реальные ремонты</div><p className="text-gray-500">Смотрите диагностику и результат на настоящей технике.</p></div>
            <Link href="/projects"><Button className="bg-transparent border border-[#FFC000] text-[#FFC000] hover:bg-[#FFC000] hover:text-black">Все видеокейсы</Button></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
