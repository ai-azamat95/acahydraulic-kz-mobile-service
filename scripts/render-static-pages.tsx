import React from "react";
import { renderToString } from "react-dom/server";
import helmetPackage from "react-helmet-async";
import { Router } from "wouter";
import PressureArticle from "../client/src/pages/blog/PadaetDavlenieGidravliki";
import CatCase from "../client/src/pages/cases/Cat330DLHotPowerLoss";
import SanyCase from "../client/src/pages/cases/SanySY365HHotHydraulics";
import HitachiCase from "../client/src/pages/cases/Hitachi330FloatingPressure";
import DiagnosisArticle from "../client/src/pages/blog/KakOpredelitNeispravnost";
import PumpRepairArticle from "../client/src/pages/blog/RemonGidronasosaCat";
import MotorCostArticle from "../client/src/pages/blog/StoimostRemonGidromotora";
import Cat432ePumpSale from "../client/src/pages/cases/Cat432ePumpSale";
import ShantuiSD32EngineSupply from "../client/src/pages/cases/ShantuiSD32EngineSupply";
import CompleteEngines from "../client/src/pages/CompleteEngines";
import CompleteEngineProduct from "../client/src/pages/CompleteEngineProduct";
import Cases from "../client/src/pages/Cases";

const { HelmetProvider } = helmetPackage;
const pages: Record<string, React.ComponentType> = {
  "blog/kak-opredelit-neispravnost-gidravliki": DiagnosisArticle,
  "blog/remont-gidronasosa-cat": PumpRepairArticle,
  "blog/stoimost-remonta-gidromotora-komatsu": MotorCostArticle,
  "blog/padaet-davlenie-gidravliki-ekskavatora": PressureArticle,
  "cases/cat-330dl-teryaet-moshchnost-na-goryachuyu": CatCase,
  "cases/sany-sy365h-gidravlika-na-goryachuyu": SanyCase,
  "cases/hitachi-330-5g-plavaet-davlenie-strela-ryvkami": HitachiCase,
  "cases/cat-432e-postavka-gidronasosa-267-2755": Cat432ePumpSale,
  "cases/shantui-sd32-postavka-dvigatelya-cummins-nta855": ShantuiSD32EngineSupply,
  "parts/engines-complete": CompleteEngines,
  "parts/engines-complete/shantui-sd32-cummins-nta855-c360s10": CompleteEngineProduct,
  cases: Cases,
};

// Use the actual page component, so the HTML read by crawlers matches the UI.
export function renderStaticPage(requestedRoute: string) {
  const Page = pages[requestedRoute];
  if (!Page) return null;
  const context: any = {};
  const body = renderToString(
    <HelmetProvider context={context}>
      <Router ssrPath={`/${requestedRoute}`}>
        <Page />
      </Router>
    </HelmetProvider>
  );
  const { helmet } = context;
  return {
    body: body.includes("<main")
      ? body.replace("<main", '<main aria-label="Материал ACA Hydraulic"')
      : `<main aria-label="Материал ACA Hydraulic">${body}</main>`,
    head: ["title", "meta", "link", "script"]
      .map(key => helmet[key].toString())
      .join("\n"),
  };
}
