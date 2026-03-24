import { useState, useRef, useEffect } from 'react'
import {
  Search, Ship, Waves, Calendar, Building2, Globe, Map,
  Plus, Bus, AlertCircle, Landmark, Clock,
  UtensilsCrossed, Coffee, IceCream, Beef, Pizza, Sandwich,
  ShoppingCart, Leaf, Building, Banknote, Fuel, ShoppingBag, MapPin,
} from 'lucide-react'

const TR = {
  PT:{ placeholder:'Pesquisar em VRSA...', pages:'Páginas', places:'Locais', noResults:'Sem resultados para', tryAnother:'Tenta outra pesquisa', suggestions:'Sugestões', recents:'Pesquisas recentes' },
  EN:{ placeholder:'Search in VRSA...', pages:'Pages', places:'Places', noResults:'No results for', tryAnother:'Try another search', suggestions:'Suggestions', recents:'Recent searches' },
  ES:{ placeholder:'Buscar en VRSA...', pages:'Páginas', places:'Lugares', noResults:'Sin resultados para', tryAnother:'Intenta otra búsqueda', suggestions:'Sugerencias', recents:'Búsquedas recientes' },
  FR:{ placeholder:'Rechercher à VRSA...', pages:'Pages', places:'Lieux', noResults:'Aucun résultat pour', tryAnother:'Essayez une autre recherche', suggestions:'Suggestions', recents:'Recherches récentes' },
  DE:{ placeholder:'In VRSA suchen...', pages:'Seiten', places:'Orte', noResults:'Keine Ergebnisse für', tryAnother:'Andere Suche versuchen', suggestions:'Vorschläge', recents:'Letzte Suchen' },
}

const PAGE_SHORTCUTS = [
  { q:['ferry','barca','fähre'],                           page:'transport', Icon:Ship,         label:{PT:'Ferry para Ayamonte',EN:'Ferry to Ayamonte',ES:'Ferry a Ayamonte',FR:'Ferry pour Ayamonte',DE:'Fähre nach Ayamonte'} },
  { q:['praia','beach','plage','strand','playa'],           page:'beaches',   Icon:Waves,        label:{PT:'Praias',EN:'Beaches',ES:'Playas',FR:'Plages',DE:'Strände'} },
  { q:['event','evento'],                                  page:'events',    Icon:Calendar,     label:{PT:'Eventos',EN:'Events',ES:'Eventos',FR:'Événements',DE:'Events'} },
  { q:['hotel','hostel','pousada'],                        page:'hotels',    Icon:Building2,    label:{PT:'Hotéis',EN:'Hotels',ES:'Hoteles',FR:'Hôtels',DE:'Hotels'} },
  { q:['ayamonte','espanha','spain'],                      page:'ayamonte',  Icon:Globe,        label:{PT:'Guia Ayamonte',EN:'Ayamonte Guide',ES:'Guía Ayamonte',FR:'Guide Ayamonte',DE:'Ayamonte Guide'} },
  { q:['mapa','map','karte','carte'],                      page:'map',       Icon:Map,          label:{PT:'Mapa',EN:'Map',ES:'Mapa',FR:'Carte',DE:'Karte'} },
  { q:['farmácia','pharmacy','farmacia','apotheke'],        page:'health',    Icon:Plus,         label:{PT:'Farmácias & Saúde',EN:'Health & Pharmacies',ES:'Farmacias',FR:'Pharmacies',DE:'Apotheken'} },
  { q:['transporte','transport','bus','comboio','train'],   page:'transport', Icon:Bus,          label:{PT:'Transportes',EN:'Transport',ES:'Transporte',FR:'Transport',DE:'Transport'} },
  { q:['report','reportar','problem','problema'],           page:'report',    Icon:AlertCircle,  label:{PT:'Reportar Problema',EN:'Report Problem',ES:'Reportar',FR:'Signaler',DE:'Melden'} },
  { q:['cultura','culture','monumento','monument'],         page:'culture',   Icon:Landmark,     label:{PT:'Cultura & Monumentos',EN:'Culture & Monuments',ES:'Cultura',FR:'Culture',DE:'Kultur'} },
]

const CAT_ICONS = {
  restaurante: UtensilsCrossed,
  pastelaria:  Coffee,
  gelataria:   IceCream,
  hamburgaria: Beef,
  pizzaria:    Pizza,
  kebab:       Sandwich,
  cultura:     Landmark,
  praia:       Waves,
  hotel:       Building2,
  mercado:     ShoppingCart,
  transporte:  Bus,
  natureza:    Leaf,
  estado:      Building,
  banco:       Banknote,
  parking:     MapPin,
  farmacia:    Plus,
  combustivel: Fuel,
  compras:     ShoppingBag,
}

// Category display names
const CAT_LABELS = {
  restaurante:'Restaurantes', pastelaria:'Pastelarias', gelataria:'Gelatarias',
  hamburgaria:'Hamburgarias', pizzaria:'Pizzarias', kebab:'Kebabs',
  cultura:'Cultura', praia:'Praias', hotel:'Hotéis', mercado:'Mercados',
  transporte:'Transportes', natureza:'Natureza', estado:'Serviços',
  banco:'Bancos', parking:'Estacionamento', farmacia:'Farmácias',
  combustivel:'Combustível', compras:'Compras', saude:'Saúde',
}

const SUGGESTIONS = ['Ferry','Restaurante Cuca','Praia','Ayamonte','Farmácia','Museu','Hotel','Eventos']

function loadRecents() { try { return JSON.parse(localStorage.getItem('vrsa_searches')||'[]') } catch { return [] } }
function saveRecents(a) { try { localStorage.setItem('vrsa_searches', JSON.stringify(a)) } catch {} }

function Hl({ text, q }) {
  if (!q) return <>{text}</>
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i === -1) return <>{text}</>
  return <>{text.slice(0,i)}<mark style={{ background:'#FDE68A', borderRadius:2, padding:'0 1px' }}>{text.slice(i,i+q.length)}</mark>{text.slice(i+q.length)}</>
}

const ROW = { width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'none', border:'none', borderBottom:'0.5px solid var(--border-lt)', cursor:'pointer', textAlign:'left' }
const SEC = { fontSize:10, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', padding:'12px 14px 6px' }

export default function GlobalSearch({ lang, pins, onNav, onClose }) {
  const L = lang || 'PT'
  const t = TR[L] || TR.PT
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [recents, setRecents] = useState(loadRecents)
  const ref = useRef()
  const timer = useRef()

  useEffect(() => { setTimeout(() => ref.current?.focus(), 80) }, [])

  // Debounce: wait 250ms after user stops typing
  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setDebouncedQ(q), 250)
    return () => clearTimeout(timer.current)
  }, [q])

  const query = debouncedQ.trim().toLowerCase()
  const allPins = query.length >= 2 ? (pins||[]).filter(p => p.name.toLowerCase().includes(query)) : []
  const pageResults = query.length >= 2 ? PAGE_SHORTCUTS.filter(s => s.q.some(kw => kw.includes(query)||query.includes(kw))).slice(0,3) : []

  // Group pin results by category (max 3 per cat, max 4 cats)
  const catGroups = {}
  for (const p of allPins) {
    if (!catGroups[p.cat]) catGroups[p.cat] = []
    if (catGroups[p.cat].length < 3) catGroups[p.cat].push(p)
    if (Object.keys(catGroups).length >= 4 && !catGroups[p.cat]) break
  }
  const hasResults = allPins.length > 0 || pageResults.length > 0

  function goTo(page, term) {
    if (term) {
      const updated = [term, ...recents.filter(r => r !== term)].slice(0, 5)
      setRecents(updated)
      saveRecents(updated)
    }
    onNav(page); onClose()
  }

  function pickSuggestion(s) { setQ(s) }

  function clearRecents() { setRecents([]); saveRecents([]) }

  const cancel = {PT:'Cancelar',EN:'Cancel',ES:'Cancelar',FR:'Annuler',DE:'Abbrechen'}[L]

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)', zIndex:350 }} />
      <style>{`@keyframes srch-dn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}`}</style>
      <div style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, zIndex:351, background:'var(--white)', borderRadius:'0 0 16px 16px', boxShadow:'0 8px 32px rgba(0,0,0,.15)', animation:'srch-dn .2s ease', paddingTop:'env(safe-area-inset-top,0px)', maxHeight:'85vh', display:'flex', flexDirection:'column' }}>

        {/* Search bar */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderBottom:'1px solid var(--border-lt)' }}>
          <span style={{ display:'flex', flexShrink:0, color:'var(--ink-40)' }}><Search size={18} strokeWidth={1.8} /></span>
          <input
            ref={ref}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={t.placeholder}
            style={{ flex:1, border:'none', outline:'none', fontSize:16, color:'var(--ink)', background:'transparent', fontFamily:'var(--font)' }}
          />
          {q && <button onClick={() => { setQ(''); setDebouncedQ('') }} style={{ background:'none', border:'none', color:'var(--ink-40)', cursor:'pointer', fontSize:18, lineHeight:1, padding:'0 4px' }}>×</button>}
          <button onClick={onClose} style={{ background:'var(--surface)', border:'none', borderRadius:8, padding:'5px 10px', fontSize:13, fontWeight:600, color:'var(--ink-40)', cursor:'pointer', flexShrink:0 }}>{cancel}</button>
        </div>

        <div style={{ overflowY:'auto', flex:1 }}>
          {/* No results */}
          {query.length >= 2 && !hasResults && (
            <div style={{ padding:'32px 20px', textAlign:'center', color:'var(--ink-20)' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}><Search size={32} strokeWidth={1.3} /></div>
              <div style={{ fontSize:13, fontWeight:600 }}>{t.noResults} "{debouncedQ}"</div>
              <div style={{ fontSize:12, marginTop:4 }}>{t.tryAnother}</div>
            </div>
          )}

          {/* Page shortcuts */}
          {pageResults.length > 0 && (
            <>
              <div style={SEC}>{t.pages}</div>
              {pageResults.map((r,i) => (
                <button key={i} onClick={() => goTo(r.page, r.label[L]||r.label.PT)} style={ROW}>
                  <div style={{ width:36, height:36, borderRadius:8, background:'var(--primary-lt)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--primary)' }}>
                    <r.Icon size={18} strokeWidth={1.8} />
                  </div>
                  <span style={{ fontSize:14, fontWeight:600, color:'var(--ink)' }}>{r.label[L]||r.label.PT}</span>
                  <span style={{ marginLeft:'auto', fontSize:16, color:'var(--ink-20)' }}>›</span>
                </button>
              ))}
            </>
          )}

          {/* Pin results grouped by category */}
          {Object.entries(catGroups).map(([cat, items]) => {
            const CatIcon = CAT_ICONS[cat] || MapPin
            return (
              <div key={cat}>
                <div style={SEC}>{CAT_LABELS[cat] || cat}</div>
                {items.map((p,i) => (
                  <button key={i} onClick={() => goTo('map', p.name)} style={ROW}>
                    <div style={{ width:36, height:36, borderRadius:8, background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontSize:18 }}>{p.emoji}</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}><Hl text={p.name} q={debouncedQ} /></div>
                      <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{CAT_LABELS[cat] || cat}</div>
                    </div>
                    <span style={{ fontSize:16, color:'var(--ink-20)', flexShrink:0 }}>›</span>
                  </button>
                ))}
              </div>
            )
          })}

          {/* Default state: recents + suggestions */}
          {query.length < 2 && (
            <div style={{ padding:'12px 14px' }}>
              {/* Recent searches */}
              {recents.length > 0 && (
                <>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase' }}>{t.recents}</div>
                    <button onClick={clearRecents} style={{ background:'none', border:'none', fontSize:11, color:'var(--ink-40)', cursor:'pointer', padding:0 }}>✕</button>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
                    {recents.map(r => (
                      <button key={r} onClick={() => pickSuggestion(r)} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', background:'var(--surface)', border:'1px solid var(--border-lt)', borderRadius:50, fontSize:12, fontWeight:600, color:'var(--ink-70)', cursor:'pointer' }}>
                        <Clock size={11} color="var(--ink-40)" />
                        {r}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {/* Suggestions */}
              <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>{t.suggestions}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => pickSuggestion(s)} style={{ padding:'6px 12px', background:'var(--surface)', border:'1px solid var(--border-lt)', borderRadius:50, fontSize:12, fontWeight:600, color:'var(--ink-70)', cursor:'pointer' }}>{s}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
