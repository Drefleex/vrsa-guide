import { useState, useEffect } from 'react'
import { getInitials, getAvatarColor } from '../utils/avatarUtils'
import { tr } from '../utils/i18n'


const RICH = {
  268: { stars:5, price:'€€€€', phone:'+351 281 510 000',
    desc:{PT:'O Hotel Golfe de VRSA é o endereço de eleição para quem procura luxo no Algarve Oriental. Quartos com varanda e vista para o Guadiana, piscina exterior, spa e restaurante gourmet com chef premiado.',EN:'VRSA\'s premier luxury address. Rooms with balcony and Guadiana views, outdoor pool, spa and award-winning gourmet restaurant.',ES:'La dirección de lujo de VRSA. Habitaciones con balcón y vistas al Guadiana, piscina exterior, spa y restaurante gourmet.',FR:'L\'adresse de luxe de VRSA. Chambres avec balcon et vue sur le Guadiana, piscine extérieure, spa et restaurant gastronomique.',DE:'VRSA\'s Luxusadresse. Zimmer mit Balkon und Guadiana-Blick, Außenpool, Spa und Gourmetrestaurant.'},
    amenities:['pool','spa','restaurant','parking','wifi','ac'], book:'https://www.booking.com/city/pt/vila-real-de-santo-antonio.html' },
  260: { stars:4, price:'€€€', phone:'+351 281 510 100',
    desc:{PT:'A Pousada de VRSA ocupa um edifício pombalino original de 1778, completamente restaurado. Quartos amplos com vista para o rio Guadiana, sala de jantar histórica e jardim interior. Pequeno-almoço incluído.',EN:'VRSA Pousada occupies an original Pombaline building from 1778, fully restored. Spacious rooms with Guadiana views, historic dining room and inner garden. Breakfast included.',ES:'La Pousada de VRSA ocupa un edificio pombalino de 1778 restaurado. Habitaciones amplias con vistas al Guadiana.',FR:'La Pousada de VRSA occupe un bâtiment pombalin de 1778 entièrement restauré. Chambres spacieuses avec vue sur le Guadiana.',DE:'Die Pousada de VRSA befindet sich in einem restaurierten Pombalino-Gebäude von 1778. Geräumige Zimmer mit Blick auf den Guadiana.'},
    amenities:['restaurant','parking','wifi','ac','breakfast'], book:'https://www.booking.com/city/pt/vila-real-de-santo-antonio.html' },
  212: { stars:4, price:'€€€', phone:'+351 281 512 000',
    desc:{PT:'Hotel Apollo VRSA — hotel de 4 estrelas moderno com piscina exterior aquecida, ginásio equipado e quartos espaçosos. Localização central a 5 minutos a pé da Praça Marquês de Pombal. Ideal para famílias.',EN:'Hotel Apollo VRSA — modern 4-star hotel with heated outdoor pool, fully equipped gym and spacious rooms. Central location 5 minutes from Praça Marquês de Pombal.',ES:'Hotel Apollo VRSA — hotel moderno de 4 estrellas con piscina exterior climatizada y gimnasio. Ubicación central.',FR:'Hôtel Apollo VRSA — hôtel moderne 4 étoiles avec piscine extérieure chauffée et salle de sport.',DE:'Hotel Apollo VRSA — modernes 4-Sterne-Hotel mit beheiztem Außenpool und Fitnessstudio.'},
    amenities:['pool','gym','parking','wifi','ac'], book:'https://www.booking.com/city/pt/vila-real-de-santo-antonio.html' },
  214: { stars:2, price:'€', phone:'+351 281 513 200',
    desc:{PT:'Hostel Guadiana — o hostel mais central de VRSA, mesmo à beira rio. Quartos privados e dormitórios disponíveis. Cozinha partilhada equipada, terraço com vista para Ayamonte. Ideal para mochileiros.',EN:'Hostel Guadiana — VRSA\'s most central hostel, right on the riverfront. Private rooms and dormitories available. Equipped shared kitchen, terrace with views of Ayamonte.',ES:'Hostel Guadiana — el hostel más céntrico de VRSA, frente al río. Habitaciones privadas y dormitorios.',FR:'Hostel Guadiana — l\'auberge la plus centrale de VRSA, au bord du fleuve. Chambres privées et dortoirs.',DE:'Hostel Guadiana — VRSA\'s zentralstes Hostel direkt am Flussufer. Privatzimmer und Schlafsäle verfügbar.'},
    amenities:['wifi','kitchen','terrace'], book:'https://www.booking.com/city/pt/vila-real-de-santo-antonio.html' },
  221: { stars:3, price:'€€', phone:'+351 281 510 400',
    desc:{PT:'Hotel Arenilha Residence — apart-hotel à beira da Praia de VRSA. Quartos com kitchenette e terraço. Acordas, abres a porta e já estás na areia. Vista para o Oceano Atlântico. Estacionamento gratuito.',EN:'Hotel Arenilha Residence — apart-hotel next to VRSA Beach. Rooms with kitchenette and terrace. Wake up and step straight onto the sand. Atlantic Ocean views. Free parking.',ES:'Hotel Arenilha Residence — apart-hotel junto a la playa. Habitaciones con kitchenette y terraza.',FR:'Hôtel Arenilha Residence — apart-hôtel à côté de la plage. Chambres avec kitchenette et terrasse.',DE:'Hotel Arenilha Residence — Apart-Hotel neben dem Strand. Zimmer mit Kitchenette und Terrasse.'},
    amenities:['pool','parking','wifi','ac','beach'], book:'https://www.booking.com/city/pt/vila-real-de-santo-antonio.html' },
  230: { stars:2, price:'€', phone:'+351 281 511 000',
    desc:{PT:'Residencial Matos Pereira — hospedaria familiar no coração do centro histórico. Quartos confortáveis e limpos com casa de banho privada. Pequeno-almoço caseiro. A pé de todos os restaurantes e monumentos.',EN:'Residencial Matos Pereira — family guesthouse in the heart of the historic centre. Comfortable, clean rooms with private bathroom. Homemade breakfast. Walking distance to all restaurants.',ES:'Residencial Matos Pereira — hostal familiar en el corazón del centro histórico. Habitaciones cómodas con baño privado.',FR:'Residencial Matos Pereira — pension familiale au cœur du centre historique. Chambres confortables avec salle de bain privée.',DE:'Residencial Matos Pereira — Familienpension im Herzen der Altstadt. Komfortable Zimmer mit privatem Bad.'},
    amenities:['wifi','breakfast'], book:'https://www.booking.com/city/pt/vila-real-de-santo-antonio.html' },
}

function getRich(id) {
  return RICH[id] || { stars:3, price:'€€', desc:{PT:'Alojamento em VRSA.',EN:'Accommodation in VRSA.',ES:'Alojamiento en VRSA.',FR:'Hébergement à VRSA.',DE:'Unterkunft in VRSA.'}, book:'https://www.booking.com' }
}

function Stars({ n }) {
  return <span style={{ color:'#F59E0B', fontSize:12, letterSpacing:1 }}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</span>
}

const FILTERS = [
  { k:'all',     match: r => true },
  { k:'luxury',  match: r => r.stars >= 4 },
  { k:'mid',     match: r => r.stars === 3 },
  { k:'budget',  match: r => r.stars <= 2 },
]

export default function Hotels({ lang, pins, favs, toggleFav, onNav, focusPin, onFocusClear }) {
  const L = lang || 'PT'
  const t = tr('hotels', L)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState(focusPin || null)

  useEffect(() => {
    if (focusPin) { setDetail(focusPin); onFocusClear?.() }
  }, [focusPin])
  const hotelPins = pins.filter(p => p.cat === 'hotel')

  const filtered = hotelPins.filter(p => {
    const r = getRich(p.id)
    const f = FILTERS.find(x => x.k === filter)
    if (f && !f.match(r)) return false
    if (search.trim()) return p.name.toLowerCase().includes(search.toLowerCase())
    return true
  })

  if (detail) {
    const r    = getRich(detail.id)
    const isFav = favs.includes('pin-' + detail.id)
    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        <div style={{ background:getAvatarColor(detail.name), padding:'20px 18px 24px', paddingTop:'calc(64px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <button aria-label={t.back} onClick={() => setDetail(null)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
            <button aria-label={t.fav} onClick={() => toggleFav('pin-' + detail.id)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav ? '❤️' : '🤍'}</button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:60, height:60, borderRadius:14, background:'rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:22, fontWeight:700, color:'#fff' }}>{getInitials(detail.name)}</span>
            </div>
            <div>
              <div style={{ fontSize:20, fontWeight:700, color:'#fff', lineHeight:1.2 }}>{detail.name}</div>
              <div style={{ display:'flex', gap:6, marginTop:5 }}>
                <span style={{ fontSize:11, color:'rgba(255,255,255,.7)', background:'rgba(255,255,255,.15)', padding:'2px 8px', borderRadius:50 }}>{r.price}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,.6)' }}>{'★'.repeat(r.stars)}{'☆'.repeat(5-r.stars)}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'18px 20px 40px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:21, fontWeight:800, color:'var(--ink)', lineHeight:1.2, flex:1 }}>{detail.name}</div>
            <div style={{ fontSize:16, fontWeight:800, color:'var(--ink)', flexShrink:0 }}>{r.price}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <Stars n={r.stars} />
            <span style={{ fontSize:11, color:'var(--ink-40)' }}>{r.stars} {t.stars}</span>
          </div>
          <p style={{ fontSize:13, color:'var(--ink-40)', lineHeight:1.75, marginBottom:20 }}>{r.desc[L] || r.desc.PT}</p>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => window.open(r.book, '_blank','noopener,noreferrer')} style={{ flex:1, padding:'13px 0', background:'var(--navy)', color:'#fff', border:'none', borderRadius:14, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>🛏️ {t.book}</button>
            <button aria-label={t.navigate} onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination='+detail.lat+','+detail.lng, '_blank','noopener,noreferrer')} style={{ width:50, height:50, background:'var(--blue-lt)', border:'none', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>🧭</button>
            <button aria-label={t.fav} onClick={() => toggleFav('pin-' + detail.id)} style={{ width:50, height:50, background: isFav ? '#FEE2E2' : 'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav ? '❤️' : '🤍'}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ display:'flex', flexDirection:'column' }}>
      <div style={{ background:'linear-gradient(160deg,var(--navy) 0%,#162844 100%)', padding:'18px 20px 0', paddingTop:'calc(62px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#fff', marginBottom:12 }}>{t.title}</div>
        <div style={{ position:'relative', marginBottom:12 }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, pointerEvents:'none' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} style={{ width:'100%', padding:'10px 14px 10px 40px', border:'1px solid rgba(255,255,255,.15)', borderRadius:50, background:'rgba(255,255,255,.1)', color:'#fff', fontSize:13, outline:'none', fontFamily:'var(--font)' }} />
        </div>
        <div style={{ display:'flex', gap:6, paddingBottom:14 }}>
          {FILTERS.map(f => (
            <button key={f.k} onClick={() => setFilter(f.k)} style={{ flexShrink:0, padding:'6px 14px', borderRadius:50, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, background: filter === f.k ? '#fff' : 'rgba(255,255,255,.1)', color: filter === f.k ? 'var(--navy)' : 'rgba(255,255,255,.6)', transition:'all .15s' }}>{t[f.k]}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px 32px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--ink-20)' }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🏨</div>
            <div style={{ fontSize:13 }}>{t.noResults}</div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {filtered.map(p => {
              const r    = getRich(p.id)
              const isFav = favs.includes('pin-' + p.id)
              return (
                <div key={p.id} onClick={() => setDetail(p)} className="card" style={{ cursor:'pointer', overflow:'hidden' }}>
                  <div style={{ height:100, background:getAvatarColor(p.name), display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', position:'relative' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:52, height:52, borderRadius:12, background:'rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ fontSize:20, fontWeight:700, color:'#fff' }}>{getInitials(p.name)}</span>
                      </div>
                      <span style={{ background:'rgba(255,255,255,.2)', color:'#fff', fontSize:12, fontWeight:700, padding:'2px 10px', borderRadius:50 }}>{r.price}</span>
                    </div>
                    <button aria-label={t.fav} onClick={e => { e.stopPropagation(); toggleFav('pin-' + p.id) }} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav ? '❤️' : '🤍'}</button>
                  </div>
                  <div style={{ padding:'12px 14px' }}>
                    <div style={{ fontSize:14, fontWeight:800, color:'var(--ink)', marginBottom:4 }}>{p.name}</div>
                    <Stars n={r.stars} />
                    <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{(r.desc[L] || r.desc.PT).substring(0,80)}...</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}