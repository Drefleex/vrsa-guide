import { useState, useEffect } from 'react'
import { getInitials, getAvatarColor } from '../utils/avatarUtils'
import { tr } from '../utils/i18n'
import { MONUMENTS } from '../data/culture'
import { Share } from 'lucide-react'

export default function Culture({ lang, favs, toggleFav, onNav, focusName, onFocusClear }) {
  const L = lang || 'PT'
  const t = tr('culture', L)
  const [detail, setDetail]   = useState(null)

  useEffect(() => {
    if (!focusName) return
    const found = MONUMENTS.find(m => {
      const n = (typeof m.name === 'object' ? (m.name[L] || m.name.PT) : m.name) || ''
      return n.toLowerCase().includes(focusName.toLowerCase()) || focusName.toLowerCase().includes(n.toLowerCase())
    })
    if (found) setDetail(found)
    onFocusClear?.()
  }, [focusName])

  const handleShare = async (itemTitle) => {
    const shareData = {
      title: 'VRSA Guide - ' + itemTitle,
      text: `Descobre este monumento incrível no VRSA Guide: ${itemTitle}!`,
      url: window.location.href
    }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch {}
    } else {
      navigator.clipboard?.writeText(`${shareData.text} ${shareData.url}`)
    }
  }

  if (detail) {
    const isFav = favs.includes('culture-' + detail.id)
    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        <div style={{ background:getAvatarColor(detail.name), padding:'20px 18px 24px', paddingTop:'calc(64px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <button aria-label={t.back} onClick={() => setDetail(null)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => handleShare(detail.name)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Share size={18} color="#fff" /></button>
              <button aria-label={t.fav} onClick={() => toggleFav('culture-' + detail.id)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav ? '❤️' : '🤍'}</button>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:60, height:60, borderRadius:14, background:'rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:28 }}>{detail.emoji}</span>
            </div>
            <div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>{detail.tag[L]||detail.tag.PT} · {detail.year}</div>
              <div style={{ fontSize:20, fontWeight:700, color:'#fff', lineHeight:1.2 }}>{detail.name}</div>
            </div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 40px' }}>
          <p style={{ fontSize:14, color:'var(--ink-40)', lineHeight:1.8, marginBottom:20 }}>{detail.desc[L]||detail.desc.PT}</p>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${detail.lat},${detail.lng}`,'_blank')} style={{ flex:1, padding:'13px 0', background:'var(--navy)', color:'#fff', border:'none', borderRadius:14, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>📍 {t.navigate}</button>
            <button onClick={() => handleShare(detail.name)} style={{ width:50, height:50, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Share size={20} color="var(--ink)" /></button>
            <button aria-label={t.fav} onClick={() => toggleFav('culture-' + detail.id)} style={{ width:50, height:50, background: isFav?'#FEE2E2':'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav?'❤️':'🤍'}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ display:'flex', flexDirection:'column' }}>
      <div style={{ background:'linear-gradient(160deg,#2D1B69 0%,#1E1145 100%)', padding:'18px 20px 18px', paddingTop:'calc(62px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-.3px' }}>{t.title}</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,.38)', marginTop:2 }}>{t.sub}</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px 40px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {MONUMENTS.map(m => {
            const isFav = favs.includes('culture-' + m.id)
                    return (
              <div key={m.id} onClick={() => setDetail(m)} className="card" style={{ cursor:'pointer', overflow:'hidden' }}>
                <div style={{ height:90, background:getAvatarColor(m.name), display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ fontSize:32 }}>{m.emoji}</span>
                    <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.7)', background:'rgba(255,255,255,.15)', padding:'2px 8px', borderRadius:50 }}>{m.tag[L]||m.tag.PT}</span>
                  </div>
                  <button aria-label={t.fav} onClick={e => { e.stopPropagation(); toggleFav('culture-' + m.id) }} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav?'❤️':'🤍'}</button>
                </div>
                <div style={{ padding:'12px 14px 14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:18 }}>{m.emoji}</span>
                    <div style={{ fontSize:15, fontWeight:800, color:'var(--ink)' }}>{m.name}</div>
                  </div>
                  <div style={{ fontSize:12, color:'var(--ink-40)', lineHeight:1.55 }}>{(m.desc[L]||m.desc.PT).substring(0,100)}...</div>
                  <div style={{ fontSize:11, color:'var(--ink-20)', marginTop:6, fontWeight:600 }}>📅 {t.year}: {m.year}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}