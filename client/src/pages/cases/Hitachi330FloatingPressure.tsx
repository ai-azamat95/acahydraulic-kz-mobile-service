import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, ExternalLink, Gauge, MessageCircle, Phone, PlayCircle, Waves } from "lucide-react";

export default function Hitachi330FloatingPressure() {
  const videoUrl = "https://www.tiktok.com/@acaservice01/video/7529938314011380997";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      <SEO
        title="Hitachi 330-5G: плавает давление и стрела идёт рывками | ACA Hydraulic"
        description="Реальный выездной ремонт Hitachi 330-5G: машина медленная, давление гидросистемы нестабильное, стрела поднимается рывками. Диагностика и ремонт на объекте, видео процесса."
        keywords="Hitachi 330 5G ремонт, Hitachi плавает давление, стрела поднимается рывками, ремонт гидравлики Hitachi, диагностика Hitachi Казахстан"
        canonical="/cases/hitachi-330-5g-plavaet-davlenie-strela-ryvkami"
      />

      <main>
        <section className="py-14 md:py-20 border-b border-white/10 bg-[#111]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-[#FFC000] text-sm font-bold uppercase tracking-widest mb-4">Реальный кейс • Hitachi 330-5G</div>
            <h1 className="font-bebas text-5xl md:text-7xl leading-none mb-6">
              Давление «плавало», <span className="text-[#FFC000]">стрела шла рывками</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl">
              Экскаватор работал медленно и не развивал нормальную мощность. Одновременно давление гидросистемы было нестабильным, а подъём стрелы сопровождался рывками. Такой набор симптомов требует проверки системы под нагрузкой, а не замены деталей наугад.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-[1fr_360px] gap-8">
            <article className="space-y-10">
              <div>
                <h2 className="font-bebas text-3xl md:text-4xl mb-5">Симптомы на объекте</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-[#141414] border border-white/10 rounded-lg p-5 flex gap-3"><Gauge className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-gray-300">Давление в гидросистеме было нестабильным</span></div>
                  <div className="bg-[#141414] border border-white/10 rounded-lg p-5 flex gap-3"><Waves className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-gray-300">Стрела поднималась рывками</span></div>
                  <div className="bg-[#141414] border border-white/10 rounded-lg p-5 flex gap-3"><AlertTriangle className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-gray-300">Машина работала медленно</span></div>
                  <div className="bg-[#141414] border border-white/10 rounded-lg p-5 flex gap-3"><AlertTriangle className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-gray-300">Не развивала нормальную мощность</span></div>
                </div>
              </div>

              <div>
                <h2 className="font-bebas text-3xl md:text-4xl mb-4">Как диагностируем такие неисправности</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  При плавающем давлении важно проверить систему именно в момент проявления дефекта: давление под нагрузкой, работу клапанов и распределения потока, управляющие контуры и реакцию исполнительных механизмов.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Диагностика на объекте позволяет отделить неисправность насоса от проблем регулирования, клапанов и других элементов системы и не менять дорогостоящие узлы без подтверждения причины.
                </p>
              </div>

              <div className="bg-[#141414] border border-[#FFC000]/30 rounded-xl p-6 md:p-8">
                <h2 className="font-bebas text-3xl mb-4">Реальный ремонт на видео</h2>
                <p className="text-gray-400 mb-6">Этот ролик Hitachi 330-5G набрал более 111 000 просмотров и привёл реальные переходы в профиль и телефонные обращения.</p>
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#FFC000] hover:bg-[#eab000] text-black h-12 px-6 font-bold">
                    <PlayCircle className="w-5 h-5 mr-2"/> Смотреть Hitachi 330-5G <ExternalLink className="w-4 h-4 ml-2"/>
                  </Button>
                </a>
              </div>

              <div>
                <h2 className="font-bebas text-3xl md:text-4xl mb-4">Если давление плавает или стрела дёргается</h2>
                <div className="flex gap-3 bg-[#141414] border border-white/10 rounded-lg p-6">
                  <CheckCircle2 className="w-6 h-6 text-[#FFC000] shrink-0"/>
                  <p className="text-gray-300 leading-relaxed">Сначала фиксируем симптомы и измеряем параметры под нагрузкой. После диагностики даём перечень фактических неисправностей и отдельно рассчитываем ремонт и запчасти.</p>
                </div>
              </div>
            </article>

            <aside className="lg:sticky lg:top-24 h-fit bg-[#141414] border border-white/10 rounded-xl p-6">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Выездная диагностика</div>
              <div className="font-bebas text-4xl text-[#FFC000] mb-3">от 200 000 ₸</div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">Стоимость зависит от города, модели техники и характера неисправности. Ремонт и запчасти рассчитываются отдельно после диагностики.</p>
              <Link href="/contacts"><Button className="w-full bg-[#FFC000] hover:bg-[#eab000] text-black h-12 font-bold mb-3">Отправить данные техники</Button></Link>
              <a href="https://wa.me/77714177925?text=Hitachi%20330-5G%20плавает%20давление%2C%20стрела%20идёт%20рывками" target="_blank" rel="noopener noreferrer">
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
