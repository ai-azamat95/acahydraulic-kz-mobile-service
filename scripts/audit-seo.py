"""Audit every generated sitemap URL without crawling the production catalogue."""
import collections, json, pathlib, re, sys, urllib.parse, xml.etree.ElementTree as ET
from html.parser import HTMLParser

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'dist/public')
class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(); self.h1 = 0; self.canonical = []; self.links = []; self.images = []; self.noindex = False
        self.meta = collections.Counter(); self.feed(source)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta' and (a.get('name') or a.get('property')): self.meta[a.get('name') or a.get('property')] += 1
        if tag == 'h1': self.h1 += 1
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical.append(a.get('href'))
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag == 'img': self.images.append(a)
        if tag == 'meta' and a.get('name') == 'robots' and 'noindex' in a.get('content', ''): self.noindex = True

urls = set(); maps = {}; issues = collections.defaultdict(list); titles = collections.defaultdict(list); descriptions = collections.defaultdict(list)
thin = []; targets = collections.defaultdict(set); schema_count = collections.Counter(); sizes = []
for file in sorted(root.glob('sitemap*.xml')):
    tree = ET.parse(file); entries = [n.text for n in tree.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    maps[file.name] = len(entries); urls.update(entries)
for url in sorted(urls):
    route = urllib.parse.urlparse(url).path; file = root / route.lstrip('/') / 'index.html'
    if not file.exists(): issues['missing_page'].append(route); continue
    html = file.read_text(); sizes.append((len(html.encode()), route)); page = Page(html)
    if page.h1 != 1: issues['h1'].append([route, page.h1])
    if page.canonical != [url]: issues['canonical'].append([route, page.canonical])
    if page.noindex: issues['noindex_in_sitemap'].append(route)
    for key in ['description', 'og:title', 'og:description', 'og:url', 'og:image']:
        if page.meta[key] != 1: issues['meta_count'].append([route, key, page.meta[key]])
    for field, pattern, store in [('title', r'<title[^>]*>(.*?)</title>', titles), ('description', r'<meta[^>]*name="description"[^>]*content="([^"]*)"', descriptions)]:
        match = re.search(pattern, html, re.S)
        if not match or not match[1].strip(): issues['missing_' + field].append(route)
        else: store[match[1]].append(route)
    for block in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S):
        try:
            data = json.loads(block); t = data.get('@type', 'unknown'); schema_count[str(t)] += 1
            if data.get('@type') == 'WebPage' and data.get('url') != url: issues['wrong_webpage_schema'].append([route, data.get('url')])
        except (ValueError, AttributeError): issues['invalid_jsonld'].append(route)
    main = re.search(r'<main\b.*?</main>', html, re.S)
    if not main: issues['missing_main'].append(route)
    else:
        words = len(re.sub(r'<[^>]+>', ' ', main[0]).split())
        if words < 120 and not route.startswith('/catalog/'): thin.append([route, words])
    for href in page.links:
        parsed = urllib.parse.urlparse(urllib.parse.urljoin(url, href))
        if parsed.netloc == 'acahydraulic.kz': targets[urllib.parse.unquote(parsed.path)].add(route)
    for img in page.images:
        if 'alt' not in img: issues['missing_alt'].append(route)
for target, sources in targets.items():
    file = root / target.lstrip('/')
    if not file.is_file() and not (file / 'index.html').is_file(): issues['broken_internal_target'].append({'target': target, 'sources': sorted(sources)[:6], 'source_count':len(sources)})
report = {'sitemaps': maps, 'unique_urls':len(urls), 'issue_counts':{k:len(v) for k,v in issues.items()}, 'issues':dict(issues), 'thin_non_catalog_pages':thin, 'duplicate_title_groups':[v for v in titles.values() if len(v)>1], 'duplicate_description_groups':[v for v in descriptions.values() if len(v)>1], 'schema_counts':dict(schema_count), 'largest_html':sorted(sizes, reverse=True)[:5]}
print(json.dumps(report, ensure_ascii=False, indent=2))
if '--strict' in sys.argv and issues: sys.exit(1)
