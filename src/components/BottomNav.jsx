import { useState } from 'react'
import {
  Landmark, Activity, Bus, Building2, ShoppingBag,
  Globe, Waves, Heart, AlertCircle, BarChart2,
} from 'lucide-react'

// ── Nav tab SVGs ──────────────────────────────────────────────
const NAV_SVG = {
  home:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  map:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  eat:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/></svg>,
  calendar:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  info:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  more:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>,
}

const TABS = [
  { k:'home',        nav:'home',     l:{PT:'Início', EN:'Home',    ES:'Inicio',  FR:'Accueil',DE:'Start'  } },
  { k:'map',         nav:'map',      l:{PT:'Mapa',   EN:'Map',     ES:'Mapa',    FR:'Carte',  DE:'Karte'  } },
  { k:'restaurants', nav:'eat',      l:{PT:'Comer',  EN:'Eat',     ES:'Comer',   FR:'Manger', DE:'Essen'  } },
  { k:'events',      nav:'calendar', l:{PT:'Eventos',EN:'Events',  ES:'Eventos', FR:'Agenda', DE:'Events' } },
  { k:'info',        nav:'info',     l:{PT:'Info',   EN:'Info',    ES:'Info',    FR:'Info',   DE:'Info'   } },
]

// Each item: Icon = Lucide component, color/bg = tinted icon badge
const MORE_ITEMS = [
  { k:'culture',   Icon:Landmark,    color:'#7C3AED', bg:'#F5F3FF', l:{PT:'Cultura',   EN:'Culture',   ES:'Cultura',   FR:'Culture',  DE:'Kultur'    } },
  { k:'health',    Icon:Activity,    color:'#059669', bg:'#ECFDF5', l:{PT:'Saúde',      EN:'Health',    ES:'Salud',     FR:'Santé',    DE:'Gesundheit'} },
  { k:'transport', Icon:Bus,         color:'#D97706', bg:'#FFFBEB', l:{PT:'Transporte', EN:'Transport', ES:'Transporte',FR:'Transport', DE:'Transport' } },
  { k:'hotels',    Icon:Building2,   color:'#9333EA', bg:'#FDF4FF', l:{PT:'Hotéis',     EN:'Hotels',    ES:'Hoteles',   FR:'Hôtels',   DE:'Hotels'    } },
  { k:'shopping',  Icon:ShoppingBag, color:'#059669', bg:'#ECFDF5', l:{PT:'Compras',    EN:'Shopping',  ES:'Compras',   FR:'Shopping', DE:'Einkaufen' } },
  { k:'ayamonte',  Icon:Globe,       color:'#DC2626', bg:'#FEF2F2', l:{PT:'Ayamonte',   EN:'Ayamonte',  ES:'Ayamonte',  FR:'Ayamonte', DE:'Ayamonte'  } },
  { k:'beaches',   Icon:Waves,       color:'#0277BD', bg:'#F0F9FF', l:{PT:'Praias',     EN:'Beaches',   ES:'Playas',    FR:'Plages',   DE:'Strände'   } },
  { k:'favorites', Icon:Heart,       color:'#DC2626', bg:'#FEF2F2', l:{PT:'Favoritos',  EN:'Saved',     ES:'Favoritos', FR:'Favoris',  DE:'Favoriten' } },
  { k:'report',    Icon:AlertCircle, color:'#B91C1C', bg:'#FEF2F2', l:{PT:'Reportar',   EN:'Report',    ES:'Reportar',  FR:'Signaler', DE:'Melden'    } },
  { k:'analytics', Icon:BarChart2,   color:'#1D4ED8', bg:'#EFF6FF', l:{PT:'Analytics',  EN:'Analytics', ES:'Analytics', FR:'Analytics', DE:'Analytics' } },
]

export default function BottomNav({ page, setPage, lang }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const isMorePage = MORE_ITEMS.some(m => m.k === page)

  return (
    <>
      {/* ── More services bottom sheet ── */}
      {moreOpen && (
        <>
          <div onClick={() => setMoreOpen(false)} style={{ position:'fixed', inset:0, zIndex:90, background:'rgba(0,0,0,.35)', animation:'fade-in .18s ease' }} />
          <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, zIndex:100, background:'var(--white)', borderRadius:'18px 18px 0 0', padding:'14px 16px calc(76px + env(safe-area-inset-bottom,0px))', boxShadow:'0 -4px 32px rgba(0,0,0,.13)', animation:'slide-up .25s cubic-bezier(.22,.68,0,1.1)' }}>
            {/* Handle */}
            <div style={{ width:32, height:3, borderRadius:2, background:'var(--border)', margin:'0 auto 14px' }} />

            {/* Title */}
            <div style={{ fontSize:9, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.4, textTransform:'uppercase', marginBottom:14, textAlign:'center' }}>
              {lang==='EN'?'More Services':lang==='FR'?'Plus de Services':lang==='DE'?'Mehr Services':lang==='ES'?'Más Servicios':'Mais Serviços'}
            </div>

            {/* Grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {MORE_ITEMS.map(item => {
                const isActive = page === item.k
                return (
                  <button
                    key={item.k}
                    onClick={() => { setPage(item.k); setMoreOpen(false) }}
                    aria-label={item.l[lang]||item.l.PT}
                    style={{
                      display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                      padding:'11px 4px 9px',
                      background: isActive ? 'var(--primary-lt)' : 'var(--surface)',
                      borderRadius:12,
                      border: isActive ? '1.5px solid var(--primary)' : '1px solid var(--border-lt)',
                      cursor:'pointer', transition:'background .12s',
                    }}
                  >
                    <div style={{
                      width:40, height:40, borderRadius:10,
                      background: isActive ? 'var(--primary-lt)' : item.bg,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <item.Icon size={20} strokeWidth={1.8} color={isActive ? 'var(--primary)' : item.color} />
                    </div>
                    <span style={{ fontSize:9, fontWeight:600, color: isActive ? 'var(--primary)' : 'var(--ink-40)', textAlign:'center', lineHeight:1.2 }}>
                      {item.l[lang]||item.l.PT}
                    </span>
                  </button>
                )
              })}

            </div>
          </div>
        </>
      )}

      {/* ── Bottom navigation bar ── */}
      <nav className="bottom-nav">
        {TABS.map(tab => {
          const active = page === tab.k
          return (
            <button key={tab.k} className={'nav-btn'+(active?' active':'')} onClick={() => setPage(tab.k)} aria-label={tab.l[lang]||tab.l.PT}>
              <div className="nav-active-bar" style={{ width:active?24:0 }} />
              <span className="nav-icon" style={{display:'flex',alignItems:'center',justifyContent:'center',color:active?'var(--primary)':'var(--ink-40)',transition:'color .18s'}}>{NAV_SVG[tab.nav]}</span>
              <span className="nav-label" style={{color:active?'var(--primary)':'var(--ink-20)',fontWeight:active?700:600,transition:'color .18s'}}>{tab.l[lang]||tab.l.PT}</span>
            </button>
          )
        })}

        {/* More tab */}
        <button className={'nav-btn'+(isMorePage||moreOpen?' active':'')} onClick={() => setMoreOpen(o => !o)} aria-label="Mais serviços">
          <div className="nav-active-bar" style={{ width:isMorePage||moreOpen?24:0 }} />
          <span className="nav-icon" style={{display:'flex',alignItems:'center',justifyContent:'center',color:isMorePage||moreOpen?'var(--primary)':'var(--ink-40)',transition:'color .18s'}}>{NAV_SVG.more}</span>
          <span className="nav-label" style={{color:isMorePage||moreOpen?'var(--primary)':'var(--ink-20)',fontWeight:isMorePage||moreOpen?700:600,transition:'color .18s'}}>{lang==='EN'?'More':lang==='ES'?'Más':lang==='FR'?'Plus':lang==='DE'?'Mehr':'Mais'}</span>
        </button>
      </nav>
    </>
  )
}
