import { useState } from 'react'

const T = {
  PT: {
    title: 'Sunsets & Bares',
    sub: 'Pôr do Sol · Cocktails · Esplanadas',
    goldenHour: 'Golden Hour',
    opens: 'Abre às',
    vibes: 'Vibe',
    seeMore: 'Ver mais',
    tip: '🌅 Melhor hora para o pôr do sol em VRSA: 30 min antes do anoitecer',
  },
  EN: {
    title: 'Sunsets & Bars',
    sub: 'Sunset · Cocktails · Terraces',
    goldenHour: 'Golden Hour',
    opens: 'Opens at',
    vibes: 'Vibe',
    seeMore: 'See more',
    tip: '🌅 Best sunset time in VRSA: 30 min before dusk',
  },
  ES: {
    title: 'Atardeceres & Bares',
    sub: 'Puesta de Sol · Cócteles · Terrazas',
    goldenHour: 'Hora Dorada',
    opens: 'Abre a las',
    vibes: 'Ambiente',
    seeMore: 'Ver más',
    tip: '🌅 Mejor hora para el atardecer en VRSA: 30 min antes del anochecer',
  },
  FR: {
    title: 'Couchers de Soleil & Bars',
    sub: 'Coucher de Soleil · Cocktails · Terrasses',
    goldenHour: 'Heure Dorée',
    opens: 'Ouvre à',
    vibes: 'Ambiance',
    seeMore: 'Voir plus',
    tip: '🌅 Meilleure heure pour le coucher de soleil à VRSA : 30 min avant le crépuscule',
  },
  DE: {
    title: 'Sonnenuntergänge & Bars',
    sub: 'Sonnenuntergang · Cocktails · Terrassen',
    goldenHour: 'Goldene Stunde',
    opens: 'Öffnet um',
    vibes: 'Atmosphäre',
    seeMore: 'Mehr sehen',
    tip: '🌅 Bester Sonnenuntergang in VRSA: 30 Min. vor der Dämmerung',
  },
}

// Sunset time approximation by month
function getSunsetTime() {
  const m = new Date().getMonth() // 0-indexed
  if (m >= 5 && m <= 7) return '21h15' // Jun-Aug
  if (m === 4 || m === 8) return '20h30' // May, Sep
  if (m === 3 || m === 9) return '19h45' // Apr, Oct
  return '18h15' // Nov-Mar
}

const LABEL_STYLE = {
  Lounge:      { bg: '#1E1B4B', color: '#C7D2FE' },
  'Beach Club':{ bg: '#064E3B', color: '#A7F3D0' },
  Rooftop:     { bg: '#7C2D12', color: '#FDBA74' },
  Riverside:   { bg: '#0C4A6E', color: '#BAE6FD' },
  Casino:      { bg: '#581C87', color: '#E9D5FF' },
}

const SUNSET_SPOTS = [
  {
    id: 1,
    name: 'Guadiana River Club',
    label: 'Riverside',
    emoji: '🍹',
    opens: '17h00',
    desc: {
      PT: 'Cocktails premium com vista panorâmica para o Rio Guadiana e Espanha. O sítio perfeito para ver o sol pôr-se sobre Ayamonte.',
      EN: 'Premium cocktails with panoramic views over the Guadiana River and Spain. The perfect spot to watch the sun set over Ayamonte.',
      ES: 'Cócteles premium con vistas panorámicas al Río Guadiana y España. El lugar perfecto para ver el atardecer sobre Ayamonte.',
      FR: 'Cocktails premium avec vue panoramique sur le Guadiana et l\'Espagne. L\'endroit parfait pour regarder le coucher de soleil sur Ayamonte.',
      DE: 'Premium-Cocktails mit Panoramablick auf den Guadiana und Spanien. Der perfekte Ort, um den Sonnenuntergang über Ayamonte zu beobachten.',
    },
    tags: ['Cocktails', 'Vista Rio', 'Esplanada'],
    accentColor: '#0369A1',
    bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    lat: 37.1947, lng: -7.4161,
  },
  {
    id: 2,
    name: "Pézinhos N'Areia",
    label: 'Beach Club',
    emoji: '🌅',
    opens: '16h00',
    desc: {
      PT: 'O melhor pôr do sol da região com os pés na areia. Entre pinheiros e praia, em Praia Verde — um paraíso secreto do Algarve.',
      EN: 'The best sunset in the region with your feet in the sand. Nestled between pine trees and beach in Praia Verde — a secret Algarve paradise.',
      ES: 'El mejor atardecer de la región con los pies en la arena. Entre pinos y playa en Praia Verde — un paraíso secreto del Algarve.',
      FR: 'Le meilleur coucher de soleil de la région les pieds dans le sable. Entre pins et plage à Praia Verde — un paradis secret de l\'Algarve.',
      DE: 'Der beste Sonnenuntergang der Region mit Füßen im Sand. Zwischen Pinien und Strand in Praia Verde — ein geheimes Algarve-Paradies.',
    },
    tags: ['Sunset', 'Pés na Areia', 'DJ ao vivo'],
    accentColor: '#D97706',
    bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    lat: 37.1701, lng: -7.4977,
  },
  {
    id: 3,
    name: 'Casino de Monte Gordo',
    label: 'Lounge',
    emoji: '🎰',
    opens: '18h00',
    desc: {
      PT: 'Bar panorâmico do Casino com vista 180° sobre o Algarve e o Atlântico. Ambiente sofisticado, carta de vinhos premium e música ambiente.',
      EN: 'Panoramic casino bar with 180° views over the Algarve and the Atlantic. Sophisticated ambience, premium wine list and ambient music.',
      ES: 'Bar panorámico del Casino con vistas 180° sobre el Algarve y el Atlántico. Ambiente sofisticado, carta de vinos premium y música ambiente.',
      FR: 'Bar panoramique du Casino avec vue 180° sur l\'Algarve et l\'Atlantique. Ambiance sophistiquée, carte des vins premium et musique d\'ambiance.',
      DE: 'Panorama-Casinobar mit 180° Blick über die Algarve und den Atlantik. Anspruchsvolles Ambiente, Premium-Weinkarte und Hintergrundmusik.',
    },
    tags: ['Vista 180°', 'Vinho', 'Piano Bar'],
    accentColor: '#7C3AED',
    bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    lat: 37.1780, lng: -7.4497,
  },
  {
    id: 4,
    name: 'Faz Gostos',
    label: 'Rooftop',
    emoji: '🥂',
    opens: '19h00',
    desc: {
      PT: 'Esplanada com vistas privilegiadas sobre a Praça Marquês de Pombal. Vinhos do Alentejo, petiscos e o som da cidade ao entardecer.',
      EN: 'Terrace with privileged views over Marquês de Pombal Square. Alentejo wines, snacks and the sound of the city at dusk.',
      ES: 'Terraza con vistas privilegiadas sobre la Plaza Marqués de Pombal. Vinos del Alentejo, aperitivos y el sonido de la ciudad al atardecer.',
      FR: 'Terrasse avec vue privilégiée sur la Place Marquês de Pombal. Vins de l\'Alentejo, tapas et le son de la ville au crépuscule.',
      DE: 'Terrasse mit privilegiertem Blick auf den Marquês de Pombal Platz. Alentejo-Weine, Snacks und der Klang der Stadt bei Dämmerung.',
    },
    tags: ['Rooftop', 'Petiscos', 'Vista Praça'],
    accentColor: '#BE185D',
    bg: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
    lat: 37.1948, lng: -7.4150,
  },
]

export default function Sunsets({ lang }) {
  const L = lang || 'PT'
  const t = T[L] || T.PT
  const [expanded, setExpanded] = useState(null)
  const sunsetTime = getSunsetTime()

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        background: 'url("/images/sunset_hero_hr.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '18px 20px 28px',
        paddingTop: 'calc(64px + env(safe-area-inset-top,0px))',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Cinematic gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.95) 100%)' }} />

        {/* Text */}
        <div style={{ position:'relative', display:'flex', flexDirection:'column', gap:4 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-.5px', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>{t.title}</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,.7)', letterSpacing: '.2px' }}>{t.sub}</div>
        </div>

        {/* Premium Golden Hour Card */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 14,
          marginTop: 24, background: 'rgba(20,20,30,0.5)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: '12px 18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          position: 'relative',
        }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #DC2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }}>
            🌅
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>{t.goldenHour}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-.5px', lineHeight: 1 }}>{sunsetTime}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 40px' }}>
        {/* Tip banner */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
          border: '1px solid #FDE68A',
          borderRadius: 12, padding: '11px 14px',
          fontSize: 12, color: '#92400E', fontWeight: 600,
          marginBottom: 16, lineHeight: 1.4,
        }}>
          {t.tip}
        </div>

        {/* Spots */}
        {SUNSET_SPOTS.map(spot => {
          const isOpen = expanded === spot.id
          const labelStyle = LABEL_STYLE[spot.label] || { bg: '#1F2937', color: '#F3F4F6' }
          return (
            <div key={spot.id} style={{
              background: spot.bg,
              borderRadius: 18,
              marginBottom: 12,
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              transition: 'box-shadow .2s',
            }}>
              {/* Card header */}
              <button
                onClick={() => setExpanded(isOpen ? null : spot.id)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '16px 16px 14px', textAlign: 'left',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                }}
              >
                {/* Emoji badge */}
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                  {spot.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>{spot.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
                      background: labelStyle.bg, color: labelStyle.color,
                      borderRadius: 50, padding: '2px 8px',
                    }}>{spot.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {spot.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 10, fontWeight: 600,
                        background: 'rgba(255,255,255,0.6)',
                        color: spot.accentColor,
                        border: `1px solid ${spot.accentColor}30`,
                        borderRadius: 50, padding: '2px 8px',
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: spot.accentColor, textTransform: 'uppercase', letterSpacing: 0.8 }}>{t.opens}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: spot.accentColor }}>{spot.opens}</div>
                  <span style={{ fontSize: 16, color: 'var(--ink-20)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>›</span>
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <p style={{ fontSize: 13, color: 'var(--ink-70)', lineHeight: 1.55, margin: '14px 0 14px' }}>
                    {spot.desc[L] || spot.desc.PT}
                  </p>
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`, '_blank', 'noopener,noreferrer')}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: spot.accentColor, color: '#fff',
                      fontSize: 13, fontWeight: 700,
                    }}
                  >
                    🗺️ {L === 'EN' ? 'Navigate' : L === 'ES' ? 'Navegar' : L === 'FR' ? 'Naviguer' : L === 'DE' ? 'Navigieren' : 'Navegar'}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
