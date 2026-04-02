import React, { useState, useEffect, useRef } from 'react'
import { getAvatarColor } from '../utils/avatarUtils'
import { tr } from '../utils/i18n'
import { MONUMENTS } from '../data/culture'
import { Share } from 'lucide-react'

export default function Culture({ lang, favs, toggleFav, focusName, onFocusClear }) {
  const L = lang || 'PT'
  const t = tr('culture', L)
  const [detail, setDetail] = useState(null)
  const [playingId, setPlayingId] = useState(null)
  const listRef     = useRef(null)
  const savedScroll = useRef(0)
  function openDetail(m) { savedScroll.current = listRef.current?.scrollTop || 0; setDetail(m) }
  function closeDetail()  { setDetail(null); requestAnimationFrame(() => { if (listRef.current) listRef.current.scrollTop = savedScroll.current }) }

  const voiceLangs = { PT:'pt-PT', EN:'en-US', ES:'es-ES', FR:'fr-FR', DE:'de-DE' }

  const audioText = { PT:'Ouvir História', EN:'Listen to Story', ES:'Escuchar Historia', FR:"Écouter l'histoire", DE:'Geschichte anhören' }
  const stopText  = { PT:'Parar Áudio',    EN:'Stop Audio',       ES:'Detener Audio',   FR:'Arrêter Audio',    DE:'Audio stoppen' }

  useEffect(() => {
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel() }
  }, [])

  useEffect(() => {
    if (!focusName) return
    const found = MONUMENTS.find(m => {
      const n = (typeof m.name === 'object' ? (m.name[L] || m.name.PT) : m.name) || ''
      return n.toLowerCase().includes(focusName.toLowerCase()) || focusName.toLowerCase().includes(n.toLowerCase())
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (found) setDetail(found)
    onFocusClear?.()
  }, [focusName])

  function handleSpeak(id, text) {
    if (!('speechSynthesis' in window)) {
      alert(L === 'PT' ? 'O seu navegador não suporta áudio.' : 'Audio not supported in this browser.')
      return
    }
    if (playingId === id) {
      window.speechSynthesis.cancel()
      setPlayingId(null)
      return
    }
    window.speechSynthesis.cancel()
    const utterance  = new SpeechSynthesisUtterance(text)
    utterance.lang   = voiceLangs[L] || 'en-US'
    utterance.rate   = 0.95
    utterance.onend  = () => setPlayingId(null)
    utterance.onerror = () => setPlayingId(null)
    setPlayingId(id)
    window.speechSynthesis.speak(utterance)
  }

  const handleShare = async (itemTitle) => {
    const shareData = {
      title: 'VRSA Guide - ' + itemTitle,
      text: `Descobre este monumento incrível no VRSA Guide: ${itemTitle}!`,
      url: window.location.href
    }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch { /* ignore */ }
    } else {
      navigator.clipboard?.writeText(`${shareData.text} ${shareData.url}`)
    }
  }

  if (detail) {
    const isFav = favs.includes('culture-' + detail.id)
    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        <div style={{ background:`linear-gradient(160deg, ${getAvatarColor(detail.name)} 0%, ${getAvatarColor(detail.name)}bb 60%, #0F172A 100%)`, paddingRight:'18px', paddingBottom:'24px', paddingLeft:'18px', paddingTop:'calc(64px + env(safe-area-inset-top,0px))', flexShrink:0, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
          <div style={{ position:'absolute', bottom:-30, left:-20, width:110, height:110, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <button aria-label={t.back} onClick={closeDetail} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
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
          <p style={{ fontSize:14, color:'var(--ink-40)', lineHeight:1.8, marginBottom:14 }}>{detail.desc[L]||detail.desc.PT}</p>

          {/* Áudio-Guia */}
          <button
            onClick={() => handleSpeak(detail.id, detail.desc[L] || detail.desc.PT)}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:'12px 0', marginBottom:12, borderRadius:12, border:'none', cursor:'pointer', fontSize:14, fontWeight:700,
              background: playingId === detail.id ? '#FEE2E2' : '#EFF6FF',
              color:      playingId === detail.id ? '#DC2626'  : '#2563EB',
            }}
          >
            {playingId === detail.id ? (
              <>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                {stopText[L]}
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                {audioText[L]}
              </>
            )}
          </button>

          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => window.location.assign(`https://www.google.com/maps/search/?api=1&query=${detail.lat},${detail.lng}`)} style={{ flex:1, padding:'13px 0', background:'var(--navy)', color:'#fff', border:'none', borderRadius:14, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>📍 {t.navigate}</button>
            <button onClick={() => handleShare(detail.name)} style={{ width:50, height:50, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Share size={20} color="var(--ink)" /></button>
            <button aria-label={t.fav} onClick={() => toggleFav('culture-' + detail.id)} style={{ width:50, height:50, background: isFav?'#FEE2E2':'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav?'❤️':'🤍'}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ display:'flex', flexDirection:'column' }}>
      <div style={{
        background: 'url("/images/culture_hero_hr.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '18px 20px 24px',
        paddingTop: 'calc(64px + env(safe-area-inset-top,0px))',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Cinematic gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.95) 100%)' }} />
        
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'-.5px', textShadow: '0 2px 14px rgba(0,0,0,0.5)', marginBottom:4 }}>{t.title}</div>
          <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.8)', textShadow: '0 2px 8px rgba(0,0,0,0.5)', letterSpacing: '.5px' }}>{t.sub}</div>
        </div>
      </div>

      <div ref={listRef} style={{ flex:1, overflowY:'auto', padding:'14px 16px 40px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {MONUMENTS.map(m => {
            const isFav = favs.includes('culture-' + m.id)
                    return (
              <div key={m.id} onClick={() => openDetail(m)} className="card" style={{ cursor:'pointer', overflow:'hidden' }}>
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
                  <div style={{ fontSize:11, color:'var(--ink-20)', marginTop:6, fontWeight:600, marginBottom:10 }}>📅 {t.year}: {m.year}</div>
                  <button
                    onClick={e => { e.stopPropagation(); handleSpeak(m.id, m.desc[L] || m.desc.PT) }}
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, width:'100%', padding:'8px 0', borderRadius:9, border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
                      background: playingId === m.id ? '#FEE2E2' : '#EFF6FF',
                      color:      playingId === m.id ? '#DC2626'  : '#2563EB',
                    }}
                  >
                    {playingId === m.id ? (
                      <>
                        <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        {stopText[L]}
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                        {audioText[L]}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}