import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";

import { publicAsset } from "@/lib/assets";
import { compactSeoDescription, formatSeoTitle } from "@shared/seo-meta.mjs";
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
  ogImageWidth?: number | null;
  ogImageHeight?: number | null;
  schema?: object;
  breadcrumbs?: BreadcrumbItem[];
  faq?: FAQItem[];
  serviceSchema?: ServiceSchemaProps;
  noIndex?: boolean;
  pageType?: "website" | "article" | "service";
  publishedDate?: string;
  modifiedDate?: string;
  titleMaxLength?: number;
}

const BASE_URL = "https://acahydraulic.kz";
const DEFAULT_OG_IMAGE =
  publicAsset("webdev-static-assets/og-image-20261024.jpg");
const SITE_NAME = "ACA Hydraulic";
const PHONE = "+77714177925";
const BUSINESS_ID = `${BASE_URL}/#business`;

function imageMimeType(imageUrl: string) {
  const pathname = new URL(imageUrl, BASE_URL).pathname.toLowerCase();
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".avif")) return "image/avif";
  if (pathname.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogImageWidth = 1200,
  ogImageHeight = 630,
  schema,
  breadcrumbs,
  faq,
  serviceSchema,
  noIndex = false,
  pageType = "website",
  publishedDate,
  modifiedDate,
  titleMaxLength = 68,
}: SEOProps) {
  const fullTitle = formatSeoTitle(title, SITE_NAME, titleMaxLength);
  const metaDescription = compactSeoDescription(description);
  const [location] = useLocation();
  const canonicalPath = canonical || location;
  const rawCanonicalUrl = canonicalPath.startsWith("http")
    ? canonicalPath
    : `${BASE_URL}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;
  const canonicalUrl = rawCanonicalUrl.split(/[?#]/)[0].replace(/\/+$/, "") + "/";
  const imageUrl = new URL(ogImage || DEFAULT_OG_IMAGE, BASE_URL).href;
  const ogImageType = imageMimeType(imageUrl);
  const imageDimensions = ogImageWidth && ogImageHeight
    ? { width: ogImageWidth, height: ogImageHeight }
    : null;

  // Use the same preferred URL format as canonical links and omit callers'
  // repeated home entries (the component supplies the home item itself).
  const breadcrumbUrls = new Set([`${BASE_URL}/`]);
  const normalizedBreadcrumbs = (breadcrumbs ?? []).flatMap(item => {
    const url = new URL(item.url, BASE_URL);
    url.search = "";
    url.hash = "";
    url.pathname = url.pathname.replace(/\/+$/, "") + "/";
    const href = url.href;
    if (breadcrumbUrls.has(href)) return [];
    breadcrumbUrls.add(href);
    return [{ name: item.name, url: href }];
  });

  // ── Breadcrumb Schema ──────────────────────────────────────────────────────
  const breadcrumbSchema =
    normalizedBreadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: `${BASE_URL}/`,
            },
            ...normalizedBreadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              position: index + 2,
              name: item.name,
              item: item.url,
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
    ? (() => {
        const serviceUrl = new URL(serviceSchema.serviceUrl, BASE_URL);
        serviceUrl.search = "";
        serviceUrl.hash = "";
        serviceUrl.pathname = serviceUrl.pathname.replace(/\/+$/, "") + "/";
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${serviceUrl.href}#service`,
          name: serviceSchema.serviceName,
          description: serviceSchema.serviceDescription,
          url: serviceUrl.href,
          provider: {
            "@id": BUSINESS_ID,
          },
          areaServed: (serviceSchema.areaServed ?? ["Астана", "Казахстан"]).map(
            (area) => ({ "@type": "Place", name: area })
          ),
          availableChannel: {
            "@type": "ServiceChannel",
            serviceUrl: serviceUrl.href,
            servicePhone: PHONE,
            availableLanguage: ["Russian", "Kazakh"],
          },
        };
      })()
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
      <meta name="description" content={metaDescription} />
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
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:type" content={ogImageType} />
      {imageDimensions && <meta property="og:image:width" content={String(imageDimensions.width)} />}
      {imageDimensions && <meta property="og:image:height" content={String(imageDimensions.height)} />}
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
      <meta name="twitter:description" content={metaDescription} />
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
