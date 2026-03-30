import { useState, useEffect } from 'react'
import { tr } from '../utils/i18n'

// ─── Simple analytics tracked in localStorage ────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function trackEvent(type, data) {
  try {
    const key   = 'vrsa_analytics'
    const store = JSON.parse(localStorage.getItem(key) || '{}')
    const today = new Date().toISOString().slice(0,10)
    const hour  = new Date().getHours()

    if (!store.pageViews)  store.pageViews  = {}
    if (!store.pinClicks)  store.pinClicks  = {}
    if (!store.languages)  store.languages  = {}
    if (!store.hourly)     store.hourly     = {}
    if (!store.dailySessions) store.dailySessions = {}

    if (type === 'page') {
      store.pageViews[data] = (store.pageViews[data] || 0) + 1
      store.hourly[hour]    = (store.hourly[hour]    || 0) + 1
      store.dailySessions[today] = (store.dailySessions[today] || 0) + 1
    }
    if (type === 'pin')  store.pinClicks[data]  = (store.pinClicks[data]  || 0) + 1
    if (type === 'lang') store.languages[data]  = (store.languages[data]  || 0) + 1

    localStorage.setItem(key, JSON.stringify(store))
  } catch { /* ignore */ }
}

// eslint-disable-next-line react-refresh/only-export-components
export function getAnalytics() {
  try { return JSON.parse(localStorage.getItem('vrsa_analytics') || '{}') } catch { /* ignore */ return {} }
}

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:12, color:'var(--ink-70)', fontWeight:600 }}>{label}</span>
        <span style={{ fontSize:12, color:'var(--ink-40)' }}>{value}</span>
      </div>
      <div style={{ height:6, background:'var(--surface)', borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width:pct+'%', background:color, borderRadius:3, transition:'width .6s ease' }} />
      </div>
    </div>
  )
}

function Stat({ icon, value, label }) {
  return (
    <div style={{ flex:1, background:'var(--white)', borderRadius:14, padding:'14px 12px', textAlign:'center', border:'1px solid var(--border)' }}>
      <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
      <div style={{ fontSize:22, fontWeight:900, color:'var(--ink)' }}>{value}</div>
      <div style={{ fontSize:10, color:'var(--ink-40)', fontWeight:600, marginTop:2, textTransform:'uppercase', letterSpacing:.8 }}>{label}</div>
    </div>
  )
}

const PAGE_LABELS = { home:'🏠 Início', map:'🗺️ Mapa', restaurants:'🍽️ Restaurantes', events:'📅 Eventos', info:'ℹ️ Info', beaches:'🏖️ Praias', hotels:'🏨 Hotéis', shopping:'🛒 Compras', favorites:'❤️ Favoritos' }
const LANG_FLAGS  = { PT:'🇵🇹 PT', EN:'🇬🇧 EN', ES:'🇪🇸 ES', FR:'🇫🇷 FR', DE:'🇩🇪 DE' }
const COLORS      = { primary:'var(--blue)', secondary:'var(--mint)', accent:'var(--gold)' }

export default function Analytics({ lang }) {
  const L = lang || 'PT'
  const t = tr('analytics', L)
  const [data, setData] = useState(getAnalytics())
  const [_tick, setTick] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setData(getAnalytics()), 5000)
    return () => clearInterval(iv)
  }, [])

  function doReset() {
    if (window.confirm(t.resetConfirm)) {
      localStorage.removeItem('vrsa_analytics')
      setData({})
      setTick(x => x+1)
    }
  }

  function doExport() {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type:'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'vrsa-analytics.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const pageViews  = data.pageViews  || {}
  const pinClicks  = data.pinClicks  || {}
  const languages  = data.languages  || {}
  const hourly     = data.hourly     || {}
  const sessions   = data.dailySessions || {}

  const totalViews  = Object.values(pageViews).reduce((a,b) => a+b, 0)
  const totalClicks = Object.values(pinClicks).reduce((a,b) => a+b, 0)
  const _totalSess  = Object.values(sessions).reduce((a,b) => a+b, 0)
  const today       = new Date().toISOString().slice(0,10)
  const todaySess   = sessions[today] || 0

  const topPages = Object.entries(pageViews).sort((a,b) => b[1]-a[1]).slice(0,6)
  const topPins  = Object.entries(pinClicks).sort((a,b) => b[1]-a[1]).slice(0,5)
  const topLangs = Object.entries(languages).sort((a,b) => b[1]-a[1])
  const maxPage  = topPages[0]?.[1] || 1
  const maxPin   = topPins[0]?.[1]  || 1
  const maxLang  = topLangs[0]?.[1] || 1
  const maxHour  = Math.max(...Object.values(hourly), 1)

  const hasData = totalViews > 0 || totalClicks > 0

  return (
    <div className="page">
      <div style={{ background:'linear-gradient(160deg,var(--navy) 0%,#162844 100%)', paddingRight:'20px', paddingBottom:'18px', paddingLeft:'20px', paddingTop:'calc(62px + env(safe-area-inset-top,0px))' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{t.title}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.38)', marginTop:2 }}>{t.sub}</div>
          </div>
          <button onClick={doExport} style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', borderRadius:10, padding:'6px 12px', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer' }}>↓ {t.export}</button>
        </div>
      </div>

      <div style={{ padding:'14px 16px 40px' }}>
        {!hasData ? (
          <div style={{ textAlign:'center', padding:'48px 24px', color:'var(--ink-20)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📊</div>
            <div style={{ fontSize:14, fontWeight:600, color:'var(--ink-40)', marginBottom:6 }}>{t.noData}</div>
          </div>
        ) : (
          <>
            {/* Top stats */}
            <div style={{ display:'flex', gap:10, marginBottom:16 }}>
              <Stat icon="👁️" value={totalViews}  label={t.sessions} />
              <Stat icon="📍" value={totalClicks} label={t.clicks}   />
              <Stat icon="📅" value={todaySess}   label={t.today}    />
            </div>

            {/* Pages */}
            {topPages.length > 0 && (
              <div className="card" style={{ padding:'14px 16px', marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:12 }}>{t.pages}</div>
                {topPages.map(([page, count]) => (
                  <Bar key={page} label={PAGE_LABELS[page] || page} value={count} max={maxPage} color={COLORS.primary} />
                ))}
              </div>
            )}

            {/* Languages */}
            {topLangs.length > 0 && (
              <div className="card" style={{ padding:'14px 16px', marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:12 }}>{t.langs}</div>
                {topLangs.map(([l, count]) => (
                  <Bar key={l} label={LANG_FLAGS[l] || l} value={count} max={maxLang} color={COLORS.accent} />
                ))}
              </div>
            )}

            {/* Hourly activity */}
            {Object.keys(hourly).length > 0 && (
              <div className="card" style={{ padding:'14px 16px', marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:12 }}>{t.hourly}</div>
                <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:60 }}>
                  {Array.from({length:24},(_,h) => {
                    const v   = hourly[h] || 0
                    const pct = Math.round((v/maxHour)*100)
                    return (
                      <div key={h} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                        <div style={{ width:'100%', background: pct > 50 ? 'var(--blue)' : pct > 20 ? 'var(--blue-md)' : 'var(--border)', borderRadius:2, height:Math.max(4, pct*0.56)+'px', transition:'height .4s ease' }} />
                        {h % 6 === 0 && <div style={{ fontSize:8, color:'var(--ink-20)', fontWeight:600 }}>{h}h</div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Pin clicks */}
            {topPins.length > 0 && (
              <div className="card" style={{ padding:'14px 16px', marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:12 }}>{t.pins}</div>
                {topPins.map(([pin, count]) => (
                  <Bar key={pin} label={pin} value={count} max={maxPin} color={COLORS.secondary} />
                ))}
              </div>
            )}

            {/* Reset — exige PIN */}
            <button onClick={doReset} style={{ width:'100%', padding:'11px', background:'var(--red-lt)', color:'var(--red)', border:'1px solid #FECACA', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer' }}>
              🗑️ {t.reset}
            </button>
          </>
        )}

      </div>
    </div>
  )
}