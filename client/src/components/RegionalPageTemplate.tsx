import React from 'react';
import { SEO } from '@/components/SEO';
import { MapPin, Truck, Clock, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import B2BLeadForm from '@/components/B2BLeadForm';

interface RegionalPageProps {
  city: string;
  regionSpec: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
  canonical?: string;
  heroImage: string;
  industries: string[];
  mapCoordinates?: { lat: number; lng: number };
  faq?: { question: string; answer: string }[];
}

const RegionalPageTemplate: React.FC<RegionalPageProps> = ({
  city,
  regionSpec,
  seoTitle,
  seoDescription,
  seoKeywords,
  canonical,
  heroImage,
  industries,
  faq,
}) => {
  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={canonical}
        faq={faq}
        breadcrumbs={[

          { name: city, url: canonical || '/regions' },
        ]}
        serviceSchema={canonical ? {
          serviceName: seoTitle,
          serviceDescription: seoDescription,
          serviceUrl: canonical,
          areaServed: [city, 'Казахстан'],
        } : undefined}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={heroImage} alt={`Ремонт гидравлики ${city}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="container relative z-10 px-4 md:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-[#FFB800] text-black px-4 py-1 rounded-full font-bold mb-6">
              <MapPin className="w-4 h-4" />
              {city} и область
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
              Выездной ремонт гидравлики <br /> спецтехники в г. {city}
            </h1>
            <p className="text-xl text-gray-200 mb-8 font-light max-w-2xl mx-auto">
              Специализированный сервис для {regionSpec}. <br />
              Срок и стоимость выезда согласуем по местонахождению техники.
            </p>
            <Button asChild size="lg" className="bg-[#FFB800] text-black hover:bg-[#FFB800]/90 font-bold text-lg px-8">
              <a href="#repair-request">Вызвать бригаду</a>
            </Button>
          </div>
        </section>

        {/* Regional Specifics */}
        <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Работаем со спецификой региона
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Понимаем особенности эксплуатации техники в вашем регионе. 
                  Наши бригады укомплектованы оборудованием для работы с техникой в сферах:
                </p>
                <ul className="space-y-3">
                  {industries.map((ind, idx) => (
                    <li key={idx} className="flex items-center gap-3 font-medium">
                      <CheckCircle2 className="text-[#FFB800] w-5 h-5" />
                      {ind}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white dark:bg-zinc-900 border-none shadow-md">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Truck className="w-10 h-10 text-[#FFB800] mb-4" />
                    <h3 className="font-bold mb-2">Выезд на объект</h3>
                    <p className="text-sm text-muted-foreground">Карьеры, стройплощадки, промзоны</p>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-zinc-900 border-none shadow-md">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Clock className="w-10 h-10 text-[#FFB800] mb-4" />
                    <h3 className="font-bold mb-2">Оперативность</h3>
                    <p className="text-sm text-muted-foreground">Быстрое реагирование в черте города</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-zinc-900 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">
              Нужен ремонт гидравлики в г. {city}?
            </h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <div className="flex items-center gap-4 bg-white/10 px-8 py-4 rounded-lg">
                <Phone className="w-8 h-8 text-[#FFB800]" />
                <div className="text-left">
                  <div className="text-sm text-gray-400">Круглосуточная диспетчерская</div>
                  <a href="tel:+77714177925" className="text-xl font-bold">+7 (771) 417-79-25</a>
                </div>
              </div>
              <div id="repair-request" className="w-full max-w-2xl scroll-mt-8">
                <B2BLeadForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RegionalPageTemplate;
