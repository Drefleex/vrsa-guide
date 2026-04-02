import { useState, useEffect } from 'react'

import { FERRY_TIMES, CP_TRAINS } from '../data/transport'

const TRAINS = CP_TRAINS.map(t => ({ dep: t.dep, arr: t.faro }))

const BUSES = [
  { id:1, op:'EVA / Rede Expressos', dest:{PT:'Faro (Aeroporto)',EN:'Faro (Airport)',ES:'Faro (Aeropuerto)'}, price:'€6', dur:'50min', color:'#1D4ED8', times:['07:30','09:15','11:00','13:30','15:45','17:30','19:00'] },
  { id:2, op:'Frota Azul',           dest:{PT:'Tavira',EN:'Tavira',ES:'Tavira'},                             price:'€3', dur:'30min', color:'#059669', times:['08:00','10:30','12:00','14:30','16:00','18:30'] },
  { id:3, op:'Local VRSA',           dest:{PT:'↔ Monte Gordo',EN:'↔ Monte Gordo',ES:'↔ Monte Gordo'},        price:'€1.50',dur:'15min',color:'#D97706', times:['08:30','09:30','10:30','11:30','13:00','14:30','16:00','17:30','19:00'] },
  { id:4, op:'Local VRSA',           dest:{PT:'↔ Castro Marim',EN:'↔ Castro Marim',ES:'↔ Castro Marim'},     price:'€2', dur:'20min', color:'#7C3AED', times:['08:00','10:00','12:00','14:00','16:30','18:30'] },
]

const EMERGENCY = [
  { e:'🚨', num:'112',               label:{PT:'Emergência Geral',EN:'General Emergency',ES:'Emergencia General'}, big:true },
  { e:'🚔', num:'+351 281 510 820',  label:{PT:'GNR — Polícia',EN:'Police GNR',ES:'Policía GNR'} },
  { e:'🏥', num:'+351 289 891 100',  label:{PT:'Hospital de Faro',EN:'Faro Hospital',ES:'Hospital de Faro'} },
  { e:'⚕️', num:'+351 281 510 650',  label:{PT:'Centro de Saúde',EN:'Health Centre',ES:'Centro de Salud'} },
  { e:'🚒', num:'+351 281 512 112',  label:{PT:'Bombeiros VRSA',EN:'Fire Brigade',ES:'Bomberos'} },
  { e:'🚖', num:'+351 963 847 520',  label:{PT:'Táxi Pinho',EN:'Taxi Pinho',ES:'Taxi Pinho'} },
]

const PRACTICAL = [
  { e:'💶', label:{PT:'Moeda',EN:'Currency',ES:'Moneda',FR:'Monnaie',DE:'Währung'}, val:'Euro (EUR)' },
  { e:'🗣️', label:{PT:'Língua',EN:'Language',ES:'Idioma',FR:'Langue',DE:'Sprache'}, val:{PT:'Português',EN:'Portuguese',ES:'Portugués',FR:'Portugais',DE:'Portugiesisch'} },
  { e:'🕐', label:{PT:'Fuso horário',EN:'Timezone',ES:'Zona horaria',FR:'Fuseau horaire',DE:'Zeitzone'}, val:'UTC+0 / +1' },
  { e:'✈️', label:{PT:'Aeroporto',EN:'Airport',ES:'Aeropuerto',FR:'Aéroport',DE:'Flughafen'}, val:'Faro (FAO) ~65 km' },
  { e:'🌐', label:{PT:'Wi-Fi público',EN:'Public Wi-Fi',ES:'Wi-Fi público',FR:'Wi-Fi public',DE:'Öffentl. WLAN'}, val:{PT:'Câmara Municipal',EN:'Town Hall area',ES:'Ayuntamiento',FR:'Hôtel de Ville',DE:'Stadtverwaltung'} },
]

// ─── Helpers ─────────────────────────────────────────────────
const toMin = t => { const [h,m]=t.split(':').map(Number); return h*60+m }
const nowMin = () => { const n=new Date(); return n.getHours()*60+n.getMinutes() }
const fmtEta = t => { const d=toMin(t)-nowMin(); if(d<=0)return null; return d<60?`${d}min`:`${Math.floor(d/60)}h${d%60?` ${d%60}min`:''}` }
const wIcon = c => c===0?'☀️':c<=3?'⛅':c<=48?'🌫️':c<=67?'🌧️':c<=82?'🌦️':'⛈️'
const wDesc = (c,l) => {
  const m = {
    PT:{0:'Céu limpo',1:'Maioritariamente limpo',2:'Parcialmente nublado',3:'Nublado',45:'Nevoeiro',61:'Chuva leve',63:'Chuva moderada',80:'Aguaceiros',95:'Trovoada'},
    EN:{0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Foggy',61:'Light rain',63:'Moderate rain',80:'Showers',95:'Thunderstorm'},
    ES:{0:'Despejado',1:'Mayormente despejado',2:'Parcialmente nublado',3:'Nublado',45:'Niebla',61:'Lluvia leve',63:'Lluvia moderada',80:'Chubascos',95:'Tormenta'},
    FR:{0:'Ciel dégagé',1:'Majoritairement dégagé',2:'Partiellement nuageux',3:'Couvert',45:'Brouillard',61:'Pluie légère',63:'Pluie modérée',80:'Averses',95:'Orage'},
    DE:{0:'Klarer Himmel',1:'Überwiegend klar',2:'Teilweise bewölkt',3:'Bedeckt',45:'Nebel',61:'Leichter Regen',63:'Mäßiger Regen',80:'Schauer',95:'Gewitter'},
  }
  return (m[l]||m.PT)[c]||''
}

// ─── Sub-components ───────────────────────────────────────────
function SchedRow({ time, sub, past, isNext, eta }) {
  return (
    <div className={`sched-row ${past?'past':''} ${isNext?'next-dep':''}`}>
      <span className="sched-time">{time}</span>
      <span style={{ flex:1, fontSize:12, color: past?'#CBD5E1': isNext?'#2563EB':'#64748B' }}>{sub}</span>
      {isNext && <span className="badge badge-blue">próximo</span>}
      {!isNext && eta && <span style={{ fontSize:12, fontWeight:700, color:'#059669' }}>{eta}</span>}
    </div>
  )
}

function InfoCard({ children, style }) {
  return <div className="card" style={{ marginBottom:12, ...style }}>{children}</div>
}

function InfoBanner({ icon, children, color='#1D4ED8' }) {
  return (
    <div style={{ background:`${color}12`, border:`1px solid ${color}25`, borderRadius:12, padding:'11px 14px', marginBottom:12, display:'flex', gap:10, alignItems:'flex-start' }}>
      <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
      <div style={{ fontSize:12, color:color, fontWeight:600, lineHeight:1.5 }}>{children}</div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function Info({ lang }) {
  const [tab, setTab]     = useState('weather')
  const [wx, setWx]       = useState(null)
  const [wxLoading, setWxLoading] = useState(false)
  const [busOpen, setBusOpen] = useState(null)
  const [_tick, setTick]  = useState(0)

  const L = lang || 'PT'
  const DAY = {PT:['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],EN:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],ES:['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],FR:['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],DE:['So','Mo','Di','Mi','Do','Fr','Sa']}

  const T = {
    PT:{ title:'Info Prática', sub:'Vila Real de Santo António · Algarve', weather:'Tempo', ferry:'Ferry', train:'Comboio', bus:'Autocarro', sea:'Praias', sos:'SOS', today:'Hoje', depart:'Parte', arrive:'Chega', noMore:'Sem mais hoje', ferryInfo:'€2,50 · 15 min · Passaporte necessário para Espanha', ferryReturn:'Último ferry de volta: 19:30', trainInfo:'Bilhetes em cp.pt ou na estação · ~1h10 até Faro', busInfo:'Rede VAMUS Algarve · Bilhetes a bordo ou em vamus.pt', touristTrain:'🚂 Comboio Turístico (Jun–Set)', touristNote:'Praça Pombal · ~€3 adulto · ~€2 criança', taxiAvail:'disponível 24h', sunrise:'Nascer', sunset:'Pôr do sol', uvIndex:'Índice UV', precipToday:'Precipitação hoje', noRain:'Sem chuva prevista', beachCond:'Condições de praia', beachExcellent:'Excelente — ideal para nadar', beachGood:'Boas — confortáveis para a praia', beachPoor:'Má — chuva prevista hoje', beachFair:'Razoáveis — leva um casaco leve', loading:'A carregar...', flagGuide:'Bandeiras da Praia', nearbyBeaches:'PRAIAS PRÓXIMAS', emergency:'EMERGÊNCIA GERAL', practicalInfo:'INFO PRÁTICA' },
    EN:{ title:'Practical Info', sub:'Vila Real de Santo António · Algarve', weather:'Weather', ferry:'Ferry', train:'Train', bus:'Bus', sea:'Beaches', sos:'SOS', today:'Today', depart:'Departs', arrive:'Arrives', noMore:'No more today', ferryInfo:'€2.50 · 15 min · Passport required for Spain', ferryReturn:'Last return ferry: 19:30', trainInfo:'Tickets at cp.pt or station · ~1h10 to Faro', busInfo:'Algarve VAMUS Network · Tickets on board or at vamus.pt', touristTrain:'🚂 Tourist Train (Jun–Sep)', touristNote:'Praça Pombal · ~€3 adult · ~€2 child', taxiAvail:'available 24h', sunrise:'Sunrise', sunset:'Sunset', uvIndex:'UV Index', precipToday:'Precipitation today', noRain:'No rain expected', beachCond:'Beach conditions', beachExcellent:'Excellent — ideal for swimming', beachGood:'Good — comfortable for the beach', beachPoor:'Poor — rain expected today', beachFair:'Fair — bring a light jacket', loading:'Loading...', flagGuide:'Beach Flag Guide', nearbyBeaches:'NEARBY BEACHES', emergency:'GENERAL EMERGENCY', practicalInfo:'PRACTICAL INFO' },
    ES:{ title:'Info Práctica', sub:'Vila Real de Santo António · Algarve', weather:'Tiempo', ferry:'Ferry', train:'Tren', bus:'Autobús', sea:'Playas', sos:'SOS', today:'Hoy', depart:'Sale', arrive:'Llega', noMore:'Sin más hoy', ferryInfo:'€2,50 · 15 min · Pasaporte necesario para España', ferryReturn:'Último ferry de vuelta: 19:30', trainInfo:'Billetes en cp.pt o estación · ~1h10 a Faro', busInfo:'Red VAMUS Algarve · Billetes a bordo o en vamus.pt', touristTrain:'🚂 Tren Turístico (Jun–Sep)', touristNote:'Plaza Pombal · ~€3 adulto · ~€2 niño', taxiAvail:'disponible 24h', sunrise:'Amanecer', sunset:'Atardecer', uvIndex:'Índice UV', precipToday:'Precipitación hoy', noRain:'Sin lluvia prevista', beachCond:'Condiciones de playa', beachExcellent:'Excelente — ideal para nadar', beachGood:'Buenas — cómodas para la playa', beachPoor:'Malas — lluvia prevista hoy', beachFair:'Regulares — lleva una chaqueta', loading:'Cargando...', flagGuide:'Guía de Banderas', nearbyBeaches:'PLAYAS CERCANAS', emergency:'EMERGENCIA GENERAL', practicalInfo:'INFO PRÁCTICA' },
    FR:{ title:'Info Pratique', sub:'Vila Real de Santo António · Algarve', weather:'Météo', ferry:'Ferry', train:'Train', bus:'Bus', sea:'Plages', sos:'SOS', today:'Aujourd\'hui', depart:'Départ', arrive:'Arrivée', noMore:'Plus de ferry aujourd\'hui', ferryInfo:'€2,50 · 15 min · Passeport requis pour l\'Espagne', ferryReturn:'Dernier ferry retour: 19h30', trainInfo:'Billets sur cp.pt ou à la gare · ~1h10 jusqu\'à Faro', busInfo:'Réseau VAMUS Algarve · Billets à bord ou sur vamus.pt', touristTrain:'🚂 Train Touristique (Jun–Sep)', touristNote:'Praça Pombal · ~€3 adulte · ~€2 enfant', taxiAvail:'disponible 24h', sunrise:'Lever du soleil', sunset:'Coucher du soleil', uvIndex:'Indice UV', precipToday:'Précipitations aujourd\'hui', noRain:'Pas de pluie prévue', beachCond:'Conditions de plage', beachExcellent:'Excellentes — idéal pour nager', beachGood:'Bonnes — confortables pour la plage', beachPoor:'Mauvaises — pluie prévue aujourd\'hui', beachFair:'Correctes — prenez une veste légère', loading:'Chargement...', flagGuide:'Guide des Drapeaux', nearbyBeaches:'PLAGES PROCHES', emergency:'URGENCE GÉNÉRALE', practicalInfo:'INFO PRATIQUE' },
    DE:{ title:'Praktische Info', sub:'Vila Real de Santo António · Algarve', weather:'Wetter', ferry:'Fähre', train:'Zug', bus:'Bus', sea:'Strände', sos:'SOS', today:'Heute', depart:'Abfahrt', arrive:'Ankunft', noMore:'Keine Fähre mehr heute', ferryInfo:'€2,50 · 15 Min · Reisepass für Spanien erforderlich', ferryReturn:'Letzte Rückfähre: 19:30', trainInfo:'Tickets auf cp.pt oder am Bahnhof · ~1h10 nach Faro', busInfo:'VAMUS Algarve Netz · Tickets an Bord oder auf vamus.pt', touristTrain:'🚂 Touristenzug (Jun–Sep)', touristNote:'Praça Pombal · ~€3 Erw. · ~€2 Kind', taxiAvail:'verfügbar 24h', sunrise:'Sonnenaufgang', sunset:'Sonnenuntergang', uvIndex:'UV-Index', precipToday:'Niederschlag heute', noRain:'Kein Regen erwartet', beachCond:'Strandbedingungen', beachExcellent:'Ausgezeichnet — ideal zum Schwimmen', beachGood:'Gut — angenehm am Strand', beachPoor:'Schlecht — Regen erwartet', beachFair:'Mäßig — leichte Jacke mitnehmen', loading:'Laden...', flagGuide:'Strandfahnen-Guide', nearbyBeaches:'NAHE STRÄNDE', emergency:'ALLGEMEINER NOTFALL', practicalInfo:'PRAKTISCHE INFO' },
  }
  const t = T[L] || T.PT

  function fetchWx() {
    setWxLoading(true)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=37.1948&longitude=-7.4161&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,wind_direction_10m,relativehumidity_2m,precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=Europe/Lisbon&forecast_days=7')
      .then(r=>r.json()).then(d=>{ if(d?.current) setWx(d) }).catch(()=>{})
      .finally(()=>setWxLoading(false))
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWx()
    const iv = setInterval(()=>setTick(x=>x+1), 60000)
    return () => clearInterval(iv)
  }, [])

  const nm = nowMin()
  const ferryNext = FERRY_TIMES.find(f => toMin(f) > nm) || null
  const trainNext = TRAINS.find(f => toMin(f.dep) > nm) || null

  const TABS = [
    { k:'weather', icon:'🌤️', label:t.weather },
    { k:'ferry',   icon:'⛴️', label:t.ferry   },
    { k:'train',   icon:'🚂', label:t.train   },
    { k:'bus',     icon:'🚌', label:t.bus     },
    { k:'sea',     icon:'🏖️', label:t.sea     },
    { k:'sos',     icon:'🚨', label:t.sos     },
  ]

  return (
    <div className="page" style={{ display:'flex', flexDirection:'column' }}>

      {/* ── Hero with live tiles ── */}
      <div className="info-hero" style={{
        background: 'url("/images/info_hero_hr.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Cinematic gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.95) 100%)', zIndex: 0 }} />
        
        <h1 style={{ position:'relative', zIndex:1, fontSize:28, fontWeight:900, color:'#fff', letterSpacing:'-.5px', textShadow: '0 2px 14px rgba(0,0,0,0.5)', marginBottom:18 }}>{t.title}</h1>

        {/* Live tiles */}
        <div className="info-tiles" style={{ position:'relative', zIndex:1 }}>

          {/* Weather tile */}
          <div className="info-tile" onClick={()=>setTab('weather')}>
            <div className="info-tile-label">🌤️ {t.weather}</div>
            {wx ? (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:30 }}>{wIcon(wx.current.weathercode)}</span>
                <div>
                  <div className="info-tile-big">{Math.round(wx.current.temperature_2m)}°C</div>
                  <div className="info-tile-sub" style={{ color:'rgba(255,255,255,.5)' }}>{wDesc(wx.current.weathercode,L)}</div>
                </div>
              </div>
            ) : (
              <div className="info-tile-big" style={{ fontSize:18, color:'rgba(255,255,255,.4)' }}>—</div>
            )}
          </div>

          {/* Ferry tile */}
          <div className={`info-tile${ferryNext?' next-up':''}`} onClick={()=>setTab('ferry')}>
            <div className="info-tile-label">⛴️ Ferry</div>
            {ferryNext ? (
              <>
                <div className="info-tile-big">{ferryNext}</div>
                <div className="info-tile-sub" style={{ color:'#93C5FD' }}>{L==='DE'?'in':L==='FR'?'dans':'em'} {fmtEta(ferryNext)}</div>
              </>
            ) : (
              <div className="info-tile-sub" style={{ color:'rgba(255,255,255,.35)', fontSize:12 }}>{t.noMore}</div>
            )}
          </div>
        </div>

        {/* Tab strip */}
        <div className="info-tabs" style={{ position:'relative', zIndex:1 }}>
          {TABS.map(tb => (
            <button
              key={tb.k}
              className={`info-tab${tab===tb.k?' active':''}`}
              onClick={() => setTab(tb.k)}
            >
              <span className="tab-icon">{tb.icon}</span>
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content area ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 40px' }}>

        {/* ══════════ WEATHER ══════════ */}
        {tab === 'weather' && (
          <div>
            {/* Refresh row */}
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:8 }}>
              <button
                onClick={fetchWx}
                disabled={wxLoading}
                aria-label="Refresh weather"
                style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:50, background:'var(--surface)', border:'1px solid var(--border-lt)', fontSize:12, fontWeight:600, color:'var(--ink-40)', cursor:'pointer', opacity: wxLoading ? .5 : 1 }}
              >
                <span style={{ display:'inline-block', animation: wxLoading ? 'spin .8s linear infinite' : 'none' }}>🔄</span>
                {wxLoading
                  ? (L==='EN'?'Updating…':L==='ES'?'Actualizando…':L==='FR'?'Mise à jour…':L==='DE'?'Aktualisierung…':'A atualizar…')
                  : (L==='EN'?'Refresh':L==='ES'?'Actualizar':L==='FR'?'Actualiser':L==='DE'?'Aktualisieren':'Atualizar')}
              </button>
            </div>
            {wx ? (() => {
              const code  = wx.current.weathercode
              const temp  = Math.round(wx.current.temperature_2m)
              const feels = Math.round(wx.current.apparent_temperature ?? wx.current.temperature_2m)
              const wind  = Math.round(wx.current.windspeed_10m)
              const hum   = wx.current.relativehumidity_2m
              const uv    = wx.daily?.uv_index_max?.[0] ?? null
              const rain  = wx.daily?.precipitation_sum?.[0] ?? null

              // Sunrise / Sunset formatted
              const fmtTime = iso => iso ? iso.slice(11,16) : '--:--'
              const sunrise = fmtTime(wx.daily?.sunrise?.[0])
              const sunset  = fmtTime(wx.daily?.sunset?.[0])

              // Wind direction arrow
              const windDir = wx.current.wind_direction_10m ?? 0
              const dirs = ['N','NE','E','SE','S','SO','O','NO']
              const windLabel = dirs[Math.round(windDir/45) % 8]

              // Smart tip
              const getTip = () => {
                if (code === 0 && temp >= 20)
                  return { icon:'🏖️', color:'#059669', bg:'#ECFDF5', border:'#A7F3D0', text:{PT:'Dia perfeito para a praia! Aproveita o sol e o mar.',EN:'Perfect beach day! Enjoy the sun and sea.',ES:'¡Día perfecto para la playa! Disfruta del sol y el mar.',FR:'Journée parfaite pour la plage ! Profite du soleil et de la mer.',DE:'Perfekter Strandtag! Genieße Sonne und Meer.'} }
                if (code === 0 || code <= 3)
                  return { icon:'🚶', color:'#1D4ED8', bg:'#EFF6FF', border:'#BFDBFE', text:{PT:'Bom dia para explorar a cidade a pé.',EN:'Great day for a walk around town.',ES:'Buen día para explorar la ciudad a pie.',FR:'Belle journée pour explorer la ville à pied.',DE:'Guter Tag für einen Spaziergang durch die Stadt.'} }
                if (code >= 51 && code <= 82)
                  return { icon:'☂️', color:'#7C3AED', bg:'#F5F3FF', border:'#DDD6FE', text:{PT:'Leva guarda-chuva. Considera visitar o museu ou a biblioteca.',EN:'Take an umbrella. Consider visiting the museum or library.',ES:'Lleva paraguas. Considera visitar el museo o la biblioteca.',FR:'Prends un parapluie. Visite le musée ou la bibliothèque.',DE:'Nimm einen Regenschirm mit. Besuche das Museum oder die Bibliothek.'} }
                if (code >= 95)
                  return { icon:'⚡', color:'#DC2626', bg:'#FEF2F2', border:'#FECACA', text:{PT:'Tempestade prevista. Fica em segurança e evita a praia.',EN:'Storm forecast. Stay safe and avoid the beach.',ES:'Tormenta prevista. Mantente seguro y evita la playa.',FR:'Orage prévu. Reste en sécurité et évite la plage.',DE:'Gewitter vorhergesagt. Bleib sicher und meide den Strand.'} }
                return { icon:'🌤️', color:'#D97706', bg:'#FFFBEB', border:'#FDE68A', text:{PT:'Tempo variável. Ideal para explorar o mercado ou a praça.',EN:'Variable weather. Great for the market or the main square.',ES:'Tiempo variable. Ideal para el mercado o la plaza principal.',FR:'Temps variable. Idéal pour explorer le marché ou la place.',DE:'Wechselhaftes Wetter. Ideal für den Markt oder den Hauptplatz.'} }
              }
              const tip = getTip()

              // Smart alerts
              const alerts = []
              if (uv != null && uv >= 6) alerts.push({ icon:'☀️', color:'#B45309', bg:'#FEF3C7', border:'#FDE68A', text:{PT:`UV ${uv} — Protecção solar obrigatória. Evita sol entre 12h–16h.`,EN:`UV ${uv} — Sunscreen essential. Avoid sun between 12–4pm.`,ES:`UV ${uv} — Protector solar obligatorio. Evita el sol entre 12–16h.`,FR:`UV ${uv} — Crème solaire indispensable. Évite le soleil entre 12–16h.`,DE:`UV ${uv} — Sonnencreme erforderlich. Meide die Sonne zwischen 12–16 Uhr.`} })
              if (wind >= 30) alerts.push({ icon:'💨', color:'#1D4ED8', bg:'#EFF6FF', border:'#BFDBFE', text:{PT:`Vento forte ${wind} km/h — Evita praias expostas. Cuidado com chapéus.`,EN:`Strong wind ${wind} km/h — Avoid exposed beaches. Watch your hat.`,ES:`Viento fuerte ${wind} km/h — Evita playas expuestas.`,FR:`Vent fort ${wind} km/h — Évite les plages exposées.`,DE:`Starker Wind ${wind} km/h — Vermeide exponierte Strände.`} })
              if (code >= 51 && rain != null && rain > 5) alerts.push({ icon:'🌧️', color:'#7C3AED', bg:'#F5F3FF', border:'#DDD6FE', text:{PT:`Chuva prevista ${rain.toFixed(0)}mm — Leva guarda-chuva e roupa impermeável.`,EN:`Rain forecast ${rain.toFixed(0)}mm — Bring umbrella and waterproof jacket.`,ES:`Lluvia prevista ${rain.toFixed(0)}mm — Lleva paraguas e impermeable.`,FR:`Pluie prévue ${rain.toFixed(0)}mm — Prends ton parapluie et un imperméable.`,DE:`Regen vorhergesagt ${rain.toFixed(0)}mm — Regenschirm und Regenjacke mitnehmen.`} })

              // UV level
              const uvLabel = !uv ? null : uv <= 2 ? {l:{PT:'Baixo',EN:'Low',ES:'Bajo',FR:'Faible',DE:'Niedrig'}, c:'#059669'}
                : uv <= 5 ? {l:{PT:'Moderado',EN:'Moderate',ES:'Moderado',FR:'Modéré',DE:'Mäßig'}, c:'#D97706'}
                : uv <= 7 ? {l:{PT:'Alto',EN:'High',ES:'Alto',FR:'Élevé',DE:'Hoch'}, c:'#EA580C'}
                : {l:{PT:'Muito alto',EN:'Very high',ES:'Muy alto',FR:'Très élevé',DE:'Sehr hoch'}, c:'#DC2626'}

              return (
                <>
                  {/* ── Smart alerts ── */}
                  {alerts.length > 0 && alerts.map((al, i) => (
                    <div key={i} style={{ background:al.bg, border:`1px solid ${al.border}`, borderRadius:12, padding:'11px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:22, flexShrink:0 }}>{al.icon}</span>
                      <div style={{ fontSize:12, color:al.color, fontWeight:700, lineHeight:1.5 }}>{al.text[L]||al.text.PT}</div>
                    </div>
                  ))}

                  {/* ── Smart tip ── */}
                  <div style={{ background:tip.bg, border:`1px solid ${tip.border}`, borderRadius:16, padding:'14px 16px', marginBottom:12, display:'flex', alignItems:'flex-start', gap:12 }}>
                    <span style={{ fontSize:26, flexShrink:0 }}>{tip.icon}</span>
                    <div style={{ fontSize:13, color:tip.color, fontWeight:600, lineHeight:1.55 }}>{tip.text[L]}</div>
                  </div>

                  {/* ── Current conditions card ── */}
                  <InfoCard>
                    {/* Big temp row */}
                    <div style={{ padding:'20px 20px 16px', display:'flex', alignItems:'center', gap:16 }}>
                      <span style={{ fontSize:54, lineHeight:1 }}>{wIcon(code)}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:46, fontWeight:900, color:'var(--ink)', lineHeight:1 }}>{temp}°C</div>
                        <div style={{ fontSize:14, color:'var(--ink-40)', marginTop:4 }}>{wDesc(code,L)}</div>
                      </div>
                    </div>

                    {/* Metrics grid */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderTop:'1px solid var(--surface)' }}>
                      {[
                        { icon:'🌡️', val:`${feels}°`, label:{PT:'Sensação',EN:'Feels like',ES:'Sensación',FR:'Ressenti',DE:'Gefühlt'}[L] },
                        { icon:'💧', val:`${hum}%`,   label:{PT:'Humidade',EN:'Humidity',ES:'Humedad',FR:'Humidité',DE:'Luftfeuchte'}[L] },
                        { icon:'💨', val:`${wind} km/h`, label:`${windLabel}` },
                      ].map((item,i)=>(
                        <div key={i} style={{ padding:'13px 4px', textAlign:'center', borderRight:i<2?'1px solid var(--surface)':'none' }}>
                          <div style={{ fontSize:18, marginBottom:4 }}>{item.icon}</div>
                          <div style={{ fontSize:15, fontWeight:800, color:'var(--ink)' }}>{item.val}</div>
                          <div style={{ fontSize:10, color:'var(--ink-20)', marginTop:2, fontWeight:600, textTransform:'uppercase', letterSpacing:.5 }}>{item.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* 7-day */}
                    {wx.daily && (
                      <div style={{ borderTop:'1px solid var(--surface)', padding:'12px 4px', display:'flex', overflowX:'auto' }}>
                        {wx.daily.time.map((date,i) => {
                          const dn = (DAY[L]||DAY.PT)[new Date(date).getDay()]
                          return (
                            <div key={i} style={{ flexShrink:0, flex:1, textAlign:'center', padding:'4px 6px', borderRight:i<6?'1px solid var(--surface)':'none', minWidth:42 }}>
                              <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)' }}>{i===0?t.today:dn}</div>
                              <div style={{ fontSize:20, margin:'5px 0' }}>{wIcon(wx.daily.weathercode[i])}</div>
                              <div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>{Math.round(wx.daily.temperature_2m_max[i])}°</div>
                              <div style={{ fontSize:11, color:'var(--ink-20)' }}>{Math.round(wx.daily.temperature_2m_min[i])}°</div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </InfoCard>

                  {/* ── Sun & UV row ── */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginTop:12 }}>
                    {/* Sunrise */}
                    <div className="card card-sm" style={{ padding:'14px 12px', textAlign:'center' }}>
                      <div style={{ fontSize:24, marginBottom:6 }}>🌅</div>
                      <div style={{ fontSize:16, fontWeight:800, color:'var(--ink)' }}>{sunrise}</div>
                      <div style={{ fontSize:10, color:'var(--ink-20)', fontWeight:700, textTransform:'uppercase', letterSpacing:.5, marginTop:3 }}>
                        {t.sunrise}
                      </div>
                    </div>

                    {/* Sunset */}
                    <div className="card card-sm" style={{ padding:'14px 12px', textAlign:'center' }}>
                      <div style={{ fontSize:24, marginBottom:6 }}>🌇</div>
                      <div style={{ fontSize:16, fontWeight:800, color:'var(--ink)' }}>{sunset}</div>
                      <div style={{ fontSize:10, color:'var(--ink-20)', fontWeight:700, textTransform:'uppercase', letterSpacing:.5, marginTop:3 }}>
                        {t.sunset}
                      </div>
                    </div>

                    {/* UV */}
                    <div className="card card-sm" style={{ padding:'14px 12px', textAlign:'center' }}>
                      <div style={{ fontSize:24, marginBottom:6 }}>☀️</div>
                      <div style={{ fontSize:16, fontWeight:800, color: uvLabel?.c ?? 'var(--ink)' }}>{uv != null ? uv.toFixed(1) : '--'}</div>
                      <div style={{ fontSize:10, color:'var(--ink-20)', fontWeight:700, textTransform:'uppercase', letterSpacing:.5, marginTop:3 }}>
                        {t.uvIndex}
                      </div>
                      {uvLabel && <div style={{ fontSize:9, color:uvLabel.c, fontWeight:800, marginTop:2 }}>{uvLabel.l[L]}</div>}
                    </div>
                  </div>

                  {/* ── Rain today ── */}
                  {rain != null && (
                    <div style={{ marginTop:10 }}>
                      <div className="card card-sm" style={{ padding:'13px 18px', display:'flex', alignItems:'center', gap:14 }}>
                        <span style={{ fontSize:26 }}>🌧️</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>
                            {t.precipToday}
                          </div>
                          <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:2 }}>
                            {rain === 0
                              ? t.noRain
                              : `${rain.toFixed(1)} mm`}
                          </div>
                        </div>
                        <div style={{ fontSize:16, fontWeight:900, color: rain===0?'#059669':'#1D4ED8' }}>
                          {rain === 0 ? '✓' : `${rain.toFixed(1)}mm`}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Beach recommendation ── */}
                  <div style={{ marginTop:10 }}>
                    <div className="card card-sm" style={{ padding:'13px 18px', display:'flex', alignItems:'center', gap:14 }}>
                      <span style={{ fontSize:26 }}>🏖️</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>
                          {t.beachCond}
                        </div>
                        <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:2 }}>
                          {code===0 && temp>=22
                            ? t.beachExcellent
                            : code<=3 && temp>=18
                            ? t.beachGood
                            : code>=51 && code<=82
                            ? t.beachPoor
                            : t.beachFair}
                        </div>
                      </div>
                      <div style={{ fontSize:13, fontWeight:800,
                        color: code===0&&temp>=22?'#059669' : code<=3&&temp>=18?'#D97706' : code>=51?'#DC2626':'#64748B'
                      }}>
                        {code===0&&temp>=22?'🟢':code<=3&&temp>=18?'🟡':code>=51?'🔴':'🟡'}
                      </div>
                    </div>
                  </div>
                </>
              )
            })() : (
              <InfoCard>
                <div style={{ padding:32, textAlign:'center', color:'var(--ink-20)', fontSize:13 }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🌡️</div>
                  {t.loading}
                </div>
              </InfoCard>
            )}
          </div>
        )}

        {/* ══════════ FERRY ══════════ */}
        {tab === 'ferry' && (
          <div>
            <InfoBanner icon="ℹ️" color="#1D4ED8">
              {t.ferryInfo} — {t.ferryReturn}
            </InfoBanner>

            <InfoCard>
              {/* Header */}
              <div style={{ padding:'14px 18px 12px', borderBottom:'1px solid var(--surface)', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>⛴️</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:'var(--ink)' }}>VRSA → Ayamonte</div>
                  <div style={{ fontSize:11, color:'var(--ink-20)', marginTop:1 }}>Cais de Embarque Transguadiana</div>
                </div>
                <a
                  href="https://maps.google.com/?q=37.1973,-7.4131"
                 
                  rel="noopener noreferrer"
                  style={{ marginLeft:'auto', background:'var(--blue-lt)', color:'var(--blue)', border:'none', borderRadius:8, padding:'5px 10px', fontSize:11, fontWeight:700, cursor:'pointer', textDecoration:'none' }}
                >
                  📍 Mapa
                </a>
              </div>

              {/* Schedule */}
              {FERRY_TIMES.map((f, i) => {
                const past   = toMin(f) <= nm
                const isNext = f === ferryNext
                const e      = fmtEta(f)
                return (
                  <SchedRow
                    key={i}
                    time={f}
                    sub="VRSA → Ayamonte (15 min)"
                    past={past}
                    isNext={isNext}
                    eta={e}
                  />
                )
              })}

              {/* Footer note */}
              <div style={{ padding:'10px 18px', background:'var(--gold-lt)', borderTop:'1px solid #FDE68A', display:'flex', alignItems:'center', gap:8 }}>
                <span>💡</span>
                <span style={{ fontSize:11, color:'#92400E', fontWeight:600 }}>{t.ferryReturn}</span>
              </div>
            </InfoCard>
          </div>
        )}

        {/* ══════════ TRAIN ══════════ */}
        {tab === 'train' && (
          <div>
            <InfoBanner icon="🎫" color="#059669">{t.trainInfo}</InfoBanner>

            <InfoCard>
              <div style={{ padding:'14px 18px 12px', borderBottom:'1px solid var(--surface)', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'var(--mint-lt)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🚂</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:'var(--ink)' }}>VRSA → Faro</div>
                  <div style={{ fontSize:11, color:'var(--ink-20)', marginTop:1 }}>Via Monte Gordo · Tavira · Olhão</div>
                </div>
                <a
                  href="https://www.cp.pt"
                 
                  rel="noopener noreferrer"
                  style={{ background:'var(--mint-lt)', color:'var(--mint)', border:'none', borderRadius:8, padding:'5px 10px', fontSize:11, fontWeight:700, cursor:'pointer', textDecoration:'none' }}
                >
                  cp.pt
                </a>
              </div>

              {TRAINS.map((tr, i) => {
                const past   = toMin(tr.dep) <= nm
                const isNext = tr === trainNext
                return (
                  <SchedRow
                    key={i}
                    time={tr.dep}
                    sub={`${t.arrive} Faro ${tr.arr}`}
                    past={past}
                    isNext={isNext}
                    eta={fmtEta(tr.dep)}
                  />
                )
              })}
            </InfoCard>

            {/* Tourist train */}
            <div style={{ background:'var(--mint-lt)', border:'1px solid #A7F3D0', borderRadius:20, padding:'16px 18px' }}>
              <div style={{ fontSize:13, fontWeight:800, color:'#065F46', marginBottom:6 }}>{t.touristTrain}</div>
              <div style={{ fontSize:11, color:'#059669', marginBottom:12 }}>{t.touristNote}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {['10:00','12:00','15:00','17:00','19:00'].map((t2,i)=>(
                  <span key={i} style={{ background:'#059669', color:'#fff', fontSize:12, fontWeight:800, padding:'5px 12px', borderRadius:8, fontVariantNumeric:'tabular-nums' }}>{t2}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ BUS ══════════ */}
        {tab === 'bus' && (
          <div>
            <InfoBanner icon="ℹ️" color="#1D4ED8">{t.busInfo}</InfoBanner>

            {/* Taxi shortcut */}
            <a href="tel:+351963847520" style={{ textDecoration:'none', display:'block', marginBottom:12 }}>
              <div className="card card-sm" style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:14, background:'var(--gold-lt)', border:'1px solid #FDE68A' }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'#FEF3C7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>🚖</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>{L==='EN'?'Taxi Pinho':L==='DE'?'Taxi Pinho':'Táxi Pinho'} — {t.taxiAvail}</div>
                  <div style={{ fontSize:13, color:'#1D4ED8', fontWeight:700, marginTop:2 }}>+351 963 847 520</div>
                </div>
                <span style={{ fontSize:22 }}>📞</span>
              </div>
            </a>

            {/* Bus lines */}
            {BUSES.map((line, li) => {
              const isOpen = busOpen === li
              const nm2    = nm
              return (
                <div key={li} className="card card-sm" style={{ marginBottom:10 }}>
                  {/* Header row */}
                  <div
                    onClick={() => setBusOpen(isOpen ? null : li)}
                    style={{ padding:'13px 18px', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}
                  >
                    <div style={{ width:10, height:10, borderRadius:'50%', background:line.color, flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>{line.op}</div>
                      <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{line.dest[L]}</div>
                    </div>
                    <div style={{ textAlign:'right', marginRight:8 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>{line.price}</div>
                      <div style={{ fontSize:10, color:'var(--ink-20)', marginTop:1 }}>{line.dur}</div>
                    </div>
                    <span style={{ color:'var(--ink-20)', fontSize:14, transform:isOpen?'rotate(90deg)':'none', transition:'transform .2s' }}>›</span>
                  </div>

                  {/* Expanded times */}
                  {isOpen && (
                    <div style={{ padding:'4px 18px 14px', borderTop:'1px solid var(--surface)' }}>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6, paddingTop:10 }}>
                        {line.times.map((t2, i) => {
                          const past   = toMin(t2) <= nm2
                          const isNext = !past && line.times.find(x=>toMin(x)>nm2) === t2
                          return (
                            <span key={i} style={{
                              padding:'5px 11px', borderRadius:8,
                              fontVariantNumeric:'tabular-nums', fontSize:13, fontWeight:700,
                              background: isNext?line.color : past?'var(--surface)':'var(--border-lt)',
                              color: isNext?'#fff' : past?'var(--ink-20)':'var(--ink)',
                            }}>{t2}</span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ══════════ SEA / BEACHES ══════════ */}
        {tab === 'sea' && (
          <div>
            {/* Sea temp */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
              {[
                { icon:'☀️', season:{PT:'Verão (Jun–Set)',EN:'Summer (Jun–Sep)',ES:'Verano (Jun–Sep)'}[L], temp:'18–22°C', bg:'#FFF7ED', c:'#D97706', bc:'#FDE68A' },
                { icon:'🌧️', season:{PT:'Inverno (Out–Mai)',EN:'Winter (Oct–May)',ES:'Invierno (Oct–May)'}[L], temp:'14–17°C', bg:'#EFF6FF', c:'#1D4ED8', bc:'#BFDBFE' },
              ].map((s,i)=>(
                <div key={i} style={{ background:s.bg, border:`1px solid ${s.bc}`, borderRadius:20, padding:'16px', textAlign:'center' }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:24, fontWeight:900, color:s.c }}>{s.temp}</div>
                  <div style={{ fontSize:11, color:s.c, marginTop:4, fontWeight:700 }}>{s.season}</div>
                </div>
              ))}
            </div>

            {/* Flag guide */}
            <InfoCard style={{ marginBottom:12 }}>
              <div style={{ padding:'13px 18px 11px', borderBottom:'1px solid var(--surface)' }}>
                <div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>
                  {t.flagGuide}
                </div>
              </div>
              {[
                { flag:'🟢', text:{PT:'Verde — Seguro para nadar',EN:'Green — Safe to swim',ES:'Verde — Seguro para nadar',FR:'Vert — Sûr pour nager',DE:'Grün — Sicher zum Schwimmen'} },
                { flag:'🟡', text:{PT:'Amarelo — Atenção, aguardar instruções',EN:'Yellow — Caution, await instructions',ES:'Amarillo — Precaución, esperar instrucciones',FR:'Jaune — Prudence, attendez les instructions',DE:'Gelb — Vorsicht, auf Anweisungen warten'} },
                { flag:'🔴', text:{PT:'Vermelho — Proibido entrar na água',EN:'Red — No swimming',ES:'Rojo — Prohibido bañarse',FR:'Rouge — Baignade interdite',DE:'Rot — Baden verboten'} },
                { flag:'🟣', text:{PT:'Roxo — Animais marinhos avistados',EN:'Purple — Marine animals spotted',ES:'Morado — Animales marinos avistados',FR:'Violet — Animaux marins repérés',DE:'Lila — Meerestiere gesichtet'} },
              ].map((f,i,arr) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'11px 18px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
                  <span style={{ fontSize:20 }}>{f.flag}</span>
                  <span style={{ fontSize:13, color:'var(--ink-70)' }}>{f.text[L]}</span>
                </div>
              ))}
            </InfoCard>

            {/* Beaches list */}
            <div className="sec-label">{t.nearbyBeaches}</div>
            <InfoCard>
              {[
                { name:'Praia de VRSA',           dist:'2.5 km', flag:'🟢', note:{PT:'Bandeira Azul',EN:'Blue Flag',ES:'Bandera Azul',FR:'Pavillon Bleu',DE:'Blaue Flagge'} },
                { name:'Praia de Monte Gordo',     dist:'5 km',   flag:'🟢', note:{PT:'Águas quentes',EN:'Warm water',ES:'Agua cálida',FR:'Eau chaude',DE:'Warmes Wasser'} },
                { name:'Praia da Ponta da Areia',  dist:'3 km',   flag:'🟡', note:{PT:'Correntes · cuidado',EN:'Currents · caution',ES:'Corrientes · precaución',FR:'Courants · prudence',DE:'Strömungen · Vorsicht'} },
                { name:'Praia Verde',              dist:'9 km',   flag:'🟢', note:{PT:'Pinheiros · tranquila',EN:'Pine forest · quiet',ES:'Pinos · tranquila',FR:'Forêt de pins · tranquille',DE:'Kiefernwald · ruhig'} },
              ].map((b,i,arr) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 18px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:'#F0F9FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>🏖️</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{b.name}</div>
                    <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{b.note[L]} · {b.dist}</div>
                  </div>
                  <span style={{ fontSize:18 }}>{b.flag}</span>
                </div>
              ))}
            </InfoCard>
          </div>
        )}

        {/* ══════════ SOS ══════════ */}
        {tab === 'sos' && (
          <div>
            {/* 112 — huge hero */}
            <a href="tel:112" style={{ textDecoration:'none', display:'block', marginBottom:10 }}>
              <div style={{ background:'#B91C1C', borderRadius:16, padding:'22px', display:'flex', alignItems:'center', gap:16, boxShadow:'0 4px 20px rgba(185,28,28,.35)' }}>
                <div style={{ width:64, height:64, borderRadius:16, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, flexShrink:0 }}>🚨</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.65)', fontWeight:700, letterSpacing:1.2, textTransform:'uppercase', marginBottom:4 }}>{t.emergency}</div>
                  <div style={{ fontSize:52, fontWeight:900, color:'#fff', lineHeight:1, letterSpacing:'-2px' }}>112</div>
                </div>
                <div style={{ fontSize:32 }}>📞</div>
              </div>
            </a>

            {/* Other emergency numbers — big tappable rows */}
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
              {EMERGENCY.slice(1).map((em, i) => (
                <a key={i} href={`tel:${em.num.replace(/\s/g,'')}`} style={{ textDecoration:'none' }}>
                  <div style={{ background:'var(--white)', border:'1px solid var(--border-lt)', borderRadius:12, padding:'14px 16px', display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:48, height:48, borderRadius:12, background:'#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{em.e}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:'var(--ink)' }}>{em.label[L]||em.label.PT}</div>
                      <div style={{ fontSize:14, color:'var(--primary)', fontWeight:700, marginTop:2, letterSpacing:'.5px' }}>{em.num}</div>
                    </div>
                    <div style={{ width:36, height:36, borderRadius:10, background:'var(--green-lt)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>📞</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Practical info */}
            <div className="sec-label">{t.practicalInfo}</div>
            <InfoCard>
              {PRACTICAL.map((item, i, arr) => (
                <div key={i} className="row" style={{ borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
                  <span style={{ fontSize:22 }}>{item.e}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{item.label[L]}</div>
                  </div>
                  <div style={{ fontSize:12, color:'var(--ink-40)', textAlign:'right', maxWidth:160 }}>
                    {typeof item.val === 'object' ? item.val[L]||item.val.PT : item.val}
                  </div>
                </div>
              ))}
            </InfoCard>
          </div>
        )}

      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
    </div>
  )
}

