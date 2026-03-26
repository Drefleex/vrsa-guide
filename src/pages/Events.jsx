import React, { useState, useEffect } from 'react'
import { tr } from '../utils/i18n'
import { EVENTS } from '../data/events'
import { Share } from 'lucide-react'

const MONTHS = {
  PT:['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  EN:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  ES:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  FR:['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
  DE:['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
}

function countdown(month, day) {
  const now  = new Date()
  const year = now.getFullYear()
  let target = new Date(year, month-1, day)
  if (target < now) target = new Date(year+1, month-1, day)
  const diff = Math.ceil((target - now) / 86400000)
  return diff
}



// ── Collapsible past events ───────────────────────────────────
function PastEvents({ past, favs, toggleFav, setDetail, MONTHS, L, t }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <button onClick={() => setOpen(o => !o)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', background:'none', border:'none', cursor:'pointer', marginBottom: open ? 10 : 0 }}>
        <span style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase' }}>
          {L==='EN'?'PAST EVENTS':L==='FR'?'ÉVÉNEMENTS PASSÉS':L==='DE'?'VERGANGENE EVENTS':L==='ES'?'EVENTOS PASADOS':'EVENTOS PASSADOS'} ({past.length})
        </span>
        <span style={{ fontSize:16, color:'var(--ink-20)', transform: open ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}>▾</span>
      </button>
      {open && (
        <div className="card">
          {past.map((ev, i) => {
            const mon   = (MONTHS[L] || MONTHS.PT)[ev.month - 1]
            const isFav = favs.includes('event-' + ev.id)
            return (
              <div key={ev.id} onClick={() => setDetail(ev)} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom: i < past.length-1 ? '1px solid var(--surface)' : 'none', cursor:'pointer', opacity:.5 }}>
                <div style={{ width:42, height:42, borderRadius:10, flexShrink:0, background:'var(--surface)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ fontSize:14, fontWeight:800, color:'var(--ink-40)', lineHeight:1 }}>{ev.day}</div>
                  <div style={{ fontSize:9, fontWeight:700, color:'var(--ink-20)', textTransform:'uppercase' }}>{mon}</div>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--ink-40)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ev.title[L] || ev.title.PT}</div>
                  <div style={{ fontSize:11, color:'var(--ink-20)', marginTop:1 }}>{ev.loc}</div>
                </div>
                <span style={{ fontSize:11, color:'var(--ink-20)' }}>✓</span>
                <button onClick={e => { e.stopPropagation(); toggleFav('event-' + ev.id) }} style={{ background:'none', border:'none', fontSize:14, cursor:'pointer', padding:2, opacity:.6 }}>{isFav ? '❤️' : '🤍'}</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Events({ lang, favs, toggleFav, onNav }) {
  const L = lang || 'PT'
  const t = tr('events', L)
  const [detail, setDetail]  = useState(null)
  const [tick, setTick]      = useState(0)

  const calendarText = {
    PT: 'Adicionar ao Calendário',
    EN: 'Add to Calendar',
    ES: 'Añadir al Calendario',
    FR: 'Ajouter au Calendrier',
    DE: 'Zum Kalender hinzufügen',
  }

  function downloadICS(ev) {
    const now  = new Date()
    const year = (ev.month < now.getMonth() + 1 || (ev.month === now.getMonth() + 1 && ev.day < now.getDate()))
      ? now.getFullYear() + 1
      : now.getFullYear()

    // Parse time like "21h00", "21:00", "9h30" — fallback to all-day
    const timeMatch = String(ev.time || '').match(/(\d{1,2})[h:](\d{2})/)
    const pad = n => String(n).padStart(2, '0')
    const dateStr = `${year}${pad(ev.month)}${pad(ev.day)}`

    let dtStart, dtEnd
    if (timeMatch) {
      const hh = pad(parseInt(timeMatch[1]))
      const mm = pad(parseInt(timeMatch[2]))
      dtStart = `${dateStr}T${hh}${mm}00`
      // default 2h duration
      const endH = pad((parseInt(timeMatch[1]) + 2) % 24)
      dtEnd   = `${dateStr}T${endH}${mm}00`
    } else {
      dtStart = `${dateStr}`
      dtEnd   = `${year}${pad(ev.month)}${pad(ev.day + 1)}`
    }

    const title = (ev.title[L] || ev.title.PT).replace(/,/g, '\\,')
    const desc  = (ev.desc[L]  || ev.desc.PT ).replace(/\n/g, '\\n').replace(/,/g, '\\,')
    const loc   = (ev.loc || '').replace(/,/g, '\\,')

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VRSA Guide//Tourist Guide//PT',
      'BEGIN:VEVENT',
      `UID:vrsa-event-${ev.id}-${Date.now()}@guia-vrsa.pt`,
      `DTSTART${timeMatch ? '' : ';VALUE=DATE'}:${dtStart}`,
      `DTEND${timeMatch ? '' : ';VALUE=DATE'}:${dtEnd}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${loc}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${title.replace(/\s+/g, '_')}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => { const iv = setInterval(() => setTick(x => x+1), 60000); return () => clearInterval(iv) }, [])

  const now     = new Date()
  const nowMon  = now.getMonth() + 1
  const nowDay  = now.getDate()

  function isToday(ev)  { return ev.month === nowMon && ev.day === nowDay }
  function isPast(ev)   { return ev.month < nowMon || (ev.month === nowMon && ev.day < nowDay) }
  function isUpcoming(ev){ return !isToday(ev) && !isPast(ev) }

  const handleShare = async (itemTitle) => {
    const shareData = {
      title: 'VRSA Guide - ' + itemTitle,
      text: `Vê este evento fantástico no VRSA Guide: ${itemTitle}!`,
      url: window.location.href
    }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch {}
    } else {
      navigator.clipboard?.writeText(`${shareData.text} ${shareData.url}`)
    }
  }

  const sorted = [...EVENTS].sort((a,b) => a.month !== b.month ? a.month - b.month : a.day - b.day)
  const featured = sorted.find(e => isUpcoming(e) || isToday(e)) || sorted[0]

  // ── Detail view ──────────────────────────────────────────────
  if (detail) {
    const ev    = detail
    const isFav = favs.includes('event-' + ev.id)
    const days  = countdown(ev.month, ev.day)
    const mon   = (MONTHS[L] || MONTHS.PT)[ev.month - 1]
    const past  = isPast(ev)
    const today = isToday(ev)

    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        {/* Hero */}
        <div style={{ height:200, background:`linear-gradient(135deg,${ev.color},${ev.color}cc)`, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'20px', position:'relative', flexShrink:0 }}>
          <button onClick={() => setDetail(null)} style={{ position:'absolute', top:'calc(60px + env(safe-area-inset-top,0px))', left:16, width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.3)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <button onClick={() => handleShare(ev.title[L] || ev.title.PT)} style={{ position:'absolute', top:'calc(60px + env(safe-area-inset-top,0px))', right:60, width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.3)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Share size={18} color="#fff" /></button>
          <button onClick={() => toggleFav('event-' + ev.id)} style={{ position:'absolute', top:'calc(60px + env(safe-area-inset-top,0px))', right:16, width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.3)', border:'none', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav ? '❤️' : '🤍'}</button>
          <span style={{ fontSize:52, marginBottom:8 }}>{ev.emoji}</span>
          <div style={{ fontSize:20, fontWeight:800, color:'#fff', lineHeight:1.2 }}>{ev.title[L] || ev.title.PT}</div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'18px 20px 40px' }}>
          {/* Countdown / status */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:50, marginBottom:14,
            background: today ? '#FEF3C7' : past ? '#F3F4F6' : '#EFF6FF',
            color:      today ? '#B45309' : past ? '#6B7280' : '#1D4ED8',
          }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:.5 }}>
              {today ? t.today : past ? t.past : days <= 7 ? `${days} ${t.days}` : t.upcoming}
            </span>
          </div>

          {/* Chips */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
            {[
              { icon:'📅', text: ev.day + ' ' + mon },
              { icon:'🕐', text: ev.time },
              { icon:'📍', text: ev.loc },
              { icon:'🎫', text: ev.price === '🆓' ? t.free : ev.price },
            ].map((chip,i) => (
              <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:5, background:'var(--surface)', color:'var(--ink-70)', fontSize:12, fontWeight:600, padding:'5px 12px', borderRadius:50, border:'1px solid var(--border)' }}>
                {chip.icon} {chip.text}
              </span>
            ))}
          </div>

          <p style={{ fontSize:13, color:'var(--ink-40)', lineHeight:1.75, marginBottom:16 }}>
            {ev.desc[L] || ev.desc.PT}
          </p>

          <button
            onClick={() => downloadICS(ev)}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:'11px 0', background:'#EFF6FF', color:'#2563EB', border:'1px solid #BFDBFE', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', marginBottom:10 }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {calendarText[L]}
          </button>

          <div style={{ display:'flex', gap:8 }}>
            <button
              onClick={() => { const c = ev.lat+','+ev.lng; window.open('https://www.google.com/maps/search/?api=1&query='+c,'_blank') }}
              style={{ flex:1, padding:'13px 0', background:ev.color, color:'#fff', border:'none', borderRadius:14, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
            >📍 {t.navigate}</button>
            <button
              onClick={() => handleShare(ev.title[L] || ev.title.PT)}
              style={{ width:50, height:50, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
            ><Share size={20} color="var(--ink)" /></button>
            <button
              onClick={() => toggleFav('event-' + ev.id)}
              style={{ width:50, height:50, background: isFav ? '#FEE2E2' : 'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
            >{isFav ? '❤️' : '🤍'}</button>
          </div>
        </div>
      </div>
    )
  }

  // ── List view ────────────────────────────────────────────────
  return (
    <div className="page">
      {/* Header */}
      <div style={{ background:'linear-gradient(160deg,var(--navy) 0%,#162844 100%)', padding:'18px 20px 18px', paddingTop:'calc(62px + env(safe-area-inset-top,0px))' }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-.3px' }}>{t.title}</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,.38)', marginTop:2 }}>Vila Real de Santo António · Algarve</div>
      </div>

      <div style={{ padding:'14px 16px 40px' }}>

        {/* Featured card */}
        {featured && (
          <div
            onClick={() => setDetail(featured)}
            style={{ background:`linear-gradient(135deg,${featured.color},${featured.color}bb)`, borderRadius:20, padding:'18px', marginBottom:20, cursor:'pointer', boxShadow:`0 6px 28px ${featured.color}44`, position:'relative', overflow:'hidden' }}
          >
            <div style={{ position:'absolute', top:0, right:0, width:120, height:120, background:'rgba(255,255,255,.07)', borderRadius:'50%', transform:'translate(20px,-20px)' }} />
            <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,.6)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:10 }}>{t.featured}</div>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <span style={{ fontSize:42 }}>{featured.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:800, color:'#fff', lineHeight:1.25, marginBottom:4 }}>{featured.title[L] || featured.title.PT}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.65)' }}>{featured.day} {(MONTHS[L]||MONTHS.PT)[featured.month-1]} · {featured.time}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', marginTop:2 }}>{featured.loc}</div>
              </div>
              <div style={{ textAlign:'center', flexShrink:0 }}>
                <div style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1 }}>{countdown(featured.month, featured.day)}</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,.55)', fontWeight:700 }}>{t.days}</div>
              </div>
            </div>
          </div>
        )}

        {/* All events — split upcoming vs past */}
        {(() => {
          const upcoming = sorted.filter(e => !isPast(e))
          const past     = sorted.filter(e => isPast(e))
          return (
            <>
              {upcoming.length === 0 && (
                <div style={{ textAlign:'center', padding:'32px 20px', color:'var(--ink-20)' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>📅</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--ink-40)', marginBottom:6 }}>{t.noUpcoming}</div>
                  <div style={{ fontSize:12 }}>{t.noUpcomingSub}</div>
                </div>
              )}

              {upcoming.length > 0 && (
                <>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>
                    {L==='EN'?'UPCOMING EVENTS':L==='FR'?'ÉVÉNEMENTS À VENIR':L==='DE'?'NÄCHSTE EVENTS':L==='ES'?'PRÓXIMOS EVENTOS':'PRÓXIMOS EVENTOS'}
                  </div>
                  <div className="card" style={{ marginBottom:16 }}>
                    {upcoming.map((ev, i) => {
                      const mon   = (MONTHS[L] || MONTHS.PT)[ev.month - 1]
                      const isFav = favs.includes('event-' + ev.id)
                      const today = isToday(ev)
                      const days  = countdown(ev.month, ev.day)
                      return (
                        <div key={ev.id} style={{ padding:'13px 16px', borderBottom: i < upcoming.length-1 ? '1px solid var(--surface)' : 'none' }}>
                          {/* Row */}
                          <div onClick={() => setDetail(ev)} style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer', marginBottom:10 }}>
                            <div style={{ width:46, height:46, borderRadius:12, flexShrink:0, background:`${ev.color}18`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', border:`1px solid ${ev.color}30` }}>
                              <div style={{ fontSize:15, fontWeight:900, color:ev.color, lineHeight:1 }}>{ev.day}</div>
                              <div style={{ fontSize:9, fontWeight:700, color:ev.color, textTransform:'uppercase' }}>{mon}</div>
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ev.title[L] || ev.title.PT}</div>
                              <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:2 }}>{ev.loc} · {ev.time}</div>
                            </div>
                            <div style={{ textAlign:'right', flexShrink:0 }}>
                              {today ? (
                                <span style={{ background:'#FEF3C7', color:'#B45309', fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:50 }}>{t.today}</span>
                              ) : days <= 30 ? (
                                <div><div style={{ fontSize:15, fontWeight:900, color:ev.color }}>{days}</div><div style={{ fontSize:9, color:'var(--ink-20)', fontWeight:600 }}>{t.days}</div></div>
                              ) : <span style={{ fontSize:18 }}>{ev.emoji}</span>}
                            </div>
                            <button onClick={e => { e.stopPropagation(); toggleFav('event-' + ev.id) }} style={{ background:'none', border:'none', fontSize:16, cursor:'pointer', padding:2, flexShrink:0 }}>{isFav ? '❤️' : '🤍'}</button>
                          </div>
                          {/* Calendar button */}
                          <button
                            onClick={e => { e.stopPropagation(); downloadICS(ev) }}
                            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, width:'100%', padding:'8px 0', background:'#EFF6FF', color:'#2563EB', border:'1px solid #BFDBFE', borderRadius:9, fontSize:12, fontWeight:700, cursor:'pointer' }}
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            {calendarText[L]}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {past.length > 0 && (
                <PastEvents past={past} favs={favs} toggleFav={toggleFav} setDetail={setDetail} isPast={isPast} MONTHS={MONTHS} L={L} t={t} />
              )}
            </>
          )
        })()}
      </div>
    </div>
  )
}