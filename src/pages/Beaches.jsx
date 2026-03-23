import { useState, useEffect } from 'react'

const BEACHES = [
  { id:1, name:'Praia de VRSA',            dist:'2.5 km', lat:37.173516, lng:-7.422291, flag:'🟢', note:{PT:'Bandeira Azul · Águas calmas',EN:'Blue Flag · Calm waters',ES:'Bandera Azul · Aguas tranquilas',FR:'Pavillon Bleu · Eaux calmes',DE:'Blaue Flagge · Ruhiges Wasser'}, parking:true, bar:true, wc:true },
  { id:2, name:'Praia de Monte Gordo',      dist:'5 km',   lat:37.177989, lng:-7.449761, flag:'🟢', note:{PT:'Bandeira Azul · Aldeia piscatória',EN:'Blue Flag · Fishing village nearby',ES:'Bandera Azul · Pueblo pescador',FR:'Pavillon Bleu · Village de pêcheurs',DE:'Blaue Flagge · Fischerort'}, parking:true, bar:true, wc:true },
  { id:3, name:'Praia da Ponta da Areia',   dist:'3 km',   lat:37.171226, lng:-7.411609, flag:'🟡', note:{PT:'Correntes · Cuidado ao nadar',EN:'Currents · Take care when swimming',ES:'Corrientes · Precaución al nadar',FR:'Courants · Prudence en nageant',DE:'Strömungen · Vorsicht beim Schwimmen'}, parking:true, bar:false, wc:true },
  { id:4, name:'Praia Verde',               dist:'9 km',   lat:37.170101, lng:-7.49767,  flag:'🟢', note:{PT:'Pinheiros · Tranquila',EN:'Pine forest · Quiet and peaceful',ES:'Pinos · Tranquila',FR:'Forêt de pins · Tranquille',DE:'Kiefernwald · Ruhig'}, parking:true, bar:true, wc:false },
  { id:5, name:'Praia das Amélias',         dist:'3.5 km', lat:37.170132, lng:-7.407478, flag:'🟢', note:{PT:'Isolada · Natureza selvagem',EN:'Secluded · Wild nature',ES:'Aislada · Naturaleza salvaje',FR:'Isolée · Nature sauvage',DE:'Abgelegen · Wilde Natur'}, parking:false, bar:false, wc:false },
]

const FLAG_INFO = [
  { flag:'🟢', l:{PT:'Verde — Seguro para nadar',EN:'Green — Safe to swim',ES:'Verde — Seguro para nadar',FR:'Vert — Sûr pour nager',DE:'Grün — Sicher zum Schwimmen'} },
  { flag:'🟡', l:{PT:'Amarelo — Precaução',EN:'Yellow — Caution',ES:'Amarillo — Precaución',FR:'Jaune — Prudence',DE:'Gelb — Vorsicht'} },
  { flag:'🔴', l:{PT:'Vermelho — Proibido nadar',EN:'Red — No swimming',ES:'Rojo — Prohibido bañarse',FR:'Rouge — Baignade interdite',DE:'Rot — Baden verboten'} },
  { flag:'🟣', l:{PT:'Roxo — Animais marinhos',EN:'Purple — Marine animals',ES:'Morado — Animales marinos',FR:'Violet — Animaux marins',DE:'Lila — Meerestiere'} },
]

const TR = {
  PT:{ title:'Praias', sub:'Vila Real de Santo António · Algarve', seaTemp:'Temperatura do Mar', seaConditions:'Condições Hoje', flagGuide:'Guia de Bandeiras', beaches:'Praias Próximas', parking:'Parque', bar:'Bar', wc:'WC', directions:'Navegar', loading:'A carregar dados marinhos...', summer:'Verão (Jun–Set)', winter:'Inverno (Out–Mai)', tipTitle:'Dica do dia', uv:'Índice UV', wave:'Altura de Onda', wind:'Vento', conditions:{0:'Excelente',1:'Bom',2:'Razoável',3:'Mau'} },
  EN:{ title:'Beaches', sub:'Vila Real de Santo António · Algarve', seaTemp:'Sea Temperature', seaConditions:'Today\'s Conditions', flagGuide:'Flag Guide', beaches:'Nearby Beaches', parking:'Parking', bar:'Bar', wc:'WC', directions:'Navigate', loading:'Loading marine data...', summer:'Summer (Jun–Sep)', winter:'Winter (Oct–May)', tipTitle:'Tip of the day', uv:'UV Index', wave:'Wave Height', wind:'Wind', conditions:{0:'Excellent',1:'Good',2:'Fair',3:'Poor'} },
  ES:{ title:'Playas', sub:'Vila Real de Santo António · Algarve', seaTemp:'Temperatura del Mar', seaConditions:'Condiciones de Hoy', flagGuide:'Guía de Banderas', beaches:'Playas Cercanas', parking:'Aparcamiento', bar:'Bar', wc:'WC', directions:'Navegar', loading:'Cargando datos marinos...', summer:'Verano (Jun–Sep)', winter:'Invierno (Oct–May)', tipTitle:'Consejo del día', uv:'Índice UV', wave:'Altura Olas', wind:'Viento', conditions:{0:'Excelente',1:'Buenas',2:'Regulares',3:'Malas'} },
  FR:{ title:'Plages', sub:'Vila Real de Santo António · Algarve', seaTemp:'Température de la Mer', seaConditions:'Conditions du Jour', flagGuide:'Guide des Drapeaux', beaches:'Plages Proches', parking:'Parking', bar:'Bar', wc:'WC', directions:'Naviguer', loading:'Chargement des données marines...', summer:'Été (Jun–Sep)', winter:'Hiver (Oct–Mai)', tipTitle:'Conseil du jour', uv:'Indice UV', wave:'Hauteur des Vagues', wind:'Vent', conditions:{0:'Excellentes',1:'Bonnes',2:'Correctes',3:'Mauvaises'} },
  DE:{ title:'Strände', sub:'Vila Real de Santo António · Algarve', seaTemp:'Meerestemperatur', seaConditions:'Heutige Bedingungen', flagGuide:'Flaggenführer', beaches:'Nahe Strände', parking:'Parkplatz', bar:'Bar', wc:'WC', directions:'Navigieren', loading:'Marine Daten laden...', summer:'Sommer (Jun–Sep)', winter:'Winter (Okt–Mai)', tipTitle:'Tipp des Tages', uv:'UV-Index', wave:'Wellenhöhe', wind:'Wind', conditions:{0:'Ausgezeichnet',1:'Gut',2:'Mäßig',3:'Schlecht'} },
}

function getConditionLevel(wx) {
  if (!wx) return 0
  const code = wx.weathercode || 0
  if (code >= 80) return 3
  if (code >= 51) return 2
  if (code >= 3)  return 1
  return 0
}

export default function Beaches({ lang, onNav }) {
  const L = lang || 'PT'
  const t = TR[L] || TR.PT
  const [marine, setMarine] = useState(null)
  const [wx, setWx]         = useState(null)

  useEffect(() => {
    // Weather
    fetch('https://api.open-meteo.com/v1/forecast?latitude=37.1948&longitude=-7.4161&current=temperature_2m,weathercode,windspeed_10m&daily=uv_index_max&timezone=Europe/Lisbon&forecast_days=1')
      .then(r => r.json()).then(d => { if (d?.current) setWx(d) }).catch(() => {})
    // Marine (Open-Meteo Marine API)
    fetch('https://marine-api.open-meteo.com/v1/marine?latitude=37.15&longitude=-7.35&current=wave_height,wave_direction,sea_surface_temperature&timezone=Europe/Lisbon')
      .then(r => r.json()).then(d => { if (d?.current) setMarine(d.current) }).catch(() => {})
  }, [])

  const month        = new Date().getMonth() // 0-indexed
  const isSummer     = month >= 5 && month <= 8
  const seaTemp      = marine?.sea_surface_temperature ? Math.round(marine.sea_surface_temperature) : (isSummer ? '19–22' : '14–17')
  const waveH        = marine?.wave_height ? marine.wave_height.toFixed(1) : '—'
  const windSpd      = wx?.current?.windspeed_10m ? Math.round(wx.current.windspeed_10m) : '—'
  const uvMax        = wx?.daily?.uv_index_max?.[0]
  const condLevel    = getConditionLevel(wx?.current)
  const condLabel    = t.conditions[condLevel]

  const condColor    = ['#059669','#D97706','#EA580C','#DC2626'][condLevel]
  const condBg       = ['#ECFDF5','#FFFBEB','#FFF7ED','#FEF2F2'][condLevel]

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background:'linear-gradient(160deg,#062040 0%,#0B3060 100%)', padding:'18px 20px 18px', paddingTop:'calc(18px + env(safe-area-inset-top,0px))' }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-.3px' }}>{t.title}</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,.38)', marginTop:2 }}>{t.sub}</div>
      </div>

      <div style={{ padding:'14px 16px 40px' }}>

        {/* Sea temp + conditions row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
          {/* Sea temp */}
          <div className="card" style={{ padding:'16px', textAlign:'center', background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)' }}>
            <div style={{ fontSize:28, marginBottom:6 }}>🌊</div>
            <div style={{ fontSize:24, fontWeight:900, color:'#1D4ED8' }}>
              {typeof seaTemp === 'number' ? seaTemp + '°C' : seaTemp + '°C'}
            </div>
            <div style={{ fontSize:10, color:'#1D4ED8', fontWeight:700, marginTop:3 }}>{t.seaTemp}</div>
          </div>

          {/* Conditions */}
          <div className="card" style={{ padding:'16px', textAlign:'center', background:condBg }}>
            <div style={{ fontSize:28, marginBottom:6 }}>🏖️</div>
            <div style={{ fontSize:18, fontWeight:900, color:condColor }}>{condLabel}</div>
            <div style={{ fontSize:10, color:condColor, fontWeight:700, marginTop:3 }}>{t.seaConditions}</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="card" style={{ marginBottom:12 }}>
          <div style={{ display:'flex' }}>
            {[
              { icon:'🌊', val: waveH !== '—' ? waveH + 'm' : '—', label:t.wave },
              { icon:'💨', val: windSpd !== '—' ? windSpd + ' km/h' : '—', label:t.wind },
              { icon:'☀️', val: uvMax != null ? uvMax.toFixed(1) : '—', label:t.uv },
            ].map((s,i) => (
              <div key={i} style={{ flex:1, padding:'14px 8px', textAlign:'center', borderRight:i<2?'1px solid var(--surface)':'none' }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontSize:16, fontWeight:800, color:'var(--ink)' }}>{s.val}</div>
                <div style={{ fontSize:9, color:'var(--ink-20)', fontWeight:700, textTransform:'uppercase', letterSpacing:.5, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal temps */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
          <div style={{ background: isSummer ? '#FFF7ED' : '#F3F4F6', border:`1px solid ${isSummer ? '#FDE68A' : '#E2E8F0'}`, borderRadius:14, padding:'14px', textAlign:'center' }}>
            <div style={{ fontSize:22, marginBottom:4 }}>☀️</div>
            <div style={{ fontSize:18, fontWeight:900, color: isSummer ? '#D97706' : '#6B7280' }}>18–22°C</div>
            <div style={{ fontSize:10, fontWeight:700, color: isSummer ? '#D97706' : '#6B7280', marginTop:2 }}>{t.summer}</div>
            {isSummer && <div style={{ fontSize:9, background:'#D97706', color:'#fff', borderRadius:50, padding:'1px 8px', marginTop:4, display:'inline-block' }}>✓ AGORA</div>}
          </div>
          <div style={{ background: !isSummer ? '#EFF6FF' : '#F3F4F6', border:`1px solid ${!isSummer ? '#BFDBFE' : '#E2E8F0'}`, borderRadius:14, padding:'14px', textAlign:'center' }}>
            <div style={{ fontSize:22, marginBottom:4 }}>🌧️</div>
            <div style={{ fontSize:18, fontWeight:900, color: !isSummer ? '#1D4ED8' : '#6B7280' }}>14–17°C</div>
            <div style={{ fontSize:10, fontWeight:700, color: !isSummer ? '#1D4ED8' : '#6B7280', marginTop:2 }}>{t.winter}</div>
            {!isSummer && <div style={{ fontSize:9, background:'#1D4ED8', color:'#fff', borderRadius:50, padding:'1px 8px', marginTop:4, display:'inline-block' }}>✓ AGORA</div>}
          </div>
        </div>

        {/* Flag guide */}
        <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>{t.flagGuide}</div>
        <div className="card" style={{ marginBottom:16 }}>
          {FLAG_INFO.map((f,i,arr) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
              <span style={{ fontSize:20 }}>{f.flag}</span>
              <span style={{ fontSize:13, color:'var(--ink-70)' }}>{f.l[L]}</span>
            </div>
          ))}
        </div>

        {/* Beaches list */}
        <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>{t.beaches}</div>
        <div className="card">
          {BEACHES.map((b,i,arr) => (
            <div key={b.id} style={{ padding:'14px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'#F0F9FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>🏖️</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--ink)' }}>{b.name}</div>
                  <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{b.note[L]} · {b.dist}</div>
                </div>
                <span style={{ fontSize:20 }}>{b.flag}</span>
              </div>

              {/* Amenities + directions */}
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                {b.parking && <span style={{ fontSize:10, fontWeight:700, background:'var(--surface)', color:'var(--ink-40)', padding:'2px 8px', borderRadius:50, border:'1px solid var(--border)' }}>🅿️ {t.parking}</span>}
                {b.bar     && <span style={{ fontSize:10, fontWeight:700, background:'var(--surface)', color:'var(--ink-40)', padding:'2px 8px', borderRadius:50, border:'1px solid var(--border)' }}>🍹 {t.bar}</span>}
                {b.wc      && <span style={{ fontSize:10, fontWeight:700, background:'var(--surface)', color:'var(--ink-40)', padding:'2px 8px', borderRadius:50, border:'1px solid var(--border)' }}>🚿 {t.wc}</span>}
                <button
                  aria-label={t.directions}
                  onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination='+b.lat+','+b.lng+'&travelmode=driving','_blank')}
                  style={{ marginLeft:'auto', padding:'5px 12px', background:'var(--navy)', color:'#fff', border:'none', borderRadius:50, fontSize:11, fontWeight:700, cursor:'pointer' }}
                >🧭 {t.directions}</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}