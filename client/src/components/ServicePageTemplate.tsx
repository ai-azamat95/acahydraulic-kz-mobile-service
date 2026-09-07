import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { ArrowRight, CheckCircle2, AlertTriangle, Clock, ShieldCheck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import B2BLeadForm from '@/components/B2BLeadForm';

interface ServicePageProps {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
  canonical?: string;
  heroImage: string;
  problems: string[];
  solutions: string[];
  benefits: { title: string; desc: string }[];
  processSteps: { title: string; desc: string }[];
  faq?: { question: string; answer: string }[];
  breadcrumbs?: { name: string; url: string }[];
}

const ServicePageTemplate: React.FC<ServicePageProps> = ({
  title,
  description,
  seoTitle,
  seoDescription,
  seoKeywords,
  canonical,
  heroImage,
  problems,
  solutions,
  benefits,
  processSteps,
  faq,
  breadcrumbs,
}) => {
  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={canonical}
        breadcrumbs={breadcrumbs}
        faq={faq}
        serviceSchema={canonical ? {
          serviceName: seoTitle,
          serviceDescription: seoDescription,
          serviceUrl: canonical,
        } : undefined}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={heroImage} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/70" />
          </div>
          
          <div className="container relative z-10 px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-[#FFB800] text-black hover:bg-[#FFB800]/90 font-bold text-lg px-8">
                  РАССЧИТАТЬ СТОИМОСТЬ
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold text-lg px-8">
                  СКАЧАТЬ ПРАЙС-ЛИСТ
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problems & Solutions (B2B Focus) */}
        <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <AlertTriangle className="text-[#FFB800] w-8 h-8" />
                  Типичные проблемы
                </h2>
                <ul className="space-y-4">
                  {problems.map((prob, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-red-100 dark:border-red-900/30 shadow-sm">
                      <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
                      <span className="text-lg">{prob}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 w-8 h-8" />
                  Наше решение
                </h2>
                <ul className="space-y-4">
                  {solutions.map((sol, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-green-100 dark:border-green-900/30 shadow-sm">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0" />
                      <span className="text-lg">{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* B2B Benefits */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Почему с нами работают <span className="text-[#FFB800]">крупные компании</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => (
                <Card key={idx} className="bg-zinc-50 dark:bg-zinc-900 border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4 text-[#FFB800]">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-20 bg-zinc-900 text-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Этапы работы
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {processSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="text-6xl font-bold text-[#FFB800]/20 mb-4">0{idx + 1}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                  {idx < processSteps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-8 -right-4 text-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#FFB800]">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Нужен профессиональный ремонт гидравлики?
            </h2>
            <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
              Работаем по договору с НДС. Предоставляем полный пакет документов. Условия гарантии фиксируем в договоре.
            </p>
            <div className="mt-8">
              <B2BLeadForm />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicePageTemplate;
