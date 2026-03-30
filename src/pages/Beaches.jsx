import { useState, useEffect } from 'react'
import { tr } from '../utils/i18n'

const BEACHES = [
  { id:1, name:'Praia de VRSA',            photo:'/images/praia_vila_real_santo_antonio.webp', dist:'2.5 km', lat:37.173516, lng:-7.422291, flag:'🟢', note:{PT:'Bandeira Azul · Águas calmas',EN:'Blue Flag · Calm waters',ES:'Bandera Azul · Aguas tranquilas',FR:'Pavillon Bleu · Eaux calmes',DE:'Blaue Flagge · Ruhiges Wasser'}, parking:true, bar:true, wc:true },
  { id:2, name:'Praia de Monte Gordo',      photo:'/images/praia_montegordo.webp',              dist:'5 km',   lat:37.177989, lng:-7.449761, flag:'🟢', note:{PT:'Bandeira Azul · Aldeia piscatória',EN:'Blue Flag · Fishing village nearby',ES:'Bandera Azul · Pueblo pescador',FR:'Pavillon Bleu · Village de pêcheurs',DE:'Blaue Flagge · Fischerort'}, parking:true, bar:true, wc:true },
  { id:3, name:'Praia da Ponta da Areia',   photo:'/images/praia_da_lota.webp',                 dist:'3 km',   lat:37.171226, lng:-7.411609, flag:'🟡', note:{PT:'Correntes · Cuidado ao nadar',EN:'Currents · Take care when swimming',ES:'Corrientes · Precaución al nadar',FR:'Courants · Prudence en nageant',DE:'Strömungen · Vorsicht beim Schwimmen'}, parking:true, bar:false, wc:true },
  { id:4, name:'Praia Verde',               photo:'/images/praia_verde.webp',                   dist:'9 km',   lat:37.170101, lng:-7.49767,  flag:'🟢', note:{PT:'Pinheiros · Tranquila',EN:'Pine forest · Quiet and peaceful',ES:'Pinos · Tranquila',FR:'Forêt de pins · Tranquille',DE:'Kiefernwald · Ruhig'}, parking:true, bar:true, wc:false },
  { id:5, name:'Praia das Amélias',         photo:'/images/praia_do_cabeo.webp',                dist:'3.5 km', lat:37.170132, lng:-7.407478, flag:'🟢', note:{PT:'Isolada · Natureza selvagem',EN:'Secluded · Wild nature',ES:'Aislada · Naturaleza salvaje',FR:'Isolée · Nature sauvage',DE:'Abgelegen · Wilde Natur'}, parking:false, bar:false, wc:false },
]

const FLAG_INFO = [
  { flag:'🟢', l:{PT:'Verde — Seguro para nadar',EN:'Green — Safe to swim',ES:'Verde — Seguro para nadar',FR:'Vert — Sûr pour nager',DE:'Grün — Sicher zum Schwimmen'} },
  { flag:'🟡', l:{PT:'Amarelo — Precaução',EN:'Yellow — Caution',ES:'Amarillo — Precaución',FR:'Jaune — Prudence',DE:'Gelb — Vorsicht'} },
  { flag:'🔴', l:{PT:'Vermelho — Proibido nadar',EN:'Red — No swimming',ES:'Rojo — Prohibido bañarse',FR:'Rouge — Baignade interdite',DE:'Rot — Baden verboten'} },
  { flag:'🟣', l:{PT:'Roxo — Animais marinhos',EN:'Purple — Marine animals',ES:'Morado — Animales marinos',FR:'Violet — Animaux marins',DE:'Lila — Meerestiere'} },
]

function getConditionLevel(wx) {
  if (!wx) return 0
  const code = wx.weathercode || 0
  if (code >= 80) return 3
  if (code >= 51) return 2
  if (code >= 3)  return 1
  return 0
}

export default function Beaches({ lang, focusName, onFocusClear }) {
  const L = lang || 'PT'
  const t = tr('beaches', L)
  const [marine, setMarine] = useState(null)
  const [wx, setWx]         = useState(null)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    if (!focusName) return
    const found = BEACHES.find(b => b.name.toLowerCase().includes(focusName.toLowerCase()) || focusName.toLowerCase().includes(b.name.toLowerCase()))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (found) setDetail(found)
    onFocusClear?.()
  }, [focusName])

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

  // Tide simulation — ~6h cycle (filling/ebbing alternates every 6h)
  const hour         = new Date().getHours()
  const isFilling    = (hour >= 0 && hour < 6) || (hour >= 12 && hour < 18)
  const tideLabel    = {
    PT: { up: 'A Encher ⬆️', down: 'A Vazar ⬇️' },
    EN: { up: 'Filling ⬆️',  down: 'Ebbing ⬇️'  },
    ES: { up: 'Subiendo ⬆️', down: 'Bajando ⬇️' },
    FR: { up: 'Montante ⬆️', down: 'Descendante ⬇️' },
    DE: { up: 'Steigend ⬆️', down: 'Fallend ⬇️' },
  }
  const tide         = isFilling ? tideLabel[L]?.up : tideLabel[L]?.down
  const seaTemp      = marine?.sea_surface_temperature ? Math.round(marine.sea_surface_temperature) : (isSummer ? '19–22' : '14–17')
  const waveH        = marine?.wave_height ? marine.wave_height.toFixed(1) : '—'
  const windSpd      = wx?.current?.windspeed_10m ? Math.round(wx.current.windspeed_10m) : '—'
  const uvMax        = wx?.daily?.uv_index_max?.[0]
  const uvLevel      = uvMax != null ? (uvMax >= 8 ? { label: L==='EN'?'Very High':L==='ES'?'Muy Alto':L==='FR'?'Très élevé':L==='DE'?'Sehr hoch':'Muito Alto', color:'#DC2626' } : uvMax >= 6 ? { label: L==='EN'?'High':L==='ES'?'Alto':L==='FR'?'Élevé':L==='DE'?'Hoch':'Alto', color:'#EA580C' } : uvMax >= 3 ? { label: L==='EN'?'Moderate':L==='ES'?'Moderado':L==='FR'?'Modéré':L==='DE'?'Mäßig':'Moderado', color:'#D97706' } : { label: L==='EN'?'Low':L==='ES'?'Bajo':L==='FR'?'Faible':L==='DE'?'Niedrig':'Baixo', color:'#059669' }) : null
  const condLevel    = getConditionLevel(wx?.current)
  const condLabel    = t.conditions[condLevel]

  const condColor    = ['#059669','#D97706','#EA580C','#DC2626'][condLevel]
  const condBg       = ['#ECFDF5','#FFFBEB','#FFF7ED','#FEF2F2'][condLevel]

  // ── Detail view ──────────────────────────────────────────────
  if (detail) {
    const b = detail
    const navLabel = L==='EN'?'Navigate':L==='ES'?'Navegar':L==='FR'?'Naviguer':L==='DE'?'Navigieren':'Navegar'
    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        {/* Photo header */}
        <div style={{ position:'relative', height:220, flexShrink:0 }}>
          <img src={b.photo} alt={b.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,.35) 0%, transparent 50%, rgba(0,0,0,.55) 100%)' }} />
          <button onClick={() => setDetail(null)} style={{ position:'absolute', top:'calc(14px + env(safe-area-inset-top,0px))', left:14, width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.35)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <div style={{ position:'absolute', bottom:14, left:16, right:16 }}>
            <div style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-.3px', textShadow:'0 1px 4px rgba(0,0,0,.5)' }}>{b.name}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.8)', marginTop:3 }}>{b.note[L]} · {b.flag} · {b.dist}</div>
          </div>
        </div>

        <div style={{ overflowY:'auto', flex:1, padding:'16px 16px 40px' }}>
          {/* Conditions */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:14 }}>
            {[
              { icon:'🌊', val: waveH !== '—' ? waveH+'m' : '—', label:t.wave },
              { icon:'💨', val: windSpd !== '—' ? windSpd+' km/h' : '—', label:t.wind },
              { icon:'🌡️', val: typeof seaTemp==='number' ? seaTemp+'°C' : seaTemp+'°C', label:t.seaTemp },
            ].map((s,i) => (
              <div key={i} className="card" style={{ padding:'12px 8px', textAlign:'center' }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontSize:15, fontWeight:800, color:'var(--ink)' }}>{s.val}</div>
                <div style={{ fontSize:9, color:'var(--ink-20)', fontWeight:700, textTransform:'uppercase', letterSpacing:.5, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Amenities */}
          <div className="card" style={{ padding:'14px 16px', marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>{L==='EN'?'Amenities':L==='ES'?'Servicios':L==='FR'?'Équipements':L==='DE'?'Ausstattung':'Comodidades'}</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {b.parking ? <span style={{ fontSize:12, fontWeight:700, background:'var(--primary-lt)', color:'var(--primary)', padding:'5px 12px', borderRadius:50 }}>🅿️ {t.parking}</span> : <span style={{ fontSize:12, color:'var(--ink-20)', padding:'5px 12px', borderRadius:50, background:'var(--surface)' }}>🅿️ {L==='EN'?'No parking':L==='ES'?'Sin parking':'Sem parking'}</span>}
              {b.bar     ? <span style={{ fontSize:12, fontWeight:700, background:'var(--primary-lt)', color:'var(--primary)', padding:'5px 12px', borderRadius:50 }}>🍹 {t.bar}</span>     : <span style={{ fontSize:12, color:'var(--ink-20)', padding:'5px 12px', borderRadius:50, background:'var(--surface)' }}>🍹 {L==='EN'?'No bar':L==='ES'?'Sin bar':'Sem bar'}</span>}
              {b.wc      ? <span style={{ fontSize:12, fontWeight:700, background:'var(--primary-lt)', color:'var(--primary)', padding:'5px 12px', borderRadius:50 }}>🚿 {t.wc}</span>      : <span style={{ fontSize:12, color:'var(--ink-20)', padding:'5px 12px', borderRadius:50, background:'var(--surface)' }}>🚿 {L==='EN'?'No WC':L==='ES'?'Sin WC':'Sem WC'}</span>}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>{navLabel}</div>
          {[
            { icon:'🗺️', label:'Google Maps', sub:'Google LLC',  url:`https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}&travelmode=driving` },
            { icon:'🍎', label:'Apple Maps',  sub:'Apple Inc.',  url:`https://maps.apple.com/?daddr=${b.lat},${b.lng}&dirflg=d` },
            { icon:'🔵', label:'Waze',        sub:'Google LLC',  url:`https://waze.com/ul?ll=${b.lat},${b.lng}&navigate=yes` },
          ].map(({ icon, label, sub, url }) => (
            <button key={label} onClick={() => window.open(url,'_blank','noopener,noreferrer')} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 14px', background:'var(--white)', border:'1px solid var(--border-lt)', borderRadius:12, width:'100%', textAlign:'left', marginBottom:8, cursor:'pointer' }}>
              <span style={{ fontSize:28 }}>{icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--ink)' }}>{label}</div>
                <div style={{ fontSize:11, color:'var(--ink-20)' }}>{sub}</div>
              </div>
              <span style={{ color:'var(--ink-20)', fontSize:18 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'url("/images/beaches_hero_hr.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '18px 20px 24px',
        paddingTop: 'calc(64px + env(safe-area-inset-top,0px))',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Cinematic gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.95) 100%)' }} />
        
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'-.5px', textShadow: '0 2px 14px rgba(0,0,0,0.5)', marginBottom:4 }}>{t.title}</div>
          <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.8)', textShadow: '0 2px 8px rgba(0,0,0,0.5)', letterSpacing: '.5px' }}>{t.sub}</div>
        </div>
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

        {/* Stats glassmorphism widget */}
        <div style={{
          background: 'linear-gradient(160deg, #0369A1 0%, #0C4A6E 100%)',
          borderRadius: 20, padding: 3, marginBottom: 12,
          boxShadow: '0 8px 32px rgba(3,105,161,0.25)',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.2)',
            overflow: 'hidden',
          }}>
            {/* UV + Maré hero row */}
            <div style={{ display:'flex', padding:'18px 16px 14px' }}>
              {/* UV */}
              <div style={{ flex:1, textAlign:'center' }}>
                <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.65)', letterSpacing:1.3, textTransform:'uppercase', marginBottom:4 }}>{t.uv}</div>
                <div style={{ fontSize:44, fontWeight:900, color:'#fff', lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
                  {uvMax != null ? Math.round(uvMax) : '—'}
                </div>
                {uvLevel && (
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.8)', marginTop:5, background:'rgba(255,255,255,0.15)', borderRadius:50, padding:'2px 10px', display:'inline-block' }}>
                    {uvLevel.label}
                  </div>
                )}
              </div>
              {/* Divider */}
              <div style={{ width:1, background:'rgba(255,255,255,0.2)', margin:'4px 16px' }} />
              {/* Maré */}
              <div style={{ flex:1, textAlign:'center' }}>
                <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.65)', letterSpacing:1.3, textTransform:'uppercase', marginBottom:6 }}>
                  {L==='EN'?'Tide':L==='ES'?'Marea':L==='FR'?'Marée':L==='DE'?'Gezeiten':'Maré'}
                </div>
                <div style={{ fontSize:36, lineHeight:1, marginBottom:4 }}>{isFilling ? '🌊' : '↘️'}</div>
                <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>{tide}</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', marginTop:3 }}>
                  {L==='EN'?'Approximate':L==='ES'?'Aproximado':L==='FR'?'Approximatif':L==='DE'?'Ungefähr':'Aproximado'}
                </div>
              </div>
            </div>
            {/* Wave / Wind / SeaTemp bottom strip */}
            <div style={{ display:'flex', borderTop:'1px solid rgba(255,255,255,0.12)' }}>
              {[
                { icon:'🌊', val: waveH !== '—' ? waveH + 'm' : '—', label:t.wave },
                { icon:'💨', val: windSpd !== '—' ? windSpd + ' km/h' : '—', label:t.wind },
                { icon:'🌡️', val: typeof seaTemp === 'number' ? seaTemp + '°C' : seaTemp + '°C', label:t.seaTemp },
              ].map((s,i) => (
                <div key={i} style={{ flex:1, padding:'12px 6px', textAlign:'center', borderRight:i<2?'1px solid rgba(255,255,255,0.12)':'none' }}>
                  <div style={{ fontSize:18, marginBottom:2 }}>{s.icon}</div>
                  <div style={{ fontSize:15, fontWeight:800, color:'#fff' }}>{s.val}</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.55)', fontWeight:700, textTransform:'uppercase', letterSpacing:.5, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seasonal temps */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
          <div style={{
            background: isSummer ? 'linear-gradient(135deg,#EA580C,#F97316)' : 'linear-gradient(135deg,#E2E8F0,#CBD5E1)',
            borderRadius:16, padding:'16px', textAlign:'center',
            boxShadow: isSummer ? '0 6px 20px rgba(234,88,12,0.35)' : '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize:26, marginBottom:4 }}>☀️</div>
            <div style={{ fontSize:22, fontWeight:900, color: isSummer ? '#fff' : '#6B7280' }}>18–22°C</div>
            <div style={{ fontSize:10, fontWeight:700, color: isSummer ? 'rgba(255,255,255,0.85)' : '#6B7280', marginTop:2 }}>{t.summer}</div>
            {isSummer && <div style={{ fontSize:9, background:'rgba(255,255,255,0.25)', color:'#fff', borderRadius:50, padding:'2px 10px', marginTop:6, display:'inline-block', fontWeight:700 }}>✓ AGORA</div>}
          </div>
          <div style={{
            background: !isSummer ? 'linear-gradient(135deg,#1D4ED8,#3B82F6)' : 'linear-gradient(135deg,#E2E8F0,#CBD5E1)',
            borderRadius:16, padding:'16px', textAlign:'center',
            boxShadow: !isSummer ? '0 6px 20px rgba(29,78,216,0.35)' : '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize:26, marginBottom:4 }}>🌧️</div>
            <div style={{ fontSize:22, fontWeight:900, color: !isSummer ? '#fff' : '#6B7280' }}>14–17°C</div>
            <div style={{ fontSize:10, fontWeight:700, color: !isSummer ? 'rgba(255,255,255,0.85)' : '#6B7280', marginTop:2 }}>{t.winter}</div>
            {!isSummer && <div style={{ fontSize:9, background:'rgba(255,255,255,0.25)', color:'#fff', borderRadius:50, padding:'2px 10px', marginTop:6, display:'inline-block', fontWeight:700 }}>✓ AGORA</div>}
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
            <button key={b.id} onClick={() => setDetail(b)} style={{ display:'block', width:'100%', padding:'14px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none', background:'none', border:'none', textAlign:'left', cursor:'pointer' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <img src={b.photo} alt={b.name} loading="lazy" decoding="async" style={{ width:56, height:56, borderRadius:12, objectFit:'cover', flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--ink)' }}>{b.name}</div>
                  <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{b.note[L]} · {b.dist}</div>
                  <div style={{ display:'flex', gap:6, marginTop:6 }}>
                    {b.parking && <span style={{ fontSize:10, fontWeight:600, background:'var(--surface)', color:'var(--ink-40)', padding:'2px 7px', borderRadius:50, border:'1px solid var(--border)' }}>🅿️</span>}
                    {b.bar     && <span style={{ fontSize:10, fontWeight:600, background:'var(--surface)', color:'var(--ink-40)', padding:'2px 7px', borderRadius:50, border:'1px solid var(--border)' }}>🍹</span>}
                    {b.wc      && <span style={{ fontSize:10, fontWeight:600, background:'var(--surface)', color:'var(--ink-40)', padding:'2px 7px', borderRadius:50, border:'1px solid var(--border)' }}>🚿</span>}
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flexShrink:0 }}>
                  <span style={{ fontSize:20 }}>{b.flag}</span>
                  <span style={{ fontSize:16, color:'var(--ink-20)' }}>›</span>
                </div>
              </div>
            </button>
        ))}
        </div>

      </div>
    </div>
  )
}