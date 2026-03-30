import { useState, useEffect } from 'react'

function isIosSafari() {
  const ua = window.navigator.userAgent
  return /iphone|ipad|ipod/i.test(ua) && window.navigator.standalone !== true
}

function isAndroidChrome() {
  return /android/i.test(navigator.userAgent)
}

const T = {
  PT: {
    title: 'VRSA Guide',
    sub: 'Guia Turístico Digital · Algarve',
    tagline: 'Leva Vila Real de Santo António no bolso.',
    features: ['📍 450+ locais com mapa interactivo', '🌍 5 idiomas', '📶 Funciona offline', '🆓 Totalmente gratuito'],
    install: 'Adicionar ao Ecrã Inicial',
    notNow: 'Agora não',
    step1: 'Toca no botão',
    step1b: 'Partilhar',
    step2: 'Selecciona',
    step2b: '"Adicionar ao Ecrã de Início"',
    step3: 'Toca em',
    step3b: '"Adicionar"',
  },
  EN: {
    title: 'VRSA Guide',
    sub: 'Digital Tourist Guide · Algarve',
    tagline: 'Carry Vila Real de Santo António in your pocket.',
    features: ['📍 450+ places with interactive map', '🌍 5 languages', '📶 Works offline', '🆓 Completely free'],
    install: 'Add to Home Screen',
    notNow: 'Not now',
    step1: 'Tap the',
    step1b: 'Share',
    step2: 'Select',
    step2b: '"Add to Home Screen"',
    step3: 'Tap',
    step3b: '"Add"',
  },
  ES: {
    title: 'VRSA Guide',
    sub: 'Guía Turística Digital · Algarve',
    tagline: 'Lleva Vila Real de Santo António en tu bolsillo.',
    features: ['📍 450+ lugares con mapa interactivo', '🌍 5 idiomas', '📶 Funciona sin conexión', '🆓 Completamente gratis'],
    install: 'Añadir a Inicio',
    notNow: 'Ahora no',
    step1: 'Toca el botón',
    step1b: 'Compartir',
    step2: 'Selecciona',
    step2b: '"Añadir a pantalla de inicio"',
    step3: 'Toca',
    step3b: '"Añadir"',
  },
  FR: {
    title: 'VRSA Guide',
    sub: 'Guide Touristique Digital · Algarve',
    tagline: 'Emportez Vila Real de Santo António dans votre poche.',
    features: ['📍 450+ lieux avec carte interactive', '🌍 5 langues', '📶 Fonctionne hors ligne', '🆓 Entièrement gratuit'],
    install: 'Ajouter à l\'écran d\'accueil',
    notNow: 'Pas maintenant',
    step1: 'Appuyez sur',
    step1b: 'Partager',
    step2: 'Sélectionnez',
    step2b: '"Sur l\'écran d\'accueil"',
    step3: 'Appuyez sur',
    step3b: '"Ajouter"',
  },
  DE: {
    title: 'VRSA Guide',
    sub: 'Digitaler Reiseführer · Algarve',
    tagline: 'Vila Real de Santo António immer dabei.',
    features: ['📍 450+ Orte mit interaktiver Karte', '🌍 5 Sprachen', '📶 Funktioniert offline', '🆓 Völlig kostenlos'],
    install: 'Zum Startbildschirm',
    notNow: 'Nicht jetzt',
    step1: 'Tippe auf',
    step1b: 'Teilen',
    step2: 'Wähle',
    step2b: '"Zum Home-Bildschirm"',
    step3: 'Tippe auf',
    step3b: '"Hinzufügen"',
  },
}

// iOS Share icon (matches Safari's actual icon)
const IosShareIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
)

export default function InstallBanner({ lang }) {
  const L = lang || 'PT'
  const t = T[L] || T.PT
  const [androidPrompt, setAndroidPrompt] = useState(null)
  const [visible, setVisible]             = useState(false)
  const [iosMode, setIosMode]             = useState(false)
  const [closing, setClosing]             = useState(false)

  useEffect(() => {
    if (localStorage.getItem('vrsa_install_dismissed')) return
    const visits = parseInt(localStorage.getItem('vrsa_visits') || '0') + 1
    localStorage.setItem('vrsa_visits', visits.toString())

    if (isIosSafari()) {
      setTimeout(() => { setIosMode(true); setVisible(true) }, 3000)
      return
    }
    if (isAndroidChrome()) {
      const handler = (e) => {
        e.preventDefault()
        setAndroidPrompt(e)
        setTimeout(() => setVisible(true), 3000)
      }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  function dismiss() {
    setClosing(true)
    setTimeout(() => {
      localStorage.setItem('vrsa_install_dismissed', '1')
      setVisible(false)
      setClosing(false)
    }, 280)
  }

  function handleInstall() {
    if (!androidPrompt) return
    androidPrompt.prompt()
    androidPrompt.userChoice.then(() => { setVisible(false); setAndroidPrompt(null) })
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0, zIndex: 399,
          background: 'rgba(0,0,0,0.45)',
          animation: closing ? 'fade-out .28s ease forwards' : 'fade-in .22s ease',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        zIndex: 400,
        background: 'var(--white)',
        borderRadius: '24px 24px 0 0',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.22)',
        animation: closing ? 'slide-down-out .28s ease forwards' : 'slide-up .3s cubic-bezier(0.22,0.68,0,1.1)',
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)', margin: '12px auto 0' }} />

        {/* Close */}
        <button
          onClick={dismiss}
          style={{ position:'absolute', top:16, right:16, width:30, height:30, borderRadius:'50%', background:'var(--surface)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'var(--ink-40)' }}
        >✕</button>

        <div style={{ padding: '16px 24px 28px' }}>
          {/* App identity */}
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
            <img src="/icon-192.png" alt="VRSA Guide" style={{ width:60, height:60, borderRadius:14, boxShadow:'0 4px 16px rgba(0,0,0,0.15)', flexShrink:0 }} />
            <div>
              <div style={{ fontSize:18, fontWeight:900, color:'var(--ink)', letterSpacing:'-.3px' }}>{t.title}</div>
              <div style={{ fontSize:12, color:'var(--ink-40)', marginTop:2 }}>{t.sub}</div>
              {/* Stars */}
              <div style={{ display:'flex', alignItems:'center', gap:3, marginTop:4 }}>
                {'★★★★★'.split('').map((s,i) => <span key={i} style={{ fontSize:12, color:'#F59E0B' }}>{s}</span>)}
                <span style={{ fontSize:11, color:'var(--ink-40)', marginLeft:3 }}>4.9 · Grátis</span>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div style={{ fontSize:14, fontWeight:700, color:'var(--ink)', marginBottom:14, lineHeight:1.4 }}>
            {t.tagline}
          </div>

          {/* Features */}
          <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:22 }}>
            {t.features.map((f, i) => (
              <div key={i} style={{ fontSize:13, color:'var(--ink-70)', display:'flex', alignItems:'center', gap:8 }}>
                <span>{f}</span>
              </div>
            ))}
          </div>

          {iosMode ? (
            <>
              {/* iOS step-by-step */}
              <div style={{ background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)', borderRadius:14, padding:'14px 16px', marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:800, color:'#1D4ED8', letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>Como instalar</div>
                {[
                  { n:1, text: <>{t.step1} <span style={{ display:'inline-flex', alignItems:'center', gap:3, background:'white', border:'1px solid #E2E8F0', borderRadius:6, padding:'2px 7px', fontSize:11, fontWeight:700, color:'#007AFF', verticalAlign:'middle' }}><IosShareIcon /> {t.step1b}</span> {/* in Safari toolbar */}</> },
                  { n:2, text: <>{t.step2} <strong style={{ color:'var(--ink)' }}>{t.step2b}</strong></> },
                  { n:3, text: <>{t.step3} <strong style={{ color:'var(--ink)' }}>{t.step3b}</strong></> },
                ].map(({ n, text }) => (
                  <div key={n} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom: n < 3 ? 8 : 0 }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', background:'#1D4ED8', color:'#fff', fontSize:11, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{n}</div>
                    <div style={{ fontSize:13, color:'var(--ink-70)', lineHeight:1.5 }}>{text}</div>
                  </div>
                ))}
              </div>
              {/* iOS arrow hint */}
              <div style={{ textAlign:'center', fontSize:12, color:'var(--ink-40)', marginBottom:4 }}>
                ↓ {L==='EN'?'Safari toolbar below':'Barra do Safari em baixo'}
              </div>
            </>
          ) : (
            /* Android install button */
            <button
              onClick={handleInstall}
              style={{
                width:'100%', padding:'15px', borderRadius:14, border:'none', cursor:'pointer',
                background:'linear-gradient(135deg,var(--primary),#1A5FA8)',
                color:'#fff', fontSize:15, fontWeight:800, letterSpacing:'-.2px',
                boxShadow:'0 6px 20px rgba(6,21,43,0.3)',
                marginBottom:12,
              }}
            >
              📲 {t.install}
            </button>
          )}

          <button
            onClick={dismiss}
            style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', cursor:'pointer', background:'none', fontSize:13, color:'var(--ink-40)', fontWeight:600 }}
          >
            {t.notNow}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-out { to { opacity:0; } }
        @keyframes slide-down-out { to { transform:translateX(-50%) translateY(100%); } }
      `}</style>
    </>
  )
}
