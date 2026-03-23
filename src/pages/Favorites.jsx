import { Heart } from 'lucide-react'

const TR = {
  PT:{ title:'Favoritos', empty:'Ainda não tens favoritos.', emptyHint:'Toca em ❤️ nos restaurantes e eventos para guardar.', restaurants:'Restaurantes Guardados', events:'Eventos Guardados', pins:'Locais Guardados', explore:'Explorar Restaurantes', noSaved:'Nada guardado aqui.', removeFav:'Remover favorito' },
  EN:{ title:'Favourites', empty:'No favourites yet.', emptyHint:'Tap ❤️ on restaurants and events to save them.', restaurants:'Saved Restaurants', events:'Saved Events', pins:'Saved Places', explore:'Explore Restaurants', noSaved:'Nothing saved here.', removeFav:'Remove favourite' },
  ES:{ title:'Favoritos', empty:'Aún no tienes favoritos.', emptyHint:'Toca ❤️ en restaurantes y eventos para guardar.', restaurants:'Restaurantes Guardados', events:'Eventos Guardados', pins:'Lugares Guardados', explore:'Explorar Restaurantes', noSaved:'Nada guardado aquí.', removeFav:'Quitar favorito' },
  FR:{ title:'Favoris', empty:'Pas encore de favoris.', emptyHint:'Tapez ❤️ sur les restaurants et événements pour les sauvegarder.', restaurants:'Restaurants Sauvegardés', events:'Événements Sauvegardés', pins:'Lieux Sauvegardés', explore:'Explorer les Restaurants', noSaved:'Rien de sauvegardé ici.', removeFav:'Supprimer des favoris' },
  DE:{ title:'Favoriten', empty:'Noch keine Favoriten.', emptyHint:'Tippe auf ❤️ bei Restaurants und Events zum Speichern.', restaurants:'Gespeicherte Restaurants', events:'Gespeicherte Events', pins:'Gespeicherte Orte', explore:'Restaurants erkunden', noSaved:'Hier nichts gespeichert.', removeFav:'Aus Favoriten entfernen' },
}

const FOOD_CATS = ['restaurante','pastelaria','gelataria','hamburgaria','pizzaria','kebab']

export default function Favorites({ lang, favs, toggleFav, pins, onNav }) {
  const L = lang || 'PT'
  const t = TR[L] || TR.PT

  const savedPins = pins.filter(p => favs.includes(p.id))
  const foodPins  = savedPins.filter(p => FOOD_CATS.includes(p.cat))
  const otherPins = savedPins.filter(p => !FOOD_CATS.includes(p.cat))

  if (savedPins.length === 0) {
    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        <div style={{ background:'linear-gradient(160deg,var(--navy) 0%,#162844 100%)', padding:'18px 20px', paddingTop:'calc(18px + env(safe-area-inset-top,0px))' }}>
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
      <div style={{ background:'linear-gradient(160deg,var(--navy) 0%,#162844 100%)', padding:'18px 20px', paddingTop:'calc(18px + env(safe-area-inset-top,0px))' }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{t.title}</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,.38)', marginTop:2 }}>{savedPins.length} {L === 'EN' ? 'saved' : L === 'FR' ? 'sauvegardés' : L === 'DE' ? 'gespeichert' : 'guardados'}</div>
      </div>

      <div style={{ padding:'14px 16px 40px' }}>

        {/* Food places */}
        {foodPins.length > 0 && (
          <>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>{t.restaurants}</div>
            <div className="card" style={{ marginBottom:16 }}>
              {foodPins.map((p,i,arr) => (
                <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none', cursor:'pointer' }} onClick={() => onNav('restaurants')}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'#FEE2E2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{p.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1, textTransform:'capitalize' }}>{p.cat}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggleFav(p.id) }} aria-label={t.removeFav} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--red)', display:'flex', padding:4 }}><Heart size={18} fill="var(--red)" strokeWidth={0} /></button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Other places */}
        {otherPins.length > 0 && (
          <>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>{t.pins}</div>
            <div className="card">
              {otherPins.map((p,i,arr) => (
                <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none', cursor:'pointer' }} onClick={() => onNav('map')}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{p.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1, textTransform:'capitalize' }}>{p.cat}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggleFav(p.id) }} aria-label={t.removeFav} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--red)', display:'flex', padding:4 }}><Heart size={18} fill="var(--red)" strokeWidth={0} /></button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}