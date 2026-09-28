import fs from "node:fs";
import path from "node:path";

const sourceBaseUrl = new URL(
  process.env.CATALOG_SNAPSHOT_URL || "https://acahydraulic.kz/catalog-data/"
);
const outputDir = path.resolve(
  process.env.CATALOG_OUTPUT_DIR || "client/public/catalog-data"
);
const stagingDir = `${outputDir}.snapshot-tmp`;

async function fetchFile(fileName) {
  const url = new URL(fileName, sourceBaseUrl);
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "ACA-Hydraulic-Catalog-Snapshot/1.0",
    },
  });
  if (!response.ok)
    throw new Error(`Snapshot request failed: ${response.status} ${url}`);
  const body = Buffer.from(await response.arrayBuffer());
  if (body.length === 0) throw new Error(`Snapshot file is empty: ${url}`);
  JSON.parse(body.toString("utf8"));
  fs.writeFileSync(path.join(stagingDir, fileName), body);
}

async function run() {
  fs.rmSync(stagingDir, { recursive: true, force: true });
  fs.mkdirSync(stagingDir, { recursive: true });
  try {
    await fetchFile("manifest.json");
    const manifest = JSON.parse(
      fs.readFileSync(path.join(stagingDir, "manifest.json"), "utf8")
    );
    if (!Number.isInteger(manifest.chunkCount) || manifest.chunkCount < 1) {
      throw new Error("Snapshot manifest has an invalid chunkCount");
    }
    const files = [
      "product-map.json",
      manifest.categorySummaryFile || "category-summary.json",
    ];
    if (manifest.indexFile) files.push(manifest.indexFile);
    for (let page = 1; page <= manifest.chunkCount; page += 1) {
      const suffix = String(page).padStart(3, "0");
      files.push(`products-${suffix}.json`, `search-index-${suffix}.json`);
    }
    await Promise.all([...new Set(files)].map(fetchFile));

    let productCount = 0;
    for (let page = 1; page <= manifest.chunkCount; page += 1) {
      const products = JSON.parse(
        fs.readFileSync(
          path.join(
            stagingDir,
            `products-${String(page).padStart(3, "0")}.json`
          ),
          "utf8"
        )
      );
      productCount += products.length;
    }
    if (productCount !== manifest.productCount) {
      throw new Error(
        `Snapshot product count mismatch: expected ${manifest.productCount}, received ${productCount}`
      );
    }

    fs.rmSync(outputDir, { recursive: true, force: true });
    fs.renameSync(stagingDir, outputDir);
    console.log(
      JSON.stringify(
        {
          snapshot: true,
          source: sourceBaseUrl.href,
          outputDir,
          productCount,
          files: files.length + 1,
        },
        null,
        2
      )
    );
  } catch (error) {
    fs.rmSync(stagingDir, { recursive: true, force: true });
    throw error;
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
