export type CatalogLanguage = "ru" | "kz" | "en";

export type CatalogCopy = {
  languageName: string;
  backToService: string;
  pageTitle: string;
  pageDescription: string;
  searchLabel: string;
  searchPlaceholder: string;
  brandLabel: string;
  brandPlaceholder: string;
  modelLabel: string;
  modelPlaceholder: string;
  categoryLabel: string;
  allCategories: string;
  findButton: string;
  helper: string;
  categoriesTitle: string;
  categoriesDescription: string;
  brandsTitle: string;
  brandsDescription: string;
  requestTitle: string;
  requestDescription: string;
  requestButton: string;
  requestNote: string;
  processTitle: string;
  process: string[];
  deliveryTitle: string;
  deliveryText: string;
  qualityTitle: string;
  qualityText: string;
  resultsTitle: string;
  productsFound: string;
  loadingProducts: string;
  loadError: string;
  noResults: string;
  fromPrice: string;
  priceOnRequest: string;
  available: string;
  checkAvailability: string;
  viewPart: string;
  loadMore: string;
  fitmentLabel: string;
  fitmentUnknown: string;
  productDescription: string;
  variantsTitle: string;
  variant: string;
  sku: string;
  price: string;
  status: string;
  backToCatalog: string;
  emptyQuery: string;
  whatsappIntro: string;
  whatsappPart: string;
  whatsappBrand: string;
  whatsappModel: string;
  whatsappCategory: string;
  whatsappPhoto: string;
};

export const catalogCopy: Record<CatalogLanguage, CatalogCopy> = {
  ru: {
    languageName: "Русский",
    backToService: "Выездной ремонт",
    pageTitle: "Запчасти для спецтехники",
    pageDescription: "Найдём деталь по номеру, модели техники или фотографии шильдика. Проверим совместимость до заказа.",
    searchLabel: "Номер детали или название",
    searchPlaceholder: "Например: K5V160DT, 90R055 или гидронасос",
    brandLabel: "Бренд техники",
    brandPlaceholder: "Выберите бренд",
    modelLabel: "Модель техники",
    modelPlaceholder: "Например: CAT 325C или SANY SY365H",
    categoryLabel: "Категория",
    allCategories: "Все категории",
    findButton: "Запросить подбор",
    helper: "Если номера нет, укажите модель техники и отправьте фото шильдика в WhatsApp.",
    categoriesTitle: "Категории запчастей",
    categoriesDescription: "Подбираем гидравлические, электрические, топливные и моторные компоненты для спецтехники.",
    brandsTitle: "Работаем с основными брендами",
    brandsDescription: "Оригинальные, OEM и проверенные аналоги. Вариант согласуем до оплаты.",
    requestTitle: "Не нашли деталь в каталоге?",
    requestDescription: "Каталог не ограничивает ассортимент. Отправьте запрос, и мы проверим поставщиков в Казахстане и Китае.",
    requestButton: "Отправить запрос",
    requestNote: "Цена и срок подтверждаются после проверки номера и совместимости.",
    processTitle: "Как проходит подбор",
    process: ["Получаем номер детали, модель техники и фото шильдика", "Сверяем исполнение, размеры, порты и подключение", "Предлагаем варианты, цену, срок и условия гарантии", "После подтверждения организуем поставку в Казахстан"],
    deliveryTitle: "Поставка по Казахстану",
    deliveryText: "Отправляем в Астану и регионы. Для срочных позиций отдельно проверяем авиа и экспресс-доставку.",
    qualityTitle: "Проверка до отправки",
    qualityText: "Запрашиваем фото маркировки, серийного номера, разъёмов, вала, фланца и портов.",
    resultsTitle: "Товары",
    productsFound: "позиций найдено",
    loadingProducts: "Загружаем каталог запчастей...",
    loadError: "Каталог временно не загрузился. Отправьте запрос в WhatsApp.",
    noResults: "Совпадений не найдено. Отправьте данные техники, мы выполним ручной поиск.",
    fromPrice: "от",
    priceOnRequest: "Цена по запросу",
    available: "Доступно к заказу",
    checkAvailability: "Наличие уточняется",
    viewPart: "Открыть карточку",
    loadMore: "Показать ещё",
    fitmentLabel: "Подходит для",
    fitmentUnknown: "Совместимость уточняем по OEM, модели и шильдику техники.",
    productDescription: "Подберём эту запчасть для вашей техники, сверим исполнение и подтвердим совместимость до оплаты.",
    variantsTitle: "Варианты и цены",
    variant: "Исполнение",
    sku: "Артикул",
    price: "Цена",
    status: "Статус",
    backToCatalog: "Назад в каталог",
    emptyQuery: "Укажите номер детали, название или модель техники.",
    whatsappIntro: "Здравствуйте! Нужен подбор запчасти для спецтехники.",
    whatsappPart: "Деталь или номер",
    whatsappBrand: "Бренд",
    whatsappModel: "Модель техники",
    whatsappCategory: "Категория",
    whatsappPhoto: "Фото шильдика отправлю следующим сообщением.",
  },
  kz: {
    languageName: "Қазақша",
    backToService: "Көшпелі жөндеу",
    pageTitle: "Арнайы техникаға арналған қосалқы бөлшектер",
    pageDescription: "Бөлшекті нөмірі, техника моделі немесе тақтайша суреті бойынша табамыз. Тапсырысқа дейін сәйкестігін тексереміз.",
    searchLabel: "Бөлшек нөмірі немесе атауы",
    searchPlaceholder: "Мысалы: K5V160DT, 90R055 немесе гидросорғы",
    brandLabel: "Техника бренді",
    brandPlaceholder: "Брендті таңдаңыз",
    modelLabel: "Техника моделі",
    modelPlaceholder: "Мысалы: CAT 325C немесе SANY SY365H",
    categoryLabel: "Санат",
    allCategories: "Барлық санаттар",
    findButton: "Іріктеуге сұрау жіберу",
    helper: "Нөмірі болмаса, техника моделін көрсетіп, тақтайша суретін WhatsApp арқылы жіберіңіз.",
    categoriesTitle: "Қосалқы бөлшектер санаттары",
    categoriesDescription: "Арнайы техникаға арналған гидравликалық, электрлік, отын және қозғалтқыш бөлшектерін іріктейміз.",
    brandsTitle: "Негізгі брендтермен жұмыс істейміз",
    brandsDescription: "Түпнұсқа, OEM және тексерілген баламалар. Нұсқаны төлемге дейін келісеміз.",
    requestTitle: "Бөлшекті каталогтан таппадыңыз ба?",
    requestDescription: "Каталог ассортиментті шектемейді. Сұрау жіберіңіз, Қазақстан мен Қытайдағы жеткізушілерді тексереміз.",
    requestButton: "Сұрау жіберу",
    requestNote: "Баға мен мерзім нөмірі және сәйкестігі тексерілгеннен кейін расталады.",
    processTitle: "Іріктеу қалай өтеді",
    process: ["Бөлшек нөмірін, техника моделін және тақтайша суретін аламыз", "Орындалуын, өлшемдерін, порттары мен қосылуын салыстырамыз", "Нұсқаларды, бағаны, мерзімді және кепілдік шарттарын ұсынамыз", "Растаудан кейін Қазақстанға жеткізуді ұйымдастырамыз"],
    deliveryTitle: "Қазақстан бойынша жеткізу",
    deliveryText: "Астанаға және өңірлерге жібереміз. Шұғыл бөлшектер үшін авиа және экспресс жеткізуді бөлек тексереміз.",
    qualityTitle: "Жіберуге дейін тексеру",
    qualityText: "Таңбалау, сериялық нөмір, қосқыштар, білік, фланец және порттар суреттерін сұраймыз.",
    resultsTitle: "Тауарлар",
    productsFound: "позиция табылды",
    loadingProducts: "Қосалқы бөлшектер каталогы жүктелуде...",
    loadError: "Каталог уақытша жүктелмеді. WhatsApp арқылы сұрау жіберіңіз.",
    noResults: "Сәйкестік табылмады. Техника деректерін жіберіңіз, қолмен іздейміз.",
    fromPrice: "бастап",
    priceOnRequest: "Бағасы сұрау бойынша",
    available: "Тапсырысқа қолжетімді",
    checkAvailability: "Қолжетімділігі нақтыланады",
    viewPart: "Карточканы ашу",
    loadMore: "Тағы көрсету",
    fitmentLabel: "Қолданылуы",
    fitmentUnknown: "Сәйкестігін OEM, техника моделі және тақтайша бойынша тексереміз.",
    productDescription: "Бұл бөлшекті техникаңызға іріктеп, орындалуын салыстырып, төлемге дейін сәйкестігін растаймыз.",
    variantsTitle: "Нұсқалар мен бағалар",
    variant: "Орындалуы",
    sku: "Артикул",
    price: "Баға",
    status: "Күйі",
    backToCatalog: "Каталогқа оралу",
    emptyQuery: "Бөлшек нөмірін, атауын немесе техника моделін көрсетіңіз.",
    whatsappIntro: "Сәлеметсіз бе! Арнайы техникаға қосалқы бөлшек іріктеу қажет.",
    whatsappPart: "Бөлшек немесе нөмір",
    whatsappBrand: "Бренд",
    whatsappModel: "Техника моделі",
    whatsappCategory: "Санат",
    whatsappPhoto: "Тақтайша суретін келесі хабарламада жіберемін.",
  },
  en: {
    languageName: "English",
    backToService: "Field repair service",
    pageTitle: "Heavy equipment parts",
    pageDescription: "We source parts by part number, machine model or nameplate photo and verify fitment before ordering.",
    searchLabel: "Part number or description",
    searchPlaceholder: "For example: K5V160DT, 90R055 or hydraulic pump",
    brandLabel: "Machine brand",
    brandPlaceholder: "Select a brand",
    modelLabel: "Machine model",
    modelPlaceholder: "For example: CAT 325C or SANY SY365H",
    categoryLabel: "Category",
    allCategories: "All categories",
    findButton: "Request a parts search",
    helper: "If the part number is unknown, enter the machine model and send the nameplate photo on WhatsApp.",
    categoriesTitle: "Parts categories",
    categoriesDescription: "We source hydraulic, electrical, fuel-system and engine components for heavy equipment.",
    brandsTitle: "Major brands supported",
    brandsDescription: "Genuine, OEM and verified aftermarket options. The exact option is confirmed before payment.",
    requestTitle: "Cannot find your part?",
    requestDescription: "The catalogue does not limit our range. Send an enquiry and we will check suppliers in Kazakhstan and China.",
    requestButton: "Send an enquiry",
    requestNote: "Price and lead time are confirmed after part-number and fitment verification.",
    processTitle: "How parts sourcing works",
    process: ["We receive the part number, machine model and nameplate photo", "We verify configuration, dimensions, ports and connectors", "We provide options, price, lead time and warranty terms", "After approval, we arrange delivery to Kazakhstan"],
    deliveryTitle: "Delivery across Kazakhstan",
    deliveryText: "We ship to Astana and all regions. Air and express delivery are checked separately for urgent parts.",
    qualityTitle: "Pre-shipment verification",
    qualityText: "We request clear photos of markings, serial number, connectors, shaft, flange and ports.",
    resultsTitle: "Products",
    productsFound: "products found",
    loadingProducts: "Loading the parts catalogue...",
    loadError: "The catalogue is temporarily unavailable. Send your enquiry on WhatsApp.",
    noResults: "No match found. Send the machine details and we will run a manual search.",
    fromPrice: "from",
    priceOnRequest: "Price on request",
    available: "Available to order",
    checkAvailability: "Availability to be confirmed",
    viewPart: "View part",
    loadMore: "Load more",
    fitmentLabel: "Fits",
    fitmentUnknown: "Fitment is verified by OEM number, machine model and nameplate.",
    productDescription: "We will match this part to your machine, verify its configuration and confirm fitment before payment.",
    variantsTitle: "Options and prices",
    variant: "Option",
    sku: "Part number",
    price: "Price",
    status: "Status",
    backToCatalog: "Back to catalogue",
    emptyQuery: "Enter a part number, description or machine model.",
    whatsappIntro: "Hello! I need help sourcing a heavy equipment part.",
    whatsappPart: "Part or number",
    whatsappBrand: "Brand",
    whatsappModel: "Machine model",
    whatsappCategory: "Category",
    whatsappPhoto: "I will send the nameplate photo in the next message.",
  },
};

export const partCategories = [
  { id: "hydraulic-pumps", ru: "Гидронасосы", kz: "Гидросорғылар", en: "Hydraulic pumps" },
  { id: "gear-pumps", ru: "Шестерёнчатые насосы", kz: "Тісті сорғылар", en: "Gear pumps" },
  { id: "piston-pumps", ru: "Поршневые насосы", kz: "Поршеньді сорғылар", en: "Piston pumps" },
  { id: "main-control-valves", ru: "Основные гидрораспределители", kz: "Негізгі гидротаратқыштар", en: "Main control valves" },
  { id: "pump-parts", ru: "Запчасти гидронасосов", kz: "Гидросорғы бөлшектері", en: "Hydraulic pump parts" },
  { id: "hydraulic-motors", ru: "Гидромоторы", kz: "Гидромоторлар", en: "Hydraulic motors" },
  { id: "final-drives", ru: "Бортовые редукторы", kz: "Борттық редукторлар", en: "Final drives" },
  { id: "control-valves", ru: "Распределители и клапаны", kz: "Таратқыштар мен клапандар", en: "Control valves" },
  { id: "electrical", ru: "Датчики и соленоиды", kz: "Датчиктер мен соленоидтар", en: "Sensors and solenoids" },
  { id: "wiring-harnesses", ru: "Жгуты проводки", kz: "Сымдар шоғыры", en: "Wiring harnesses" },
  { id: "controllers-monitors", ru: "Контроллеры и мониторы", kz: "Контроллерлер мен мониторлар", en: "Controllers and monitors" },
  { id: "seals-filters", ru: "Ремкомплекты и фильтры", kz: "Жөндеу жинақтары мен сүзгілер", en: "Seal kits and filters" },
  { id: "engine-fuel", ru: "Двигатель и топливная", kz: "Қозғалтқыш және отын жүйесі", en: "Engine and fuel parts" },
  { id: "engine-rebuild-kits", ru: "Комплекты капремонта ДВС", kz: "Қозғалтқыш жөндеу жинақтары", en: "Engine rebuild kits" },
  { id: "fuel-injectors", ru: "Топливные форсунки", kz: "Отын бүріккіштері", en: "Fuel injectors" },
  { id: "fuel-pumps", ru: "Топливные насосы", kz: "Отын сорғылары", en: "Fuel pumps" },
  { id: "air-conditioning", ru: "Кондиционирование", kz: "Кондиционер жүйесі", en: "Air conditioning" },
  { id: "diagnostic-tools", ru: "Диагностические инструменты", kz: "Диагностикалық құралдар", en: "Diagnostic tools" },
  { id: "other-parts", ru: "Другие запчасти", kz: "Басқа қосалқы бөлшектер", en: "Other parts" },
] as const;

export const supportedBrands = [
  "Caterpillar", "Komatsu", "Hitachi", "Volvo CE", "Hyundai", "SANY", "XCMG", "Shantui", "Doosan", "Kobelco", "Liebherr", "JCB", "Danfoss", "Rexroth", "Kawasaki", "Parker", "HANDOK", "Cummins",
];
