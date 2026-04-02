import { useState, useEffect } from 'react'

const LANGS = [
  { code:'PT', label:'Português', flag:'🇵🇹' },
  { code:'EN', label:'English',   flag:'🇬🇧' },
  { code:'ES', label:'Español',   flag:'🇪🇸' },
  { code:'FR', label:'Français',  flag:'🇫🇷' },
  { code:'DE', label:'Deutsch',   flag:'🇩🇪' },
]
const CTA        = { PT:'Entrar no Guia', EN:'Enter Guide', ES:'Acceder', FR:'Accéder', DE:'Öffnen' }
const SUB        = { PT:'Guia Turístico Digital', EN:'Digital Tourism Guide', ES:'Guía Turística Digital', FR:'Guide Touristique Numérique', DE:'Digitaler Stadtführer' }
const LANG_LABEL = { PT:'Idioma', EN:'Language', ES:'Idioma', FR:'Langue', DE:'Sprache' }
const CHOOSE     = { PT:'Escolher idioma', EN:'Choose language', ES:'Elegir idioma', FR:'Choisir la langue', DE:'Sprache wählen' }

// Imagens que vendem a cidade — ciclo com Ken Burns
const BG_IMAGES = [
  '/images/praa_marques_de_pombal.webp',
  '/images/por_do_sol_sapal.webp',
  '/images/ponte_guadiana.webp',
]

export default function SplashScreen({ lang, setLang, onStart }) {
  const [open, setOpen]   = useState(false)
  const [ready, setReady] = useState(false)
  const current = LANGS.find(l => l.code === lang) || LANGS[0]
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t) }, [])

  const a = (d) => ({ animation: ready ? `sp-fade .55s ease both ${d}` : 'none', opacity: ready ? undefined : 0 })

  return (
    <div style={{ position:'fixed', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 28px', overflow:'hidden', fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <style>{`
        @keyframes sp-fade { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes sp-logo { 0%{opacity:0;transform:scale(.7)} 60%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)} }
        @keyframes sht-up  { from{transform:translateY(100%)} to{transform:none} }

        /* Ken Burns — zoom e direção distintos por imagem */
        @keyframes kb-1 { from{transform:scale(1.0) translate(0%,0%)}   to{transform:scale(1.14) translate(-2%,-1%)} }
        @keyframes kb-2 { from{transform:scale(1.0) translate(0%,0%)}   to{transform:scale(1.12) translate(2%,1%)} }
        @keyframes kb-3 { from{transform:scale(1.0) translate(0%,0%)}   to{transform:scale(1.14) translate(-1%,2%)} }

        /* Cross-fade ciclo 21s (7s cada imagem) */
        @keyframes bg-cf-1 { 0%,5%{opacity:1}   28%,100%{opacity:0} }
        @keyframes bg-cf-2 { 0%,27%{opacity:0}  33%,60%{opacity:1}  61%,100%{opacity:0} }
        @keyframes bg-cf-3 { 0%,60%{opacity:0}  66%,95%{opacity:1}  100%{opacity:0} }

        /* Pulse no botão CTA */
        @keyframes cta-pulse {
          0%,100% { box-shadow:0 4px 24px rgba(201,168,76,.32), inset 0 1px 0 rgba(255,255,255,.18) }
          50%     { box-shadow:0 6px 36px rgba(201,168,76,.55), 0 0 0 7px rgba(201,168,76,.11), inset 0 1px 0 rgba(255,255,255,.18) }
        }
        .sp-lang:hover { background:rgba(255,255,255,.14) !important; }
        .sp-cta { animation:cta-pulse 2.6s ease-in-out infinite !important; }
        .sp-cta:hover { filter:brightness(1.1); }
      `}</style>

      {/* ── Fundo imersivo com Ken Burns ── */}
      {BG_IMAGES.map((src, i) => (
        <div key={i} style={{ position:'absolute', inset:0, overflow:'hidden', animationName:`bg-cf-${i+1}`, animationDuration:'21s', animationTimingFunction:'ease-in-out', animationIterationCount:'infinite' }}>
          <div style={{ position:'absolute', inset:'-8%', backgroundImage:`url(${src})`, backgroundSize:'cover', backgroundPosition:'center', animationName:`kb-${i+1}`, animationDuration:'21s', animationTimingFunction:'ease-in-out', animationIterationCount:'infinite', animationFillMode:'both' }} />
        </div>
      ))}

      {/* Overlay escuro para legibilidade */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(170deg,rgba(0,18,42,.78) 0%,rgba(0,30,65,.68) 45%,rgba(0,45,90,.75) 100%)', zIndex:1 }} />
      {/* Vinheta nas bordas */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,.5) 100%)', zIndex:1 }} />
      {/* Acento dourado no topo */}
      <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:60, height:2, background:'linear-gradient(90deg,transparent,#C9A84C,transparent)', zIndex:2 }} />

      {/* ── Conteúdo ── */}
      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>

        {/* Logo */}
        <div style={{ position:'relative', marginBottom:28, animation:ready?'sp-logo .65s cubic-bezier(.34,1.56,.64,1) both':'none', opacity:ready?undefined:0 }}>
          <div style={{ width:96, height:96, borderRadius:22, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 12px 40px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.15)', backdropFilter:'blur(6px)' }}>
            <img src="/brasao-vrsa.webp" alt="Brasão VRSA" loading="eager" decoding="async" fetchPriority="high" style={{ width:76, height:76, objectFit:'contain' }} />
          </div>
          <div style={{ position:'absolute', inset:-5, borderRadius:28, border:'1px solid rgba(201,168,76,.25)', pointerEvents:'none' }} />
        </div>

        {/* Município com linhas */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12, ...a('.15s') }}>
          <div style={{ height:1, width:28, background:'rgba(255,255,255,.25)' }} />
          <span style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,.5)', letterSpacing:'3.5px', textTransform:'uppercase' }}>Município de VRSA</span>
          <div style={{ height:1, width:28, background:'rgba(255,255,255,.25)' }} />
        </div>

        {/* Título */}
        <div style={{ fontSize:'clamp(28px,8vw,36px)', fontWeight:800, color:'#fff', lineHeight:1.08, textAlign:'center', letterSpacing:'-.4px', marginBottom:16, textShadow:'0 2px 20px rgba(0,0,0,.5)', ...a('.22s') }}>
          Vila Real de<br/>Santo António
        </div>

        {/* Badge dourado */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, ...a('.30s') }}>
          <div style={{ height:1, width:18, background:'rgba(201,168,76,.5)' }} />
          <div style={{ display:'flex', alignItems:'center', gap:7, background:'rgba(201,168,76,.15)', border:'1px solid rgba(201,168,76,.4)', borderRadius:50, padding:'5px 14px', backdropFilter:'blur(4px)' }}>
            <span style={{ fontSize:10, fontWeight:700, color:'#EDD07A', letterSpacing:.9 }}>VRSA</span>
            <span style={{ width:3, height:3, borderRadius:'50%', background:'rgba(237,208,122,.45)' }} />
            <span style={{ fontSize:10, fontWeight:700, color:'#EDD07A', letterSpacing:.9 }}>GUIA TURÍSTICO</span>
          </div>
          <div style={{ height:1, width:18, background:'rgba(201,168,76,.5)' }} />
        </div>

        {/* Subtítulo */}
        <div style={{ fontSize:12, color:'rgba(255,255,255,.45)', marginBottom:32, fontWeight:500, letterSpacing:'.3px', ...a('.36s') }}>
          {SUB[lang]||SUB.PT}
        </div>

        {/* Divisor */}
        <div style={{ width:'100%', maxWidth:280, height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent)', marginBottom:24, ...a('.38s') }} />

        {/* Seletor de idioma */}
        <button className="sp-lang" onClick={() => setOpen(true)} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.16)', borderRadius:12, padding:'11px 20px', cursor:'pointer', marginBottom:14, outline:'none', width:'100%', maxWidth:300, transition:'background .15s', backdropFilter:'blur(6px)', ...a('.42s') }}>
          <span style={{ fontSize:18 }}>{current.flag}</span>
          <span style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,.5)' }}>{LANG_LABEL[lang]||LANG_LABEL.PT}</span>
          <span style={{ fontSize:13, fontWeight:700, color:'#fff', flex:1, textAlign:'left' }}>{current.label}</span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,.35)', fontWeight:600 }}>▾</span>
        </button>

        {/* CTA pílula com pulse */}
        <button className="sp-cta" onClick={onStart} style={{ width:'100%', maxWidth:300, padding:'16px 0', background:'linear-gradient(135deg,#D4AE52 0%,#C9A84C 60%,#B8952A 100%)', border:'none', borderRadius:50, fontSize:15, fontWeight:700, color:'#fff', cursor:'pointer', letterSpacing:'.5px', display:'flex', alignItems:'center', justifyContent:'center', gap:8, outline:'none', transition:'filter .15s', ...a('.50s') }}>
          {CTA[lang]||CTA.PT} <span style={{ fontSize:16 }}>→</span>
        </button>
      </div>

      {/* Rodapé */}
      <div style={{ position:'absolute', bottom:28, zIndex:2, display:'flex', alignItems:'center', gap:8, ...a('.7s') }}>
        <div style={{ height:1, width:14, background:'rgba(255,255,255,.15)' }} />
        <span style={{ fontSize:9, color:'rgba(255,255,255,.25)', letterSpacing:'2.5px', textTransform:'uppercase' }}>Algarve · Portugal · 2026</span>
        <div style={{ height:1, width:14, background:'rgba(255,255,255,.15)' }} />
      </div>

      {/* Sheet de idiomas */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(0,0,0,.6)', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth: '100%', background:'var(--white)', borderRadius:'18px 18px 0 0', padding:'14px 20px 48px', animation:'sht-up .25s cubic-bezier(.22,.68,0,1.1)' }}>
            <div style={{ width:36, height:3, borderRadius:2, background:'var(--border)', margin:'0 auto 20px' }} />
            <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:14, textAlign:'center' }}>{CHOOSE[lang]||CHOOSE.PT}</div>
            {LANGS.map(l => {
              const active = lang === l.code
              return (
                <button key={l.code} onClick={() => { setLang(l.code); setOpen(false) }} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'12px 14px', borderRadius:10, border:'none', background:active?'var(--primary-lt)':'transparent', cursor:'pointer', marginBottom:4, outline:'none', borderLeft:active?'3px solid var(--primary)':'3px solid transparent' }}>
                  <span style={{ fontSize:26 }}>{l.flag}</span>
                  <div style={{ flex:1, textAlign:'left' }}>
                    <div style={{ fontSize:14, fontWeight:active?700:500, color:active?'var(--primary)':'var(--ink-70)' }}>{l.label}</div>
                  </div>
                  {active && <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#fff', fontWeight:700 }}>✓</div>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

