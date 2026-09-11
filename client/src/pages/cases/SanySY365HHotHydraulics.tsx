import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, MessageCircle, Phone, PlayCircle, Thermometer, Waves, Wrench, Zap } from "lucide-react";

export default function SanySY365HHotHydraulics() {
  const tiktokUrl = "https://www.tiktok.com/@acaservice01/video/7658206304082677000";
  const youtubeUrl = "https://www.youtube.com/watch?v=mFtnsK7oMRg";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      <SEO
        title="SANY SY365H: рывки гидравлики и потеря мощности на горячую | ACA Hydraulic"
        description="Реальный выездной ремонт SANY SY365H: после прогрева машина теряла мощность, стрела поднималась рывками. Диагностика гидравлики и электрики, ремонт и видео результата."
        keywords="SANY SY365H ремонт, SANY теряет мощность на горячую, экскаватор стрела поднимается рывками, гидравлика дергается на горячую, ремонт SANY Казахстан"
        canonical="/cases/sany-sy365h-gidravlika-na-goryachuyu"
      />

      <main>
        <section className="py-14 md:py-20 border-b border-white/10 bg-[#111]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-[#FFC000] text-sm font-bold uppercase tracking-widest mb-4">Реальный кейс • SANY SY365H</div>
            <h1 className="font-bebas text-5xl md:text-7xl leading-none mb-6">
              После прогрева пропадала мощность, <span className="text-[#FFC000]">стрела шла рывками</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl">
              Неисправность затрагивала одновременно гидравлическую и электрическую части машины. Поэтому ремонт строился не вокруг замены одной детали, а вокруг последовательной диагностики всей системы.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-[1fr_360px] gap-8">
            <article className="space-y-10">
              <div>
                <h2 className="font-bebas text-3xl md:text-4xl mb-5">Что происходило с экскаватором</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-[#141414] border border-white/10 rounded-lg p-5 flex gap-3"><Thermometer className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-gray-300">Неисправность усиливалась после прогрева</span></div>
                  <div className="bg-[#141414] border border-white/10 rounded-lg p-5 flex gap-3"><Waves className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-gray-300">Подъём стрелы сопровождался рывками</span></div>
                  <div className="bg-[#141414] border border-white/10 rounded-lg p-5 flex gap-3"><Wrench className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-gray-300">Требовалась проверка гидросистемы и насоса</span></div>
                  <div className="bg-[#141414] border border-white/10 rounded-lg p-5 flex gap-3"><Zap className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-gray-300">Одновременно были проблемы в электропроводке</span></div>
                </div>
              </div>

              <div>
                <h2 className="font-bebas text-3xl md:text-4xl mb-4">Что показала диагностика</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Во время выезда проверяли работу гидравлики под нагрузкой, состояние управляющих элементов и электрической части. В процессе ремонта работали с распределителем, устраняли утечки, восстанавливали электропроводку и демонтировали гидронасос для дальнейшего ремонта.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Такой дефект особенно опасно диагностировать только по одному симптому: рывки стрелы могут быть следствием нескольких взаимосвязанных причин, а замена насоса без проверки управления и электрики не гарантирует результат.
                </p>
              </div>

              <div className="bg-[#141414] border border-[#FFC000]/30 rounded-xl p-6 md:p-8">
                <h2 className="font-bebas text-3xl mb-4">Видео процесса ремонта</h2>
                <p className="text-gray-400 mb-6">По SANY SY365H опубликована целая серия: первичная диагностика, гидравлика, электрика, демонтаж насоса и финальный результат.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={tiktokUrl} target="_blank" rel="noopener noreferrer"><Button className="w-full bg-[#FFC000] hover:bg-[#eab000] text-black h-12 px-6 font-bold"><PlayCircle className="w-5 h-5 mr-2"/>TikTok <ExternalLink className="w-4 h-4 ml-2"/></Button></a>
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"><Button className="w-full bg-transparent border border-white/20 hover:border-red-500 h-12 px-6"><PlayCircle className="w-5 h-5 mr-2"/>YouTube</Button></a>
                </div>
              </div>

              <div>
                <h2 className="font-bebas text-3xl md:text-4xl mb-4">Результат</h2>
                <div className="flex gap-3 bg-[#141414] border border-white/10 rounded-lg p-6">
                  <CheckCircle2 className="w-6 h-6 text-[#FFC000] shrink-0"/>
                  <p className="text-gray-300 leading-relaxed">Гидравлическая и электрическая части восстановлены, рабочие показания приведены в норму, машина запущена и возвращена в работу.</p>
                </div>
              </div>
            </article>

            <aside className="lg:sticky lg:top-24 h-fit bg-[#141414] border border-white/10 rounded-xl p-6">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Выездная диагностика</div>
              <div className="font-bebas text-4xl text-[#FFC000] mb-3">от 200 000 ₸</div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">Для сложных неисправностей гидравлики и электрики. Цена выезда зависит от города и модели техники. Запчасти и ремонт — отдельно после диагностики.</p>
              <Link href="/contacts"><Button className="w-full bg-[#FFC000] hover:bg-[#eab000] text-black h-12 font-bold mb-3">Отправить модель и видео</Button></Link>
              <a href="https://wa.me/77714177925?text=SANY%20SY365H%20проблема%20с%20гидравликой%20на%20горячую" target="_blank" rel="noopener noreferrer"><Button className="w-full bg-transparent border border-white/20 hover:border-[#25D366] h-12"><MessageCircle className="w-5 h-5 mr-2"/>WhatsApp</Button></a>
              <a href="tel:+77714177925" className="mt-4 flex items-center justify-center gap-2 text-[#FFC000] font-bold"><Phone className="w-4 h-4"/>+7 (771) 417-79-25</a>
            </aside>
          </div>
        </section>

        <section className="py-12 border-t border-white/10 bg-[#111]">
          <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between gap-4 flex-wrap">
            <div><div className="font-bebas text-3xl">Смотрите другие реальные ремонты</div><p className="text-gray-500">CAT, SANY, XCMG и другие машины — процесс и результат на видео.</p></div>
            <Link href="/projects"><Button className="bg-transparent border border-[#FFC000] text-[#FFC000] hover:bg-[#FFC000] hover:text-black">Все видеокейсы</Button></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
