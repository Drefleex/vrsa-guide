import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import Papa from 'papaparse'
import BottomNav    from './components/BottomNav'
import TopBar      from './components/TopBar'
import SplashScreen from './components/SplashScreen'
import WelcomeModal    from './components/WelcomeModal'
import InstallBanner  from './components/InstallBanner'
import { trackEvent } from './pages/Analytics'
import './App.css'

const Map         = lazy(() => import('./components/Map'))
const GlobalSearch = lazy(() => import('./components/GlobalSearch'))
const Home        = lazy(() => import('./pages/Home'))
const Restaurants = lazy(() => import('./pages/Restaurants'))
const Events      = lazy(() => import('./pages/Events'))
const Info        = lazy(() => import('./pages/Info'))
const Beaches     = lazy(() => import('./pages/Beaches'))
const Favorites   = lazy(() => import('./pages/Favorites'))
const Hotels      = lazy(() => import('./pages/Hotels'))
const Shopping    = lazy(() => import('./pages/Shopping'))
const Ayamonte    = lazy(() => import('./pages/Ayamonte'))
const Analytics   = lazy(() => import('./pages/Analytics'))
const Report      = lazy(() => import('./pages/Report'))
const Sobre       = lazy(() => import('./pages/Sobre'))
const Culture     = lazy(() => import('./pages/Culture'))
const Health      = lazy(() => import('./pages/Health'))
const Transport   = lazy(() => import('./pages/Transport'))
const Admin       = lazy(() => import('./pages/Admin'))

import { DEFAULT_PINS } from './data/pins'


function parseCSV(text) {
  const parsed = Papa.parse(text.trim(), { skipEmptyLines: true })
  const rows = parsed.data.slice(1) // skip header
  return rows.map(parts => {
    if (parts.length < 5) return null
    const lat = parseFloat(parts[parts.length-2])
    const lng = parseFloat(parts[parts.length-1])
    if (isNaN(lat) || isNaN(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null
    return { id:parseInt(parts[0]||0), name:parts.slice(1,parts.length-5).join(' ').trim(), emoji:parts[parts.length-5]?.trim()||'📍', cat:parts[parts.length-4]?.trim()||'compras', color:parts[parts.length-3]?.trim()||'#0E2B4A', lat, lng }
  }).filter(Boolean)
}

function loadFavs() { try { return JSON.parse(localStorage.getItem('vrsa_favs')||'[]') } catch { /* ignore */ return [] } }
function saveFavs(a) { try { localStorage.setItem('vrsa_favs', JSON.stringify(a)) } catch { /* ignore */ } }
function loadTheme() { try { return localStorage.getItem('vrsa_theme')||'light' } catch { /* ignore */ return 'light' } }

// Tabs that support left/right swipe navigation (map excluded — has its own pan)
const SWIPE_TABS = ['home', 'restaurants', 'events', 'transport']

export default function App() {
  const [lang, setLang]     = useState(() => { try { return localStorage.getItem('vrsa_lang')||'PT' } catch { return 'PT' } })
  const [page, setPage]     = useState(() => {
    // Acesso secreto: ?admin=1 ou ?analytics=1 na URL
    const p = new URLSearchParams(window.location.search)
    if (p.get('admin') === '1') return 'admin'
    if (p.get('analytics') === '1') return 'analytics'
    return 'splash'
  })
  const swipeX = useRef(null)
  const swipeY = useRef(null)
  const [pins, setPins]     = useState(DEFAULT_PINS)
  const [loading, setLoading] = useState(false)
  const [favs, setFavs]       = useState(loadFavs)
  const [theme, setTheme]     = useState(loadTheme)
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem('vrsa_tutorial_seen') !== 'true'
  })
  const closeWelcome = () => {
    localStorage.setItem('vrsa_tutorial_seen', 'true')
    setShowWelcome(false)
  }
  const [search, setSearch]                         = useState(false)
  const [mapFocusPin, setMapFocusPin]               = useState(null)
  const [restaurantFocusPin, setRestaurantFocusPin] = useState(null)
  const [hotelFocusPin, setHotelFocusPin]           = useState(null)
  const [beachFocusName, setBeachFocusName]         = useState(null)
  const [cultureFocusName, setCultureFocusName]     = useState(null)
  const [shoppingFocusName, setShoppingFocusName]   = useState(null)
  const [healthFocusName, setHealthFocusName]       = useState(null)
  const [sheetEvents, setSheetEvents] = useState([])

  // Load events from Google Sheets (VITE_EVENTS_URL)
  useEffect(() => {
    const url = import.meta.env.VITE_EVENTS_URL
    if (!url) return
    fetch(url)
      .then(r => r.text())
      .then(csv => {
        const rows = csv.trim().split('\n').slice(1) // skip header
        const evs = rows.map((row, i) => {
          const cols = row.split(',').map(s => s.trim().replace(/^"|"$/g, ''))
          const [, emoji, titlePT, loc, day, month, time, price, descPT] = cols
          if (!titlePT) return null
          const id = 900000 + i
          return { id, emoji: emoji||'📅', color:'#003B6F', price: price||'🆓',
            title:{ PT:titlePT, EN:titlePT, ES:titlePT, FR:titlePT, DE:titlePT },
            desc:{ PT:descPT||'', EN:descPT||'', ES:descPT||'', FR:descPT||'', DE:descPT||'' },
            loc: loc||'VRSA', day: parseInt(day)||1, month: parseInt(month)||1, time: time||'', lat:37.1944, lng:-7.4161 }
        }).filter(Boolean)
        if (evs.length) setSheetEvents(evs)
      })
      .catch(() => {})
  }, [])

  const [municipalAlerts, setMunicipalAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('vrsa_admin_alert')
      if (saved) {
        const raw = JSON.parse(saved)
        return Array.isArray(raw) ? raw : [{ id: 1, ...raw }]
      }
    } catch { /* ignore */ }
    return []
  })

  // Load alerts — admin localStorage takes priority over Google Sheets
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vrsa_admin_alert')
      if (saved) {
        const raw = JSON.parse(saved)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMunicipalAlerts(Array.isArray(raw) ? raw : [{ id: 1, ...raw }])
        return
      }
    } catch { /* ignore */ }
    const url = import.meta.env.VITE_ALERT_URL
    if (!url) return
    fetch(url)
      .then(r => r.text())
      .then(text => {
        const lines = text.trim().split('\n')
        if (lines.length < 2) return
        const vals = lines[1].split(',').map(s => s.trim().replace(/^"|"$/g, ''))
        const [active, type, PT, EN, ES, FR, DE] = vals
        if (active === 'true') setMunicipalAlerts([{ id: 1, active:true, type:type||'info', message:{PT,EN,ES,FR,DE} }])
      })
      .catch(() => {})
  }, [])

  function handleNav(dest) {
    if (dest && typeof dest === 'object') {
      setPage(dest.page)
      if (dest.page === 'map'         && dest.pin)       setMapFocusPin(dest.pin)
      if (dest.page === 'restaurants' && dest.pin)       setRestaurantFocusPin(dest.pin)
      if (dest.page === 'hotels'      && dest.pin)       setHotelFocusPin(dest.pin)
      if (dest.page === 'beaches'     && dest.focusName) setBeachFocusName(dest.focusName)
      if (dest.page === 'culture'     && dest.focusName) setCultureFocusName(dest.focusName)
      if (dest.page === 'shopping'    && dest.focusName) setShoppingFocusName(dest.focusName)
      if (dest.page === 'health'      && dest.focusName) setHealthFocusName(dest.focusName)
    } else {
      setPage(dest)
    }
  }
  const [toast, setToast]     = useState(null)
  const toastTimer            = useRef(null)
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const goOnline  = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online',  goOnline)
    window.addEventListener('offline', goOffline)
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline) }
  }, [])

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('vrsa_theme', theme)
  }, [theme])

  // Load from Google Sheets
  useEffect(() => {
    const SHEET_URL = import.meta.env.VITE_SHEET_URL
    if (!SHEET_URL) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    fetch(SHEET_URL)
      .then(r => r.text())
      .then(csv => { const p = parseCSV(csv); if (p.length > 5) setPins(p) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Persist favs
  useEffect(() => { saveFavs(favs) }, [favs])

  // Persist lang
  useEffect(() => { try { localStorage.setItem('vrsa_lang', lang) } catch { /* ignore */ } }, [lang])

  // Track language changes
  useEffect(() => { if (page !== 'splash') trackEvent('lang', lang) }, [lang])

  // Track page views
  useEffect(() => {
    if (page !== 'splash') trackEvent('page', page)
  }, [page])

  const toggleFav = useCallback((id) => {
    setFavs(prev => {
      const adding = !prev.includes(id)
      clearTimeout(toastTimer.current)
      setToast(adding ? 'added' : 'removed')
      toastTimer.current = setTimeout(() => setToast(null), 2200)
      return adding ? [...prev, id] : prev.filter(x => x !== id)
    })
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }, [])

  const onSwipeStart = useCallback((e) => {
    swipeX.current = e.touches[0].clientX
    swipeY.current = e.touches[0].clientY
  }, [])

  const onSwipeEnd = useCallback((e) => {
    if (swipeX.current === null) return
    const dx = e.changedTouches[0].clientX - swipeX.current
    const dy = e.changedTouches[0].clientY - swipeY.current
    swipeX.current = null
    // Only horizontal swipes > 60px that are more horizontal than vertical
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    const idx = SWIPE_TABS.indexOf(page)
    if (idx === -1) return
    if (dx < 0 && idx < SWIPE_TABS.length - 1) setPage(SWIPE_TABS[idx + 1])
    else if (dx > 0 && idx > 0) setPage(SWIPE_TABS[idx - 1])
  }, [page])

  if (page === 'splash') {
    return <SplashScreen lang={lang} setLang={setLang} onStart={() => setPage('home')} />
  }

  const cp = { lang, favs, toggleFav, onNav: setPage }

  return (
    <div className="app-shell">
      {page !== 'map' && <TopBar lang={lang} setLang={setLang} onSearch={() => setSearch(true)} theme={theme} toggleTheme={toggleTheme} />}
      <Suspense fallback={<div style={{ flex:1, background:'var(--bg)' }} />}>
        <div style={{ flex:1, minHeight:0, position:'relative', overflow:'hidden' }} onTouchStart={onSwipeStart} onTouchEnd={onSwipeEnd}>
          {page === 'home'        && <Home        {...cp} pins={pins} loading={loading} theme={theme} toggleTheme={toggleTheme} municipalAlerts={municipalAlerts} />}
          {page === 'map'         && <Map         lang={lang} pins={pins} setPins={setPins} theme={theme} onNav={setPage} focusPin={mapFocusPin} onFocusClear={() => setMapFocusPin(null)} />}
          {page === 'restaurants' && <Restaurants {...cp} pins={pins} focusPin={restaurantFocusPin} onFocusClear={() => setRestaurantFocusPin(null)} />}
          {page === 'events'      && <Events      {...cp} sheetEvents={sheetEvents} />}
          {page === 'beaches'     && <Beaches     {...cp} focusName={beachFocusName} onFocusClear={() => setBeachFocusName(null)} />}
          {page === 'hotels'      && <Hotels      {...cp} pins={pins} focusPin={hotelFocusPin} onFocusClear={() => setHotelFocusPin(null)} />}
          {page === 'shopping'    && <Shopping    {...cp} pins={pins} focusName={shoppingFocusName} onFocusClear={() => setShoppingFocusName(null)} />}
          {page === 'ayamonte'    && <Ayamonte    lang={lang} onNav={setPage} />}
          {page === 'favorites'   && <Favorites   {...cp} pins={pins} />}
          {page === 'analytics'   && <Analytics   lang={lang} />}
          {page === 'culture'     && <Culture     {...cp} focusName={cultureFocusName} onFocusClear={() => setCultureFocusName(null)} />}
          {page === 'health'      && <Health      lang={lang} onNav={setPage} focusName={healthFocusName} onFocusClear={() => setHealthFocusName(null)} />}
          {page === 'transport'   && <Transport   lang={lang} onNav={setPage} />}
          {page === 'report'      && <Report      lang={lang} />}
          {page === 'info'        && <Info        lang={lang} />}
          {page === 'admin'       && <Admin       lang={lang} onNav={setPage} onAlertChange={setMunicipalAlerts} />}
          {page === 'sobre'       && <Sobre       lang={lang} />}
        </div>
      </Suspense>
      {/* ── Offline banner ── */}
      {!isOnline && (
        <div className="offline-banner" role="status" aria-live="polite">
          <span>{{PT:'Sem ligação — a mostrar dados guardados',EN:'Offline — showing cached data',ES:'Sin conexión — datos guardados',FR:'Hors ligne — données en cache',DE:'Offline — zwischengespeicherte Daten'}[lang] || 'Offline'}</span>
        </div>
      )}
      {/* ── Fav toast ── */}
      {toast && (
        <div style={{
          position:'fixed', top:'calc(56px + env(safe-area-inset-top,0px))',
          left:'50%', transform:'translateX(-50%)',
          zIndex:500, borderRadius:50, padding:'9px 18px',
          background: toast === 'added' ? 'var(--green)' : 'var(--ink-70)',
          color:'#fff', fontSize:13, fontWeight:700,
          whiteSpace:'nowrap', boxShadow:'0 4px 20px rgba(0,0,0,.22)',
          display:'flex', alignItems:'center', gap:7,
          animation:'fade-in .18s ease',
          pointerEvents:'none',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={toast==='added'?'#fff':'none'} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          {{
            added:   {PT:'Adicionado', EN:'Saved',   ES:'Guardado',  FR:'Sauvegardé', DE:'Gespeichert'},
            removed: {PT:'Removido',   EN:'Removed', ES:'Eliminado', FR:'Retiré',     DE:'Entfernt'},
          }[toast][lang] || (toast === 'added' ? 'Adicionado' : 'Removido')}
        </div>
      )}
      <InstallBanner lang={lang} />
      <WelcomeModal
        lang={lang}
        visible={showWelcome}
        onClose={closeWelcome}
      />
      {search && <Suspense fallback={null}><GlobalSearch lang={lang} pins={pins} onNav={handleNav} onClose={() => setSearch(false)} /></Suspense>}
      <BottomNav page={page} setPage={setPage} lang={lang} theme={theme} toggleTheme={toggleTheme} />
    </div>
  )
}