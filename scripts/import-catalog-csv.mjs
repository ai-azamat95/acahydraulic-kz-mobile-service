import fs from "node:fs";
import path from "node:path";

const DEFAULT_OUTPUT = "client/src/data/catalog.generated.json";
const VALID_CURRENCIES = new Set(["CNY", "USD", "KZT"]);
const VALID_AVAILABILITY = new Set(["in_stock", "on_request", "out_of_stock"]);

function parseArgs(argv) {
  const input = argv[2];
  const options = {};

  for (const arg of argv.slice(3)) {
    if (!arg.startsWith("--")) continue;
    const [key, ...rest] = arg.slice(2).split("=");
    options[key] = rest.join("=");
  }

  return { input, options };
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (quoted) throw new Error("CSV parse error: unclosed quoted field");
  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
}

function toNumber(value) {
  if (value === undefined || value === null || String(value).trim() === "") return undefined;
  const normalized = String(value).trim().replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toBoolean(value) {
  return /^(1|true|yes|y|да)$/i.test(String(value ?? "").trim());
}

function splitList(value) {
  return String(value ?? "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}

function applyMarkup(basePrice, markupPercent) {
  return Math.round(basePrice * (1 + markupPercent / 100));
}

function required(row, key, line) {
  const value = String(row[key] ?? "").trim();
  if (!value) throw new Error(`Row ${line}: required field '${key}' is empty`);
  return value;
}

function getRate(currency, row, options) {
  const rowRate = toNumber(row.exchangeRateKzt);
  if (rowRate && rowRate > 0) return rowRate;
  if (currency === "CNY") return toNumber(options["cny-rate"]);
  if (currency === "USD") return toNumber(options["usd-rate"]);
  if (currency === "KZT") return 1;
  return undefined;
}

function buildProduct(row, index, options) {
  const line = index + 2;
  const sku = required(row, "sku", line);
  const title = required(row, "title", line);
  const brand = required(row, "brand", line);
  const category = required(row, "category", line);
  const slug = String(row.slug ?? "").trim() || slugify(sku);

  if (!slug) {
    throw new Error(`Row ${line}: cannot generate slug from SKU '${sku}'. Provide slug explicitly.`);
  }

  const sourcePrice = toNumber(row.sourcePrice);
  const requestedCurrency = String(row.sourceCurrency ?? "").trim().toUpperCase();
  const sourceCurrency = requestedCurrency || undefined;
  if (sourceCurrency && !VALID_CURRENCIES.has(sourceCurrency)) {
    throw new Error(`Row ${line}: unsupported currency '${sourceCurrency}'`);
  }

  const defaultMarkup = toNumber(options.markup) ?? 50;
  const markupPercent = toNumber(row.markupPercent) ?? defaultMarkup;
  let priceKzt = toNumber(row.priceKzt);

  if (!priceKzt && sourcePrice && sourceCurrency) {
    const rate = getRate(sourceCurrency, row, options);
    if (rate && rate > 0) {
      priceKzt = applyMarkup(sourcePrice * rate, markupPercent);
    }
  }

  const availabilityRaw = String(row.availability ?? "on_request").trim() || "on_request";
  const availability = VALID_AVAILABILITY.has(availabilityRaw)
    ? availabilityRaw
    : "on_request";

  const product = {
    id: String(row.id ?? "").trim() || `import-${slug}`,
    slug,
    sku,
    title,
    brand,
    category,
    oem: splitList(row.oem).length ? splitList(row.oem) : [sku],
    machineModels: splitList(row.machineModels),
    description:
      String(row.description ?? "").trim() ||
      `${title}. Подбор и проверка совместимости по OEM-номеру, маркировке и модели техники.`,
    markupPercent,
    availability,
    featured: toBoolean(row.featured),
    isDemo: toBoolean(row.isDemo),
  };

  const image = String(row.image ?? "").trim();
  if (image) product.image = image;
  if (sourcePrice !== undefined) product.sourcePrice = sourcePrice;
  if (sourceCurrency) product.sourceCurrency = sourceCurrency;
  if (priceKzt !== undefined) product.priceKzt = priceKzt;

  return product;
}

function main() {
  const { input, options } = parseArgs(process.argv);
  if (!input) {
    console.error(
      "Usage: node scripts/import-catalog-csv.mjs <file.csv> [--markup=50] [--cny-rate=70] [--usd-rate=540] [--output=path]"
    );
    process.exit(1);
  }

  const inputPath = path.resolve(input);
  const outputPath = path.resolve(options.output || DEFAULT_OUTPUT);
  const raw = fs.readFileSync(inputPath, "utf8").replace(/^\uFEFF/, "");
  const rows = parseCsv(raw);

  if (rows.length < 2) throw new Error("CSV must contain a header and at least one product row");

  const headers = rows[0].map((header) => header.trim());
  const products = rows.slice(1).map((cells, index) => {
    const row = Object.fromEntries(headers.map((header, column) => [header, cells[column] ?? ""]));
    return buildProduct(row, index, options);
  });

  const slugSet = new Set();
  const idSet = new Set();
  for (const product of products) {
    if (slugSet.has(product.slug)) throw new Error(`Duplicate slug: ${product.slug}`);
    if (idSet.has(product.id)) throw new Error(`Duplicate id: ${product.id}`);
    slugSet.add(product.slug);
    idSet.add(product.id);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  const priced = products.filter((product) => product.priceKzt).length;
  console.log(`Imported ${products.length} products -> ${path.relative(process.cwd(), outputPath)}`);
  console.log(`Products with calculated/fixed KZT price: ${priced}`);
  console.log(`Default markup: ${toNumber(options.markup) ?? 50}%`);
}

main();
