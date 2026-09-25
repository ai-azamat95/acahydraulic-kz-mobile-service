export type CumminsEngineFamily = {
  id: string;
  name: string;
  powerKw: string;
  application: string;
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
      { id: "4bta39", name: "4BTA3.9", powerKw: "60–97 кВт", application: "Компактная строительная и промышленная техника" },
      { id: "qsb39", name: "QSB3.9", powerKw: "63–97 кВт", application: "Строительная техника и промышленные установки" },
      { id: "6bt-bta59", name: "6BT / BTA5.9", powerKw: "92–132 кВт", application: "Погрузчики, экскаваторы и промышленное оборудование" },
      { id: "qsb59", name: "QSB5.9", powerKw: "96–154 кВт", application: "Дорожная и строительная техника" },
      { id: "qsb67", name: "QSB6.7", powerKw: "99–194 кВт", application: "Экскаваторы, погрузчики и генераторные применения" },
      { id: "c83", name: "C8.3", powerKw: "151–194 кВт", application: "Средняя и тяжёлая строительная техника" },
      { id: "qsc83", name: "QSC8.3", powerKw: "160–194 кВт", application: "Строительная и карьерная техника" },
      { id: "qsl9", name: "QSL8.9 / QSL9", powerKw: "160–264 кВт", application: "Экскаваторы, погрузчики и промышленное оборудование" },
    ],
  },
  {
    id: "heavy-duty",
    title: "Тяжёлые и карьерные серии",
    description: "Для бульдозеров, карьерной техники, тяжёлых машин и энергетических установок.",
    engines: [
      { id: "qsm11", name: "M11 / QSM11", powerKw: "228–298 кВт", application: "Тяжёлая строительная и карьерная техника" },
      { id: "n855", name: "N855 / NT855 / NTA855", powerKw: "187–385 кВт", application: "Бульдозеры, карьерная и промышленная техника", detailPath: "/parts/engines-complete/shantui-sd32-cummins-nta855-c360s10/" },
      { id: "qsnt-n14", name: "QSNT / N14", powerKw: "По исполнению", application: "Тяжёлая спецтехника и промышленные установки" },
      { id: "k19", name: "K19", powerKw: "335–522 кВт", application: "Карьерная техника и стационарные установки" },
      { id: "qsk19", name: "QSK19", powerKw: "340–597 кВт", application: "Карьерные машины и тяжёлые силовые установки" },
      { id: "qsk23", name: "QSK23", powerKw: "567–708 кВт", application: "Горная техника и крупные промышленные машины" },
      { id: "k38", name: "K38", powerKw: "690–1007 кВт", application: "Карьерное и энергетическое оборудование" },
      { id: "qsk38", name: "QSK38", powerKw: "809–1193 кВт", application: "Крупная горная техника и генераторные установки" },
      { id: "k50", name: "K50", powerKw: "1194–1343 кВт", application: "Тяжёлые карьерные и энергетические применения" },
      { id: "qsk50", name: "QSK50", powerKw: "1044–1864 кВт", application: "Крупная карьерная техника и промышленная энергетика" },
      { id: "qsx15", name: "QSX15", powerKw: "336–503 кВт", application: "Тяжёлая дорожная, карьерная и строительная техника" },
      { id: "x15", name: "X15", powerKw: "336–503 кВт", application: "Современная тяжёлая техника и промышленные установки" },
    ],
  },
  {
    id: "generator-marine",
    title: "Генераторные и морские исполнения",
    description: "Исполнения для электростанций и судовых применений. Комплектация зависит от режима работы и требований объекта.",
    engines: [
      { id: "4bta39-g2", name: "4BTA3.9-G2", powerKw: "По исполнению", application: "Дизель-генераторные установки" },
      { id: "6ltaa89-g2", name: "6LTAA8.9-G2", powerKw: "По исполнению", application: "Промышленные дизель-генераторные установки" },
      { id: "qsb67-marine", name: "QSB6.7 Marine", powerKw: "По исполнению", application: "Судовые вспомогательные и силовые установки" },
      { id: "marine-generation", name: "Marine Power Generation", powerKw: "По проекту", application: "Судовые генераторные установки" },
      { id: "marine-propulsion", name: "Marine Main Propulsion", powerKw: "По проекту", application: "Главные судовые двигатели и замена силовой установки" },
    ],
  },
];

export const cumminsEngineFamilies = cumminsEngineGroups.flatMap((group) => group.engines);
