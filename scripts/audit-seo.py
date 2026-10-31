"""Audit generated sitemap URLs without crawling the production catalogue."""

import collections
import html as html_lib
import json
import pathlib
import re
import sys
import urllib.parse
import xml.etree.ElementTree as ET
from html.parser import HTMLParser


root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "dist/public")


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.h1 = 0
        self.canonical = []
        self.links = []
        self.images = []
        self.noindex = False
        self.meta = collections.Counter()
        self.meta_content = collections.defaultdict(list)
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "meta" and (attributes.get("name") or attributes.get("property")):
            key = attributes.get("name") or attributes.get("property")
            self.meta[key] += 1
            self.meta_content[key].append(attributes.get("content", ""))
        if tag == "h1":
            self.h1 += 1
        if tag == "link" and attributes.get("rel") == "canonical":
            self.canonical.append(attributes.get("href"))
        if tag == "a" and attributes.get("href"):
            self.links.append(attributes["href"])
        if tag == "img":
            self.images.append(attributes)
        if tag == "meta" and attributes.get("name") == "robots" and "noindex" in attributes.get("content", ""):
            self.noindex = True


urls = set()
maps = {}
issues = collections.defaultdict(list)
titles = collections.defaultdict(list)
descriptions = collections.defaultdict(list)
thin = []
targets = collections.defaultdict(set)
schema_count = collections.Counter()
sizes = []

namespace = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
for sitemap_file in sorted(root.glob("sitemap*.xml")):
    tree = ET.parse(sitemap_file)
    entries = [node.text for node in tree.findall(f".//{namespace}url/{namespace}loc")]
    maps[sitemap_file.name] = len(entries)
    urls.update(entries)

for url in sorted(urls):
    route = urllib.parse.urlparse(url).path
    page_file = root / route.lstrip("/") / "index.html"
    if not page_file.exists():
        issues["missing_page"].append(route)
        continue

    source = page_file.read_text()
    sizes.append((len(source.encode()), route))
    page = Page(source)
    if page.h1 != 1:
        issues["h1"].append([route, page.h1])
    if page.canonical != [url]:
        issues["canonical"].append([route, page.canonical])
    if page.noindex:
        issues["noindex_in_sitemap"].append(route)

    required_meta = ["description", "og:title", "og:description", "og:url", "og:image", "og:image:type"]
    for key in required_meta:
        if page.meta[key] != 1:
            issues["meta_count"].append([route, key, page.meta[key]])

    og_image = page.meta_content["og:image"][0].split("?", 1)[0].lower() if page.meta_content["og:image"] else ""
    og_image_type = page.meta_content["og:image:type"][0].lower() if page.meta_content["og:image:type"] else ""
    expected_image_type = next(
        (mime for suffix, mime in [(".webp", "image/webp"), (".png", "image/png"), (".avif", "image/avif"), (".gif", "image/gif")] if og_image.endswith(suffix)),
        "image/jpeg",
    )
    if og_image and og_image_type and og_image_type != expected_image_type:
        issues["og_image_type"].append([route, og_image_type, expected_image_type])

    metadata = [
        ("title", r"<title[^>]*>(.*?)</title>", titles),
        ("description", r'<meta[^>]*name="description"[^>]*content="([^"]*)"', descriptions),
    ]
    for field, pattern, store in metadata:
        match = re.search(pattern, source, re.S)
        if not match or not match[1].strip():
            issues[f"missing_{field}"].append(route)
            continue
        value = html_lib.unescape(re.sub(r"<[^>]+>", "", match[1])).strip()
        store[value].append(route)
        if field == "title" and len(value) > 75:
            issues["title_too_long"].append([route, len(value)])
        if field == "title" and re.search(
            r"(?:^|\s)(?:and|for|from|of|the|to|with|без|в|для|и|из|к|на|о|об|от|по|с|у)\s*\|\s*ACA Hydraulic$",
            value,
            re.IGNORECASE,
        ):
            issues["title_dangling_connector"].append([route, value])
        if field == "description" and len(value) > 180:
            issues["description_too_long"].append([route, len(value)])

    for block in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', source, re.S):
        try:
            data = json.loads(block)
            nodes = data.get("@graph") if isinstance(data, dict) and isinstance(data.get("@graph"), list) else [data]
            for node in nodes:
                if not isinstance(node, dict):
                    schema_count["unknown"] += 1
                    continue
                schema_type = node.get("@type", "unknown")
                schema_count[str(schema_type)] += 1
                types = schema_type if isinstance(schema_type, list) else [schema_type]
                if "WebPage" in types and node.get("url") and node.get("url") != url:
                    issues["webpage_url"].append([route, node.get("url")])
                if "Product" in types and not any(node.get(field) for field in ["offers", "review", "aggregateRating"]):
                    issues["ineligible_product_schema"].append(route)
                if "VideoObject" in types:
                    upload_date = node.get("uploadDate", "")
                    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})", upload_date):
                        issues["invalid_video_upload_date"].append([route, upload_date])
        except (ValueError, AttributeError):
            issues["invalid_jsonld"].append(route)

    main = re.search(r"<main\b.*?</main>", source, re.S)
    if not main:
        issues["missing_main"].append(route)
    else:
        words = len(re.sub(r"<[^>]+>", " ", main[0]).split())
        if words < 120 and not route.startswith("/catalog/"):
            thin.append([route, words])

    for href in page.links:
        parsed = urllib.parse.urlparse(urllib.parse.urljoin(url, href))
        if parsed.netloc == "acahydraulic.kz":
            targets[urllib.parse.unquote(parsed.path)].add(route)
    for image in page.images:
        if "alt" not in image:
            issues["missing_alt"].append(route)

for target, sources in targets.items():
    target_file = root / target.lstrip("/")
    if not target_file.is_file() and not (target_file / "index.html").is_file():
        issues["broken_internal_target"].append({
            "target": target,
            "sources": sorted(sources)[:6],
            "source_count": len(sources),
        })

duplicate_title_groups = [routes for routes in titles.values() if len(routes) > 1]
duplicate_description_groups = [routes for routes in descriptions.values() if len(routes) > 1]
if duplicate_title_groups:
    issues["duplicate_title"].extend(duplicate_title_groups)
if duplicate_description_groups:
    issues["duplicate_description"].extend(duplicate_description_groups)

report = {
    "sitemaps": maps,
    "unique_urls": len(urls),
    "issue_counts": {key: len(value) for key, value in issues.items()},
    "issues": dict(issues),
    "thin_non_catalog_pages": thin,
    "duplicate_title_groups": duplicate_title_groups,
    "duplicate_description_groups": duplicate_description_groups,
    "schema_counts": dict(schema_count),
    "largest_html": sorted(sizes, reverse=True)[:5],
}
print(json.dumps(report, ensure_ascii=False, indent=2))
if "--strict" in sys.argv and issues:
    sys.exit(1)
