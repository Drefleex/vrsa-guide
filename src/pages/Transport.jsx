import { useState, useEffect } from 'react'
import { tr } from '../utils/i18n'
import { FERRY_TIMES, TRAIN_TIMES, CP_TRAINS, toMin, fmtEta } from '../data/transport'

const MODES = [
  { k:'ferry',  icon:'⛴️',  color:'#1D4ED8', bg:'#EFF6FF' },
  { k:'train',  icon:'🚂',  color:'#059669', bg:'#ECFDF5' },
  { k:'bus',    icon:'🚌',  color:'#D97706', bg:'#FFFBEB' },
  { k:'taxi',   icon:'🚖',  color:'#7C3AED', bg:'#F5F3FF' },
  { k:'airport',icon:'✈️', color:'#0891B2', bg:'#ECFEFF' },
  { k:'car',    icon:'🚗',  color:'#64748B', bg:'var(--surface)' },
]

export default function Transport({ lang }) {
  const L = lang || 'PT'
  const t = tr('transport', L)
  const [mode, setMode]   = useState('ferry')
  const [_tick, setTick]  = useState(0)
  useEffect(() => { const iv = setInterval(()=>setTick(x=>x+1),60000); return ()=>clearInterval(iv) }, [])

  const nm        = new Date().getHours()*60 + new Date().getMinutes()
  const nextFerry = FERRY_TIMES.find(f => toMin(f) > nm)
  const nextTrain = TRAIN_TIMES.find(f => toMin(f.dep) > nm)
  const nextCP    = CP_TRAINS.find(f => toMin(f.dep) > nm)

  return (
    <div className="page" style={{ display:'flex', flexDirection:'column' }}>

      {/* Hero */}
      <div style={{
        background: 'url("/images/transport_hero_hr.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '18px 20px 0',
        paddingTop: 'calc(64px + env(safe-area-inset-top,0px))',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        {/* Cinematic gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.95) 100%)' }} />
        
        <div style={{ position:'relative', zIndex:1, fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'-.5px', textShadow: '0 2px 14px rgba(0,0,0,0.5)', marginBottom:4 }}>{t.title}</div>
        <div style={{ position:'relative', zIndex:1, fontSize:12, fontWeight:700, color:'rgba(255,255,255,.8)', textShadow: '0 2px 8px rgba(0,0,0,0.5)', letterSpacing: '.5px', marginBottom:18 }}>{t.sub}</div>

        {/* Next departures mini tiles */}
        <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
          <div onClick={() => setMode('ferry')} style={{ background:'rgba(29,78,216,.35)', border:'1px solid rgba(29,78,216,.5)', borderRadius:14, padding:'12px 14px', cursor:'pointer' }}>
            <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.45)', letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>⛴️ {t.ferry} · {t.toAyamonte}</div>
            {nextFerry ? <><div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{nextFerry}</div><div style={{ fontSize:11, color:'#93C5FD', fontWeight:700, marginTop:2 }}>{fmtEta(nextFerry)}</div></> : <div style={{ fontSize:12, color:'rgba(255,255,255,.35)' }}>{t.noMore}</div>}
          </div>
          <div onClick={() => setMode('train')} style={{ background:'rgba(5,150,105,.3)', border:'1px solid rgba(5,150,105,.5)', borderRadius:14, padding:'12px 14px', cursor:'pointer' }}>
            <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.45)', letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>🚆 CP → Faro</div>
            {nextCP ? <><div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{nextCP.dep}</div><div style={{ fontSize:11, color:'#6EE7B7', fontWeight:700, marginTop:2 }}>{fmtEta(nextCP.dep)}</div></> : <div style={{ fontSize:12, color:'rgba(255,255,255,.35)' }}>{t.noMore}</div>}
          </div>
        </div>

        {/* Mode tabs */}
        <div role="tablist" aria-label={t.title} style={{ position:'relative', zIndex:1, display:'flex', gap:6, overflowX:'auto', paddingBottom:16 }}>
          {MODES.map(m => (
            <button key={m.k} role="tab" aria-selected={mode===m.k} aria-controls={`panel-${m.k}`} onClick={() => setMode(m.k)} style={{ flexShrink:0, display:'flex', alignItems:'center', gap:5, padding:'6px 14px', borderRadius:50, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, transition:'all .15s', background: mode===m.k ? '#fff' : 'rgba(255,255,255,.1)', color: mode===m.k ? 'var(--navy)' : 'rgba(255,255,255,.6)' }}>
              <span style={{ fontSize:14 }}>{m.icon}</span>{t[m.k]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px 40px' }}>

        {/* ── FERRY ── */}
        {mode==='ferry' && (
          <div id="panel-ferry" role="tabpanel">
            <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:12, padding:'11px 14px', marginBottom:12, fontSize:12, color:'#1E40AF', fontWeight:600 }}>⚠️ {t.ferryNote}</div>
            <div className="card">
              <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--surface)', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:22 }}>⛴️</span>
                <div><div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>VRSA → Ayamonte</div><div style={{ fontSize:11, color:'var(--ink-40)' }}>Cais de Embarque Transguadiana</div></div>
                <a href="https://maps.google.com/?q=37.1970,-7.4132" target="_blank" rel="noopener noreferrer" style={{ marginLeft:'auto', background:'var(--blue-lt)', color:'var(--blue)', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:8, textDecoration:'none' }}>📍</a>
              </div>
              {FERRY_TIMES.map((f,i,arr) => {
                const past=toMin(f)<=nm, isNext=f===nextFerry, e=fmtEta(f)
                return (
                  <div key={i} className={`sched-row ${past?'past':''} ${isNext?'next-dep':''}`} style={{ borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
                    <span className="sched-time">{f}</span>
                    <span style={{ flex:1, fontSize:12, color: isNext?'var(--blue)':'var(--ink-40)' }}>→ Ayamonte (15 min)</span>
                    {isNext && <span className="badge badge-blue">{t.next}</span>}
                    {!isNext && e && <span style={{ fontSize:11, fontWeight:700, color:'var(--mint)' }}>{e}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── TRAIN ── */}
        {mode==='train' && (
          <div id="panel-train" role="tabpanel">

            {/* CP Regional */}
            <div style={{ background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:12, padding:'11px 14px', marginBottom:12, fontSize:12, color:'#065F46', fontWeight:600 }}>🚆 CP Linha do Algarve · VRSA → Faro ~1h10 · VRSA → Lagos ~2h30 · cp.pt</div>
            <div className="card" style={{ marginBottom:16 }}>
              <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--surface)', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:22 }}>🚆</span>
                <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>CP Regional — VRSA → Lagos</div><div style={{ fontSize:11, color:'var(--ink-40)' }}>via Tavira · Faro · Loulé · Albufeira · Portimão</div></div>
                <a href="https://www.cp.pt" target="_blank" rel="noopener noreferrer" style={{ background:'var(--mint-lt)', color:'var(--mint)', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:8, textDecoration:'none' }}>cp.pt</a>
              </div>
              {CP_TRAINS.map((tr,i,arr) => {
                const past=toMin(tr.dep)<=nm, isNext=tr===nextCP
                return (
                  <div key={i} className={`sched-row ${past?'past':''} ${isNext?'next-dep':''}`} style={{ borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
                    <span className="sched-time">{tr.dep}</span>
                    <span style={{ flex:1, fontSize:12, color: isNext?'var(--blue)':'var(--ink-40)' }}>Faro {tr.faro} · {tr.train}</span>
                    {isNext && <span className="badge badge-blue">{t.next}</span>}
                    {!isNext && fmtEta(tr.dep) && <span style={{ fontSize:11, fontWeight:700, color:'var(--mint)' }}>{fmtEta(tr.dep)}</span>}
                  </div>
                )
              })}
            </div>

            {/* Comboio Turístico */}
            <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:12, padding:'11px 14px', marginBottom:12, fontSize:12, color:'#14532D', fontWeight:600 }}>🚂 €1,00 · Cada 30 min · Pausa almoço 13h–14h · touristtrainvrsa.com</div>
            <div className="card">
              <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--surface)', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:22 }}>🚂</span>
                <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>Comboio Turístico VRSA</div><div style={{ fontSize:11, color:'var(--ink-40)' }}>Bombeiros → Praia → Farol · 6 paragens</div></div>
                <a href="https://touristtrainvrsa.com" target="_blank" rel="noopener noreferrer" style={{ background:'var(--mint-lt)', color:'var(--mint)', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:8, textDecoration:'none' }}>🌐</a>
              </div>
              {TRAIN_TIMES.map((tr,i,arr) => {
                const past=toMin(tr.dep)<=nm, isNext=tr===nextTrain
                const isBreak = tr.dep === '14:00'
                return (
                  <div key={i}>
                    {isBreak && <div style={{ padding:'6px 16px', fontSize:11, color:'var(--ink-40)', fontWeight:600, background:'var(--surface)', textAlign:'center' }}>⏸ Pausa almoço 13:00–14:00</div>}
                    <div className={`sched-row ${past?'past':''} ${isNext?'next-dep':''}`} style={{ borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
                      <span className="sched-time">{tr.dep}</span>
                      <span style={{ flex:1, fontSize:12, color: isNext?'var(--blue)':'var(--ink-40)' }}>→ Farol (circuito completo)</span>
                      {isNext && <span className="badge badge-blue">{t.next}</span>}
                      {!isNext && fmtEta(tr.dep) && <span style={{ fontSize:11, fontWeight:700, color:'var(--mint)' }}>{fmtEta(tr.dep)}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── BUS ── */}
        {mode==='bus' && (
          <div id="panel-bus" role="tabpanel">
            <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:'11px 14px', marginBottom:12, fontSize:12, color:'#92400E', fontWeight:600 }}>🚌 VAMUS Linha 67 · VRSA Terminal → Faro Terminal · ~1h50 · vamus.pt</div>
            {/* Linha 67 — horários reais VRSA→Faro */}
            <div className="card" style={{ marginBottom:10 }}>
              <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--surface)', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:20 }}>🚌</span>
                <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>Linha 67 — VRSA → Faro</div><div style={{ fontSize:11, color:'var(--ink-40)' }}>via Monte Gordo · Castro Marim · Tavira</div></div>
                <a href="https://vamus.pt" target="_blank" rel="noopener noreferrer" style={{ background:'#FFFBEB', color:'#D97706', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:8, textDecoration:'none' }}>vamus.pt</a>
              </div>
              {[
                {dep:'07:00', arr:'08:50', days:{PT:'Diário',          EN:'Daily',       ES:'Diario',    FR:'Quotidien', DE:'Täglich'}},
                {dep:'08:15', arr:'10:05', days:{PT:'Seg–Sex',         EN:'Mon–Fri',     ES:'Lun–Vie',   FR:'Lun–Ven',   DE:'Mo–Fr'}},
                {dep:'10:00', arr:'11:55', days:{PT:'Diário',          EN:'Daily',       ES:'Diario',    FR:'Quotidien', DE:'Täglich'}},
                {dep:'16:30', arr:'18:20', days:{PT:'Diário',          EN:'Daily',       ES:'Diario',    FR:'Quotidien', DE:'Täglich'}},
                {dep:'18:00', arr:'19:50', days:{PT:'Diário',          EN:'Daily',       ES:'Diario',    FR:'Quotidien', DE:'Täglich'}},
                {dep:'18:30', arr:null,    days:{PT:'Seg–Sex',         EN:'Mon–Fri',     ES:'Lun–Vie',   FR:'Lun–Ven',   DE:'Mo–Fr'}},
              ].map((b,i,arr) => {
                const past2=toMin(b.dep)<=nm
                const isNext2=!past2&&arr.find(x=>toMin(x.dep)>nm)===b
                return (
                  <div key={i} className={`sched-row ${past2?'past':''} ${isNext2?'next-dep':''}`} style={{ borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
                    <span className="sched-time">{b.dep}</span>
                    <span style={{ flex:1, fontSize:12, color:isNext2?'var(--blue)':'var(--ink-40)' }}>
                      {b.arr ? `Faro ${b.arr}` : 'Faro (sem paragem Terminal)'} · <span style={{ fontSize:11 }}>{b.days[L]||b.days.PT}</span>
                    </span>
                    {isNext2 && <span className="badge badge-blue">{t.next}</span>}
                    {!isNext2 && fmtEta(b.dep) && <span style={{ fontSize:11, fontWeight:700, color:'var(--mint)' }}>{fmtEta(b.dep)}</span>}
                  </div>
                )
              })}
            </div>

            {/* Faro → VRSA */}
            <div className="card" style={{ marginTop:10 }}>
              <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--surface)', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:20 }}>🚌</span>
                <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>Linha 67 — Faro → VRSA</div><div style={{ fontSize:11, color:'var(--ink-40)' }}>via Tavira · Castro Marim · Monte Gordo</div></div>
              </div>
              {[
                {dep:'07:15', days:{PT:'Diário',  EN:'Daily',   ES:'Diario',  FR:'Quotidien', DE:'Täglich'}},
                {dep:'09:30', days:{PT:'Diário',  EN:'Daily',   ES:'Diario',  FR:'Quotidien', DE:'Täglich'}},
                {dep:'11:30', days:{PT:'Seg–Sex', EN:'Mon–Fri', ES:'Lun–Vie', FR:'Lun–Ven',   DE:'Mo–Fr'}},
                {dep:'13:30', days:{PT:'Diário',  EN:'Daily',   ES:'Diario',  FR:'Quotidien', DE:'Täglich'}},
                {dep:'18:30', days:{PT:'Diário',  EN:'Daily',   ES:'Diario',  FR:'Quotidien', DE:'Täglich'}},
              ].map((b,i,arr) => {
                const past2=toMin(b.dep)<=nm
                const isNext2=!past2&&arr.find(x=>toMin(x.dep)>nm)===b
                return (
                  <div key={i} className={`sched-row ${past2?'past':''} ${isNext2?'next-dep':''}`} style={{ borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
                    <span className="sched-time">{b.dep}</span>
                    <span style={{ flex:1, fontSize:12, color:isNext2?'var(--blue)':'var(--ink-40)' }}>→ VRSA · <span style={{ fontSize:11 }}>{b.days[L]||b.days.PT}</span></span>
                    {isNext2 && <span className="badge badge-blue">{t.next}</span>}
                    {!isNext2 && fmtEta(b.dep) && <span style={{ fontSize:11, fontWeight:700, color:'var(--mint)' }}>{fmtEta(b.dep)}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── TAXI ── */}
        {mode==='taxi' && (
          <div id="panel-taxi" role="tabpanel">
            {[
              { name:'Táxi Pinho', phone:'+351 963 847 520', avail:{PT:'Disponível 24h',EN:'Available 24h',ES:'Disponible 24h',FR:'Disponible 24h',DE:'Verfügbar 24h'}, note:{PT:'Serviço de táxi local de confiança. Aceita pagamento em numerário.',EN:'Trusted local taxi service. Cash payment.',ES:'Servicio de taxi local de confianza.',FR:'Service de taxi local de confiance.',DE:'Zuverlässiger lokaler Taxiservice.'} },
              { name:'Táxi Rádio Algarve', phone:'+351 289 791 060', avail:{PT:'Central 24h',EN:'Central 24h',ES:'Central 24h',FR:'Central 24h',DE:'Zentrale 24h'}, note:{PT:'Central de táxi regional do Algarve.',EN:'Regional Algarve taxi centre.',ES:'Central de taxis regional del Algarve.',FR:'Centrale de taxis régionale de l\'Algarve.',DE:'Regionale Algarve Taxizentrale.'} },
            ].map((tx,i) => (
              <a key={i} href={`tel:${tx.phone.replace(/\s/g,'')}`} style={{ textDecoration:'none', display:'block', marginBottom:10 }}>
                <div className="card" style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:'#F5F3FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>🚖</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:'var(--ink)' }}>{tx.name}</div>
                    <div style={{ fontSize:12, color:'var(--blue)', fontWeight:700, marginTop:2 }}>{tx.phone}</div>
                    <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:2 }}>{tx.note[L]||tx.note.PT}</div>
                  </div>
                  <span style={{ fontSize:22, color:'var(--mint)' }}>📞</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ── AIRPORT ── */}
        {mode==='airport' && (
          <div id="panel-airport" role="tabpanel">
            <div className="card" style={{ padding:'16px', marginBottom:12, background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:40 }}>✈️</span>
                <div>
                  <div style={{ fontSize:17, fontWeight:800, color:'var(--ink)' }}>Aeroporto de Faro</div>
                  <div style={{ fontSize:12, color:'var(--blue)', fontWeight:700 }}>FAO · ~65 km · ~50 min</div>
                  <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:4 }}>{t.trainNote}</div>
                </div>
              </div>
            </div>
            <div className="card">
              {[
                { icon:'🚂', label:{PT:'Comboio directo',EN:'Direct train',ES:'Tren directo',FR:'Train direct',DE:'Direktzug'}, val:{PT:'~1h10 · a partir de €7,10',EN:'~1h10 · from €7.10',ES:'~1h10 · desde €7,10',FR:'~1h10 · à partir de €7,10',DE:'~1h10 · ab €7,10'} },
                { icon:'🚌', label:{PT:'Autocarro EVA',EN:'EVA Bus',ES:'Autobús EVA',FR:'Bus EVA',DE:'EVA Bus'}, val:{PT:'~50 min · ~€6',EN:'~50 min · ~€6',ES:'~50 min · ~€6',FR:'~50 min · ~€6',DE:'~50 min · ~€6'} },
                { icon:'🚖', label:{PT:'Táxi / Transfer',EN:'Taxi / Transfer',ES:'Taxi / Transfer',FR:'Taxi / Transfer',DE:'Taxi / Transfer'}, val:{PT:'~50 min · ~€50–70',EN:'~50 min · ~€50–70',ES:'~50 min · ~€50–70',FR:'~50 min · ~€50–70',DE:'~50 min · ~€50–70'} },
                { icon:'🚗', label:{PT:'Carro alugado',EN:'Rental car',ES:'Coche alquilado',FR:'Voiture de location',DE:'Mietwagen'}, val:{PT:'~45 min pela N125',EN:'~45 min via N125',ES:'~45 min por la N125',FR:'~45 min par la N125',DE:'~45 min über N125'} },
              ].map((item,i,arr) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
                  <span style={{ fontSize:22 }}>{item.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{item.label[L]||item.label.PT}</div>
                  </div>
                  <div style={{ fontSize:12, color:'var(--ink-40)', textAlign:'right' }}>{item.val[L]||item.val.PT}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CAR ── */}
        {mode==='car' && (
          <div id="panel-car" role="tabpanel">
            <div className="sec-label">{t.parkings}</div>
            <div className="card" style={{ marginBottom:14 }}>
              {[
                { name:'Parque Estacionamento Central', dist:'0 m', free:true, lat:37.174825, lng:-7.421436 },
                { name:'Parque Autocaravanas',          dist:'500 m', free:true, lat:37.199407, lng:-7.415085 },
              ].map((p,i,arr) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
                  <span style={{ fontSize:22 }}>🅿️</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{p.name}</div>
                    <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{p.dist}</div>
                  </div>
                  <span style={{ background:'#DCFCE7', color:'#15803D', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:50 }}>{L==='EN'?'Free':L==='FR'?'Gratuit':L==='DE'?'Kostenlos':L==='ES'?'Gratis':'Grátis'}</span>
                  <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`,'_blank','noopener,noreferrer')} style={{ width:32, height:32, background:'var(--blue-lt)', border:'none', borderRadius:8, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>🧭</button>
                </div>
              ))}
            </div>

            <div className="sec-label">{t.carRentals}</div>
            <div className="card">
              {[
                { name:'Europcar VRSA',  phone:'+351 281 544 934', link:'https://www.europcar.pt' },
                { name:'Hertz Algarve',  phone:'+351 289 818 695', link:'https://www.hertz.pt' },
              ].map((r,i,arr) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
                  <span style={{ fontSize:22 }}>🚗</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{r.name}</div>
                    <div style={{ fontSize:12, color:'var(--blue)', marginTop:1 }}>{r.phone}</div>
                  </div>
                  <a href={`tel:${r.phone.replace(/\s/g,'')}`}>
                    <button style={{ padding:'5px 10px', background:'var(--blue-lt)', border:'none', borderRadius:8, fontSize:12, fontWeight:700, color:'var(--blue)', cursor:'pointer' }}>📞</button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}