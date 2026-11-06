import geography from './geography.json';

export function ServiceMap() {
  const astana = geography.cities[0];
  return <figure className="home-map">
    <svg viewBox="0 0 660 425" role="img" aria-labelledby="home-map-title home-map-desc">
      <title id="home-map-title">Выезд из Астаны по Казахстану и в Бишкек</title>
      <desc id="home-map-desc">Схематические направления выездов, не автомобильные маршруты. Бишкек находится в Кыргызстане.</desc>
      <defs><linearGradient id="map-metal" x2="0.3" y2="1"><stop stopColor="#343a3b"/><stop offset="1" stopColor="#14191d"/></linearGradient></defs>
      <g fill="url(#map-metal)" stroke="#756443" strokeWidth="1.2">{geography.kazakhstan.map((d,i)=><path d={d} key={i}/>)}</g>
      <g fill="#202527" stroke="#545654">{geography.kyrgyzstan.map((d,i)=><path d={d} key={i}/>)}</g>
      <g fill="none" stroke="#a78a53" strokeWidth="1" opacity=".65">{geography.cities.slice(1).map(city=><path key={city.name} d={`M${astana.x},${astana.y} Q${(astana.x+city.x)/2},${Math.min(astana.y,city.y)-30} ${city.x},${city.y}`}/>)}</g>
      {geography.cities.map((city,i)=><g key={city.name} data-city={city.name}>
        <circle cx={city.x} cy={city.y} r={i===0?5:2.8} fill="#b49b65"/>
        {i===0&&<circle cx={city.x} cy={city.y} r="11" fill="none" stroke="#a78a53"/>}
        <text x={city.name === 'Усть-Каменогорск' ? 645 : city.name === 'Кокшетау' ? city.x-12 : city.x+city.dx} y={city.name === 'Кокшетау' ? city.y+12 : city.name === 'Караганда' ? city.y-5 : city.name === 'Бишкек' ? city.y+54 : city.y+city.dy} textAnchor={city.name === 'Усть-Каменогорск' || city.name === 'Кокшетау' ? 'end' : 'start'} className={i===0?'home-map-origin':''}>{city.name}</text>
      </g>)}
    </svg>
    <figcaption>Линии показывают направления выездов, не дорожные маршруты.</figcaption>
  </figure>;
}

const groups = [
  ['Европа', 'Danfoss · Rexroth', 'Eaton · Perkins'],
  ['США', 'Cummins · Dana'],
  ['Япония', 'Kawasaki · Isuzu'],
  ['Корея', 'Handok · Doosan'],
  ['Китай', 'XCMG · SANY'],
];
export function SupplyGlobe() {
  return <figure className="home-globe">
    <svg viewBox="0 0 600 540" role="img" aria-labelledby="globe-title">
      <title id="globe-title">Направления поставок в Казахстан, вид на Евразию</title>
      <defs>
        <radialGradient id="sphere" cx="35%" cy="27%" r="76%"><stop stopColor="#454b4d"/><stop offset=".55" stopColor="#242b2f"/><stop offset="1" stopColor="#080b0e"/></radialGradient>
        <radialGradient id="shade" cx="32%" cy="25%" r="78%"><stop stopColor="#b1b7b8" stopOpacity=".09"/><stop offset=".6" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".85"/></radialGradient>
        <clipPath id="globe-disc"><circle cx="300" cy="270" r="240"/></clipPath>
      </defs>
      <ellipse cx="300" cy="517" rx="190" ry="13" fill="#000" opacity=".5"/>
      <circle cx="300" cy="270" r="240" fill="url(#sphere)" stroke="#596063" strokeWidth=".8"/>
      <g clipPath="url(#globe-disc)">
        {geography.globe.map((country,i)=><path key={i} d={country.d} fill={country.name==='Kazakhstan'?'#a3884f':'#464b4c'} stroke="#151b1f" strokeWidth=".65"/>)}
        <circle cx="300" cy="270" r="240" fill="url(#shade)"/>
        <g stroke="#b59a63" strokeWidth="1.2" fill="none" opacity=".8">
          <path d="M150 170 Q220 75 306 193"/><path d="M68 285 Q160 110 306 193"/>
          <path d="M480 230 Q390 100 306 193"/><path d="M440 270 Q375 135 306 193"/>
          <path d="M390 325 Q380 220 306 193"/>
        </g>
        <circle cx="306" cy="193" r="5" fill="#c19a48"/>
      </g>
    </svg>
    <div className="supply-labels">{groups.map(([region,...brands],i)=><div className={`supply-label supply-${i}`} key={region}><strong>{region}</strong>{brands.map(line=><span key={line}>{line}</span>)}</div>)}</div>
    <figcaption>Направления поставок и ассортимент, не страна производства каждой детали и не заявление об официальном дилерстве.</figcaption>
  </figure>;
}
