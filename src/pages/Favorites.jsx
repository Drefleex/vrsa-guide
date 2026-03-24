import { Heart } from 'lucide-react'
import { EVENTS } from './Events'
import { MONUMENTS } from './Culture'

const TR = {
  PT:{ title:'Favoritos', empty:'Ainda não tens favoritos.', emptyHint:'Toca em ❤️ nos restaurantes, eventos e monumentos para guardar.', places:'Restaurantes & Locais', events:'Eventos Guardados', culture:'Cultura & Monumentos', explore:'Explorar Restaurantes', removeFav:'Remover favorito' },
  EN:{ title:'Favourites', empty:'No favourites yet.', emptyHint:'Tap ❤️ on restaurants, events and monuments to save them.', places:'Restaurants & Places', events:'Saved Events', culture:'Culture & Monuments', explore:'Explore Restaurants', removeFav:'Remove favourite' },
  ES:{ title:'Favoritos', empty:'Aún no tienes favoritos.', emptyHint:'Toca ❤️ en restaurantes, eventos y monumentos para guardar.', places:'Restaurantes & Lugares', events:'Eventos Guardados', culture:'Cultura & Monumentos', explore:'Explorar Restaurantes', removeFav:'Quitar favorito' },
  FR:{ title:'Favoris', empty:'Pas encore de favoris.', emptyHint:'Tapez ❤️ sur les restaurants, événements et monuments pour les sauvegarder.', places:'Restaurants & Lieux', events:'Événements Sauvegardés', culture:'Culture & Monuments', explore:'Explorer les Restaurants', removeFav:'Supprimer des favoris' },
  DE:{ title:'Favoriten', empty:'Noch keine Favoriten.', emptyHint:'Tippe auf ❤️ bei Restaurants, Events und Denkmälern zum Speichern.', places:'Restaurants & Orte', events:'Gespeicherte Events', culture:'Kultur & Denkmäler', explore:'Restaurants erkunden', removeFav:'Aus Favoriten entfernen' },
}

const FOOD_CATS = ['restaurante','pastelaria','gelataria','hamburgaria','pizzaria','kebab']

export default function Favorites({ lang, favs, toggleFav, pins, onNav }) {
  const L = lang || 'PT'
  const t = TR[L] || TR.PT

  const savedPins      = pins.filter(p => favs.includes('pin-' + p.id))
  const savedEvents    = EVENTS.filter(ev => favs.includes('event-' + ev.id))
  const savedMonuments = MONUMENTS.filter(m => favs.includes('culture-' + m.id))

  const total = savedPins.length + savedEvents.length + savedMonuments.length

  if (total === 0) {
    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        <div style={{ background:'linear-gradient(160deg,var(--navy) 0%,#162844 100%)', padding:'18px 20px', paddingTop:'calc(62px + env(safe-area-inset-top,0px))' }}>
          <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{t.title}</div>
        </div>
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px', textAlign:'center' }}>
          <div style={{ marginBottom:16, color:'var(--ink-20)' }}><Heart size={52} strokeWidth={1.3} /></div>
          <div style={{ fontSize:17, fontWeight:700, color:'var(--ink)', marginBottom:8 }}>{t.empty}</div>
          <div style={{ fontSize:13, color:'var(--ink-40)', lineHeight:1.6, marginBottom:28 }}>{t.emptyHint}</div>
          <button
            onClick={() => onNav('restaurants')}
            style={{ padding:'13px 28px', background:'var(--navy)', color:'#fff', border:'none', borderRadius:50, fontSize:14, fontWeight:700, cursor:'pointer' }}
          >{t.explore}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div style={{ background:'linear-gradient(160deg,var(--navy) 0%,#162844 100%)', padding:'18px 20px', paddingTop:'calc(62px + env(safe-area-inset-top,0px))' }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{t.title}</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,.38)', marginTop:2 }}>{total} {L === 'EN' ? 'saved' : L === 'FR' ? 'sauvegardés' : L === 'DE' ? 'gespeichert' : 'guardados'}</div>
      </div>

      <div style={{ padding:'14px 16px 40px' }}>

        {/* ── Restaurantes & Locais ── */}
        {savedPins.length > 0 && (
          <>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>{t.places}</div>
            <div className="card" style={{ marginBottom:16 }}>
              {savedPins.map((p, i, arr) => (
                <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none', cursor:'pointer' }}
                  onClick={() => onNav(FOOD_CATS.includes(p.cat) ? 'restaurants' : 'map')}>
                  <div style={{ width:44, height:44, borderRadius:12, background: FOOD_CATS.includes(p.cat) ? '#FEE2E2' : '#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{p.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1, textTransform:'capitalize' }}>{p.cat}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggleFav('pin-' + p.id) }} aria-label={t.removeFav} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--red)', display:'flex', padding:4 }}><Heart size={18} fill="var(--red)" strokeWidth={0} /></button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Eventos Guardados ── */}
        {savedEvents.length > 0 && (
          <>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>{t.events}</div>
            <div className="card" style={{ marginBottom:16 }}>
              {savedEvents.map((ev, i, arr) => (
                <div key={ev.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none', cursor:'pointer' }} onClick={() => onNav('events')}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${ev.color}18`, border:`1px solid ${ev.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{ev.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ev.title[L] || ev.title.PT}</div>
                    <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{ev.loc}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggleFav('event-' + ev.id) }} aria-label={t.removeFav} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--red)', display:'flex', padding:4 }}><Heart size={18} fill="var(--red)" strokeWidth={0} /></button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Cultura & Monumentos ── */}
        {savedMonuments.length > 0 && (
          <>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>{t.culture}</div>
            <div className="card">
              {savedMonuments.map((m, i, arr) => (
                <div key={m.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none', cursor:'pointer' }} onClick={() => onNav('culture')}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'#F5F3FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{m.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.name}</div>
                    <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{m.tag[L] || m.tag.PT} · {m.year}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggleFav('culture-' + m.id) }} aria-label={t.removeFav} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--red)', display:'flex', padding:4 }}><Heart size={18} fill="var(--red)" strokeWidth={0} /></button>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
