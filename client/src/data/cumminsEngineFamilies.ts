export type CumminsEngineFamily = {
  id: string;
  name: string;
  powerKw: string;
  application: string;
  image: string;
  detailPath?: string;
};

export type CumminsEngineGroup = {
  id: string;
  title: string;
  description: string;
  engines: CumminsEngineFamily[];
};

export const cumminsEngineGroups: CumminsEngineGroup[] = [
  {
    id: "compact-medium",
    title: "Компактные и средние серии",
    description: "Для строительной, дорожной, промышленной техники и силовых установок средней мощности.",
    engines: [
      { id: "4bta39", name: "4BTA3.9", powerKw: "60–97 кВт", application: "Компактная строительная и промышленная техника", image: "/catalog-assets/cummins-series/4bta3.webp" },
      { id: "qsb39", name: "QSB3.9", powerKw: "63–97 кВт", application: "Строительная техника и промышленные установки", image: "/catalog-assets/cummins-series/4bta3.webp" },
      { id: "6bt-bta59", name: "6BT / BTA5.9", powerKw: "92–132 кВт", application: "Погрузчики, экскаваторы и промышленное оборудование", image: "/catalog-assets/cummins-series/6bt-bta59.webp" },
      { id: "qsb59", name: "QSB5.9", powerKw: "96–154 кВт", application: "Дорожная и строительная техника", image: "/catalog-assets/cummins-series/qsb59.webp" },
      { id: "qsb67", name: "QSB6.7", powerKw: "99–194 кВт", application: "Экскаваторы, погрузчики и генераторные применения", image: "/catalog-assets/cummins-series/qsb67.webp" },
      { id: "c83", name: "C8.3", powerKw: "151–194 кВт", application: "Средняя и тяжёлая строительная техника", image: "/catalog-assets/cummins-series/c83.webp" },
      { id: "qsc83", name: "QSC8.3", powerKw: "160–194 кВт", application: "Строительная и карьерная техника", image: "/catalog-assets/cummins-series/qsc83.webp" },
      { id: "qsl9", name: "QSL8.9 / QSL9", powerKw: "160–264 кВт", application: "Экскаваторы, погрузчики и промышленное оборудование", image: "/catalog-assets/cummins-series/qsl9.webp" },
    ],
  },
  {
    id: "heavy-duty",
    title: "Тяжёлые и карьерные серии",
    description: "Для бульдозеров, карьерной техники, тяжёлых машин и энергетических установок.",
    engines: [
      { id: "qsm11", name: "M11 / QSM11", powerKw: "228–298 кВт", application: "Тяжёлая строительная и карьерная техника", image: "/catalog-assets/cummins-series/qsm11.webp" },
      { id: "n855", name: "N855 / NT855 / NTA855", powerKw: "187–385 кВт", application: "Бульдозеры, карьерная и промышленная техника", image: "/catalog-assets/cummins-series/nta855.webp", detailPath: "/parts/engines-complete/shantui-sd32-cummins-nta855-c360s10/" },
      { id: "qsnt-n14", name: "QSNT / N14", powerKw: "По исполнению", application: "Тяжёлая спецтехника и промышленные установки", image: "/catalog-assets/cummins-series/nta855.webp" },
      { id: "k19", name: "K19", powerKw: "335–522 кВт", application: "Карьерная техника и стационарные установки", image: "/catalog-assets/cummins-series/k19.webp" },
      { id: "qsk19", name: "QSK19", powerKw: "340–597 кВт", application: "Карьерные машины и тяжёлые силовые установки", image: "/catalog-assets/cummins-series/qsk19.webp" },
      { id: "qsk23", name: "QSK23", powerKw: "567–708 кВт", application: "Горная техника и крупные промышленные машины", image: "/catalog-assets/cummins-series/qsk23.webp" },
      { id: "k38", name: "K38", powerKw: "690–1007 кВт", application: "Карьерное и энергетическое оборудование", image: "/catalog-assets/cummins-series/qsk19.webp" },
      { id: "qsk38", name: "QSK38", powerKw: "809–1193 кВт", application: "Крупная горная техника и генераторные установки", image: "/catalog-assets/cummins-series/qsk19.webp" },
      { id: "k50", name: "K50", powerKw: "1194–1343 кВт", application: "Тяжёлые карьерные и энергетические применения", image: "/catalog-assets/cummins-series/k50.webp" },
      { id: "qsk50", name: "QSK50", powerKw: "1044–1864 кВт", application: "Крупная карьерная техника и промышленная энергетика", image: "/catalog-assets/cummins-series/qsk19.webp" },
      { id: "qsx15", name: "QSX15", powerKw: "336–503 кВт", application: "Тяжёлая дорожная, карьерная и строительная техника", image: "/catalog-assets/cummins-series/qsx15.webp" },
      { id: "x15", name: "X15", powerKw: "336–503 кВт", application: "Современная тяжёлая техника и промышленные установки", image: "/catalog-assets/cummins-series/x15.webp" },
    ],
  },
  {
    id: "generator-marine",
    title: "Генераторные и морские исполнения",
    description: "Исполнения для электростанций и судовых применений. Комплектация зависит от режима работы и требований объекта.",
    engines: [
      { id: "4bta39-g2", name: "4BTA3.9-G2", powerKw: "По исполнению", application: "Дизель-генераторные установки", image: "/catalog-assets/cummins-series/4bta39-g2.webp" },
      { id: "6ltaa89-g2", name: "6LTAA8.9-G2", powerKw: "По исполнению", application: "Промышленные дизель-генераторные установки", image: "/catalog-assets/cummins-series/6ltaa89-g2.webp" },
      { id: "qsb67-marine", name: "QSB6.7 Marine", powerKw: "По исполнению", application: "Судовые вспомогательные и силовые установки", image: "/catalog-assets/cummins-series/qsb67-marine.webp" },
      { id: "marine-generation", name: "Marine Power Generation", powerKw: "По проекту", application: "Судовые генераторные установки", image: "/catalog-assets/cummins-series/marine-generation.webp" },
      { id: "marine-propulsion", name: "Marine Main Propulsion", powerKw: "По проекту", application: "Главные судовые двигатели и замена силовой установки", image: "/catalog-assets/cummins-series/marine-propulsion.webp" },
    ],
  },
];

export const cumminsEngineFamilies = cumminsEngineGroups.flatMap((group) => group.engines);
