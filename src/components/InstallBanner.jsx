import { useState, useEffect } from 'react'

const TR = {
  PT:{ title:'Instalar VRSA Guide', sub:'Adicionar ao ecrã inicial — grátis', btn:'Instalar', dismiss:'Agora não' },
  EN:{ title:'Install VRSA Guide', sub:'Add to home screen — free', btn:'Install', dismiss:'Not now' },
  ES:{ title:'Instalar VRSA Guide', sub:'Añadir a la pantalla de inicio — gratis', btn:'Instalar', dismiss:'Ahora no' },
  FR:{ title:'Installer VRSA Guide', sub:'Ajouter à l\'écran d\'accueil — gratuit', btn:'Installer', dismiss:'Plus tard' },
  DE:{ title:'VRSA Guide installieren', sub:'Zum Startbildschirm hinzufügen — kostenlos', btn:'Installieren', dismiss:'Nicht jetzt' },
}

export default function InstallBanner({ lang }) {
  const L = lang || 'PT'
  const t = TR[L] || TR.PT
  const [prompt, setPrompt]   = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Don't show if dismissed before
    if (localStorage.getItem('vrsa_install_dismissed')) return

    const handler = (e) => {
      e.preventDefault()
      setPrompt(e)
      // Show after 2nd visit
      const visits = parseInt(localStorage.getItem('vrsa_visits') || '0') + 1
      localStorage.setItem('vrsa_visits', visits)
      if (visits >= 2) setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function handleInstall() {
    if (!prompt) return
    prompt.prompt()
    prompt.userChoice.then(() => {
      setVisible(false)
      setPrompt(null)
    })
  }

  function handleDismiss() {
    localStorage.setItem('vrsa_install_dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position:'fixed', bottom: 'calc(60px + env(safe-area-inset-bottom,0px))',
      left:'50%', transform:'translateX(-50%)',
      width:'calc(100% - 24px)', maxWidth:406,
      background:'var(--white)', border:'1px solid var(--border-lt)',
      borderRadius:14, padding:'12px 14px',
      display:'flex', alignItems:'center', gap:12,
      zIndex:300, boxShadow:'0 4px 24px rgba(0,0,0,.12)',
      animation:'slide-up .3s ease',
    }}>
      <img src="/brasao-vrsa.png" alt="" style={{ width:36, height:36, objectFit:'contain', flexShrink:0 }} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{t.title}</div>
        <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{t.sub}</div>
      </div>
      <button
        onClick={handleDismiss}
        style={{ background:'none', border:'none', color:'var(--ink-20)', fontSize:18, cursor:'pointer', padding:'4px', flexShrink:0 }}
      >✕</button>
      <button
        onClick={handleInstall}
        style={{ background:'var(--primary)', color:'#fff', border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0, whiteSpace:'nowrap' }}
      >{t.btn}</button>
    </div>
  )
}