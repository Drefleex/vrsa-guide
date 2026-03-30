import { useState, useEffect } from 'react'

// Detect iOS Safari (not already installed as PWA)
function isIosSafari() {
  const ua = window.navigator.userAgent
  const isIos = /iphone|ipad|ipod/i.test(ua)
  const isInStandaloneMode = window.navigator.standalone === true
  return isIos && !isInStandaloneMode
}

function isAndroidChrome() {
  return /android/i.test(navigator.userAgent)
}

const T = {
  PT: {
    title: 'Instalar VRSA Guide',
    sub: 'Adiciona ao ecrã inicial para acesso rápido',
    btn: 'Instalar',
    ios: 'Toca em',
    ios2: 'e depois "Adicionar ao ecrã de início"',
    close: 'Fechar',
  },
  EN: {
    title: 'Install VRSA Guide',
    sub: 'Add to home screen for quick access',
    btn: 'Install',
    ios: 'Tap',
    ios2: 'then "Add to Home Screen"',
    close: 'Close',
  },
  ES: {
    title: 'Instalar VRSA Guide',
    sub: 'Añade a la pantalla de inicio para acceso rápido',
    btn: 'Instalar',
    ios: 'Pulsa',
    ios2: 'y luego "Añadir a pantalla de inicio"',
    close: 'Cerrar',
  },
  FR: {
    title: 'Installer VRSA Guide',
    sub: 'Ajoutez à l\'écran d\'accueil pour un accès rapide',
    btn: 'Installer',
    ios: 'Appuyez sur',
    ios2: 'puis "Sur l\'écran d\'accueil"',
    close: 'Fermer',
  },
  DE: {
    title: 'VRSA Guide installieren',
    sub: 'Zum Startbildschirm hinzufügen für schnellen Zugriff',
    btn: 'Installieren',
    ios: 'Tippe auf',
    ios2: 'dann "Zum Home-Bildschirm"',
    close: 'Schließen',
  },
}

// Share icon SVG (iOS share sheet icon)
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display:'inline', verticalAlign:'middle', margin:'0 3px' }}>
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

  useEffect(() => {
    if (localStorage.getItem('vrsa_install_dismissed')) return

    const visits = parseInt(localStorage.getItem('vrsa_visits') || '0') + 1
    localStorage.setItem('vrsa_visits', visits.toString())

    // iOS Safari — show after 2nd visit with 4s delay
    if (isIosSafari() && visits >= 2) {
      setTimeout(() => { setIosMode(true); setVisible(true) }, 4000)
      return
    }

    // Android Chrome — listen for beforeinstallprompt
    if (isAndroidChrome()) {
      const handler = (e) => {
        e.preventDefault()
        setAndroidPrompt(e)
        if (visits >= 2) setTimeout(() => setVisible(true), 4000)
      }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  function handleInstall() {
    if (!androidPrompt) return
    androidPrompt.prompt()
    androidPrompt.userChoice.then(() => { setVisible(false); setAndroidPrompt(null) })
  }

  function handleDismiss() {
    localStorage.setItem('vrsa_install_dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(68px + env(safe-area-inset-bottom,0px))',
      left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 24px)', maxWidth: 406,
      zIndex: 300, animation: 'slide-up .3s ease',
    }}>
      {iosMode ? (
        /* iOS instruction card */
        <div style={{
          background: 'var(--white)', border: '1px solid var(--border-lt)',
          borderRadius: 16, padding: '16px 16px 14px',
          boxShadow: '0 8px 32px rgba(0,0,0,.18)',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <img src="/icon-192.png" alt="" style={{ width:36, height:36, borderRadius:8, flexShrink:0 }} />
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>{t.title}</div>
                <div style={{ fontSize:11, color:'var(--ink-40)' }}>{t.sub}</div>
              </div>
            </div>
            <button onClick={handleDismiss} style={{ background:'none', border:'none', color:'var(--ink-20)', fontSize:20, cursor:'pointer', padding:'2px 4px', lineHeight:1 }}>✕</button>
          </div>
          <div style={{ background:'var(--surface)', borderRadius:10, padding:'10px 12px', fontSize:12, color:'var(--ink-70)', lineHeight:1.6 }}>
            {t.ios} <span style={{ display:'inline-flex', alignItems:'center', background:'#007AFF', color:'#fff', borderRadius:6, padding:'1px 6px', fontSize:11, fontWeight:700, gap:2 }}><ShareIcon />Share</span> {t.ios2}
          </div>
          {/* Arrow pointing down to the share bar */}
          <div style={{ textAlign:'center', marginTop:8, fontSize:20, lineHeight:1 }}>↓</div>
        </div>
      ) : (
        /* Android banner */
        <div style={{
          background: 'var(--white)', border: '1px solid var(--border-lt)',
          borderRadius: 14, padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,.12)',
        }}>
          <img src="/icon-192.png" alt="" style={{ width:36, height:36, borderRadius:8, objectFit:'contain', flexShrink:0 }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{t.title}</div>
            <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{t.sub}</div>
          </div>
          <button onClick={handleDismiss} style={{ background:'none', border:'none', color:'var(--ink-20)', fontSize:18, cursor:'pointer', padding:'4px', flexShrink:0 }}>✕</button>
          <button onClick={handleInstall} style={{ background:'var(--primary)', color:'#fff', border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0, whiteSpace:'nowrap' }}>{t.btn}</button>
        </div>
      )}
    </div>
  )
}
