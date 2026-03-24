import { useState } from 'react'
import { getInitials, getAvatarColor } from '../utils/avatarUtils'


const DETAILS = {
  16:  { hours:'Seg–Sáb 07:00–13:00', note:{PT:'Produtos frescos locais, peixe e legumes. O melhor mercado para comprar peixe fresco do dia.',EN:'Local fresh produce, fish and vegetables. The best market to buy fresh daily fish.',ES:'Productos frescos locales, pescado y verduras.',FR:'Produits frais locaux, poissons et légumes.',DE:'Frische lokale Produkte, Fisch und Gemüse.'} },
  209: { hours:'Seg–Dom 08:00–21:00', note:{PT:'Supermercado próximo do centro. Produtos portugueses, vinhos e padaria.',EN:'Supermarket close to the centre. Portuguese products, wines and bakery.',ES:'Supermercado cercano al centro.',FR:'Supermarché près du centre.',DE:'Supermarkt nahe dem Zentrum.'} },
  210: { hours:'Seg–Dom 08:00–21:00', note:{PT:'Maior Continente da zona. Ampla variedade de produtos.',EN:'Largest Continente in the area. Wide variety of products.',ES:'El Continente más grande de la zona.',FR:'Le plus grand Continente de la zone.',DE:'Größter Continente der Gegend.'} },
  216: { hours:'Seg–Dom 08:00–20:00', note:{PT:'Preços competitivos. Bom para compras económicas.',EN:'Competitive prices. Good for budget shopping.',ES:'Precios competitivos.',FR:'Prix compétitifs.',DE:'Günstige Preise.'} },
  217: { hours:'Seg–Dom 08:00–21:00', note:{PT:'Perto da estação de comboios. Grande variedade.',EN:'Near the train station. Wide variety.',ES:'Cerca de la estación de tren.',FR:'Près de la gare.',DE:'Nahe dem Bahnhof.'} },
  218: { hours:'Seg–Dom 07:00–21:00', note:{PT:'Supermercado de conveniência. Padaria e talho frescos.',EN:'Convenience supermarket. Fresh bakery and butcher.',ES:'Supermercado de conveniencia.',FR:'Supermarché de proximité.',DE:'Nahversorgungsmarkt.'} },
  229: { hours:'Seg–Sáb 08:00–20:00', note:{PT:'Supermercado de bairro. Atendimento pessoal.',EN:'Neighbourhood supermarket. Personal service.',ES:'Supermercado de barrio.',FR:'Supermarché de quartier.',DE:'Stadtteil-Supermarkt.'} },
}

function getDetails(id) {
  return DETAILS[id] || { hours:'09:00–19:00', note:{PT:'Loja local em VRSA.',EN:'Local shop in VRSA.',ES:'Tienda local en VRSA.',FR:'Boutique locale à VRSA.',DE:'Lokales Geschäft in VRSA.'} }
}

const TR = {
  PT:{ title:'Compras & Mercados', all:'Todos', market:'Mercado', super:'Supermercados', shops:'Lojas', hours:'Horário', navigate:'Navegar', fav:'Favorito', back:'← Voltar', tip:'💡 Dica: O Mercado Municipal tem os melhores preços de peixe fresco — vai de manhã cedo!', search:'Pesquisar...', noResults:'Sem resultados.' },
  EN:{ title:'Shopping & Markets', all:'All', market:'Market', super:'Supermarkets', shops:'Shops', hours:'Hours', navigate:'Navigate', fav:'Favourite', back:'← Back', tip:'💡 Tip: The Municipal Market has the best fresh fish prices — go early in the morning!', search:'Search...', noResults:'No results.' },
  ES:{ title:'Compras & Mercados', all:'Todos', market:'Mercado', super:'Supermercados', shops:'Tiendas', hours:'Horario', navigate:'Navegar', fav:'Favorito', back:'← Volver', tip:'💡 Consejo: El Mercado Municipal tiene los mejores precios de pescado fresco.', search:'Buscar...', noResults:'Sin resultados.' },
  FR:{ title:'Shopping & Marchés', all:'Tous', market:'Marché', super:'Supermarchés', shops:'Boutiques', hours:'Horaires', navigate:'Naviguer', fav:'Favori', back:'← Retour', tip:'💡 Astuce: Le Marché Municipal a les meilleurs prix pour le poisson frais!', search:'Rechercher...', noResults:'Aucun résultat.' },
  DE:{ title:'Einkaufen & Märkte', all:'Alle', market:'Markt', super:'Supermärkte', shops:'Geschäfte', hours:'Öffnungszeiten', navigate:'Navigieren', fav:'Favorit', back:'← Zurück', tip:'💡 Tipp: Der Stadtmarkt hat die besten Preise für frischen Fisch!', search:'Suchen...', noResults:'Keine Ergebnisse.' },
}

const SHOP_CATS = ['mercado','compras']
const FILTERS = [
  { k:'all',    cats:['mercado','compras'] },
  { k:'market', cats:['mercado'], sub:['mercado municipal'] },
  { k:'super',  cats:['mercado'], sub:['pingo','continente','aldi','intermarché','supermercado','filho'] },
  { k:'shops',  cats:['compras'] },
]

export default function Shopping({ lang, pins, favs, toggleFav, onNav }) {
  const L = lang || 'PT'
  const t = TR[L] || TR.PT
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const shopPins = pins.filter(p => SHOP_CATS.includes(p.cat))

  const filtered = shopPins.filter(p => {
    const f = FILTERS.find(x => x.k === filter)
    if (!f) return true
    if (!f.cats.includes(p.cat)) return false
    if (f.sub) {
      const n = p.name.toLowerCase()
      if (filter === 'market') return n.includes('mercado')
      if (filter === 'super')  return f.sub.some(s => n.includes(s))
    }
    if (search.trim()) return p.name.toLowerCase().includes(search.toLowerCase())
    return true
  })

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
        {/* Tip */}
        <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:14, padding:'11px 14px', marginBottom:14, fontSize:12, color:'#92400E', fontWeight:600 }}>{t.tip}</div>

        <div className="card">
          {filtered.length === 0 ? (
            <div style={{ padding:32, textAlign:'center', color:'var(--ink-20)' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🛒</div>
              <div style={{ fontSize:13 }}>{t.noResults}</div>
            </div>
          ) : filtered.map((p, i, arr) => {
            const d    = getDetails(p.id)
            const isFav = favs.includes(p.id)
            return (
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom: i < arr.length-1 ? '1px solid var(--surface)' : 'none' }}>
                <div style={{ width:50, height:50, borderRadius:12, flexShrink:0, background:getAvatarColor(p.name), display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:17, fontWeight:700, color:'#fff' }}>{getInitials(p.name)}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:2 }}>⏰ {d.hours}</div>
                  <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{(d.note[L] || d.note.PT).substring(0,55)}...</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:4, flexShrink:0 }}>
                  <button aria-label={t.navigate} onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination='+p.lat+','+p.lng,'_blank')} style={{ width:34, height:34, background:'var(--blue-lt)', border:'none', borderRadius:9, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>🧭</button>
                  <button aria-label={t.fav} onClick={() => toggleFav(p.id)} style={{ width:34, height:34, background: isFav ? '#FEE2E2' : 'var(--surface)', border:'1px solid var(--border)', borderRadius:9, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav ? '❤️' : '🤍'}</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}