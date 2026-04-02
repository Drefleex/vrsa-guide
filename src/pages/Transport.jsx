import { useState, useEffect } from 'react'
import { tr } from '../utils/i18n'
import { FERRY_TIMES, TRAIN_TIMES, TOURIST_TRAIN_STOPS, CP_TRAINS, toMin, fmtEta } from '../data/transport'

const MODES = [
  { k:'ferry',  icon:'⛴️',  color:'#1D4ED8', bg:'#EFF6FF' },
  { k:'train',  icon:'🚂',  color:'#059669', bg:'#ECFDF5' },
  { k:'bus',    icon:'🚌',  color:'#D97706', bg:'#FFFBEB' },
  { k:'taxi',   icon:'🚖',  color:'#7C3AED', bg:'#F5F3FF' },
  { k:'airport',icon:'✈️', color:'#0891B2', bg:'#ECFEFF' },
  { k:'car',    icon:'🚗',  color:'#64748B', bg:'var(--surface)' },
]

function StopPill({ time, label, bold, isNext }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:52 }}>
      <span style={{ fontSize: bold ? 14 : 12, fontWeight: bold ? 800 : 700, color: isNext ? '#1D4ED8' : 'var(--ink)', fontVariantNumeric:'tabular-nums' }}>{time}</span>
      <span style={{ fontSize:9, color:'var(--ink-40)', fontWeight:600, marginTop:1 }}>{label}</span>
    </div>
  )
}
function Arrow() {
  return <div style={{ flex:1, height:1, background:'var(--border)', margin:'0 2px', marginBottom:10 }} />
}

export default function Transport({ lang }) {
  const L = lang || 'PT'
  const t = tr('transport', L)
  const [mode, setMode]     = useState('ferry')
  const [busDir, setBusDir] = useState('vrsa2faro')
  const [_tick, setTick]    = useState(0)
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
                <a href="https://maps.google.com/?q=37.1970,-7.4132" style={{ marginLeft:'auto', background:'var(--blue-lt)', color:'var(--blue)', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:8, textDecoration:'none' }}>📍</a>
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
                <a href="https://www.cp.pt" style={{ background:'var(--mint-lt)', color:'var(--mint)', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:8, textDecoration:'none' }}>cp.pt</a>
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

            {/* Comboio Turístico — aviso sazonal */}
            <div style={{ background:'#FEF9C3', border:'1px solid #FDE047', borderRadius:12, padding:'11px 14px', marginBottom:12, fontSize:12, color:'#713F12', fontWeight:600 }}>
              🗓️ Sazonal · <strong>15 Jun – 15 Set</strong> · €1,30/pessoa · Grátis –4 anos · Cada 30 min
            </div>

            {/* Paragens */}
            <div className="card" style={{ marginBottom:12 }}>
              <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--surface)', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:22 }}>🚂</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>Comboio Turístico VRSA</div>
                  <div style={{ fontSize:11, color:'var(--ink-40)' }}>Circuito completo ~25 min · 6 paragens</div>
                </div>
                <a href="https://touristtrainvrsa.com" style={{ background:'#DCFCE7', color:'#16A34A', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:8, textDecoration:'none' }}>🌐</a>
              </div>
              {TOURIST_TRAIN_STOPS.map((s, i, arr) => (
                <div key={s.n} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderBottom: i < arr.length-1 ? '1px solid var(--surface)' : 'none' }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:'#16A34A', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>{s.n}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{s.name}</div>
                    <div style={{ fontSize:10, color:'var(--ink-40)' }}>{s.addr}</div>
                  </div>
                  {s.offset > 0 && <div style={{ fontSize:11, fontWeight:600, color:'var(--ink-40)' }}>+{s.offset}min</div>}
                </div>
              ))}
            </div>

            {/* Horários */}
            <div className="card">
              <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--surface)', fontSize:11, color:'var(--ink-40)', fontWeight:700, textTransform:'uppercase', letterSpacing:.5 }}>
                Partidas da Paragem 1 (Bombeiros)
              </div>
              {TRAIN_TIMES.map((entry, i, arr) => {
                const past = toMin(entry.dep) <= nm, isNext = entry === nextTrain
                const isBreak = entry.dep === '14:00'
                return (
                  <div key={i}>
                    {isBreak && <div style={{ padding:'6px 16px', fontSize:11, color:'var(--ink-40)', fontWeight:600, background:'var(--surface)', textAlign:'center' }}>⏸ Pausa almoço 13:00–14:00</div>}
                    <div className={`sched-row ${past?'past':''} ${isNext?'next-dep':''}`} style={{ borderBottom: i < arr.length-1 ? '1px solid var(--surface)' : 'none' }}>
                      <span className="sched-time">{entry.dep}</span>
                      <span style={{ flex:1, fontSize:12, color: isNext ? 'var(--blue)' : 'var(--ink-40)' }}>
                        → Farol {entry.peak && <span style={{ fontSize:10, color:'#D97706', fontWeight:700 }}>★ Jul/Ago</span>}
                      </span>
                      {isNext && <span className="badge badge-blue">{t.next}</span>}
                      {!isNext && fmtEta(entry.dep) && <span style={{ fontSize:11, fontWeight:700, color:'var(--mint)' }}>{fmtEta(entry.dep)}</span>}
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

            {/* Info + link */}
            <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:'11px 14px', marginBottom:12, fontSize:12, color:'#92400E', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span>🚌 VAMUS Linha 67 · ~1h50</span>
              <a href="https://vamus.pt" style={{ color:'#D97706', fontWeight:700, textDecoration:'none' }}>vamus.pt ↗</a>
            </div>

            {/* Toggle direção */}
            <div style={{ display:'flex', background:'var(--surface)', borderRadius:12, padding:4, marginBottom:14, gap:4 }}>
              <button onClick={() => setBusDir('vrsa2faro')} style={{ flex:1, padding:'9px 0', borderRadius:9, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, transition:'all .15s', background: busDir==='vrsa2faro' ? '#D97706' : 'transparent', color: busDir==='vrsa2faro' ? '#fff' : 'var(--ink-40)' }}>
                VRSA → Faro
              </button>
              <button onClick={() => setBusDir('faro2vrsa')} style={{ flex:1, padding:'9px 0', borderRadius:9, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, transition:'all .15s', background: busDir==='faro2vrsa' ? '#D97706' : 'transparent', color: busDir==='faro2vrsa' ? '#fff' : 'var(--ink-40)' }}>
                Faro → VRSA
              </button>
            </div>

            <div className="card">
              <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--surface)', fontSize:11, color:'var(--ink-40)', fontWeight:600 }}>
                {busDir==='vrsa2faro'
                  ? '📍 Terminal Rodoviário VRSA · via Monte Gordo · Castro Marim · Tavira'
                  : '📍 Terminal Rodoviário Faro · via Tavira · Castro Marim · Monte Gordo'}
              </div>

              {(busDir==='vrsa2faro' ? [
                {vrsa:'07:00', gordo:'07:07', tavira:'07:40', faro:'08:50', days:{PT:'Diário',       EN:'Daily',   ES:'Diario',  FR:'Quotidien', DE:'Täglich'}},
                {vrsa:'08:15', gordo:'08:22', tavira:'08:55', faro:'10:05', days:{PT:'Seg–Sex',      EN:'Mon–Fri', ES:'Lun–Vie', FR:'Lun–Ven',   DE:'Mo–Fr'}},
                {vrsa:'10:00', gordo:'10:07', tavira:'10:45', faro:'11:55', days:{PT:'Diário',       EN:'Daily',   ES:'Diario',  FR:'Quotidien', DE:'Täglich'}},
                {vrsa:'16:30', gordo:'16:37', tavira:'17:10', faro:'18:20', days:{PT:'Diário',       EN:'Daily',   ES:'Diario',  FR:'Quotidien', DE:'Täglich'}},
                {vrsa:'18:00', gordo:'18:07', tavira:'18:40', faro:'19:50', days:{PT:'Diário',       EN:'Daily',   ES:'Diario',  FR:'Quotidien', DE:'Täglich'}},
                {vrsa:'18:30', gordo:'18:37', tavira:'19:10', faro:null,    days:{PT:'Seg–Sex ⚠️ termina Tavira', EN:'Mon–Fri ⚠️ ends Tavira', ES:'Lun–Vie ⚠️ termina Tavira', FR:'Lun–Ven ⚠️ fin Tavira', DE:'Mo–Fr ⚠️ endet Tavira'}},
              ] : [
                {faro:'07:15', tavira:'08:15', gordo:'08:48', vrsa:'08:55', days:{PT:'Diário',  EN:'Daily',   ES:'Diario',  FR:'Quotidien', DE:'Täglich'}},
                {faro:'09:30', tavira:'10:30', gordo:'11:03', vrsa:'11:10', days:{PT:'Diário',  EN:'Daily',   ES:'Diario',  FR:'Quotidien', DE:'Täglich'}},
                {faro:'11:30', tavira:'12:30', gordo:'13:03', vrsa:'13:10', days:{PT:'Seg–Sex', EN:'Mon–Fri', ES:'Lun–Vie', FR:'Lun–Ven',   DE:'Mo–Fr'}},
                {faro:'13:30', tavira:'14:30', gordo:'15:03', vrsa:'15:10', days:{PT:'Diário',  EN:'Daily',   ES:'Diario',  FR:'Quotidien', DE:'Täglich'}},
                {faro:'18:30', tavira:'19:30', gordo:'20:03', vrsa:'20:10', days:{PT:'Diário',  EN:'Daily',   ES:'Diario',  FR:'Quotidien', DE:'Täglich'}},
              ]).map((b,i,arr) => {
                const depTime = busDir==='vrsa2faro' ? b.vrsa : b.faro
                const past2   = toMin(depTime) <= nm
                const isNext2 = !past2 && arr.find(x => toMin(busDir==='vrsa2faro' ? x.vrsa : x.faro) > nm) === b
                return (
                  <div key={i} style={{ borderBottom:i<arr.length-1?'1px solid var(--surface)':'none', padding:'10px 14px', background: isNext2 ? '#EFF6FF' : past2 ? 'transparent' : 'transparent', opacity: past2 ? 0.4 : 1 }}>
                    {/* Linha de stops */}
                    <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:4 }}>
                      {busDir==='vrsa2faro' ? <>
                        <StopPill time={b.vrsa} label="VRSA" bold isNext={isNext2} />
                        <Arrow />
                        <StopPill time={b.gordo} label="M.Gordo" isNext={isNext2} />
                        <Arrow />
                        <StopPill time={b.tavira||'—'} label="Tavira" isNext={isNext2} />
                        <Arrow />
                        <StopPill time={b.faro||'—'} label="Faro" isNext={isNext2} />
                      </> : <>
                        <StopPill time={b.faro} label="Faro" bold isNext={isNext2} />
                        <Arrow />
                        <StopPill time={b.tavira} label="Tavira" isNext={isNext2} />
                        <Arrow />
                        <StopPill time={b.gordo} label="M.Gordo" isNext={isNext2} />
                        <Arrow />
                        <StopPill time={b.vrsa} label="VRSA" isNext={isNext2} />
                      </>}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:11, color:'var(--ink-40)' }}>{b.days[L]||b.days.PT}</span>
                      {isNext2 && <span className="badge badge-blue">{t.next}</span>}
                      {!isNext2 && !past2 && fmtEta(depTime) && <span style={{ fontSize:11, fontWeight:700, color:'var(--mint)' }}>{fmtEta(depTime)}</span>}
                    </div>
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
                { name:{PT:'Parque da Praça Marquês de Pombal', EN:'Marquês de Pombal Square Car Park', ES:'Aparcamiento Plaza Marqués de Pombal', FR:'Parking Place Marquês de Pombal', DE:'Parkplatz Praça Marquês de Pombal'}, info:{PT:'Centro histórico · zona azul pago', EN:'Historic centre · paid blue zone', ES:'Centro histórico · zona azul de pago', FR:'Centre historique · zone bleue payante', DE:'Historisches Zentrum · kostenpflichtige Zone'}, free:false, lat:37.1938, lng:-7.4150 },
                { name:{PT:'Parque junto ao Ferry/Rio', EN:'Ferry/River Car Park', ES:'Aparcamiento Ferry/Río', FR:'Parking Ferry/Rivière', DE:'Parkplatz Fähre/Fluss'}, info:{PT:'Junto ao cais do ferry · gratuito', EN:'Next to ferry pier · free', ES:'Junto al muelle del ferry · gratis', FR:'Près de l\'embarcadère · gratuit', DE:'Am Fähranleger · kostenlos'}, free:true, lat:37.1978, lng:-7.4133 },
                { name:{PT:'Parque do Terminal Rodoviário', EN:'Bus Terminal Car Park', ES:'Aparcamiento Terminal de Autobuses', FR:'Parking Terminal Routier', DE:'Parkplatz Busbahnhof'}, info:{PT:'Junto ao terminal de autocarros · gratuito', EN:'Next to bus station · free', ES:'Junto a la estación de autobuses · gratis', FR:'Près de la gare routière · gratuit', DE:'Am Busbahnhof · kostenlos'}, free:true, lat:37.1945, lng:-7.4188 },
                { name:{PT:'Parque Avenida da República', EN:'Avenida da República Car Park', ES:'Aparcamiento Avenida da República', FR:'Parking Avenida da República', DE:'Parkplatz Avenida da República'}, info:{PT:'Avenida principal · zona azul pago', EN:'Main avenue · paid blue zone', ES:'Avenida principal · zona azul de pago', FR:'Avenue principale · zone bleue payante', DE:'Hauptstraße · kostenpflichtige Zone'}, free:false, lat:37.1932, lng:-7.4165 },
                { name:{PT:'Parque Autocaravanas (Monte Gordo)', EN:'Motorhome Park (Monte Gordo)', ES:'Área Autocaravanas (Monte Gordo)', FR:'Aire Camping-Cars (Monte Gordo)', DE:'Wohnmobilstellplatz (Monte Gordo)'}, info:{PT:'Monte Gordo · gratuito · 24h', EN:'Monte Gordo · free · 24h', ES:'Monte Gordo · gratis · 24h', FR:'Monte Gordo · gratuit · 24h', DE:'Monte Gordo · kostenlos · 24h'}, free:true, lat:37.1775, lng:-7.4290 },
              ].map((p,i,arr) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
                  <span style={{ fontSize:22 }}>🅿️</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{p.name[L]||p.name.PT}</div>
                    <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{p.info[L]||p.info.PT}</div>
                  </div>
                  <span style={{ background: p.free ? '#DCFCE7' : '#FEF9C3', color: p.free ? '#15803D' : '#854D0E', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:50, flexShrink:0 }}>{p.free ? (L==='EN'?'Free':L==='FR'?'Gratuit':L==='DE'?'Kostenlos':L==='ES'?'Gratis':'Grátis') : (L==='EN'?'Paid':L==='FR'?'Payant':L==='DE'?'Kostenpfl.':L==='ES'?'Pago':'Pago')}</span>
                  <button onClick={() => window.location.assign(`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`)} style={{ width:32, height:32, background:'var(--blue-lt)', border:'none', borderRadius:8, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>🧭</button>
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