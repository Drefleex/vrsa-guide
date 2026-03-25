import { useState, useEffect } from 'react'

const LANGS = [
  { code:'PT', label:'Português', flag:'🇵🇹' },
  { code:'EN', label:'English',   flag:'🇬🇧' },
  { code:'ES', label:'Español',   flag:'🇪🇸' },
  { code:'FR', label:'Français',  flag:'🇫🇷' },
  { code:'DE', label:'Deutsch',   flag:'🇩🇪' },
]
const CTA  = { PT:'Entrar no Guia', EN:'Enter Guide', ES:'Acceder', FR:'Accéder', DE:'Öffnen' }
const SUB  = { PT:'Guia Oficial do Município', EN:'Official Municipal Guide', ES:'Guía Oficial del Municipio', FR:'Guide Officiel de la Commune', DE:'Offizielle Stadtführer' }

export default function SplashScreen({ lang, setLang, onStart }) {
  const [open, setOpen]   = useState(false)
  const [ready, setReady] = useState(false)
  const current = LANGS.find(l => l.code === lang) || LANGS[0]
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t) }, [])

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(175deg,#002D55 0%,#003B6F 55%,#004F96 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 32px', overflow:'hidden', fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <style>{`
        @keyframes inst-fade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes inst-logo{0%{opacity:0;transform:scale(.7)}60%{transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
        @keyframes sht-up{from{transform:translateY(100%)}to{transform:none}}
      `}</style>
      <div style={{ position:'absolute', top:0, right:0, width:220, height:220, borderRadius:'0 0 0 100%', background:'rgba(255,255,255,.035)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:0, left:0, width:160, height:160, borderRadius:'0 100% 0 0', background:'rgba(255,255,255,.035)', pointerEvents:'none' }} />

      <img
        src="/logo_vrsa_light.svg"
        alt="VRSA Guide"
        loading="eager"
        decoding="async"
        fetchpriority="high"
        style={{ width:280, marginBottom:10, animation:ready?'inst-logo .6s cubic-bezier(.34,1.56,.64,1) both':'none', opacity:ready?undefined:0 }}
      />

      <div style={{ fontSize:12, color:'rgba(255,255,255,.35)', marginBottom:36, fontWeight:500, textAlign:'center', animation:ready?'inst-fade .5s ease both .22s':'none', opacity:ready?undefined:0 }}>{SUB[lang]||SUB.PT}</div>

      <button onClick={() => setOpen(true)} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', borderRadius:8, padding:'9px 18px', cursor:'pointer', marginBottom:14, outline:'none', animation:ready?'inst-fade .5s ease both .42s':'none', opacity:ready?undefined:0 }}>
        <span style={{ fontSize:18 }}>{current.flag}</span>
        <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.65)' }}>{lang==='EN'?'Language':lang==='FR'?'Langue':lang==='DE'?'Sprache':'Idioma'}</span>
        <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{current.label}</span>
        <span style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>▾</span>
      </button>

      <button onClick={onStart} style={{ width:'100%', maxWidth:300, padding:'14px 0', background:'#C9A84C', border:'none', borderRadius:8, fontSize:15, fontWeight:700, color:'#fff', cursor:'pointer', letterSpacing:'.3px', display:'flex', alignItems:'center', justifyContent:'center', gap:8, outline:'none', animation:ready?'inst-fade .5s ease both .5s':'none', opacity:ready?undefined:0 }}>
        {CTA[lang]||CTA.PT} →
      </button>

      <div style={{ position:'absolute', bottom:28, fontSize:9, color:'rgba(255,255,255,.16)', letterSpacing:'2px', textTransform:'uppercase', animation:ready?'inst-fade .5s ease both .7s':'none', opacity:ready?undefined:0 }}>Algarve · Portugal · 2026</div>

      {open && (
        <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:430, background:'var(--white)', borderRadius:'18px 18px 0 0', padding:'14px 20px 48px', animation:'sht-up .25s cubic-bezier(.22,.68,0,1.1)' }}>
            <div style={{ width:36, height:3, borderRadius:2, background:'var(--border)', margin:'0 auto 20px' }} />
            <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:14, textAlign:'center' }}>{lang==='EN'?'Choose language':lang==='ES'?'Elegir idioma':lang==='FR'?'Choisir la langue':lang==='DE'?'Sprache wählen':'Escolher idioma'}</div>
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