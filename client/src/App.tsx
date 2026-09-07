import { Toaster } from "@/components/ui/sonner";
import { useTikTokPageView } from "@/hooks/useTikTokEvents";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";

// Critical path — loaded immediately (above the fold on first visit)
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

// Lazy-loaded pages — split into separate chunks to reduce initial bundle
const Legal = lazy(() => import("./pages/Legal"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Cases = lazy(() => import("./pages/Cases"));
const Projects = lazy(() => import("./pages/Projects"));
const Corporate = lazy(() => import("./pages/Corporate"));
const Blog = lazy(() => import("./pages/Blog"));

// Service sub-pages (lazy loaded)
const MobileRepair = lazy(() => import("./pages/services/MobileRepair"));
const HydraulicPumps = lazy(() => import("./pages/services/HydraulicPumps"));
const HydraulicMotors = lazy(() => import("./pages/services/HydraulicMotors"));
const GNBRepair = lazy(() => import("./pages/services/GNBRepair"));
const BulldozerRepair = lazy(() => import("./pages/services/BulldozerRepair"));
const WirtgenRepair = lazy(() => import("./pages/services/WirtgenRepair"));
const HydraulicValves = lazy(() => import("./pages/services/HydraulicValves"));
const EmergencyService = lazy(() => import("./pages/services/EmergencyService"));
const B2BMaintenance = lazy(() => import("./pages/services/B2BMaintenance"));
const IndustrialService = lazy(() => import("./pages/services/IndustrialService"));
const ExcavatorRepair = lazy(() => import("./pages/services/ExcavatorRepair"));
const LoaderRepair = lazy(() => import("./pages/services/LoaderRepair"));
const ManipulatorRepair = lazy(() => import("./pages/services/ManipulatorRepair"));
const RailwayRepair = lazy(() => import("./pages/services/RailwayRepair"));
const PressRepair = lazy(() => import("./pages/services/PressRepair"));
const DrillingRepair = lazy(() => import("./pages/services/DrillingRepair"));
const GraderRepair = lazy(() => import("./pages/services/GraderRepair"));
const PiledriverRepair = lazy(() => import("./pages/services/PiledriverRepair"));
const MiningLoaderRepair = lazy(() => import("./pages/services/MiningLoaderRepair"));
const MiningTruckRepair = lazy(() => import("./pages/services/MiningTruckRepair"));

// Regional pages (lazy loaded)
const RegionPage = lazy(() => import("./pages/RegionPage"));

// Brand pages (lazy loaded)
const BrandCat = lazy(() => import("./pages/brands/BrandCat"));
const BrandKomatsu = lazy(() => import("./pages/brands/BrandKomatsu"));
const BrandHitachi = lazy(() => import("./pages/brands/BrandHitachi"));
const BrandHyundai = lazy(() => import("./pages/brands/BrandHyundai"));
const BrandWirtgen = lazy(() => import("./pages/brands/BrandWirtgen"));
const BrandShantui = lazy(() => import("./pages/brands/BrandShantui"));
const BrandLiebherr = lazy(() => import("./pages/brands/BrandLiebherr"));
const BrandVolvo = lazy(() => import("./pages/brands/BrandVolvo"));

// Blog articles (lazy loaded)
const RemonGidronasosaCat = lazy(() => import("./pages/blog/RemonGidronasosaCat"));
const PadaetDavlenieGidravliki = lazy(() => import("./pages/blog/PadaetDavlenieGidravliki"));
const StoimostRemonGidromotora = lazy(() => import("./pages/blog/StoimostRemonGidromotora"));
const KakOpredelitNeispravnost = lazy(() => import("./pages/blog/KakOpredelitNeispravnost"));
const RemonGidravlikiFrezyWirtgen1500 = lazy(() => import("./pages/blog/RemonGidravlikiFrezyWirtgen1500"));
const KapitalnyiRemonShantuiSD32 = lazy(() => import("./pages/blog/KapitalnyiRemonShantuiSD32"));
const RemonGidravlikiLiebherrR950 = lazy(() => import("./pages/blog/RemonGidravlikiLiebherrR950"));
const VosstanovlenieGidromotoraVolvoEC380 = lazy(() => import("./pages/blog/VosstanovlenieGidromotoraVolvoEC380"));

// Minimal loading fallback — prevents layout shift
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#FFC000] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppRoutes() {
  // make sure to consider if you need authentication for certain routes
  // Fire TikTok PageView on every route change via server-side Events API
  useTikTokPageView();
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path="/privacy" component={Legal} />
        <Route path="/terms" component={Legal} />
        <Route path={"/services/mobile-repair"} component={MobileRepair} />
        <Route path={"/services/hydraulic-pumps"} component={HydraulicPumps} />
        <Route path={"/services/hydraulic-motors"} component={HydraulicMotors} />
        <Route path={"/services/gnb-repair"} component={GNBRepair} />
        <Route path={"/services/bulldozer-repair"} component={BulldozerRepair} />
        <Route path={"/services/wirtgen-repair"} component={WirtgenRepair} />
        <Route path={"/services/hydraulic-valves"} component={HydraulicValves} />
        <Route path={"/services/emergency-service"} component={EmergencyService} />
        <Route path={"/services/b2b-maintenance"} component={B2BMaintenance} />
        <Route path={"/services/industrial-service"} component={IndustrialService} />
        <Route path={"/services/excavator-repair"} component={ExcavatorRepair} />
        <Route path={"/services/loader-repair"} component={LoaderRepair} />
        <Route path={"/services/manipulator-repair"} component={ManipulatorRepair} />
        <Route path={"/services/railway-repair"} component={RailwayRepair} />
        <Route path={"/services/press-repair"} component={PressRepair} />
        <Route path={"/services/drilling-repair"} component={DrillingRepair} />
        <Route path={"/services/grader-repair"} component={GraderRepair} />
        <Route path={"/services/piledriver-repair"} component={PiledriverRepair} />
        <Route path={"/services/mining-loader-repair"} component={MiningLoaderRepair} />
        <Route path={"/services/mining-truck-repair"} component={MiningTruckRepair} />
        <Route path="/regions/:slug" component={RegionPage} />
        <Route path="/brands/cat" component={BrandCat} />
        <Route path="/brands/komatsu" component={BrandKomatsu} />
        <Route path="/brands/hitachi" component={BrandHitachi} />
        <Route path="/brands/hyundai" component={BrandHyundai} />
        <Route path="/brands/wirtgen" component={BrandWirtgen} />
        <Route path="/brands/shantui" component={BrandShantui} />
        <Route path="/brands/liebherr" component={BrandLiebherr} />
        <Route path="/brands/volvo" component={BrandVolvo} />
        <Route path="/corporate" component={Corporate} />
        <Route path="/projects" component={Projects} />
        <Route path="/cases" component={Cases} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/remont-gidronasosa-cat" component={RemonGidronasosaCat} />
        <Route path="/blog/padaet-davlenie-gidravliki-ekskavatora" component={PadaetDavlenieGidravliki} />
        <Route path="/blog/stoimost-remonta-gidromotora-komatsu" component={StoimostRemonGidromotora} />
        <Route path="/blog/kak-opredelit-neispravnost-gidravliki" component={KakOpredelitNeispravnost} />
        <Route path="/blog/remont-gidravliki-frezy-wirtgen-1500" component={RemonGidravlikiFrezyWirtgen1500} />
        <Route path="/blog/kapitalnyy-remont-shantui-sd32" component={KapitalnyiRemonShantuiSD32} />
        <Route path="/blog/remont-gidravliki-liebherr-r950" component={RemonGidravlikiLiebherrR950} />
        <Route path="/blog/vosstanovlenie-gidromotora-volvo-ec380" component={VosstanovlenieGidromotoraVolvoEC380} />
        <Route path={"/services"} component={Services} />
        <Route path={"/about"} component={About} />
        <Route path={"/reviews"} component={Reviews} />
        <Route path={"/contacts"} component={Contacts} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const routerBase = typeof window !== "undefined" && window.location.hostname.endsWith("github.io")
    ? "/acahydraulic-kz-mobile-service"
    : "";

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <WouterRouter base={routerBase}>
            <AppRoutes />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
