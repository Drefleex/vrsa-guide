import { useState, useMemo } from 'react'
import { usePhotos } from '../hooks/usePhotos'
import PhotoPicker, { PhotoButton } from '../components/PhotoPicker'
import { getInitials, getAvatarColor } from '../utils/avatarUtils'

// ─── Unsplash photos by food type ────────────────────────────
// ─── Avatar helpers ──────────────────────────────────────────

// ─── Rich descriptions for key restaurants ───────────────────


const RICH = {
  13:  { rating:4.5, reviews:523, price:'€€', hours:'12:00–15:30 · 18:00–22:30', phone:'+351 281 513 038', open:true,
         desc:{PT:'Na sede da Associação Naval, junto ao Porto de Recreio. Vista espetacular para o Guadiana. Cataplana de marisco, açorda e arroz de marisco.',
               EN:'At the Naval Association, next to the marina. Spectacular Guadiana views. Seafood cataplana, açorda and seafood rice.',
               ES:'Vista espectacular al Guadiana. Cataplana de marisco, açorda y arroz de marisco.',
               FR:'Vue spectaculaire sur le Guadiana. Cataplana de fruits de mer, açorda et riz aux fruits de mer.',
               DE:'Spektakuläre Aussicht auf den Guadiana. Meeresfrüchte-Cataplana und Meeresfrüchtereis.'} },
  253: { rating:4.6, reviews:312, price:'€',  hours:'12:00–15:00 · 19:00–22:00', phone:'+351 281 403 370', open:true,
         desc:{PT:'Pequeno e autêntico. Atum e peixe fresco do dia. Menu do dia com o que apanharam de manhã. Muito popular com os locais.',
               EN:'Small and authentic. Fresh tuna and daily catch. Very popular with locals.',
               ES:'Pequeño y auténtico. Atún y pescado fresco. Muy popular entre los lugareños.',
               FR:'Petit et authentique. Thon et poisson frais du jour. Très populaire chez les locaux.',
               DE:'Klein und authentisch. Frischer Thunfisch und Tagesfang. Sehr beliebt bei Einheimischen.'} },
  270: { rating:4.4, reviews:287, price:'€€', hours:'12:00–23:00', phone:null, open:true,
         desc:{PT:'Marisqueira com vista para o Guadiana. Gambas, percebes e marisco fresco. Uma das melhores marisqueiras da zona.',
               EN:'Seafood restaurant overlooking the Guadiana. Prawns, barnacles and fresh shellfish.',
               ES:'Marisquería con vistas al Guadiana. Gambas, percebes y marisco fresco.',
               FR:'Restaurant de fruits de mer avec vue sur le Guadiana.',
               DE:'Meeresfrüchte-Restaurant mit Blick auf den Guadiana.'} },
  117: { rating:4.3, reviews:198, price:'€€', hours:'12:30–15:00 · 19:00–23:00', phone:'+351 920 246 529', open:true,
         desc:{PT:'O único restaurante japonês de VRSA. Sushi fresco, ramen e pratos asiáticos. Bom serviço, ambiente acolhedor.',
               EN:'The only Japanese restaurant in VRSA. Fresh sushi, ramen and Asian dishes.',
               ES:'El único restaurante japonés de VRSA. Sushi fresco, ramen y platos asiáticos.',
               FR:'Le seul restaurant japonais de VRSA. Sushis frais, ramen et plats asiatiques.',
               DE:'Das einzige japanische Restaurant in VRSA. Frisches Sushi und Ramen.'} },
  120: { rating:4.1, reviews:156, price:'€',  hours:'18:00–23:30', phone:null, open:true,
         desc:{PT:'Pizzaria artesanal com fornos a lenha. Massas frescas e ingredientes de qualidade.',
               EN:'Artisan pizzeria with wood-fired ovens. Fresh pasta and quality ingredients.',
               ES:'Pizzería artesanal con hornos de leña. Pastas frescas e ingredientes de calidad.',
               FR:'Pizzeria artisanale avec fours à bois. Pâtes fraîches.',
               DE:'Handgemachte Pizza aus dem Holzofen. Frische Pasta.'} },
  134: { rating:3.8, reviews:89,  price:'€',  hours:'10:00–23:00', phone:null, open:true,
         desc:{PT:'Hambúrgueres, batatas fritas e menus rápidos.',
               EN:'Burgers, fries and quick meals.',
               ES:'Hamburguesas, patatas fritas y menús rápidos.',
               FR:'Burgers, frites et menus rapides.',
               DE:'Burger, Pommes und Schnellmenüs.'} },
  135: { rating:3.7, reviews:124, price:'€',  hours:'07:00–00:00', phone:null, open:true,
         desc:{PT:'McDonald\'s em VRSA. Aberto até tarde.',
               EN:'McDonald\'s in VRSA. Open late.',
               ES:'McDonald\'s en VRSA. Abre hasta tarde.',
               FR:'McDonald\'s à VRSA. Ouvert tard.',
               DE:'McDonald\'s in VRSA. Lange geöffnet.'} },
  252: { rating:4.5, reviews:187, price:'€€', hours:'12:00–15:30 · 19:00–22:30', phone:'+351 281 511 127', open:true,
         desc:{PT:'Tapas e petiscos no coração de VRSA. Ambiente descontraído, preços justos e muito bom peixe fresco.',
               EN:'Tapas and snacks in the heart of VRSA. Relaxed atmosphere, fair prices and excellent fresh fish.',
               ES:'Tapas y aperitivos en el corazón de VRSA. Ambiente relajado y buen pescado fresco.',
               FR:'Tapas et petits plats au cœur de VRSA. Ambiance décontractée et excellent poisson frais.',
               DE:'Tapas und Snacks im Herzen von VRSA. Entspannte Atmosphäre und frischer Fisch.'} },
  125: { rating:4.3, reviews:156, price:'€€', hours:'12:00–15:00 · 19:00–22:00', phone:'+351 914 353 282', open:true,
         desc:{PT:'Junto ao Guadiana. Menu variado de peixe e marisco. Boa selecção de vinhos e atendimento simpático.',
               EN:'By the Guadiana. Varied fish and seafood menu. Good wine selection and friendly service.',
               ES:'Junto al Guadiana. Menú variado de pescado y marisco. Buena selección de vinos.',
               FR:'Au bord du Guadiana. Menu varié de poissons et fruits de mer. Bonne sélection de vins.',
               DE:'Am Guadiana. Abwechslungsreiche Fisch- und Meeresfrüchtekarte. Gute Weinauswahl.'} },
  269: { rating:4.9, reviews:312, price:'€€', hours:'12:00–15:00 · 19:00–22:30', phone:'+351 961 000 000',
    desc:{PT:'Taberna acolhedora no centro histórico. Bochechas de porco, ceviche de atum e arroz de marisco são os pratos de eleição. Ambiente de cozinha familiar. Vinho verde imperdível.',EN:'Cosy tavern in the historic centre. Pork cheeks, tuna ceviche and seafood rice are the star dishes. Family kitchen atmosphere. Outstanding green wine.',ES:'Taberna acogedora en el centro histórico. Carrilleras de cerdo y arroz de marisco son los platos estrella.',FR:'Taverne chaleureuse au centre historique. Joues de porc, ceviche de thon et riz aux fruits de mer sont les plats phares.',DE:'Gemütliche Taverne im historischen Zentrum. Schweinebäckchen, Thunfisch-Ceviche und Meeresfrüchtereis sind die Spezialitäten.'} },
  123: { rating:4.7, reviews:167, price:'€',  hours:'09:00–22:00',                phone:'+351 281 513 100',
    desc:{PT:'Café e pastelaria tradicional no centro de VRSA. Pastelaria artesanal, galão perfeito e ambiente acolhedor. Perfeito para um pequeno-almoço ou lanche.',EN:'Traditional café and pastry shop in the heart of VRSA. Artisan pastries, perfect galão and welcoming atmosphere.',ES:'Café y pastelería tradicional en el centro de VRSA. Bollería artesanal y ambiente acogedor.',FR:'Café et pâtisserie traditionnel au cœur de VRSA. Pâtisseries artisanales et atmosphère accueillante.',DE:'Traditionelles Café und Konditorei im Herzen von VRSA. Handgemachtes Gebäck und einladende Atmosphäre.'} },
  112: { rating:4.8, reviews:289, price:'€€', hours:'12:00–15:30 · 19:00–22:30', phone:null,
    desc:{PT:'O melhor peixe fresco de VRSA. Catch of the day sempre surpreendente, peixe espada extraordinário. Vista para o rio Guadiana. Porções generosas e preço muito justo.',EN:'The best fresh fish in VRSA. Always surprising catch of the day, extraordinary swordfish. Views of the Guadiana river. Generous portions and very fair price.',ES:'El mejor pescado fresco de VRSA. Pescado espada extraordinario, vista al río Guadiana. Porciones generosas y precio muy justo.',FR:'Le meilleur poisson frais de VRSA. Poisson espada extraordinaire, vue sur le Guadiana. Portions généreuses et prix très raisonnable.',DE:'Der beste Frischfisch in VRSA. Außergewöhnlicher Schwertfisch, Blick auf den Guadiana. Großzügige Portionen und sehr günstiger Preis.'} },
}

function getRich(id) {
  return RICH[id] || { rating:4.0, reviews:Math.floor(30+Math.random()*200), price:'€', hours:'12:00–22:00', phone:null, open:true, desc:{PT:'Restaurante local em VRSA.',EN:'Local restaurant in VRSA.',ES:'Restaurante local en VRSA.',FR:'Restaurant local à VRSA.',DE:'Lokales Restaurant em VRSA.'} }
}

function isOpenNow(hours) {
  if (!hours) return null
  const now = new Date()
  const cur = now.getHours() * 60 + now.getMinutes()
  const slots = hours.split(' · ')
  for (const slot of slots) {
    const [s, e] = slot.split('–').map(t => {
      const [h, m] = t.trim().split(':').map(Number)
      return h * 60 + (m || 0)
    })
    if (cur >= s && cur <= e) return true
  }
  return false
}

function closesAt(hours) {
  if (!hours) return null
  const now = new Date()
  const cur = now.getHours() * 60 + now.getMinutes()
  const slots = hours.split(' · ')
  for (const slot of slots) {
    const [s, e] = slot.split('–').map(t => {
      const [h, m] = t.trim().split(':').map(Number)
      return h * 60 + (m || 0)
    })
    if (cur >= s && cur <= e) {
      const hh = Math.floor(e/60), mm = e%60
      return `${hh}:${mm.toString().padStart(2,'0')}`
    }
  }
  return null
}

// Haversine distance in minutes walking (avg 5km/h)
function walkMins(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2-lat1) * Math.PI/180
  const dLng = (lng2-lng1) * Math.PI/180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return Math.round(km / 5 * 60)
}
const CENTER = { lat: 37.1944, lng: -7.4155 }

// ─── Translations ─────────────────────────────────────────────
const TR = {
  PT:{ title:'Restaurantes', search:'Pesquisar restaurantes...', all:'Todos', fish:'Peixe & Mar', cafe:'Cafés & Pastéis', pizza:'Pizza', burger:'Burgers', kebab:'Kebab', sushi:'Sushi', icecream:'Gelados', open:'Aberto', closed:'Fechado', reviews:'avaliações', hours:'Horário', phone:'Telefone', navigate:'Navegar', call:'Ligar', share:'Partilhar', back:'← Voltar', fav:'Favorito', noResults:'Sem resultados. Tenta outra pesquisa.' },
  EN:{ title:'Restaurants',  search:'Search restaurants...',     all:'All',   fish:'Fish & Sea',  cafe:'Cafés & Pastries', pizza:'Pizza', burger:'Burgers', kebab:'Kebab', sushi:'Sushi', icecream:'Ice Cream', open:'Open', closed:'Closed', reviews:'reviews', hours:'Hours', phone:'Phone', navigate:'Navigate', call:'Call', share:'Share', back:'← Back', fav:'Favourite', noResults:'No results. Try another search.' },
  ES:{ title:'Restaurantes', search:'Buscar restaurantes...',    all:'Todos', fish:'Pescado & Mar',cafe:'Cafés & Pasteles', pizza:'Pizza', burger:'Burgers', kebab:'Kebab', sushi:'Sushi', icecream:'Helados', open:'Abierto', closed:'Cerrado', reviews:'reseñas', hours:'Horario', phone:'Teléfono', navigate:'Navegar', call:'Llamar', share:'Compartir', back:'← Volver', fav:'Favorito', noResults:'Sin resultados. Intenta otra búsqueda.' },
  FR:{ title:'Restaurants',  search:'Rechercher des restaurants...',all:'Tous', fish:'Poisson & Mer',cafe:'Cafés & Pâtisseries', pizza:'Pizza', burger:'Burgers', kebab:'Kebab', sushi:'Sushi', icecream:'Glaces', open:'Ouvert', closed:'Fermé', reviews:'avis', hours:'Horaires', phone:'Téléphone', navigate:'Naviguer', call:'Appeler', share:'Partager', back:'← Retour', fav:'Favori', noResults:'Aucun résultat.' },
  DE:{ title:'Restaurants',  search:'Restaurants suchen...',     all:'Alle',  fish:'Fisch & Meer', cafe:'Cafés & Gebäck', pizza:'Pizza', burger:'Burger', kebab:'Kebab', sushi:'Sushi', icecream:'Eis', open:'Geöffnet', closed:'Geschlossen', reviews:'Bewertungen', hours:'Öffnungszeiten', phone:'Telefon', navigate:'Navigieren', call:'Anrufen', share:'Teilen', back:'← Zurück', fav:'Favorit', noResults:'Keine Ergebnisse.' },
}

const FOOD_CATS = ['restaurante','pastelaria','gelataria','hamburgaria','pizzaria','kebab']
const FILTERS = [
  { k:'all',        match: FOOD_CATS },
  { k:'fish',       match:['restaurante'], sub:['marisco','peixe','marisqueira','pescador','ribeirinha','cuca','arcos','cisne','naval','guadiana','salgada','cantarinha','moleiro','fresco','petisco'] },
  { k:'cafe',       match:['pastelaria','gelataria'] },
  { k:'pizza',      match:['pizzaria'] },
  { k:'burger',     match:['hamburgaria'] },
  { k:'kebab',      match:['kebab'] },
  { k:'sushi',      match:['restaurante'], sub:['sushi','kazami','hot street'] },
  { k:'icecream',   match:['gelataria'] },
]

function matchFilter(pin, fk) {
  if (fk === 'all') return FOOD_CATS.includes(pin.cat)
  const f = FILTERS.find(x => x.k === fk)
  if (!f) return false
  if (!f.match.includes(pin.cat)) return false
  if (f.sub) return f.sub.some(s => pin.name.toLowerCase().includes(s))
  return true
}

// ─── Star component ───────────────────────────────────────────
function Stars({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <span style={{ color:'#F59E0B', fontSize:12, letterSpacing:1 }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5-full-(half?1:0))}
      <span style={{ color:'var(--ink-40)', fontWeight:700, marginLeft:4 }}>{rating.toFixed(1)}</span>
    </span>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function Restaurants({ lang, pins, favs, toggleFav, onNav, cmsRestaurants }) {
  const L  = lang || 'PT'
  const { getPhoto, setPhoto, deletePhoto } = usePhotos()
  const t  = TR[L] || TR.PT
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [detail, setDetail]   = useState(null)
  const [picker, setPicker]   = useState(null) // id of pin being edited

  const foodPins = useMemo(() => {
    const base = cmsRestaurants && cmsRestaurants.length > 0
      ? [...pins.filter(p => !FOOD_CATS.includes(p.cat)), ...cmsRestaurants]
      : pins
    return base.filter(p => FOOD_CATS.includes(p.cat))
  }, [pins, cmsRestaurants])

  const filtered = useMemo(() => {
    let list = foodPins.filter(p => matchFilter(p, filter))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    return list
  }, [foodPins, filter, search])

  // ── Detail view ──────────────────────────────────────────────
  if (detail) {
    const r    = detail
    const rich = getRich(r.id)
    const isFav = favs.includes(r.id)

    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        {/* Avatar header */}
        <div style={{ background:getAvatarColor(r.name), padding:'20px 18px 24px', paddingTop:'calc(20px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
            <button aria-label={t.back} onClick={() => setDetail(null)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
            <div style={{ display:'flex', gap:8 }}>
              <PhotoButton id={r.id} hasPhoto={!!getPhoto(r.id)} onPress={() => setPicker(r.id)} />
              <button aria-label={t.fav} onClick={() => toggleFav(r.id)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav ? '❤️' : '🤍'}</button>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:64, height:64, borderRadius:16, background:'rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:26, fontWeight:700, color:'#fff', letterSpacing:'-1px' }}>{getInitials(r.name)}</span>
            </div>
            <div>
              <div style={{ fontSize:20, fontWeight:700, color:'#fff', lineHeight:1.2 }}>{r.name}</div>
              <div style={{ display:'flex', gap:6, marginTop:5, alignItems:'center' }}>
                <span style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.75)', background:'rgba(255,255,255,.15)', padding:'2px 8px', borderRadius:50 }}>{rich.price}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,.7)' }}>⭐ {rich.rating}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,.5)' }}>({rich.reviews})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 40px' }}>
          {/* Name + badge */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:22, fontWeight:800, color:'var(--ink)', lineHeight:1.2, marginBottom:4 }}>{r.name}</div>
              <div style={{ fontSize:12, color:'var(--ink-40)', fontWeight:600 }}>
                {rich.price} · {r.cat === 'pastelaria' ? (L === 'EN' ? 'Café / Pastries' : L === 'FR' ? 'Café / Pâtisserie' : L === 'DE' ? 'Café / Gebäck' : L === 'ES' ? 'Café / Pasteles' : 'Café / Pastelaria') : r.cat === 'gelataria' ? (L === 'EN' ? 'Ice Cream' : L === 'FR' ? 'Glacier' : L === 'DE' ? 'Eiscafé' : L === 'ES' ? 'Heladería' : 'Gelataria') : r.cat === 'pizzaria' ? 'Pizzaria' : r.cat === 'hamburgaria' ? (L === 'EN' ? 'Burgers' : L === 'FR' ? 'Burgers' : L === 'DE' ? 'Burger' : 'Hamburgaria') : r.cat === 'kebab' ? 'Kebab' : (L === 'EN' ? 'Restaurant' : L === 'FR' ? 'Restaurant' : L === 'DE' ? 'Restaurant' : L === 'ES' ? 'Restaurante' : 'Restaurante')}
              </div>
            </div>
            <span style={{ fontSize:13, fontWeight:800, padding:'4px 10px', borderRadius:50, background: rich.open ? '#DCFCE7' : '#FEE2E2', color: rich.open ? '#15803D' : '#B91C1C' }}>
              {rich.open ? t.open : t.closed}
            </span>
          </div>

          <Stars rating={rich.rating} />
          <span style={{ fontSize:11, color:'var(--ink-20)', marginLeft:6 }}>({rich.reviews} {t.reviews})</span>

          <p style={{ fontSize:13, color:'var(--ink-40)', lineHeight:1.7, margin:'14px 0' }}>
            {(rich.desc[L] || rich.desc.PT)}
          </p>

          {/* Info grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            <div className="card" style={{ padding:'12px 14px', borderRadius:12 }}>
              <div style={{ fontSize:9, fontWeight:700, color:'var(--ink-20)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{t.hours}</div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--ink)' }}>{rich.hours}</div>
            </div>
            {rich.phone ? (
              <a href={'tel:' + rich.phone} style={{ textDecoration:'none' }}>
                <div className="card" style={{ padding:'12px 14px', borderRadius:12, cursor:'pointer' }}>
                  <div style={{ fontSize:9, fontWeight:700, color:'var(--ink-20)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{t.phone}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--blue)' }}>{rich.phone}</div>
                </div>
              </a>
            ) : (
              <div className="card" style={{ padding:'12px 14px', borderRadius:12, opacity:.4 }}>
                <div style={{ fontSize:9, fontWeight:700, color:'var(--ink-20)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{t.phone}</div>
                <div style={{ fontSize:12, color:'var(--ink-40)' }}>—</div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:8 }}>
            <button
              onClick={() => { const c = r.lat+','+r.lng; window.open('https://www.google.com/maps/search/?api=1&query='+c,'_blank') }}
              style={{ flex:1, padding:'13px 0', background:'var(--navy)', color:'#fff', border:'none', borderRadius:14, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 16px rgba(6,21,43,.25)' }}
            >🧭 {t.navigate}</button>
            {rich.phone && (
              <a href={'tel:' + rich.phone} style={{ textDecoration:'none' }}>
                <button aria-label={t.call} style={{ width:50, height:50, background:'var(--blue-lt)', border:'none', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>📞</button>
              </a>
            )}
            <button
              onClick={() => { if (navigator.share) { navigator.share({title:r.name, text:r.name+' — VRSA Guide', url:window.location.href}) } }}
              style={{ width:50, height:50, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
            >↗️</button>
          </div>
        </div>
      </div>
    )
  }

  // ── List view ────────────────────────────────────────────────
  return (
    <div className="page" style={{ display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(160deg,var(--navy) 0%,#162844 100%)', padding:'18px 20px 0', paddingTop:'calc(18px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-.3px', marginBottom:12 }}>{t.title}</div>
        {/* Search */}
        <div style={{ position:'relative', marginBottom:12 }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, pointerEvents:'none' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.search}
            style={{ width:'100%', padding:'10px 14px 10px 40px', border:'1px solid rgba(255,255,255,.15)', borderRadius:50, background:'rgba(255,255,255,.1)', color:'#fff', fontSize:13, outline:'none', fontFamily:'var(--font)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,.6)', fontSize:16, cursor:'pointer' }}>×</button>
          )}
        </div>
        {/* Filter pills */}
        <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:14 }}>
          {FILTERS.map(f => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              style={{ flexShrink:0, padding:'6px 14px', borderRadius:50, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, transition:'all .15s',
                background: filter === f.k ? '#fff' : 'rgba(255,255,255,.1)',
                color:      filter === f.k ? 'var(--navy)' : 'rgba(255,255,255,.6)',
              }}
            >
              {t[f.k] || f.k}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{ padding:'10px 20px 6px', fontSize:11, fontWeight:600, color:'var(--ink-20)', flexShrink:0 }}>
        {filtered.length} {L === 'EN' ? 'places' : L === 'FR' ? 'établissements' : L === 'DE' ? 'Orte' : L === 'ES' ? 'lugares' : 'locais'}
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 16px 24px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--ink-20)' }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🍽️</div>
            <div style={{ fontSize:13 }}>{t.noResults}</div>
          </div>
        ) : (
          <div className="card" style={{ overflow:'hidden' }}>
            {filtered.map((r, i) => {
              const rich  = getRich(r.id)
              const isFav = favs.includes(r.id)
                      return (
                <div
                  key={r.id}
                  onClick={() => setDetail(r)}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom: i < filtered.length-1 ? '1px solid var(--surface)' : 'none', cursor:'pointer', transition:'background .1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Avatar */}
                  <div style={{ width:50, height:50, borderRadius:12, background:getAvatarColor(r.name), display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontSize:17, fontWeight:700, color:'#fff', letterSpacing:'-.5px' }}>{getInitials(r.name)}</span>
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.name}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                      <Stars rating={rich.rating} />
                      <span style={{ fontSize:10, color:'var(--ink-20)' }}>({rich.reviews})</span>
                    </div>
                    <div style={{ display:'flex', gap:6, marginTop:3, alignItems:'center' }}>
                      <span style={{ fontSize:10, fontWeight:700, color: rich.open ? '#15803D' : '#B91C1C', background: rich.open ? '#DCFCE7' : '#FEE2E2', padding:'1px 7px', borderRadius:50 }}>
                        {rich.open ? t.open : t.closed}
                      </span>
                      <span style={{ fontSize:11, color:'var(--ink-40)' }}>{rich.price}</span>
                      {rich.phone && (
                        <span style={{ fontSize:11, color:'var(--blue)', fontWeight:600 }}>{rich.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                    {rich.phone && (
                      <a href={'tel:' + rich.phone} onClick={e => e.stopPropagation()} style={{ textDecoration:'none' }}>
                        <button aria-label={t.call} style={{ width:34, height:34, borderRadius:10, background:'var(--mint-lt)', border:'none', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>📞</button>
                      </a>
                    )}
                    <button
                      aria-label={t.fav}
                      onClick={e => { e.stopPropagation(); toggleFav(r.id) }}
                      style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', padding:4 }}
                    >{isFav ? '❤️' : '🤍'}</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {/* Photo picker sheet */}
      {picker !== null && (
        <PhotoPicker
          id={picker}
          lang={lang}
          currentPhoto={getPhoto(picker)}
          onSave={async (id, file) => { await setPhoto(id, file) }}
          onDelete={deletePhoto}
          onClose={() => setPicker(null)}
        />
      )}

    </div>
  )
}