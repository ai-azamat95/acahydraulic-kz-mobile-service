import React from 'react';
import { Helmet } from 'react-helmet';
import { FileText, ShieldCheck, Briefcase, CreditCard, Building2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import B2BLeadForm from '@/components/B2BLeadForm';

const Corporate = () => {
  return (
    <>
      <Helmet>
        <title>Корпоративным клиентам | ACA Hydraulic - Работа с НДС и по договору</title>
        <meta name="description" content="Условия сотрудничества для юридических лиц. Ремонт гидравлики с НДС, отсрочка платежа, участие в тендерах. Скачать типовой договор и реквизиты." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-zinc-900 text-white py-20">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#FFB800] text-black px-4 py-1 rounded-full font-bold mb-6">
                <Building2 className="w-4 h-4" />
                B2B ПАРТНЕРСТВО
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Надежный подрядчик <br /> для вашего бизнеса
              </h1>
              <p className="text-xl text-gray-300 mb-8 font-light">
                Мы понимаем специфику работы крупных предприятий: тендеры, постоплата, 
                полный пакет документов и жесткие сроки.
              </p>
            </div>
          </div>
        </section>

        {/* Key Benefits Grid */}
        <section className="py-16 bg-white dark:bg-zinc-950">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Условия сотрудничества</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg bg-zinc-50 dark:bg-zinc-900">
                <CardContent className="p-8">
                  <FileText className="w-12 h-12 text-[#FFB800] mb-6" />
                  <h3 className="text-xl font-bold mb-4">Полный документооборот</h3>
                  <p className="text-muted-foreground">
                    Работаем с НДС. Предоставляем акты выполненных работ, счета-фактуры, 
                    дефектные ведомости и технические заключения для списания запчастей.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-zinc-50 dark:bg-zinc-900">
                <CardContent className="p-8">
                  <CreditCard className="w-12 h-12 text-[#FFB800] mb-6" />
                  <h3 className="text-xl font-bold mb-4">Гибкая оплата</h3>
                  <p className="text-muted-foreground">
                    Для постоянных партнеров доступна отсрочка платежа до 30 дней. 
                    Работаем по договору сервисного обслуживания с фиксированными ставками.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-zinc-50 dark:bg-zinc-900">
                <CardContent className="p-8">
                  <Briefcase className="w-12 h-12 text-[#FFB800] mb-6" />
                  <h3 className="text-xl font-bold mb-4">Участие в тендерах</h3>
                  <p className="text-muted-foreground">
                    Аккредитованы на всех основных тендерных площадках Казахстана (Samruk-Kazyna, 
                    Goszakup, NadLoc). Готовы предоставить обеспечение заявки.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Documents Section */}
        <section className="py-16 bg-zinc-100 dark:bg-zinc-900/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Документы для бухгалтерии</h2>
                <p className="text-muted-foreground">Скачайте необходимые файлы для начала работы</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm flex items-center justify-between group cursor-pointer hover:border-[#FFB800] border border-transparent transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-bold">Карточка предприятия (Реквизиты)</div>
                    <div className="text-sm text-muted-foreground">PDF, 1.2 MB</div>
                  </div>
                </div>
                <Download className="w-5 h-5 text-gray-400 group-hover:text-[#FFB800]" />
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm flex items-center justify-between group cursor-pointer hover:border-[#FFB800] border border-transparent transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-bold">Типовой договор на ремонт</div>
                    <div className="text-sm text-muted-foreground">DOCX, 0.5 MB</div>
                  </div>
                </div>
                <Download className="w-5 h-5 text-gray-400 group-hover:text-[#FFB800]" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-zinc-950">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Готовы обсудить условия?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Оставьте заявку, и мы подготовим для вас индивидуальное коммерческое предложение 
                  с учетом парка вашей техники и специфики работы.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-[#FFB800] w-6 h-6" />
                    <span className="font-medium">Гарантия конфиденциальности</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-[#FFB800] w-6 h-6" />
                    <span className="font-medium">Персональный менеджер 24/7</span>
                  </div>
                </div>
              </div>
              <div>
                <B2BLeadForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Corporate;
