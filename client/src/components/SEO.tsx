import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";

import { publicAsset } from "@/lib/assets";
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceSchemaProps {
  serviceName: string;
  serviceDescription: string;
  serviceUrl: string;
  areaServed?: string[];
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  schema?: object;
  breadcrumbs?: BreadcrumbItem[];
  faq?: FAQItem[];
  serviceSchema?: ServiceSchemaProps;
  noIndex?: boolean;
  pageType?: "website" | "article" | "service";
  publishedDate?: string;
  modifiedDate?: string;
}

const BASE_URL = "https://acahydraulic.kz";
const DEFAULT_OG_IMAGE =
  publicAsset("webdev-static-assets/og-image.jpg");
const SITE_NAME = "ACA Hydraulic";
const PHONE = "+77714177925";
const BUSINESS_ID = `${BASE_URL}/#business`;

export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  schema,
  breadcrumbs,
  faq,
  serviceSchema,
  noIndex = false,
  pageType = "website",
  publishedDate,
  modifiedDate,
}: SEOProps) {
  // Smart title: don't duplicate brand name
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const [location] = useLocation();
  const canonicalPath = canonical || location;
  const rawCanonicalUrl = canonicalPath.startsWith("http")
    ? canonicalPath
    : `${BASE_URL}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;
  const canonicalUrl = rawCanonicalUrl.split(/[?#]/)[0].replace(/\/+$/, "") + "/";
  const imageUrl = new URL(ogImage || DEFAULT_OG_IMAGE, BASE_URL).href;

  // ── Breadcrumb Schema ──────────────────────────────────────────────────────
  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: BASE_URL,
            },
            ...breadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              position: index + 2,
              name: item.name,
              item: `${BASE_URL}${item.url}`,
            })),
          ],
        }
      : null;

  // ── FAQ Schema ─────────────────────────────────────────────────────────────
  const faqSchema =
    faq && faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  // ── Service Schema ─────────────────────────────────────────────────────────
  const serviceJsonLd = serviceSchema
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${BASE_URL}${serviceSchema.serviceUrl}#service`,
        name: serviceSchema.serviceName,
        description: serviceSchema.serviceDescription,
        url: `${BASE_URL}${serviceSchema.serviceUrl}`,
        provider: {
          "@id": BUSINESS_ID,
        },
        areaServed: (serviceSchema.areaServed ?? ["Астана", "Казахстан"]).map(
          (area) => ({ "@type": "Place", name: area })
        ),
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${BASE_URL}${serviceSchema.serviceUrl}`,
          servicePhone: PHONE,
          availableLanguage: ["Russian", "Kazakh"],
        },
      }
    : null;

  // ── Article Schema (for blog pages) ───────────────────────────────────────
  const articleSchema =
    pageType === "article" && publishedDate
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${canonicalUrl}#article`,
          headline: title,
          description,
          image: imageUrl,
          url: canonicalUrl,
          datePublished: publishedDate,
          dateModified: modifiedDate || publishedDate,
          author: {
            "@id": BUSINESS_ID,
          },
          publisher: {
            "@id": BUSINESS_ID,
          },
          inLanguage: "ru-KZ",
        }
      : null;

  return (
    <Helmet>
      {/* ── Basic Meta ─────────────────────────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, nofollow"
            : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        }
      />
      <meta name="language" content="ru" />
      <meta name="author" content={SITE_NAME} />

      {/* ── Canonical ──────────────────────────────────────────────────── */}
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Open Graph ─────────────────────────────────────────────────── */}
      <meta property="og:type" content={pageType === "article" ? "article" : "website"} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ru_RU" />
      {publishedDate && pageType === "article" && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {modifiedDate && pageType === "article" && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}

      {/* ── Twitter Card ───────────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* ── Custom Schema ──────────────────────────────────────────────── */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}

      {/* ── Service Schema ─────────────────────────────────────────────── */}
      {serviceJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(serviceJsonLd)}
        </script>
      )}

      {/* ── Breadcrumb Schema ──────────────────────────────────────────── */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* ── FAQ Schema ─────────────────────────────────────────────────── */}
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}

      {/* ── Article Schema ─────────────────────────────────────────────── */}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Helmet>
  );
}
