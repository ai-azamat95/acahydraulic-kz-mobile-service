"""Generate lightweight orthographic globe and map paths from Natural Earth (public domain).
World input: ne_110m_admin_0_countries.geojson from nvkelso/natural-earth-vector.
Usage: python3 scripts/generate-home-geography.py /path/to/world.geojson
"""
import json, math, pathlib, sys
root = pathlib.Path(__file__).resolve().parents[1]
refs = root / 'docs/design-references/homepage-20261106'
def rings(feature):
 g = feature['geometry']; p = g['coordinates']
 return [r for poly in (p if g['type']=='MultiPolygon' else [p]) for r in poly]
def project(lon, lat):
 l,p = math.radians(lon-70),math.radians(lat); p0=math.radians(30)
 return (300+240*math.cos(p)*math.sin(l),270-240*(math.cos(p0)*math.sin(p)-math.sin(p0)*math.cos(p)*math.cos(l)),math.sin(p0)*math.sin(p)+math.cos(p0)*math.cos(p)*math.cos(l))
def path(points): return 'M'+'L'.join(f'{x:.1f},{y:.1f}' for x,y in points)+'Z'
def map_point(lon,lat): return ((lon-45)*15+25,(56-lat)*23+35)
data={}
for country in ['kazakhstan','kyrgyzstan']:
 data[country]=[path([map_point(*p) for p in r]) for r in rings(json.load(open(refs/(country+'.geojson'))))]
world=json.load(open(sys.argv[1])); countries=[]
for f in world['features']:
 for r in rings(f):
  pts=[project(*p) for p in r]
  # Only visible hemisphere; densify coastlines at horizon to avoid back-face polygons.
  visible=[(x,y) for x,y,z in pts if z>=0]
  if len(visible)>2: countries.append({'name':f['properties']['ADMIN'],'d':path(visible)})
data['globe']=countries
city_specs=[('Астана','Nur-Sultan',-10,-15),('Алматы','Almaty',12,18),('Шымкент','Shymkent',-68,14),('Караганда','Qaraghandy',0,20),('Павлодар','Pavlodar',9,-12),('Усть-Каменогорск','Oskemen',-5,25),('Костанай','Oostanay',-35,-16),('Актобе','Aqtobe',-40,-13),('Атырау','Atyrau',-44,-13),('Актау','Aqtau',-28,23),('Улытау',None,-55,0),('Балхаш','Balqash',10,-8),('Семей','Semey',8,-15),('Петропавловск','Petropavlovsk',-55,-14),('Кокшетау','Kokshetau',-15,18),('Бишкек',None,-15,30)]
cities={f['properties']['name']:f['geometry']['coordinates'] for f in json.load(open(refs/'kazakhstan_cities_10m.json'))}
data['cities']=[]
for name,key,dx,dy in city_specs:
 lon,lat=cities[key] if key else ((66.96,48.65) if name=='Улытау' else (74.60,42.87))
 x,y=map_point(lon,lat);data['cities'].append(dict(name=name,lon=lon,lat=lat,x=round(x,2),y=round(y,2),dx=dx,dy=dy))
out=root/'client/src/components/home/geography.json';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n')
print(out)
