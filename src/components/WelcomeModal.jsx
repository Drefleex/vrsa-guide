const TR = {
  PT:{ title:'Bem-vindo ao', app:'VRSA Guide', sub:'Guia Oficial do Município', body:'O guia turístico oficial de Vila Real de Santo António. Restaurantes, praias, cultura, transportes e muito mais — tudo num só lugar.', btn:'Começar a Explorar', made:'Câmara Municipal de VRSA · 2026' },
  EN:{ title:'Welcome to', app:'VRSA Guide', sub:'Official Municipal Guide', body:'The official tourist guide for Vila Real de Santo António. Restaurants, beaches, culture, transport and much more — all in one place.', btn:'Start Exploring', made:'Câmara Municipal de VRSA · 2026' },
  ES:{ title:'Bienvenido a', app:'VRSA Guide', sub:'Guía Oficial del Municipio', body:'La guía turística oficial de Vila Real de Santo António. Restaurantes, playas, cultura, transportes y mucho más — todo en un solo lugar.', btn:'Empezar a Explorar', made:'Câmara Municipal de VRSA · 2026' },
  FR:{ title:'Bienvenue sur', app:'VRSA Guide', sub:'Guide Officiel de la Commune', body:"Le guide touristique officiel de Vila Real de Santo António. Restaurants, plages, culture, transports et bien plus — tout en un seul endroit.", btn:'Commencer à Explorer', made:'Câmara Municipal de VRSA · 2026' },
  DE:{ title:'Willkommen bei', app:'VRSA Guide', sub:'Offizieller Stadtführer', body:'Der offizielle Reiseführer von Vila Real de Santo António. Restaurants, Strände, Kultur, Transport und vieles mehr — alles an einem Ort.', btn:'Erkunden beginnen', made:'Câmara Municipal de VRSA · 2026' },
}

export default function WelcomeModal({ lang, visible, onClose }) {
  const L = lang || 'PT'
  const t = TR[L] || TR.PT

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:400, animation:'fade-in .2s ease' }}
      />

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.app}
        style={{
          position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
          width:'100%', maxWidth:430, zIndex:401,
          background:'var(--white)',
          borderRadius:'var(--r-xl) var(--r-xl) 0 0',
          padding:'20px 24px calc(40px + env(safe-area-inset-bottom,0px))',
          textAlign:'center',
          animation:'slide-up .32s cubic-bezier(.22,.68,0,1.1)',
          boxShadow:'0 -8px 40px rgba(0,0,0,.13)',
        }}
      >
        {/* Handle */}
        <div style={{ width:36, height:3, borderRadius:2, background:'var(--border)', margin:'0 auto 22px' }} />

        {/* Brasão */}
        <div style={{
          width:72, height:72, borderRadius:16,
          background:'var(--primary-lt)', border:'1px solid var(--border-lt)',
          display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px',
        }}>
          <img src="/brasao-vrsa.png" alt="Brasão de Vila Real de Santo António" width={52} height={52} style={{ objectFit:'contain' }} />
        </div>

        {/* Heading */}
        <div style={{ fontSize:12, color:'var(--ink-40)', fontWeight:600, marginBottom:3, letterSpacing:.2 }}>{t.title}</div>
        <div style={{ fontSize:26, fontWeight:800, color:'var(--primary)', marginBottom:8, letterSpacing:'-.4px', lineHeight:1 }}>{t.app}</div>

        {/* Badge */}
        <div style={{ display:'inline-flex', alignItems:'center', background:'var(--gold-lt)', border:'1px solid var(--gold)', borderRadius:50, padding:'3px 12px', marginBottom:16 }}>
          <span style={{ fontSize:10, fontWeight:700, color:'var(--gold)', letterSpacing:1.4, textTransform:'uppercase' }}>{t.sub}</span>
        </div>

        {/* Body */}
        <p style={{ fontSize:13, color:'var(--ink-40)', lineHeight:1.75, maxWidth:300, margin:'0 auto 22px' }}>{t.body}</p>

        {/* CTA */}
        <button
          onClick={onClose}
          aria-label={t.btn}
          style={{
            display:'block', width:'100%', maxWidth:300, margin:'0 auto',
            padding:'15px', background:'var(--primary)', color:'#fff',
            border:'none', borderRadius:'var(--r)', fontSize:15, fontWeight:700,
            cursor:'pointer', letterSpacing:'.2px',
            transition:'opacity .15s, transform .1s',
          }}
        >
          {t.btn} →
        </button>

        {/* Footer */}
        <div style={{ fontSize:10, color:'var(--ink-20)', marginTop:16, letterSpacing:1.2, textTransform:'uppercase' }}>{t.made}</div>
      </div>
    </>
  )
}
