import { useState } from 'react'

const TR = {
  PT: { skip:'Saltar', next:'Seguinte', start:'Começar a Explorar',
    steps: [
      { emoji:'👋', title:'Bem-vindo ao VRSA Guide', desc:'O teu guia turístico oficial de Vila Real de Santo António no bolso. Restaurantes, praias, cultura e muito mais.' },
      { emoji:'❤️', title:'Cria o teu Roteiro', desc:'Toca no coração nos teus restaurantes e eventos preferidos para os guardares e acederes facilmente.' },
      { emoji:'🗺️', title:'Navega sem Internet', desc:'Traça rotas a pé no mapa interativo para qualquer monumento ou praia, mesmo sem gastar dados móveis!' }
    ]
  },
  EN: { skip:'Skip', next:'Next', start:'Start Exploring',
    steps: [
      { emoji:'👋', title:'Welcome to VRSA Guide', desc:'Your official tourist guide for Vila Real de Santo António in your pocket. Restaurants, beaches, culture and more.' },
      { emoji:'❤️', title:'Create your Itinerary', desc:'Tap the heart on your favourite restaurants and events to save them for easy access later.' },
      { emoji:'🗺️', title:'Navigate Offline', desc:'Get walking directions on the interactive map to any monument or beach, without using mobile data!' }
    ]
  },
  ES: { skip:'Saltar', next:'Siguiente', start:'Empezar a Explorar',
    steps: [
      { emoji:'👋', title:'Bienvenido a VRSA Guide', desc:'Tu guía turística oficial de Vila Real de Santo António en el bolsillo. Restaurantes, playas, cultura y mucho más.' },
      { emoji:'❤️', title:'Crea tu Itinerario', desc:'Toca el corazón en tus restaurantes y eventos favoritos para guardarlos y acceder fácilmente.' },
      { emoji:'🗺️', title:'Navega sin Internet', desc:'¡Traza rutas a pie en el mapa interactivo hacia cualquier monumento o playa, sin gastar datos móviles!' }
    ]
  },
  FR: { skip:'Passer', next:'Suivant', start:'Commencer à Explorer',
    steps: [
      { emoji:'👋', title:'Bienvenue sur VRSA Guide', desc:'Votre guide touristique officiel de Vila Real de Santo António dans la poche. Restaurants, plages, culture et plus.' },
      { emoji:'❤️', title:'Créez votre Itinéraire', desc:'Tapez sur le cœur de vos restaurants et événements préférés pour les sauvegarder facilement.' },
      { emoji:'🗺️', title:'Naviguez hors-ligne', desc:'Obtenez des itinéraires à pied sur la carte interactive sans utiliser vos données mobiles !' }
    ]
  },
  DE: { skip:'Überspringen', next:'Weiter', start:'Erkunden beginnen',
    steps: [
      { emoji:'👋', title:'Willkommen beim VRSA Guide', desc:'Ihr offizieller Reiseführer für Vila Real de Santo António in der Tasche. Restaurants, Strände, Kultur und mehr.' },
      { emoji:'❤️', title:'Erstelle deine Reiseroute', desc:'Tippe bei deinen Lieblingsrestaurants und -events auf das Herz, um sie für später zu speichern.' },
      { emoji:'🗺️', title:'Offline navigieren', desc:'Lass dir auf der interaktiven Karte Fußwege zu Denkmälern oder Stränden anzeigen, ganz ohne mobile Daten!' }
    ]
  },
}

export default function WelcomeModal({ lang, visible, onClose }) {
  const [step, setStep] = useState(0)

  const L = lang || 'PT'
  const t = TR[L] || TR.PT

  if (!visible) return null

  const handleNext = () => {
    if (step < t.steps.length - 1) {
      setStep(s => s + 1)
    } else {
      onClose()
    }
  }

  const current = t.steps[step]

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:400, animation:'fade-in .3s ease' }}
      />

      {/* Modal */}
      <div
        style={{
          position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
          width:'100%', maxWidth:430, zIndex:401,
          background:'var(--white)',
          borderRadius:'24px 24px 0 0',
          padding:'20px 24px calc(30px + env(safe-area-inset-bottom,0px))',
          textAlign:'center',
          animation:'slide-up .4s cubic-bezier(.22,.68,0,1)',
          boxShadow:'0 -8px 40px rgba(0,0,0,.15)',
        }}
      >
        {/* Top bar: drag handle + skip */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ width:40 }} />
          <div style={{ width:40, height:4, borderRadius:2, background:'var(--border)' }} />
          <button onClick={onClose} style={{ width:40, background:'none', border:'none', color:'var(--ink-40)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
            {step < t.steps.length - 1 ? t.skip : ''}
          </button>
        </div>

        {/* Content — key forces re-mount on step change for cross-fade */}
        <div key={step} style={{ animation:'fade-in .3s ease-out' }}>
          <div style={{
            width:80, height:80, borderRadius:20,
            background: step === 0 ? 'var(--primary-lt)' : step === 1 ? '#FEE2E2' : '#EFF6FF',
            display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px',
            fontSize:40, boxShadow:'0 4px 20px rgba(0,0,0,.08)',
          }}>
            {current.emoji}
          </div>

          <div style={{ fontSize:22, fontWeight:800, color:'var(--primary)', marginBottom:12, lineHeight:1.2 }}>
            {current.title}
          </div>

          <p style={{ fontSize:14, color:'var(--ink-40)', lineHeight:1.6, maxWidth:300, margin:'0 auto 24px', minHeight:66 }}>
            {current.desc}
          </p>
        </div>

        {/* Progress dots */}
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:24 }}>
          {t.steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 8, height:8, borderRadius:4,
              background: i === step ? 'var(--primary)' : 'var(--border)',
              transition:'all .3s ease',
            }} />
          ))}
        </div>

        {/* Action button */}
        <button
          onClick={handleNext}
          style={{
            display:'block', width:'100%', maxWidth:300, margin:'0 auto',
            padding:'16px', background:'var(--primary)', color:'#fff',
            border:'none', borderRadius:14, fontSize:15, fontWeight:800,
            cursor:'pointer', boxShadow:'0 4px 16px rgba(10,22,40,.2)',
          }}
        >
          {step < t.steps.length - 1 ? t.next : t.start}
        </button>
      </div>
    </>
  )
}
