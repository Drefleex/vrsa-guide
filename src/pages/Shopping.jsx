import { useState, useEffect, useRef } from 'react'
import { getInitials, getAvatarColor } from '../utils/avatarUtils'
import { tr } from '../utils/i18n'


const SHOP_CATS = ['mercado','compras']
const FILTERS = [
  { k:'all',    cats:['mercado','compras'] },
  { k:'market', cats:['mercado'], isMarket: true },
  { k:'super',  cats:['mercado'], isSuper: true },
  { k:'shops',  cats:['compras'] },
]

function getDetails(p) {
  const n = p.name.toLowerCase();
  
  // Real schedules for VRSA markets based on actual regional data
  if (n.includes('mercado municipal')) {
    return { hours:'Seg–Sáb 07:00–14:00 (Dom fechado)', note: {
      PT:'Mercado tradicional fantástico para comprar peixe e marisco fresco apanhado na zona, carnes, pão regional e vegetais dos produtores locais.',
      EN:'Fantastic traditional market to buy fresh locally caught fish, regional bread, and vegetables straight from local producers.',
      ES:'Mercado tradicional fantástico para comprar pescado y marisco fresco, pan regional y verduras locales.',
      FR:'Fantastique marché traditionnel pour acheter du poisson frais local, du pain régional et des légumes.',
      DE:'Fantastischer traditioneller Markt für frischen lokalen Fisch, regionales Brot und Gemüse.'
    }};
  }

  if (n.includes('continente modelo')) return { hours:'Seg–Dom 08:00–22:00', note: { PT:'Hipermercado completo com parque coberto, garrafeira vasta, talho, peixaria, padaria com fabrico próprio e secção bem-estar.', EN:'Complete hypermarket with covered parking, wine cellar, fresh fish, bakery, and health section.', ES:'Hipermercado completo con parking, bodega, pescado fresco y panadería.', FR:'Hypermarché complet avec parking, cave à vin, poisson frais et boulangerie.', DE:'Vollständiger Hypermarkt mit Parkplatz, Weinkeller, frischem Fisch und Bäckerei.' }};
  
  if (n.includes('continente bom dia')) return { hours:'Seg–Dom 08:00–21:00', note: { PT:'Prático supermercado focado na conveniência e bens alimentares essenciais de grande qualidade da marca Continente.', EN:'Convenient supermarket focused on daily essentials and high-quality Continente products.', ES:'Supermercado centrado en productos esenciales diarios.', FR:'Supermarché axé sur les produits essentiels quotidiens.', DE:'Supermarkt mit Fokus auf den täglichen Bedarf.' }};

  if (n.includes('pingo doce')) return { hours:'Seg–Dom 08:30–21:00', note: { PT:'Grande variedade de marca própria famosa pelas suas refeições prontas (take-away), peixaria excelente e produtos da época.', EN:'Known for its private label, great ready-to-eat meals (take-away), excellent fish counter, and seasonal products.', ES:'Conocido por sus comidas preparadas, excelente pescadería y productos de temporada.', FR:'Connu pour ses plats préparés, son excellente poissonnerie et ses produits de saison.', DE:'Bekannt für Fertiggerichte, ausgezeichnete Fischtheke und saisonale Produkte.' }};

  if (n.includes('lidl')) return { hours:'Seg–Dom 08:00–22:00', note: { PT:'Destaca-se pela padaria de alta qualidade acabada de cozer, ferramentas semanais exclusivas e boa selecção de vinhos e congelados.', EN:'Stands out for its freshly baked high-quality bakery, weekly special non-food aisles, and good frozen selection.', ES:'Destaca por su panadería recién horneada y ofertas semanales.', FR:'Se distingue par sa boulangerie fraîchement cuite et ses offres hebdomadaires.', DE:'Zeichnet sich durch frisch gebackene Backwaren und wöchentliche Angebote aus.' }};

  if (n.includes('intermarché')) return { hours:'Seg–Dom 08:30–21:00', note: { PT:'Ampla selecção de produtos de vários países (incluindo França, UK), talho e peixaria com atendimento especializado, e combustível.', EN:'Wide selection of international foods, specialized butcher and fishmonger, plus fuel station outside.', ES:'Amplia selección de productos internacionales e incluye gasolinera exterior.', FR:'Large choix de produits internationaux et station-service à l\'extérieur.', DE:'Große Auswahl an internationalen Produkten und Tankstelle draußen.' }};

  if (n.includes('auchan')) return { hours:'Seg–Dom 08:30–21:00', note: { PT:'Mercado central bem organizado, óptimos queijos, produtos biológicos e boa variedade de higiene e marcas próprias (MyAuchan).', EN:'Well organized central market, great cheeses, organic products, and their MyAuchan brand items.', ES:'Mercado central bien organizado, grandes quesos y productos biológicos.', FR:'Marché central bien organisé, excellents fromages et produits bios.', DE:'Gut organisierter zentraler Markt, toller Käse und Bio-Produkte.' }};

  if (n.includes('mini') || n.includes('amanhecer') || n.includes('coviran') || n.includes('superpreço') || n.includes('filho') || n.includes('corvo') || n.includes('mineral')) {
    return { hours:'Seg–Dom 08:30–20:00', note: { PT:'Mercearia de bairro ideal para compras essenciais rápidas, snacks e pão fresco sem necessidade de ir de carro.', EN:'Neighborhood grocery ideal for quick essentials, snacks, and fresh bread without driving.', ES:'Tienda de barrio ideal para compras esenciales y pan fresco.', FR:'Épicerie de quartier idéale pour les courses de base et le pain frais.', DE:'Lebensmittelgeschäft ideal für den täglichen Bedarf und frisches Brot.' }};
  }

  return { hours:'09:00–19:30', note: {
    PT: p.cat==='compras' ? 'Comércio local tradicional.' : 'Estabelecimento comercial recheado de produtos locais algarvios.',
    EN: p.cat==='compras' ? 'Local and traditional shops.' : 'Commercial establishment with local Algarve products.',
    ES: p.cat==='compras' ? 'Comercio local tradicional.' : 'Establecimiento comercial con productos locales.',
    FR: p.cat==='compras' ? 'Commerces locaux.' : 'Établissement avec de beaux produits locaux.',
    DE: p.cat==='compras' ? 'Lokale und traditionelle Geschäfte.' : 'Geschäft mit lokalen Produkten.'
  }};
}

export default function Shopping({ lang, pins, favs, toggleFav, focusName, onFocusClear }) {
  const L = lang || 'PT'
  const t = tr('shopping', L)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const itemRefs = useRef({})

  useEffect(() => {
    if (!focusName) return
    const key = Object.keys(itemRefs.current).find(k => k.toLowerCase().includes(focusName.toLowerCase()) || focusName.toLowerCase().includes(k.toLowerCase()))
    if (key) itemRefs.current[key]?.scrollIntoView({ behavior:'smooth', block:'center' })
    onFocusClear?.()
  }, [focusName])

  const shopPins = pins.filter(p => SHOP_CATS.includes(p.cat))

  const filtered = shopPins.filter(p => {
    const f = FILTERS.find(x => x.k === filter)
    if (!f) return true
    if (!f.cats.includes(p.cat)) return false
    
    const n = p.name.toLowerCase()
    if (f.isMarket && !n.includes('mercado municipal')) return false;
    if (f.isSuper && n.includes('mercado municipal')) return false;
    
    if (search.trim()) return p.name.toLowerCase().includes(search.toLowerCase())
    return true
  })

  return (
    <div className="page" style={{ display:'flex', flexDirection:'column' }}>
      <div style={{
        background: 'url("/images/shopping_hero_hr.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '18px 20px 0',
        paddingTop: 'calc(64px + env(safe-area-inset-top,0px))',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Cinematic gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.95) 100%)' }} />
        
        <div style={{ position:'relative', zIndex:1, fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'-.5px', textShadow: '0 2px 14px rgba(0,0,0,0.5)', marginBottom:16 }}>{t.title}</div>
        <div style={{ position:'relative', zIndex:1, marginBottom:12, backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)' }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, pointerEvents:'none' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} style={{ width:'100%', padding:'10px 14px 10px 40px', border:'1px solid rgba(255,255,255,.15)', borderRadius:50, background:'rgba(255,255,255,.1)', color:'#fff', fontSize:13, outline:'none', fontFamily:'var(--font)' }} />
        </div>
        <div style={{ position:'relative', zIndex:1, display:'flex', gap:6, paddingBottom:14 }}>
          {FILTERS.map(f => (
            <button key={f.k} onClick={() => setFilter(f.k)} style={{ flexShrink:0, padding:'6px 14px', borderRadius:50, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, background: filter === f.k ? '#fff' : 'rgba(255,255,255,.1)', color: filter === f.k ? 'var(--navy)' : 'rgba(255,255,255,.6)', transition:'all .15s' }}>{t[f.k]}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px 32px' }}>
        {/* Tip */}
        <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:14, padding:'11px 14px', marginBottom:14, fontSize:12, color:'#92400E', fontWeight:600 }}>{t.tip}</div>

        <div className="card">
          {filtered.length === 0 ? (
            <div style={{ padding:32, textAlign:'center', color:'var(--ink-20)' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🛒</div>
              <div style={{ fontSize:13 }}>{t.noResults}</div>
            </div>
          ) : filtered.map((p, i, arr) => {
            const d    = getDetails(p)
            const isFav = favs.includes('pin-' + p.id)
            const isMatch = focusName && (p.name.toLowerCase().includes(focusName.toLowerCase()) || focusName.toLowerCase().includes(p.name.toLowerCase()))
            return (
              <div key={p.id} ref={el => { if (el) itemRefs.current[p.name] = el }} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom: i < arr.length-1 ? '1px solid var(--surface)' : 'none', background:isMatch?'var(--primary-lt)':'transparent', borderLeft:isMatch?'3px solid var(--primary)':'3px solid transparent', transition:'background .3s' }}>
                <div style={{ width:50, height:50, borderRadius:12, flexShrink:0, background:getAvatarColor(p.name), display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:17, fontWeight:700, color:'#fff' }}>{getInitials(p.name)}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:2 }}>⏰ {d.hours}</div>
                  <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{(d.note[L] || d.note.PT).substring(0,55)}...</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:4, flexShrink:0 }}>
                  <button aria-label={t.navigate} onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination='+p.lat+','+p.lng,'_blank','noopener,noreferrer')} style={{ width:34, height:34, background:'var(--blue-lt)', border:'none', borderRadius:9, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>🧭</button>
                  <button aria-label={t.fav} onClick={() => toggleFav('pin-' + p.id)} style={{ width:34, height:34, background: isFav ? '#FEE2E2' : 'var(--surface)', border:'1px solid var(--border)', borderRadius:9, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav ? '❤️' : '🤍'}</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}