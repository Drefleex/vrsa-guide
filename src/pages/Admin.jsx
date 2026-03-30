import { useState } from 'react'
import { EVENTS } from '../data/events'

const PW = import.meta.env.VITE_ADMIN_PASSWORD || 'vrsa2025'

const LANG_PAIRS = { EN:'pt|en', ES:'pt|es', FR:'pt|fr', DE:'pt|de' }
const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

// Envia uma linha para o Google Sheets (fire-and-forget — não bloqueia)
function postToSheet(sheet, row) {
  if (!SCRIPT_URL) return
  fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ sheet, row }),
  }).catch(() => {}) // falha silenciosa — o localStorage já guardou
}


function loadAdminAlerts() {
  try {
    const raw = JSON.parse(localStorage.getItem('vrsa_admin_alert') || 'null')
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    // migração: formato antigo (objeto único) → array
    return [{ id: Date.now(), ...raw }]
  } catch { return [] }
}
function loadCustomEvents() {
  try { return JSON.parse(localStorage.getItem('vrsa_admin_events') || '[]') } catch { return [] }
}

const EMPTY_EVENT = {
  title: { PT:'', EN:'', ES:'', FR:'', DE:'' },
  desc:  { PT:'', EN:'', ES:'', FR:'', DE:'' },
  emoji: '📅', color: '#003B6F',
  month: new Date().getMonth() + 1, day: new Date().getDate(),
  time: '21h00', loc: 'VRSA', price: '🆓',
  lat: 37.1944, lng: -7.4161,
}

export default function Admin({ onNav, onAlertChange }) {
  const [auth, setAuth]   = useState(() => sessionStorage.getItem('vrsa_admin') === 'ok')
  const [pw, setPw]       = useState('')
  const [tab, setTab]     = useState('alert')
  const [saved, setSaved] = useState('')

  // Alerts state — array of {id, active, type, message:{PT,EN,ES,FR,DE}}
  const [alerts,    setAlerts]    = useState(loadAdminAlerts)
  const [alertForm, setAlertForm] = useState(null) // null=lista | {id?,active,type,msgPT}

  // Events state
  const [customEvents, setCustomEvents] = useState(loadCustomEvents)
  const [newEv, setNewEv]               = useState(EMPTY_EVENT)
  const [editIdx, setEditIdx]           = useState(null)


  function login() {
    if (pw === PW) { sessionStorage.setItem('vrsa_admin', 'ok'); setAuth(true) }
    else { alert('Palavra-passe incorreta') }
  }

  function flash(msg) { setSaved(msg); setTimeout(() => setSaved(''), 2000) }

  // ── Alerts ─────────────────────────────────────────────────────
  function saveAlertsList(list) {
    setAlerts(list)
    localStorage.setItem('vrsa_admin_alert', JSON.stringify(list))
    onAlertChange?.(list)
  }

  async function saveAlertForm() {
    if (!alertForm.msgPT.trim()) { flash('⚠️ Escreve a mensagem primeiro'); return }
    flash('⏳ A traduzir...')
    const msg = { PT: alertForm.msgPT, EN:'', ES:'', FR:'', DE:'' }
    for (const l of ['EN','ES','FR','DE']) {
      try {
        const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(msg.PT)}&langpair=${LANG_PAIRS[l]}`)
        const j = await r.json()
        msg[l] = j.responseStatus === 200 ? j.responseData.translatedText : msg.PT
      } catch { msg[l] = msg.PT }
    }
    const entry = { id: alertForm.id || Date.now(), active: alertForm.active, type: alertForm.type, message: msg }
    const list = alertForm.id
      ? alerts.map(a => a.id === alertForm.id ? entry : a)
      : [...alerts, entry]
    saveAlertsList(list)
    postToSheet('Alertas', [new Date().toISOString(), entry.type, String(entry.active), msg.PT, msg.EN, msg.ES, msg.FR, msg.DE])
    setAlertForm(null)
    flash('✅ Aviso guardado!')
  }

  function toggleAlert(id) {
    const list = alerts.map(a => a.id === id ? { ...a, active: !a.active } : a)
    saveAlertsList(list)
  }

  function deleteAlert(id) {
    const list = alerts.filter(a => a.id !== id)
    saveAlertsList(list)
    flash('🗑️ Aviso removido')
  }

  // ── Custom Events ──────────────────────────────────────────────
  async function saveEvent() {
    if (!newEv.title.PT) return alert('Título PT obrigatório')
    flash('⏳ A traduzir...')
    const title = { ...newEv.title }
    const desc  = { ...newEv.desc  }
    for (const l of ['EN','ES','FR','DE']) {
      try {
        if (!title[l].trim()) {
          const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(title.PT)}&langpair=${LANG_PAIRS[l]}`)
          const j = await r.json()
          title[l] = j.responseStatus === 200 ? j.responseData.translatedText : title.PT
        }
        if (desc.PT.trim() && !desc[l].trim()) {
          const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(desc.PT)}&langpair=${LANG_PAIRS[l]}`)
          const j = await r.json()
          desc[l] = j.responseStatus === 200 ? j.responseData.translatedText : desc.PT
        }
      } catch { title[l] = title[l] || title.PT; desc[l] = desc[l] || desc.PT }
    }
    const ev = { ...newEv, title, desc }
    const id = Date.now()
    const list = editIdx !== null
      ? customEvents.map((e, i) => i === editIdx ? { ...ev, id: e.id } : e)
      : [...customEvents, { ...ev, id }]
    setCustomEvents(list)
    localStorage.setItem('vrsa_admin_events', JSON.stringify(list))
    // Registo no Google Sheets
    postToSheet('Eventos', [
      new Date().toISOString(), ev.emoji, ev.title.PT,
      ev.loc, ev.day, ev.month, ev.time, ev.price, ev.desc.PT,
    ])
    setNewEv(EMPTY_EVENT); setEditIdx(null)
    flash('✅ Evento guardado!')
  }
  function deleteEvent(i) {
    const list = customEvents.filter((_, idx) => idx !== i)
    setCustomEvents(list)
    localStorage.setItem('vrsa_admin_events', JSON.stringify(list))
    flash('🗑️ Evento removido')
  }
  function editEvent(i) {
    setNewEv({ ...customEvents[i] }); setEditIdx(i); setTab('newevent')
  }

  // ── Stats ──────────────────────────────────────────────────────
  function getStats() {
    try {
      const pv = JSON.parse(localStorage.getItem('vrsa_pageViews') || '{}')
      const pc = JSON.parse(localStorage.getItem('vrsa_pinClicks') || '{}')
      const totalViews = Object.values(pv).reduce((a, b) => a + b, 0)
      const topPages = Object.entries(pv).sort((a, b) => b[1] - a[1]).slice(0, 5)
      const topPins  = Object.entries(pc).sort((a, b) => b[1] - a[1]).slice(0, 5)
      return { totalViews, topPages, topPins }
    } catch { return { totalViews: 0, topPages: [], topPins: [] } }
  }

  // ── Login screen ───────────────────────────────────────────────
  if (!auth) return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ padding:'32px 24px', width:'100%', maxWidth:320 }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
          <div style={{ fontSize:20, fontWeight:800, color:'var(--ink)' }}>Área Administrativa</div>
          <div style={{ fontSize:12, color:'var(--ink-40)', marginTop:4 }}>VRSA Guide · Câmara Municipal</div>
        </div>
        <input
          type="password" value={pw} placeholder="Palavra-passe"
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ width:'100%', padding:'13px 16px', borderRadius:12, border:'1.5px solid var(--border)', fontSize:15, fontFamily:'inherit', color:'var(--ink)', background:'var(--white)', marginBottom:12, boxSizing:'border-box' }}
        />
        <button onClick={login} style={{ width:'100%', padding:'14px 0', background:'var(--primary)', color:'#fff', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer' }}>
          Entrar
        </button>
        <button onClick={() => onNav('home')} style={{ width:'100%', padding:'10px 0', background:'none', border:'none', color:'var(--ink-40)', fontSize:13, cursor:'pointer', marginTop:8 }}>
          ← Voltar ao app
        </button>
      </div>
    </div>
  )

  const stats = getStats()
  const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

  return (
    <div className="page" style={{ display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ background:'var(--primary)', paddingRight:'18px', paddingBottom:'0', paddingLeft:'18px', paddingTop:'calc(58px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
          <button onClick={() => onNav('home')} style={{ width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,.15)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:'#fff' }}>⚙️ Painel Admin</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.5)' }}>VRSA Guide · Câmara Municipal</div>
          </div>
          <button onClick={() => { sessionStorage.removeItem('vrsa_admin'); setAuth(false) }}
            style={{ marginLeft:'auto', padding:'5px 10px', background:'rgba(255,255,255,.15)', border:'none', borderRadius:50, color:'rgba(255,255,255,.7)', fontSize:11, cursor:'pointer' }}>
            Sair
          </button>
        </div>
        {/* Tabs */}
        <div style={{ display:'flex', gap:0 }}>
          {[['alert','🔔 Alertas'],['events','📅 Eventos'],['stats','📊 Stats']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ flex:1, padding:'10px 0', background:'none', border:'none', borderBottom: tab===k ? '2.5px solid #fff' : '2.5px solid transparent', color: tab===k ? '#fff' : 'rgba(255,255,255,.45)', fontWeight:700, fontSize:12, cursor:'pointer', transition:'color .15s' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      {saved && (
        <div style={{ position:'fixed', top:'calc(80px + env(safe-area-inset-top,0px))', left:'50%', transform:'translateX(-50%)', background:'#1E293B', color:'#fff', padding:'10px 20px', borderRadius:50, fontSize:13, fontWeight:600, zIndex:999, whiteSpace:'nowrap' }}>
          {saved}
        </div>
      )}

      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 40px' }}>

        {/* ── ALERT TAB ── */}
        {tab === 'alert' && !alertForm && (
          <div>
            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase' }}>
                Avisos Municipais ({alerts.filter(a=>a.active).length} activos)
              </div>
              <button onClick={() => setAlertForm({ active:true, type:'warning', msgPT:'' })}
                style={{ padding:'6px 14px', background:'var(--primary)', color:'#fff', border:'none', borderRadius:50, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                + Novo
              </button>
            </div>

            {/* Empty state */}
            {alerts.length === 0 && (
              <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--ink-20)' }}>
                <div style={{ fontSize:36, marginBottom:10 }}>🔔</div>
                <div style={{ fontSize:14, fontWeight:600 }}>Sem avisos</div>
                <div style={{ fontSize:12, marginTop:4 }}>Clica em "+ Novo" para adicionar</div>
              </div>
            )}

            {/* Alert list */}
            {alerts.length > 0 && (
              <div className="card" style={{ marginBottom:12 }}>
                {(() => {
                  const colors = { danger:{bg:'#FEF2F2',c:'#991B1B',border:'#FECACA',dot:'#DC2626'}, warning:{bg:'#FFF7ED',c:'#9A3412',border:'#FED7AA',dot:'#EA580C'}, info:{bg:'#EFF6FF',c:'#1E40AF',border:'#BFDBFE',dot:'#2563EB'} }
                  const labels = { warning:'⚠️ Aviso', danger:'🚨 Urgente', info:'ℹ️ Info' }
                  return alerts.map((a, i) => {
                    const col = colors[a.type] || colors.info
                    return (
                      <div key={a.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderBottom: i < alerts.length-1 ? '1px solid var(--surface)' : 'none', opacity: a.active ? 1 : .45 }}>
                        {/* Type dot */}
                        <div style={{ width:10, height:10, borderRadius:'50%', background:col.dot, flexShrink:0 }} />
                        {/* Content */}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:col.dot, marginBottom:2 }}>{labels[a.type]}</div>
                          <div style={{ fontSize:12, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.message?.PT || '—'}</div>
                        </div>
                        {/* Toggle */}
                        <button onClick={() => toggleAlert(a.id)}
                          style={{ width:40, height:22, borderRadius:11, border:'none', cursor:'pointer', background: a.active ? 'var(--primary)' : '#CBD5E1', position:'relative', flexShrink:0 }}>
                          <div style={{ position:'absolute', top:2, left: a.active ? 20 : 2, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }} />
                        </button>
                        {/* Edit */}
                        <button onClick={() => setAlertForm({ id:a.id, active:a.active, type:a.type, msgPT:a.message?.PT||'' })}
                          style={{ background:'none', border:'none', fontSize:15, cursor:'pointer', padding:4 }}>✏️</button>
                        {/* Delete */}
                        <button onClick={() => deleteAlert(a.id)}
                          style={{ background:'none', border:'none', fontSize:15, cursor:'pointer', padding:4 }}>🗑️</button>
                      </div>
                    )
                  })
                })()}
              </div>
            )}
          </div>
        )}

        {/* ── ALERT FORM ── */}
        {tab === 'alert' && alertForm && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <button onClick={() => setAlertForm(null)} style={{ background:'none', border:'none', color:'var(--primary)', fontSize:13, fontWeight:700, cursor:'pointer', padding:0 }}>← Voltar</button>
              <div style={{ fontSize:14, fontWeight:800, color:'var(--ink)' }}>{alertForm.id ? 'Editar Aviso' : 'Novo Aviso'}</div>
            </div>

            {/* Active toggle */}
            <div className="card" style={{ padding:'14px 16px', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--ink)' }}>Aviso activo</div>
                <button onClick={() => setAlertForm(f => ({ ...f, active: !f.active }))}
                  style={{ width:48, height:26, borderRadius:13, border:'none', cursor:'pointer', background: alertForm.active ? 'var(--primary)' : '#CBD5E1', position:'relative' }}>
                  <div style={{ position:'absolute', top:3, left: alertForm.active ? 24 : 3, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }} />
                </button>
              </div>
            </div>

            {/* Type */}
            <div className="card" style={{ padding:'14px 16px', marginBottom:10 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--ink-40)', marginBottom:10 }}>TIPO</div>
              <div style={{ display:'flex', gap:8 }}>
                {[['warning','⚠️ Aviso','#EA580C','#FFF7ED'],['danger','🚨 Urgente','#DC2626','#FEF2F2'],['info','ℹ️ Info','#2563EB','#EFF6FF']].map(([k,l,c,bg]) => (
                  <button key={k} onClick={() => setAlertForm(f => ({ ...f, type:k }))}
                    style={{ flex:1, padding:'8px 4px', borderRadius:9, border: alertForm.type===k ? `2px solid ${c}` : '1.5px solid var(--border)', background: alertForm.type===k ? bg : 'var(--surface)', color: alertForm.type===k ? c : 'var(--ink-40)', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="card" style={{ padding:'14px 16px', marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--ink-40)' }}>MENSAGEM</div>
                <div style={{ fontSize:10, color:'var(--ink-20)' }}>traduzida ao guardar</div>
              </div>
              <textarea value={alertForm.msgPT} onChange={e => setAlertForm(f => ({ ...f, msgPT: e.target.value }))}
                placeholder="Texto do aviso em Português..."
                style={{ width:'100%', padding:'9px 12px', borderRadius:9, border:'1px solid var(--border)', fontSize:13, fontFamily:'inherit', color:'var(--ink)', background:'var(--white)', resize:'vertical', minHeight:80, boxSizing:'border-box' }}
              />
            </div>

            <button onClick={saveAlertForm} style={{ width:'100%', padding:'13px 0', background:'var(--primary)', color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer' }}>
              💾 Guardar Aviso
            </button>
          </div>
        )}

        {/* ── EVENTS TAB ── */}
        {tab === 'events' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase' }}>Eventos Personalizados</div>
              <button onClick={() => { setNewEv(EMPTY_EVENT); setEditIdx(null); setTab('newevent') }}
                style={{ padding:'6px 14px', background:'var(--primary)', color:'#fff', border:'none', borderRadius:50, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                + Novo
              </button>
            </div>

            {customEvents.length === 0 && (
              <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--ink-20)' }}>
                <div style={{ fontSize:36, marginBottom:10 }}>📅</div>
                <div style={{ fontSize:14, fontWeight:600 }}>Sem eventos personalizados</div>
                <div style={{ fontSize:12, marginTop:4 }}>Clica em "+ Novo" para adicionar</div>
              </div>
            )}

            {customEvents.length > 0 && (
              <div className="card" style={{ marginBottom:16 }}>
                {customEvents.map((ev, i) => (
                  <div key={ev.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom: i < customEvents.length-1 ? '1px solid var(--surface)' : 'none' }}>
                    <div style={{ width:44, height:44, borderRadius:10, background:`${ev.color}20`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0, border:`1px solid ${ev.color}30` }}>
                      <div style={{ fontSize:13, fontWeight:900, color:ev.color, lineHeight:1 }}>{ev.day}</div>
                      <div style={{ fontSize:8, fontWeight:700, color:ev.color, textTransform:'uppercase' }}>{MONTHS[ev.month-1]}</div>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.emoji} {ev.title.PT}</div>
                      <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{ev.loc} · {ev.time}</div>
                    </div>
                    <button onClick={() => editEvent(i)} style={{ background:'none', border:'none', fontSize:16, cursor:'pointer', padding:4 }}>✏️</button>
                    <button onClick={() => deleteEvent(i)} style={{ background:'none', border:'none', fontSize:16, cursor:'pointer', padding:4 }}>🗑️</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:8 }}>EVENTOS ESTÁTICOS ({EVENTS.length})</div>
            <div className="card">
              {EVENTS.slice(0, 5).map((ev, i) => (
                <div key={ev.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderBottom: i < 4 ? '1px solid var(--surface)' : 'none', opacity:.6 }}>
                  <span style={{ fontSize:18 }}>{ev.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--ink)' }}>{ev.title.PT}</div>
                    <div style={{ fontSize:10, color:'var(--ink-40)' }}>{ev.day} {MONTHS[ev.month-1]} · {ev.loc}</div>
                  </div>
                </div>
              ))}
              {EVENTS.length > 5 && <div style={{ padding:'8px 16px', fontSize:11, color:'var(--ink-20)', textAlign:'center' }}>+ {EVENTS.length - 5} eventos...</div>}
            </div>
          </div>
        )}

        {/* ── NEW EVENT FORM ── */}
        {tab === 'newevent' && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <button onClick={() => setTab('events')} style={{ background:'none', border:'none', color:'var(--primary)', fontSize:13, fontWeight:700, cursor:'pointer', padding:0 }}>← Voltar</button>
              <div style={{ fontSize:14, fontWeight:800, color:'var(--ink)' }}>{editIdx !== null ? 'Editar' : 'Novo'} Evento</div>
            </div>

            {/* Basic info */}
            <div className="card" style={{ padding:'14px 16px', marginBottom:10 }}>
              <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', marginBottom:4 }}>EMOJI</div>
                  <input value={newEv.emoji} onChange={e => setNewEv(v => ({ ...v, emoji: e.target.value }))} style={{ width:'100%', padding:'9px', borderRadius:9, border:'1px solid var(--border)', fontSize:20, textAlign:'center', background:'var(--white)', boxSizing:'border-box' }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', marginBottom:4 }}>COR</div>
                  <input type="color" value={newEv.color} onChange={e => setNewEv(v => ({ ...v, color: e.target.value }))} style={{ width:'100%', height:42, borderRadius:9, border:'1px solid var(--border)', cursor:'pointer', padding:2, background:'var(--white)', boxSizing:'border-box' }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', marginBottom:4 }}>PREÇO</div>
                  <input value={newEv.price} onChange={e => setNewEv(v => ({ ...v, price: e.target.value }))} placeholder="🆓 ou €5" style={{ width:'100%', padding:'9px', borderRadius:9, border:'1px solid var(--border)', fontSize:13, background:'var(--white)', boxSizing:'border-box', fontFamily:'inherit' }} />
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:10 }}>
                {[['Dia','day','number'],['Mês','month','number'],['Hora','time','text']].map(([l,k,t]) => (
                  <div key={k}>
                    <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', marginBottom:4 }}>{l.toUpperCase()}</div>
                    <input type={t} value={newEv[k]} onChange={e => setNewEv(v => ({ ...v, [k]: t==='number'?parseInt(e.target.value)||1:e.target.value }))}
                      style={{ width:'100%', padding:'9px', borderRadius:9, border:'1px solid var(--border)', fontSize:13, background:'var(--white)', boxSizing:'border-box', fontFamily:'inherit' }} />
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', marginBottom:4 }}>LOCAL</div>
                <input value={newEv.loc} onChange={e => setNewEv(v => ({ ...v, loc: e.target.value }))} placeholder="Ex: Praça Marquês de Pombal"
                  style={{ width:'100%', padding:'9px 12px', borderRadius:9, border:'1px solid var(--border)', fontSize:13, background:'var(--white)', boxSizing:'border-box', fontFamily:'inherit' }} />
              </div>
            </div>

            {/* Titles */}
            <div className="card" style={{ padding:'14px 16px', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--ink-40)' }}>TÍTULO</div>
                <div style={{ fontSize:10, color:'var(--ink-20)' }}>traduzido ao guardar</div>
              </div>
              <input value={newEv.title.PT} onChange={e => setNewEv(v => ({ ...v, title: { ...v.title, PT: e.target.value } }))}
                placeholder="Título em Português..."
                style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:'1px solid var(--border)', fontSize:13, background:'var(--white)', fontFamily:'inherit', boxSizing:'border-box' }} />
            </div>

            {/* Descriptions */}
            <div className="card" style={{ padding:'14px 16px', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--ink-40)' }}>DESCRIÇÃO</div>
                <div style={{ fontSize:10, color:'var(--ink-20)' }}>traduzida ao guardar</div>
              </div>
              <textarea value={newEv.desc.PT} onChange={e => setNewEv(v => ({ ...v, desc: { ...v.desc, PT: e.target.value } }))}
                placeholder="Descrição do evento em Português..."
                style={{ width:'100%', padding:'9px 12px', borderRadius:9, border:'1px solid var(--border)', fontSize:13, fontFamily:'inherit', color:'var(--ink)', background:'var(--white)', resize:'vertical', minHeight:80, boxSizing:'border-box' }} />
            </div>

            <button onClick={saveEvent} style={{ width:'100%', padding:'14px 0', background:'var(--primary)', color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer' }}>
              💾 {editIdx !== null ? 'Actualizar Evento' : 'Guardar Evento'}
            </button>
          </div>
        )}

        {/* ── STATS TAB ── */}
        {tab === 'stats' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
              {[
                { icon:'👁️', val: stats.totalViews, label:'Visitas totais' },
                { icon:'📍', val: Object.keys(JSON.parse(localStorage.getItem('vrsa_pinClicks')||'{}')).length, label:'Pins visitados' },
                { icon:'📅', val: EVENTS.length + customEvents.length, label:'Eventos totais' },
                { icon:'🔔', val: alerts.filter(a=>a.active).length > 0 ? 'Activo' : 'Inactivo', label:'Alerta municipal' },
              ].map((s,i) => (
                <div key={i} className="card" style={{ padding:'14px', textAlign:'center' }}>
                  <div style={{ fontSize:26, marginBottom:4 }}>{s.icon}</div>
                  <div style={{ fontSize:20, fontWeight:900, color:'var(--ink)' }}>{s.val}</div>
                  <div style={{ fontSize:10, color:'var(--ink-40)', fontWeight:600, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {stats.topPages.length > 0 && (
              <>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:8 }}>PÁGINAS MAIS VISITADAS</div>
                <div className="card" style={{ marginBottom:16 }}>
                  {stats.topPages.map(([page, views], i) => (
                    <div key={page} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', borderBottom: i < stats.topPages.length-1 ? '1px solid var(--surface)' : 'none' }}>
                      <div style={{ width:24, height:24, borderRadius:6, background:'var(--primary-lt)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'var(--primary)' }}>{i+1}</div>
                      <div style={{ flex:1, fontSize:13, fontWeight:600, color:'var(--ink)' }}>{page}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:'var(--ink-40)' }}>{views}x</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => onNav('analytics')} style={{ flex:1, padding:'12px 0', background:'var(--primary-lt)', color:'var(--primary)', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer' }}>
                📊 Ver Analytics Completo
              </button>
              <button onClick={() => { if (confirm('Limpar todos os dados de analytics?')) { ['vrsa_pageViews','vrsa_pinClicks','vrsa_languages','vrsa_hourly','vrsa_dailySessions'].forEach(k => localStorage.removeItem(k)); flash('🗑️ Analytics limpo') } }}
                style={{ width:50, height:50, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:12, fontSize:18, cursor:'pointer' }}>
                🗑️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
