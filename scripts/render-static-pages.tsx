import "../client/src/i18n";
import RegionPage from "../client/src/pages/RegionPage";
import ServiceShowcase from "../client/src/components/ServiceShowcase";
import SiteQuickNav from "../client/src/components/SiteQuickNav";
import Home from "../client/src/pages/Home";
import Services from "../client/src/pages/Services";
import About from "../client/src/pages/About";
import Reviews from "../client/src/pages/Reviews";
import Contacts from "../client/src/pages/Contacts";
import Corporate from "../client/src/pages/Corporate";
import Blog from "../client/src/pages/Blog";
import SiteMap from "../client/src/pages/SiteMap";
import BrandKomatsu from "../client/src/pages/brands/BrandKomatsu";
import BrandHitachi from "../client/src/pages/brands/BrandHitachi";
import BrandHyundai from "../client/src/pages/brands/BrandHyundai";
import BrandWirtgen from "../client/src/pages/brands/BrandWirtgen";
import BrandShantui from "../client/src/pages/brands/BrandShantui";
import BrandLiebherr from "../client/src/pages/brands/BrandLiebherr";
import BrandVolvo from "../client/src/pages/brands/BrandVolvo";
import RemonGidravlikiFrezyWirtgen1500 from "../client/src/pages/blog/RemonGidravlikiFrezyWirtgen1500";
import RemonGidravlikiLiebherrR950 from "../client/src/pages/blog/RemonGidravlikiLiebherrR950";
import VosstanovlenieGidromotoraVolvoEC380 from "../client/src/pages/blog/VosstanovlenieGidromotoraVolvoEC380";
import MobileRepair from "../client/src/pages/services/MobileRepair";
import HydraulicPumps from "../client/src/pages/services/HydraulicPumps";
import HydraulicMotors from "../client/src/pages/services/HydraulicMotors";
import GNBRepair from "../client/src/pages/services/GNBRepair";
import BulldozerRepair from "../client/src/pages/services/BulldozerRepair";
import WirtgenRepair from "../client/src/pages/services/WirtgenRepair";
import HydraulicValves from "../client/src/pages/services/HydraulicValves";
import EmergencyService from "../client/src/pages/services/EmergencyService";
import B2BMaintenance from "../client/src/pages/services/B2BMaintenance";
import IndustrialService from "../client/src/pages/services/IndustrialService";
import ExcavatorRepair from "../client/src/pages/services/ExcavatorRepair";
import LoaderRepair from "../client/src/pages/services/LoaderRepair";
import ManipulatorRepair from "../client/src/pages/services/ManipulatorRepair";
import RailwayRepair from "../client/src/pages/services/RailwayRepair";
import PressRepair from "../client/src/pages/services/PressRepair";
import DrillingRepair from "../client/src/pages/services/DrillingRepair";
import GraderRepair from "../client/src/pages/services/GraderRepair";
import PiledriverRepair from "../client/src/pages/services/PiledriverRepair";
import MiningLoaderRepair from "../client/src/pages/services/MiningLoaderRepair";
import MiningTruckRepair from "../client/src/pages/services/MiningTruckRepair";
import Legal from "../client/src/pages/Legal";
import CommercePolicy from "../client/src/pages/CommercePolicy";
import DeliveryAndReturns from "../client/src/pages/DeliveryAndReturns";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { trpc } from "../client/src/lib/trpc";
import { CartProvider } from "../client/src/contexts/CartContext";
import { renderToString } from "react-dom/server";
import helmetPackage from "react-helmet-async";
import { Router } from "wouter";
import PressureArticle from "../client/src/pages/blog/PadaetDavlenieGidravliki";
import ShantuiRepairArticle from "../client/src/pages/blog/KapitalnyiRemonShantuiSD32";
import CatCase from "../client/src/pages/cases/Cat330DLHotPowerLoss";
import SanyCase from "../client/src/pages/cases/SanySY365HHotHydraulics";
import HitachiCase from "../client/src/pages/cases/Hitachi330FloatingPressure";
import DiagnosisArticle from "../client/src/pages/blog/KakOpredelitNeispravnost";
import PumpRepairArticle from "../client/src/pages/blog/RemonGidronasosaCat";
import MotorCostArticle from "../client/src/pages/blog/StoimostRemonGidromotora";
import Cat432ePumpSale from "../client/src/pages/cases/Cat432ePumpSale";
import XcmgXz200PumpInstallation from "../client/src/pages/cases/XcmgXz200PumpInstallation";
import Hidromek102bHuscoC16E303 from "../client/src/pages/cases/Hidromek102bHuscoC16E303";
import ShantuiSD32EngineSupply from "../client/src/pages/cases/ShantuiSD32EngineSupply";
import CompleteEngines from "../client/src/pages/CompleteEngines";
import CompleteEngineProduct from "../client/src/pages/CompleteEngineProduct";
import CumminsEngineCatalog from "../client/src/pages/CumminsEngineCatalog";
import { CumminsEngineProductPage } from "../client/src/pages/CumminsEngineProduct";
import { cumminsEngineFamilies } from "../client/src/data/cumminsEngineFamilies";
import Cases from "../client/src/pages/Cases";
import BrandCat from "../client/src/pages/brands/BrandCat";

const { HelmetProvider } = helmetPackage;
const pages: Record<string, React.ComponentType> = {
  "": Home,
  "services": Services,
  "about": About,
  "reviews": Reviews,
  "contacts": Contacts,
  "corporate": Corporate,
  "blog": Blog,
  "sitemap": SiteMap,
  "brands/komatsu": BrandKomatsu,
  "brands/hitachi": BrandHitachi,
  "brands/hyundai": BrandHyundai,
  "brands/wirtgen": BrandWirtgen,
  "brands/shantui": BrandShantui,
  "brands/liebherr": BrandLiebherr,
  "brands/volvo": BrandVolvo,
  "blog/remont-gidravliki-frezy-wirtgen-1500": RemonGidravlikiFrezyWirtgen1500,
  "blog/remont-gidravliki-liebherr-r950": RemonGidravlikiLiebherrR950,
  "blog/vosstanovlenie-gidromotora-volvo-ec380": VosstanovlenieGidromotoraVolvoEC380,
  "services/mobile-repair": MobileRepair,
  "services/hydraulic-pumps": HydraulicPumps,
  "services/hydraulic-motors": HydraulicMotors,
  "services/gnb-repair": GNBRepair,
  "services/bulldozer-repair": BulldozerRepair,
  "services/wirtgen-repair": WirtgenRepair,
  "services/hydraulic-valves": HydraulicValves,
  "services/emergency-service": EmergencyService,
  "services/b2b-maintenance": B2BMaintenance,
  "services/industrial-service": IndustrialService,
  "services/excavator-repair": ExcavatorRepair,
  "services/loader-repair": LoaderRepair,
  "services/manipulator-repair": ManipulatorRepair,
  "services/railway-repair": RailwayRepair,
  "services/press-repair": PressRepair,
  "services/drilling-repair": DrillingRepair,
  "services/grader-repair": GraderRepair,
  "services/piledriver-repair": PiledriverRepair,
  "services/mining-loader-repair": MiningLoaderRepair,
  "services/mining-truck-repair": MiningTruckRepair,

  privacy: Legal, terms: Legal, payment: CommercePolicy, offer: CommercePolicy,
  "delivery-and-returns": DeliveryAndReturns,
  "brands/cat": BrandCat,
  "blog/kak-opredelit-neispravnost-gidravliki": DiagnosisArticle,
  "blog/remont-gidronasosa-cat": PumpRepairArticle,
  "blog/stoimost-remonta-gidromotora-komatsu": MotorCostArticle,
  "blog/padaet-davlenie-gidravliki-ekskavatora": PressureArticle,
  "blog/kapitalnyy-remont-shantui-sd32": ShantuiRepairArticle,
  "cases/cat-330dl-teryaet-moshchnost-na-goryachuyu": CatCase,
  "cases/sany-sy365h-gidravlika-na-goryachuyu": SanyCase,
  "cases/hitachi-330-5g-plavaet-davlenie-strela-ryvkami": HitachiCase,
  "cases/cat-432e-postavka-gidronasosa-267-2755": Cat432ePumpSale,
  "cases/xcmg-xz200-ustanovka-gidronasosa-803001730": XcmgXz200PumpInstallation,
  "cases/hidromek-102b-zamena-gidroraspredelitelya-husco-c16e303": Hidromek102bHuscoC16E303,
  "cases/shantui-sd32-postavka-dvigatelya-cummins-nta855": ShantuiSD32EngineSupply,
  "parts/engines-complete": CompleteEngines,
  "parts/engines-complete/shantui-sd32-cummins-nta855-c360s10": CompleteEngineProduct,
  "parts/engines-complete/cummins": CumminsEngineCatalog,
  cases: Cases,
};

for (const engine of cumminsEngineFamilies) {
  pages[`parts/engines-complete/cummins/${engine.slug}`] = () => (
    <CumminsEngineProductPage engine={engine} />
  );
}

// Use the actual page component, so the HTML read by crawlers matches the UI.
export function renderStaticPage(requestedRoute: string) {
  const Page = requestedRoute.startsWith("regions/") ? RegionPage : pages[requestedRoute];
  if (!Page) return null;
  const context: any = {};
  // Providers match the app. Rendering only reads the initial state; no event
  // handlers, effects, tracking calls or lead submissions run during the build.
  const queryClient = new QueryClient();
  const client = trpc.createClient({ links: [httpBatchLink({ url: "https://acahydraulic.kz/api/trpc", transformer: superjson })] });
  const body = renderToString(
    <HelmetProvider context={context}>
      <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
      <CartProvider>
      <Router ssrPath={`/${requestedRoute}`}>
        <SiteQuickNav />
        <div className={requestedRoute.startsWith("services/") ? "site-quick-nav-offset pt-12 service-detail-page" : "site-quick-nav-offset pt-12"}>
          <Page />
          <ServiceShowcase />
        </div>
      </Router>
      </CartProvider>
      </QueryClientProvider>
      </trpc.Provider>
    </HelmetProvider>
  );
  const { helmet } = context;
  const scripts = helmet.script.toString();
  const canonical = `https://acahydraulic.kz/${requestedRoute ? requestedRoute + "/" : ""}`;
  const webpage = scripts.includes('"@type":"WebPage"') ? "" : `<script type="application/ld+json" data-static-page-schema>${JSON.stringify({
    "@context": "https://schema.org", "@type": "WebPage", "@id": `${canonical}#webpage`,
    url: canonical, inLanguage: "ru-KZ", isPartOf: { "@id": "https://acahydraulic.kz/#website" },
  })}</script>`;
  queryClient.clear();
  return {
    body: body.includes("<main")
      ? body.replace("<main", '<main aria-label="Материал ACA Hydraulic"')
      : `<main aria-label="Материал ACA Hydraulic">${body}</main>`,
    head: ["title", "meta", "link", "script"]
      .map(key => helmet[key].toString())
      .join("\n") + webpage,
  };
}
