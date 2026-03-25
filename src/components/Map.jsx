import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react'
import { FERRY_TIMES, toMin } from '../data/transport'
import {
  APIProvider, Map as GMap,
  AdvancedMarker, useMap, useMapsLibrary,
} from '@vis.gl/react-google-maps'

const MAPS_KEY     = import.meta.env.VITE_GOOGLE_MAPS_KEY
const DARK_MAP_ID  = import.meta.env.VITE_GOOGLE_MAPS_DARK_ID  // optional — configure in Google Console

// Module-level helpers — accessible by ALL components in this file
function calcDist(a, b) {
  const R=6371000, dLat=(b.lat-a.lat)*Math.PI/180, dLng=(b.lng-a.lng)*Math.PI/180
  const x=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2
  return Math.round(2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x)))
}
function fmtDist(m) { return m>=1000?(m/1000).toFixed(1)+'km':m+'m' }

const T = {
  PT: {
    whatLooking: 'O que estás à procura?', showAll: 'Ver todos os locais',
    edit: 'Editar', done: 'Concluir', addPin: 'Novo Pin', cancel: 'Cancelar',
    add: 'Adicionar', tapMap: 'Toca no mapa para colocar', pinName: 'Nome do lugar',
    placeholder: 'Ex: Restaurante O Mar', choosecat: 'Escolhe a categoria',
    changeCat: 'Alterar categoria', navigateTo: 'NAVEGAR PARA',
    walk: (d,t) => `${d} a pé · ~${t} min`, noGPS: 'Ativa o GPS para distância',
    navigate: 'Navegar', saved: 'Copiado!',
    stopNav: 'Parar Navegação', calcRoute: 'A calcular rota...',
    changes: n => `💾 ${n} alteraç${n===1?'ão':'ões'}`,
    places: n => `${n} locais`,
    dragHint: 'Arrasta · × apaga · ✏️ categoria',
  },
  EN: {
    whatLooking: 'What are you looking for?', showAll: 'Show all places',
    edit: 'Edit', done: 'Done', addPin: 'New Pin', cancel: 'Cancel',
    add: 'Add', tapMap: 'Tap the map to place', pinName: 'Place name',
    placeholder: 'Ex: The Harbour Restaurant', choosecat: 'Choose category',
    changeCat: 'Change category', navigateTo: 'NAVIGATE TO',
    walk: (d,t) => `${d} walk · ~${t} min`, noGPS: 'Enable GPS for distance',
    navigate: 'Navigate', saved: 'Copied!',
    stopNav: 'Stop Navigation', calcRoute: 'Calculating route...',
    changes: n => `💾 ${n} change${n===1?'':'s'}`,
    places: n => `${n} places`,
    dragHint: 'Drag · × delete · ✏️ category',
  },
  ES: {
    whatLooking: '¿Qué estás buscando?', showAll: 'Ver todos los lugares',
    edit: 'Editar', done: 'Finalizar', addPin: 'Nuevo Pin', cancel: 'Cancelar',
    add: 'Agregar', tapMap: 'Toca el mapa para colocar', pinName: 'Nombre del lugar',
    placeholder: 'Ej: Restaurante El Mar', choosecat: 'Elige categoría',
    changeCat: 'Cambiar categoría', navigateTo: 'NAVEGAR A',
    walk: (d,t) => `${d} a pie · ~${t} min`, noGPS: 'Activa GPS para distancia',
    navigate: 'Navegar', saved: 'Copiado!',
    stopNav: 'Parar Navegación', calcRoute: 'Calculando ruta...',
    changes: n => `💾 ${n} cambio${n===1?'':'s'}`,
    places: n => `${n} lugares`,
    dragHint: 'Arrastra · × borrar · ✏️ categoría',
  },
}

const CATS = [
  { k:'restaurante', icon:'🍽️', color:'#D32F2F', bg:'#FFEBEE', label:{PT:'Restaurantes', EN:'Restaurants', ES:'Restaurantes'} },
  { k:'pastelaria',  icon:'☕',  color:'#5D4037', bg:'#EFEBE9', label:{PT:'Cafés',        EN:'Cafés',       ES:'Cafés'       } },
  { k:'gelataria',   icon:'🍦',  color:'#D81B60', bg:'#FCE4EC', label:{PT:'Gelados',      EN:'Ice Cream',   ES:'Helados'     } },
  { k:'hamburgaria', icon:'🍔',  color:'#E65100', bg:'#FFF3E0', label:{PT:'Burgers',      EN:'Burgers',     ES:'Burgers'     } },
  { k:'pizzaria',    icon:'🍕',  color:'#C62828', bg:'#FFEBEE', label:{PT:'Pizzarias',    EN:'Pizza',       ES:'Pizzerías'   } },
  { k:'kebab',       icon:'🌯',  color:'#6D4C41', bg:'#EFEBE9', label:{PT:'Kebab',        EN:'Kebab',       ES:'Kebab'       } },
  { k:'cultura',     icon:'🏛️', color:'#1565C0', bg:'#E3F2FD', label:{PT:'Cultura',      EN:'Culture',     ES:'Cultura'     } },
  { k:'estado',      icon:'🏢',  color:'#37474F', bg:'#ECEFF1', label:{PT:'Estado',       EN:'Gov.',        ES:'Estado'      } },
  { k:'praia',       icon:'🏖️', color:'#0277BD', bg:'#E1F5FE', label:{PT:'Praias',       EN:'Beaches',     ES:'Playas'      } },
  { k:'natureza',    icon:'🌿',  color:'#2E7D32', bg:'#E8F5E9', label:{PT:'Natureza',     EN:'Nature',      ES:'Naturaleza'  } },
  { k:'mercado',     icon:'🛒',  color:'#1B5E20', bg:'#E8F5E9', label:{PT:'Mercados',     EN:'Markets',     ES:'Mercados'    } },
  { k:'hotel',       icon:'🏨',  color:'#AD1457', bg:'#FCE4EC', label:{PT:'Hotéis',       EN:'Hotels',      ES:'Hoteles'     } },
  { k:'banco',       icon:'🏦',  color:'#0D47A1', bg:'#E3F2FD', label:{PT:'Bancos/ATM',  EN:'Banks/ATM',   ES:'Bancos/ATM'  } },
  { k:'farmacia',    icon:'💊',  color:'#00695C', bg:'#E0F2F1', label:{PT:'Farmácias',    EN:'Pharmacy',    ES:'Farmacias'   } },
  { k:'parking',     icon:'🅿️', color:'#1565C0', bg:'#E3F2FD', label:{PT:'Parking',      EN:'Parking',     ES:'Parking'     } },
  { k:'combustivel', icon:'⛽',  color:'#E65100', bg:'#FFF3E0', label:{PT:'Combustível',  EN:'Fuel',        ES:'Gasolina'    } },
  { k:'transporte',  icon:'🚌',  color:'#4A148C', bg:'#F3E5F5', label:{PT:'Transportes',  EN:'Transport',   ES:'Transporte'  } },
  { k:'compras',     icon:'🛍️', color:'#6A1B9A', bg:'#F3E5F5', label:{PT:'Compras',      EN:'Shopping',    ES:'Compras'     } },
  { k:'saude',       icon:'🏥',  color:'#00838F', bg:'#E0F7FA', label:{PT:'Saúde',        EN:'Health',      ES:'Salud'       } },
]

function getCat(k) {
  return CATS.find(c=>c.k===k) || { icon:'📍', color:'#546E7A', bg:'#ECEFF1', label:{PT:k,EN:k,ES:k} }
}

const MAP_FILTERS = [
  { id:'all',       icon:null,  cats:null,                                                                     label:{PT:'Todos',      EN:'All',        ES:'Todos',      FR:'Tout',      DE:'Alle'    } },
  { id:'eat',       icon:'🍽️', cats:['restaurante','pastelaria','gelataria','hamburgaria','pizzaria','kebab'], label:{PT:'Comer',      EN:'Eat',         ES:'Comer',      FR:'Manger',    DE:'Essen'   } },
  { id:'beach',     icon:'🏖️', cats:['praia'],                                                                label:{PT:'Praias',     EN:'Beaches',     ES:'Playas',     FR:'Plages',    DE:'Strände' } },
  { id:'culture',   icon:'🏛️', cats:['cultura','monumento','estado'],                                        label:{PT:'Cultura',    EN:'Culture',     ES:'Cultura',    FR:'Culture',   DE:'Kultur'  } },
  { id:'hotel',     icon:'🏨',  cats:['hotel'],                                                                label:{PT:'Hotéis',     EN:'Hotels',      ES:'Hoteles',    FR:'Hôtels',    DE:'Hotels'  } },
  { id:'transport', icon:'🚌',  cats:['transporte','parking'],                                                label:{PT:'Transporte', EN:'Transport',   ES:'Transporte', FR:'Transport', DE:'Verkehr' } },
]

// ── Pin marker ──────────────────────────────────────────────────────────────
const PinMarker = memo(function PinMarker({ pin, isSelected, editMode, onSelect, onDelete, onEditCat, onDragEnd }) {
  const cat = getCat(pin.cat)

  return (
    <AdvancedMarker
      position={{ lat: pin.lat, lng: pin.lng }}
      draggable={editMode}
      onDragEnd={e => { if (onDragEnd && e.latLng) onDragEnd(pin.id, e.latLng.lat(), e.latLng.lng()) }}
      onClick={e => {
        const action = e.domEvent?.target?.closest('[data-action]')?.getAttribute('data-action')
        if (action === 'delete') { onDelete(pin.id, pin.name); return }
        if (action === 'editcat') { onEditCat(pin); return }
        if (!editMode) onSelect(pin)
      }}
      zIndex={isSelected ? 10 : 1}
    >
      <div style={{ position:'relative', width: editMode ? 52 : 40, height: editMode ? 58 : 50 }}>
        {/* Teardrop pin */}
        <div style={{
          position:'absolute', bottom:0,
          left: editMode ? 6 : 0,
          width: isSelected ? 44 : 36,
          height: isSelected ? 44 : 36,
          borderRadius: '50% 50% 50% 4px',
          transform: 'rotate(-45deg)',
          background: isSelected
            ? `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}dd 100%)`
            : '#ffffff',
          border: `2.5px solid ${cat.color}`,
          boxShadow: isSelected
            ? `0 6px 20px ${cat.color}55, 0 2px 6px rgba(0,0,0,.12)`
            : '0 2px 10px rgba(0,0,0,.18), 0 1px 3px rgba(0,0,0,.08)',
          transition: 'all .2s cubic-bezier(.34,1.56,.64,1)',
          display:'flex', alignItems:'center', justifyContent:'center',
          willChange: 'transform',
        }}>
          <span style={{
            transform:'rotate(45deg)',
            fontSize: isSelected ? 20 : 16,
            display:'block', lineHeight:1,
            filter: isSelected ? 'brightness(0) invert(1)' : 'none',
            transition: 'all .2s',
          }}>
            {cat.icon}
          </span>
        </div>
        {editMode && (
          <>
            <div data-action="delete" style={{ position:'absolute', top:-4, right:-4, width:28, height:28, borderRadius:'50%', background:'#EF4444', border:'2.5px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,.2)', zIndex:5 }}>×</div>
            <div data-action="editcat" style={{ position:'absolute', top:-4, left:-4, width:28, height:28, borderRadius:'50%', background:'#1D4ED8', border:'2.5px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,.2)', zIndex:5 }}>✏️</div>
          </>
        )}
      </div>
    </AdvancedMarker>
  )
})

// ── Pin card (floating, bottom of map) ──────────────────────────────────────
function PinCard({ pin, userPos, lang, onClose, onNavigate }) {
  const cat  = getCat(pin.cat)
  const t    = T[lang] || T.PT
  const dist = userPos ? calcDist(userPos, pin) : null
  const mins = dist ? Math.ceil(dist / 80) : null

  return (
    <div
      style={{
        position:'absolute', bottom:0, left:0, right:0, zIndex:20,
        padding:'0 12px 16px',
        animation: 'pin-card-in .25s cubic-bezier(.22,.68,0,1.2) both',
      }}
    >
      <style>{`
        @keyframes pin-card-in {
          from { opacity:0; transform:translateY(20px) }
          to   { opacity:1; transform:none }
        }
      `}</style>

      <div style={{
        background:'var(--white)',
        borderRadius:20,
        boxShadow:'0 -2px 0 rgba(0,0,0,.04), 0 8px 40px rgba(0,0,0,.18)',
        padding:'16px 18px 18px',
        display:'flex', flexDirection:'column', gap:12,
      }}>
        {/* Top row: info + close */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
          {/* Category icon */}
          <div style={{
            width:50, height:50, borderRadius:14, flexShrink:0,
            background: cat.bg,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:24, border:`1.5px solid ${cat.color}22`,
          }}>
            {cat.icon}
          </div>

          {/* Name + badge */}
          <div style={{ flex:1, minWidth:0 }}>
            {/* Category badge */}
            <div style={{
              display:'inline-flex', alignItems:'center', gap:4,
              background: cat.bg, color: cat.color,
              fontSize:10, fontWeight:800,
              padding:'2px 8px', borderRadius:50,
              marginBottom:4,
              letterSpacing:.3, textTransform:'uppercase',
            }}>
              {cat.label[lang]}
            </div>
            {/* Name */}
            <div style={{
              fontSize:16, fontWeight:800, color:'var(--ink)',
              lineHeight:1.25,
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            }}>
              {pin.name}
            </div>
            {/* Distance */}
            {dist !== null ? (
              <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:4 }}>
                <span style={{ fontSize:13 }}>🚶</span>
                <span style={{ fontSize:12, fontWeight:700, color:'var(--green)' }}>
                  {fmtDist(dist)} · ~{mins} min
                </span>
              </div>
            ) : (
              <div style={{ fontSize:11, color:'var(--ink-20)', marginTop:4 }}>
                {t.noGPS}
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              width:30, height:30, borderRadius:'50%', flexShrink:0,
              background:'var(--surface)', border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:16, color:'var(--ink-40)',
            }}
          >×</button>
        </div>

        {/* Navigate button */}
        <button
          onClick={onNavigate}
          style={{
            width:'100%', padding:'13px 0',
            background: `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`,
            color:'#fff', border:'none', borderRadius:14,
            fontSize:14, fontWeight:800, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            boxShadow: `0 4px 16px ${cat.color}44`,
            letterSpacing:'.2px',
          }}
        >
          <span style={{ fontSize:18 }}>🧭</span>
          {t.navigate}
        </button>
      </div>
    </div>
  )
}

// ── Bottom sheet ────────────────────────────────────────────────────────────
function Sheet({ onClose, children, noPad }) {
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose()}} style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:100,
      display:'flex', alignItems:'flex-end', justifyContent:'center',
    }}>
      <div style={{
        width:'100%', maxWidth:430, background:'var(--white)',
        borderRadius:'20px 20px 0 0',
        boxShadow:'0 -4px 40px rgba(0,0,0,.15)',
        maxHeight:'88vh', display:'flex', flexDirection:'column',
        paddingBottom:'env(safe-area-inset-bottom, 0px)',
      }}>
        <div style={{ padding: noPad ? '12px 0 0' : '12px 20px 0', flexShrink:0 }}>
          <div style={{ width:40, height:4, borderRadius:2, background:'var(--border-lt)', margin:'0 auto 14px' }} />
        </div>
        <div style={{ overflowY:'auto', flex:1, padding: noPad ? '0' : '0 20px 24px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Category picker (home screen of map) ────────────────────────────────────
function CategoryPicker({ lang, pins, onSelect, onShowAll, onEdit }) {
  const t = T[lang] || T.PT
  const counts = {}
  CATS.forEach(c => { counts[c.k] = pins.filter(p=>p.cat===c.k).length })
  const activeCats = CATS.filter(c => counts[c.k] > 0)

  return (
    <div style={{
      position:'absolute', inset:0, background:'rgba(10,22,40,.55)',
      backdropFilter:'blur(2px)', zIndex:10,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end',
    }}>
      <div style={{
        width:'100%', maxWidth:430, background:'var(--white)',
        borderRadius:'20px 20px 0 0',
        maxHeight:'78vh', display:'flex', flexDirection:'column',
        paddingBottom:'env(safe-area-inset-bottom, 0px)',
        boxShadow:'0 -4px 40px rgba(0,0,0,.2)',
      }}>
        {/* Header */}
        <div style={{ padding:'12px 20px 0', flexShrink:0 }}>
          <div style={{ width:40, height:4, borderRadius:2, background:'var(--border-lt)', margin:'0 auto 14px' }} />
          <div style={{ display:'flex', alignItems:'center', marginBottom:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:17, fontWeight:800, color:'var(--ink)' }}>{t.whatLooking}</div>
              <div style={{ fontSize:12, color:'var(--ink-20)', marginTop:2 }}>
                {lang==='EN' ? `${pins.length} places available` : lang==='ES' ? `${pins.length} lugares disponibles` : `${pins.length} locais disponíveis`}
              </div>
            </div>
            <button onClick={onShowAll} aria-label="Fechar" style={{
              width:32, height:32, borderRadius:'50%',
              background:'var(--surface)', border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, color:'var(--ink-40)', lineHeight:1,
            }}>×</button>
          </div>
        </div>

        {/* Category list */}
        <div style={{ overflowY:'auto', flex:1 }}>
          {activeCats.map((c, i, arr) => (
            <button key={c.k} onClick={() => onSelect(c.k)} style={{
              display:'flex', alignItems:'center', gap:14,
              width:'100%', padding:'11px 20px',
              background:'none', border:'none',
              borderBottom: i < arr.length - 1 ? '1px solid var(--bg)' : 'none',
              cursor:'pointer', textAlign:'left',
            }}>
              <div style={{
                width:40, height:40, borderRadius:11, flexShrink:0,
                background:c.bg, border:`1.5px solid ${c.color}22`,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:19,
              }}>{c.icon}</div>
              <div style={{ flex:1, fontSize:14, fontWeight:600, color:'var(--ink)' }}>
                {c.label[lang] || c.label.PT}
              </div>
              <div style={{
                background:c.bg, color:c.color,
                fontSize:11, fontWeight:700,
                padding:'2px 9px', borderRadius:50, flexShrink:0,
              }}>{counts[c.k]}</div>
              <span style={{ color:'var(--border)', fontSize:16, flexShrink:0 }}>›</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding:'12px 20px 16px', flexShrink:0, borderTop:'1px solid var(--border-lt)', display:'flex', gap:8 }}>
          <button onClick={onShowAll} style={{
            flex:1, padding:'12px 0', background:'var(--primary)', color:'#fff',
            border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer',
          }}>🗺️ {t.showAll}</button>
          <button onClick={onEdit} style={{
            padding:'12px 16px', background:'var(--surface)', color:'var(--ink-70)',
            border:'none', borderRadius:12, fontSize:13, fontWeight:600, cursor:'pointer',
          }}>✏️ {t.edit}</button>
        </div>
      </div>
    </div>
  )
}

// ── Map controller (must be a child of GMap to access useMap) ───────────────
function MapController({ activeFilter, visible, locateMeRef, userPos }) {
  const map = useMap()

  // Expose locateMe to parent via ref
  useEffect(() => {
    if (!map) return
    locateMeRef.current = () => {
      if (!userPos) return
      map.panTo(userPos)
      map.setZoom(17)
    }
  }, [map, userPos])

  // Auto fit-bounds when category filter changes
  useEffect(() => {
    if (!map || activeFilter === null || visible.length === 0) return
    if (visible.length === 1) {
      map.panTo({ lat: visible[0].lat, lng: visible[0].lng })
      map.setZoom(16)
      return
    }
    const bounds = new window.google.maps.LatLngBounds()
    visible.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }))
    map.fitBounds(bounds, 60)
  }, [activeFilter, map]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

// ── Routing controller (must be inside GMap to use useMap / useMapsLibrary) ─
function RoutingController({ activeRoute, onResult }) {
  const map       = useMap()
  const routesLib = useMapsLibrary('routes')
  const [svc, setSvc]           = useState(null)
  const [renderer, setRenderer] = useState(null)

  // Init DirectionsService + DirectionsRenderer once the library loads
  useEffect(() => {
    if (!routesLib || !map) return
    setSvc(new routesLib.DirectionsService())
    const dr = new routesLib.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: { strokeColor: '#1976D2', strokeWeight: 5, strokeOpacity: 0.85 },
    })
    setRenderer(dr)
    return () => dr.setMap(null)
  }, [routesLib, map])

  // Request walking directions whenever activeRoute changes
  useEffect(() => {
    if (!svc || !renderer || !routesLib) return
    if (!activeRoute) {
      renderer.setMap(null)
      onResult(null)
      return
    }
    renderer.setMap(map)
    svc.route(
      { origin: activeRoute.origin, destination: activeRoute.destination, travelMode: routesLib.TravelMode.WALKING },
      (result, status) => {
        if (status === 'OK') { renderer.setDirections(result); onResult(result) }
        else onResult(null)
      }
    )
  }, [activeRoute, svc, renderer]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

// ── Route card (shown while in-app navigation is active) ────────────────────
function RouteCard({ activeRoute, routeResult, lang, onStop }) {
  const { destination, origin } = activeRoute
  const cat = getCat(destination.cat)
  const t   = T[lang] || T.PT
  const leg = routeResult?.routes?.[0]?.legs?.[0]

  const gmUrl   = `https://www.google.com/maps/dir/?api=1${origin ? `&origin=${origin.lat},${origin.lng}` : ''}&destination=${destination.lat},${destination.lng}&travelmode=walking`
  const wazeUrl = `https://waze.com/ul?ll=${destination.lat},${destination.lng}&navigate=yes`

  return (
    <div style={{
      position:'absolute', bottom:0, left:0, right:0, zIndex:20,
      padding:'0 12px 16px',
      animation: 'pin-card-in .25s cubic-bezier(.22,.68,0,1.2) both',
    }}>
      <div style={{
        background:'var(--white)', borderRadius:20,
        boxShadow:'0 -2px 0 rgba(0,0,0,.04), 0 8px 40px rgba(0,0,0,.18)',
        padding:'16px 18px 18px', display:'flex', flexDirection:'column', gap:12,
      }}>
        {/* Destination header */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:46, height:46, borderRadius:13, background:cat.bg, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, border:`1.5px solid ${cat.color}22` }}>{cat.icon}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:15, fontWeight:800, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{destination.name}</div>
            {leg ? (
              <div style={{ fontSize:12, color:'#16A34A', fontWeight:700, marginTop:2 }}>🚶 {leg.distance?.text} · {leg.duration?.text}</div>
            ) : (
              <div style={{ fontSize:11, color:'var(--ink-20)', marginTop:2 }}>{t.calcRoute}</div>
            )}
          </div>
          <button onClick={onStop} style={{ width:30, height:30, borderRadius:'50%', background:'var(--surface)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'var(--ink-40)', flexShrink:0 }}>×</button>
        </div>

        {/* External navigation apps */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <button onClick={() => window.open(gmUrl, '_blank')} style={{ padding:'10px 0', background:'#4285F4', color:'#fff', border:'none', borderRadius:12, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
            🗺️ Google Maps
          </button>
          <button onClick={() => window.open(wazeUrl, '_blank')} style={{ padding:'10px 0', background:'#00BFFF', color:'#fff', border:'none', borderRadius:12, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
            🔵 Waze
          </button>
        </div>

        {/* Stop navigation */}
        <button onClick={onStop} style={{ width:'100%', padding:'12px 0', background:'#FEE2E2', color:'#DC2626', border:'none', borderRadius:14, fontSize:14, fontWeight:800, cursor:'pointer' }}>
          ✕ {t.stopNav}
        </button>
      </div>
    </div>
  )
}

// ── Main ────────────────────────────────────────────────────────────────────
function MapContent({ lang, pins, setPins, theme, onNav }) {
  const t = T[lang] || T.PT
  const [activeFilter, setActiveFilter] = useState(null)
  const [tick, setTick] = useState(0) // null = show picker
  const [showPicker, setShowPicker]     = useState(true)
  const [selected, setSelected]         = useState(null)
  const [userPos, setUserPos]           = useState(null)
  const [navDest, setNavDest]           = useState(null)
  const [editMode, setEditMode]         = useState(false)
  const [addingPin, setAddingPin]       = useState(false)
  const [pendingPos, setPendingPos]     = useState(null)
  const [showAdd, setShowAdd]           = useState(false)
  const [pendingCat, setPendingCat]     = useState(null)
  const [newName, setNewName]           = useState('')
  const [editingPin, setEditingPin]     = useState(null)
  const [changes, setChanges]           = useState([])
  const [activeRoute, setActiveRoute]   = useState(null) // {origin, destination}
  const [routeResult, setRouteResult]   = useState(null) // DirectionsResult
  const [quickFilter, setQuickFilter]   = useState('all')
  const nextId    = useRef(Math.max(0, ...pins.map(p => p.id)) + 1)
  const locateMeRef = useRef(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    const wid = navigator.geolocation.watchPosition(
      pos => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserPos(prev => {
          if (prev && calcDist(prev, next) < 10) return prev // skip if moved <10 m
          return next
        })
      },
      () => {}, { enableHighAccuracy: true, maximumAge: 10000 }
    )
    return () => navigator.geolocation.clearWatch(wid)
  }, [])

  useEffect(() => { const iv = setInterval(() => setTick(x => x+1), 60000); return () => clearInterval(iv) }, [])

  // Ferry pill — next departure within 30 min
  const nm = new Date().getHours()*60 + new Date().getMinutes()
  const nextFerry = FERRY_TIMES.find(f => toMin(f) > nm)
  const ferryEta  = nextFerry ? toMin(nextFerry) - nm : null
  const showFerryPill = ferryEta !== null && ferryEta <= 30

  // When filter changes, hide picker
  function selectCategory(cat) {
    setActiveFilter(cat)
    setShowPicker(false)
  }
  function showAllPins() {
    setActiveFilter('todas')
    setShowPicker(false)
  }
  function openEditMode() {
    setActiveFilter('todas')
    setShowPicker(false)
    setEditMode(true)
  }

  const visible = useMemo(() => {
    let base = !activeFilter || activeFilter === 'todas'
      ? pins
      : pins.filter(p => p.cat === activeFilter)
    if (quickFilter !== 'all') {
      const f = MAP_FILTERS.find(mf => mf.id === quickFilter)
      if (f?.cats) base = base.filter(p => f.cats.includes(p.cat))
    }
    return base
  }, [pins, activeFilter, quickFilter])

  function handleMapClick(e) {
    // Em modo edição/adição, bloqueia o InfoWindow nativo para não congelar o mapa.
    // Em modo normal, deixa o Google Maps abrir o InfoWindow livremente (útil para turistas).
    if (e.detail?.placeId) {
      if (editMode || addingPin) e.stop?.()
      return
    }
    if (showAdd || editingPin || navDest) return  // sheet já aberto, ignorar clicks duplos
    if (!addingPin) { setSelected(null); return }
    if (!e.detail?.latLng) return
    setPendingPos({ lat:e.detail.latLng.lat, lng:e.detail.latLng.lng })
    setAddingPin(false); setShowAdd(true)
  }

  const handleDragEnd = useCallback((id, lat, lng) => {
    const nl = parseFloat(lat.toFixed(6)), ng = parseFloat(lng.toFixed(6))
    setPins(prev => {
      const pin = prev.find(p => p.id === id)
      setChanges(c => [...c.filter(ch => !(ch.type==='move' && ch.id===id)), {type:'move',id,name:pin?.name,lat:nl,lng:ng}])
      return prev.map(p => p.id === id ? {...p, lat:nl, lng:ng} : p)
    })
  }, [])

  const handleDelete = useCallback((id, name) => {
    setPins(prev => prev.filter(p => p.id !== id))
    setChanges(prev => [...prev, {type:'delete', id, name}])
    setSelected(prev => prev?.id === id ? null : prev)
  }, [])

  function confirmCat(newCat) {
    const info=getCat(newCat)
    setPins(prev=>prev.map(p=>p.id===editingPin.id?{...p,cat:newCat,color:info.color,emoji:info.icon}:p))
    setChanges(prev=>[...prev,{type:'cat',id:editingPin.id,name:editingPin.name,cat:newCat}])
    setEditingPin(null)
  }

  function confirmAdd() {
    if(!newName.trim()||!pendingCat||!pendingPos) return
    const info=getCat(pendingCat)
    const pin={id:nextId.current++,name:newName.trim(),emoji:info.icon,cat:pendingCat,color:info.color,lat:parseFloat(pendingPos.lat.toFixed(6)),lng:parseFloat(pendingPos.lng.toFixed(6))}
    setPins(prev=>[...prev,pin])
    setChanges(prev=>[...prev,{type:'new',name:pin.name,lat:pin.lat,lng:pin.lng,cat:pin.cat}])
    setShowAdd(false); setPendingCat(null); setNewName(''); setPendingPos(null)
  }

  function copyChanges() {
    // Generate JS array ready to paste into src/data/pins.js
    const jsLines = ['export const DEFAULT_PINS = [']
    pins.forEach((p, i) => {
      const comma = i < pins.length - 1 ? ',' : ''
      jsLines.push(`  {id:${p.id},name:${JSON.stringify(p.name)},emoji:${JSON.stringify(p.emoji)},cat:${JSON.stringify(p.cat)},color:${JSON.stringify(p.color)},lat:${p.lat},lng:${p.lng}}${comma}`)
    })
    jsLines.push(']')
    navigator.clipboard?.writeText(jsLines.join('\n')).then(() => alert(
      lang === 'EN' ? 'Copied! Send this to Claude: "update src/data/pins.js with this content"'
      : 'Copiado! Envia ao Claude: "atualiza src/data/pins.js com este conteúdo"'
    ))
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>

      {/* ── Ferry pill — only when next departure ≤ 30 min ── */}
      {showFerryPill && (
        <button
          onClick={() => onNav?.('transport')}
          style={{ position:'absolute', bottom:'calc(72px + env(safe-area-inset-bottom,0px))', left:16, zIndex:20, display:'flex', alignItems:'center', gap:7, background:'#1D4ED8', border:'none', borderRadius:50, padding:'8px 14px 8px 10px', boxShadow:'0 4px 16px rgba(29,78,216,.45)', cursor:'pointer', touchAction:'manipulation' }}
        >
          <span style={{ fontSize:17 }}>⛴️</span>
          <div style={{ textAlign:'left' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'#fff', lineHeight:1 }}>{nextFerry}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.75)', fontWeight:600, lineHeight:1, marginTop:2 }}>em {ferryEta}min</div>
          </div>
        </button>
      )}

      {/* Top bar — only when NOT showing picker */}
      {!showPicker && (
        <div style={{ background:'#fff', borderBottom:'1px solid #F3F4F6', padding:'8px 12px', flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {/* Back to picker */}
            <button onClick={()=>{ setShowPicker(true); setActiveFilter(null); setEditMode(false); setSelected(null) }} style={{ width:34, height:34, borderRadius:50, background:'#F3F4F6', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
              ☰
            </button>

            {/* Active filter pill */}
            {activeFilter && activeFilter !== 'todas' ? (
              <div style={{ display:'flex', alignItems:'center', gap:6, background:getCat(activeFilter).bg, border:`1.5px solid ${getCat(activeFilter).color}33`, borderRadius:50, padding:'5px 12px', flex:1 }}>
                <span style={{ fontSize:14 }}>{getCat(activeFilter).icon}</span>
                <span style={{ fontSize:12, fontWeight:700, color:getCat(activeFilter).color }}>{getCat(activeFilter).label[lang]}</span>
                <span style={{ fontSize:11, color:'#9CA3AF', marginLeft:'auto' }}>{visible.length}</span>
                <button onClick={showAllPins} style={{ background:'none', border:'none', color:'#9CA3AF', cursor:'pointer', fontSize:14, lineHeight:1, padding:0, marginLeft:2 }}>×</button>
              </div>
            ) : (
              <div style={{ flex:1, fontSize:12, color:'#9CA3AF' }}>
                {t.places(visible.length)}
              </div>
            )}

            {/* Edit toggle */}
            {!editMode ? (
              <button onClick={()=>setEditMode(true)} style={{ padding:'6px 12px', borderRadius:50, background:'#F3F4F6', border:'none', fontSize:11, fontWeight:600, color:'#374151', cursor:'pointer', flexShrink:0 }}>
                ✏️ {t.edit}
              </button>
            ) : (
              <button onClick={()=>{ setEditMode(false); setAddingPin(false) }} style={{ padding:'6px 12px', borderRadius:50, background:'#0A1628', border:'none', fontSize:11, fontWeight:700, color:'#fff', cursor:'pointer', flexShrink:0 }}>
                ✓ {t.done}
              </button>
            )}
          </div>

          {/* Edit mode toolbar */}
          {editMode && (
            <div style={{ display:'flex', gap:8, marginTop:8, alignItems:'center' }}>
              <span style={{ fontSize:11, color:'#9CA3AF', flex:1 }}>
                {addingPin ? `👆 ${t.tapMap}` : t.dragHint}
              </span>
              <button onClick={()=>setAddingPin(a=>!a)} style={{ padding:'5px 12px', borderRadius:50, border:'none', fontWeight:700, fontSize:11, background:addingPin?'#FF5722':'#2196F3', color:'#fff', cursor:'pointer', flexShrink:0 }}>
                {addingPin ? `✕` : `＋ ${t.addPin}`}
              </button>
              {changes.length > 0 && (
                <button onClick={copyChanges} style={{ padding:'5px 12px', borderRadius:50, border:'none', fontWeight:700, fontSize:11, background:'#4CAF50', color:'#fff', cursor:'pointer', flexShrink:0 }}>
                  {t.changes(changes.length)}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Map */}
      <div style={{ flex:1, minHeight:0, position:'relative' }}>

        {/* Quick filter bar */}
        {!showPicker && !navDest && !activeRoute && (
          <div style={{
            position:'absolute', top:8, left:0, right:0, zIndex:10,
            display:'flex', overflowX:'auto', gap:6, padding:'0 10px',
            scrollbarWidth:'none', pointerEvents:'none',
          }}>
            {MAP_FILTERS.map(f => {
              const active = quickFilter === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setQuickFilter(f.id)}
                  style={{
                    pointerEvents:'auto', flexShrink:0,
                    display:'flex', alignItems:'center', gap:5,
                    padding:'6px 13px', borderRadius:50,
                    border: active ? 'none' : '1px solid rgba(0,0,0,.1)',
                    background: active ? 'var(--primary)' : 'var(--white)',
                    color: active ? '#fff' : 'var(--ink)',
                    fontSize:12, fontWeight:700, cursor:'pointer',
                    boxShadow:'0 2px 8px rgba(0,0,0,.15)',
                    transition:'background .15s, color .15s',
                  }}
                >
                  {f.icon && <span style={{ fontSize:13 }}>{f.icon}</span>}
                  {f.label[lang] || f.label.PT}
                </button>
              )
            })}
          </div>
        )}

        <GMap
          defaultCenter={{ lat:37.194, lng:-7.425 }}
          defaultZoom={13}
          mapId={theme === 'dark' && DARK_MAP_ID ? DARK_MAP_ID : 'vrsa-map'}
          gestureHandling="greedy"
          style={{ width:'100%', height:'100%' }}
          onClick={handleMapClick}
          mapTypeControl={false} streetViewControl={false} fullscreenControl={false}
        >
          <MapController
            activeFilter={activeFilter}
            visible={visible}
            locateMeRef={locateMeRef}
            userPos={userPos}
          />
          <RoutingController
            activeRoute={activeRoute}
            onResult={setRouteResult}
          />
          {userPos && (
            <AdvancedMarker position={userPos} zIndex={20}>
              <div style={{ position:'relative', width:18, height:18 }}>
                <div style={{ position:'absolute', inset:-5, borderRadius:'50%', background:'rgba(25,118,210,.15)', animation:'gps-ring 2s ease infinite' }} />
                <div style={{ width:18, height:18, borderRadius:'50%', background:'#1976D2', border:'3px solid #fff', boxShadow:'0 2px 8px rgba(25,118,210,.5)' }} />
              </div>
            </AdvancedMarker>
          )}

          {!showPicker && visible.map(pin => {
            const destId = navDest?.id ?? activeRoute?.destination?.id
            const shouldShow = destId ? destId === pin.id : true
            if (!shouldShow) return null
            return (
              <PinMarker key={pin.id} pin={pin}
                isSelected={selected?.id === pin.id || navDest?.id === pin.id || activeRoute?.destination?.id === pin.id}
                editMode={editMode}
                onSelect={setSelected} onDelete={handleDelete}
                onEditCat={setEditingPin} onDragEnd={handleDragEnd}
              />
            )
          })}

        </GMap>

        {/* ── Active route card ── */}
        {activeRoute && (
          <RouteCard
            activeRoute={activeRoute}
            routeResult={routeResult}
            lang={lang}
            onStop={() => { setActiveRoute(null); setRouteResult(null) }}
          />
        )}

        {/* ── Floating pin card (only when no active route) ── */}
        {selected && !editMode && !activeRoute && (
          <PinCard
            pin={selected}
            userPos={userPos}
            lang={lang}
            onClose={() => setSelected(null)}
            onNavigate={() => {
              if (userPos) {
                setActiveRoute({ origin: userPos, destination: selected })
                setSelected(null)
              } else {
                setNavDest(selected)
                setSelected(null)
              }
            }}
          />
        )}

        {/* Category picker overlay */}
        {showPicker && (
          <CategoryPicker lang={lang} pins={pins} onSelect={selectCategory} onShowAll={showAllPins} onEdit={openEditMode} />
        )}

        {addingPin && (
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ position:'relative', width:40, height:40 }}>
              <div style={{ position:'absolute', top:'50%', left:0, right:0, height:2, background:'#1565C0', transform:'translateY(-50%)' }} />
              <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:2, background:'#1565C0', transform:'translateX(-50%)' }} />
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:10, height:10, borderRadius:'50%', background:'#1565C0' }} />
            </div>
          </div>
        )}

        {/* ── Locate Me button ── */}
        {userPos && !showPicker && (
          <button
            onClick={() => locateMeRef.current?.()}
            aria-label="Locate me"
            style={{
              position:'absolute',
              right:12,
              bottom: activeRoute ? 240 : selected && !editMode ? 190 : 76,
              width:44, height:44, borderRadius:12,
              background:'var(--white)',
              border:'1.5px solid var(--border-lt)',
              boxShadow:'0 2px 12px rgba(0,0,0,.18)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:20, cursor:'pointer',
              transition:'bottom .25s cubic-bezier(.22,.68,0,1.2)',
              zIndex:15,
            }}
          >🎯</button>
        )}
      </div>

      {/* Change cat sheet */}
      {editingPin && (
        <Sheet onClose={()=>setEditingPin(null)}>
          <div style={{ fontSize:16, fontWeight:800, color:'#111827', marginBottom:4 }}>{t.changeCat}</div>
          <div style={{ fontSize:13, color:'#9CA3AF', marginBottom:16 }}>{editingPin.name}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {CATS.map(c=>(
              <button key={c.k} onClick={()=>confirmCat(c.k)} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:editingPin.cat===c.k?c.bg:'#FAFAFA', border:`1.5px solid ${editingPin.cat===c.k?c.color:'#EEEEEE'}`, borderRadius:12, cursor:'pointer', textAlign:'left' }}>
                <span style={{ fontSize:20 }}>{c.icon}</span>
                <span style={{ fontSize:12, fontWeight:600, color:editingPin.cat===c.k?c.color:'#374151', flex:1, lineHeight:1.2 }}>{c.label[lang]}</span>
                {editingPin.cat===c.k && <span style={{ color:c.color, fontSize:12 }}>✓</span>}
              </button>
            ))}
          </div>
          <button onClick={()=>setEditingPin(null)} style={{ width:'100%', padding:12, marginTop:12, background:'#F9FAFB', color:'#9CA3AF', border:'1px solid #EEEEEE', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>{t.cancel}</button>
        </Sheet>
      )}

      {/* Add pin sheet */}
      {showAdd && (
        <Sheet onClose={()=>{ setShowAdd(false); setPendingCat(null); setNewName('') }}>
          {!pendingCat ? (
            <>
              <div style={{ fontSize:16, fontWeight:800, color:'#111827', marginBottom:4 }}>{t.addPin}</div>
              <div style={{ fontSize:13, color:'#9CA3AF', marginBottom:16 }}>{t.choosecat}</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {CATS.map(c=>(
                  <button key={c.k} onClick={()=>setPendingCat(c.k)} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:'#FAFAFA', border:'1.5px solid #EEEEEE', borderRadius:12, cursor:'pointer', textAlign:'left' }}>
                    <span style={{ fontSize:20 }}>{c.icon}</span>
                    <span style={{ fontSize:12, fontWeight:600, color:'#374151', lineHeight:1.2 }}>{c.label[lang]}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:getCat(pendingCat).bg, borderRadius:12, marginBottom:14 }}>
                <span style={{ fontSize:22 }}>{getCat(pendingCat).icon}</span>
                <span style={{ fontSize:14, fontWeight:700, color:getCat(pendingCat).color }}>{getCat(pendingCat).label[lang]}</span>
              </div>
              <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&confirmAdd()}
                placeholder={t.placeholder}
                style={{ width:'100%', padding:'12px 14px', marginBottom:12, border:'1.5px solid #E5E7EB', borderRadius:10, fontSize:15, outline:'none', fontFamily:'inherit', color:'#111827' }}
              />
              <button onClick={confirmAdd} style={{ width:'100%', padding:14, background:'#0A1628', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', marginBottom:8 }}>✅ {t.add}</button>
              <button onClick={()=>setPendingCat(null)} style={{ width:'100%', padding:11, background:'#F9FAFB', color:'#9CA3AF', border:'1px solid #EEEEEE', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer' }}>← {lang==='EN'?'Back':'Voltar'}</button>
            </>
          )}
          <button onClick={()=>{ setShowAdd(false); setPendingCat(null); setNewName('') }} style={{ width:'100%', padding:12, marginTop:8, background:'#FEE2E2', color:'#DC2626', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>{t.cancel}</button>
        </Sheet>
      )}

      {/* Nav sheet */}
      {navDest && (
        <Sheet onClose={()=>setNavDest(null)}>
          <div style={{ display:'flex', alignItems:'center', gap:12, paddingBottom:16, borderBottom:'1px solid #F3F4F6', marginBottom:16 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:getCat(navDest.cat).bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>
              {getCat(navDest.cat).icon}
            </div>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:'#9CA3AF', letterSpacing:1.2, textTransform:'uppercase', marginBottom:2 }}>{t.navigateTo}</div>
              <div style={{ fontSize:16, fontWeight:800, color:'#111827', lineHeight:1.2 }}>{navDest.name}</div>
            </div>
          </div>
          {[
            { app:'google', icon:'🗺️', label:'Google Maps', sub:'Google LLC' },
            { app:'apple',  icon:'🍎', label:'Apple Maps',  sub:'Apple Inc.' },
            { app:'waze',   icon:'🔵', label:'Waze',        sub:'Google LLC' },
          ].map(({ app, icon, label, sub }) => {
            const coord=`${navDest.lat},${navDest.lng}`
            const orig=userPos?`&origin=${userPos.lat},${userPos.lng}`:''
            const urls={google:`https://www.google.com/maps/dir/?api=1${orig}&destination=${coord}&travelmode=walking`,apple:`https://maps.apple.com/?daddr=${coord}&dirflg=w`,waze:`https://waze.com/ul?ll=${coord}&navigate=yes`}
            return (
              <button key={app} onClick={()=>{ window.open(urls[app],'_blank'); setNavDest(null) }} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 14px', background:'#FAFAFA', border:'1px solid #EEEEEE', borderRadius:12, width:'100%', textAlign:'left', marginBottom:8, cursor:'pointer' }}>
                <span style={{ fontSize:28 }}>{icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'#111827' }}>{label}</div>
                  <div style={{ fontSize:11, color:'#9CA3AF' }}>{sub}</div>
                </div>
                <span style={{ color:'#D1D5DB', fontSize:18 }}>›</span>
              </button>
            )
          })}
          <button onClick={()=>setNavDest(null)} style={{ width:'100%', padding:13, marginTop:4, background:'#FEE2E2', color:'#DC2626', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>
            {t.cancel}
          </button>
        </Sheet>
      )}

      <style>{`@keyframes gps-ring{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.5);opacity:0}}`}</style>
    </div>
  )
}

export default function Map({ lang, pins, setPins, theme, onNav }) {
  return (
    <APIProvider apiKey={MAPS_KEY}>
      <MapContent lang={lang} pins={pins} setPins={setPins} theme={theme} onNav={onNav} />
    </APIProvider>
  )
}