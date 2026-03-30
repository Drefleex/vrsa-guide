import { useState, useEffect } from 'react'
import { tr } from '../utils/i18n'

const PHARMACIES = [
  { id:1, name:'Farmácia Carilho',   addr:'Rua Dr. Teófilo Braga',      hours:'Seg–Sex 09:00–19:00 · Sáb 09:00–13:00', phone:'+351 281 543 212', lat:37.190519, lng:-7.419999, emergency:false },
  { id:2, name:'Farmácia Pombalina', addr:'Rua Marquês de Pombal',      hours:'Seg–Sex 09:00–19:30 · Sáb 09:00–13:00', phone:'+351 281 511 089', lat:37.194066, lng:-7.421179, emergency:false },
  { id:3, name:'Farmácia Carmo',     addr:'Rua do Carmo',               hours:'Seg–Sex 09:00–20:00 · Sáb 10:00–13:00', phone:'+351 281 512 456', lat:37.195237, lng:-7.416254, emergency:true },
]

const HEALTH = [
  { icon:'⚕️', name:{PT:'Centro de Saúde de VRSA', EN:'VRSA Health Centre',     ES:'Centro de Salud de VRSA',  FR:'Centre de Santé de VRSA',    DE:'Gesundheitszentrum VRSA'},   phone:'+351 281 510 650', hours:{PT:'Seg–Sex 08:00–20:00',EN:'Mon–Fri 08:00–20:00',ES:'Lun–Vie 08:00–20:00',FR:'Lun–Ven 08:00–20:00',DE:'Mo–Fr 08:00–20:00'}, addr:'Rua Dr. Sousa Martins, 1', lat:37.190395, lng:-7.418126, color:'#059669', bg:'#ECFDF5' },
  { icon:'🏥', name:{PT:'Hospital de Faro',         EN:'Faro Hospital',           ES:'Hospital de Faro',         FR:'Hôpital de Faro',            DE:'Krankenhaus Faro'},          phone:'+351 289 891 100', hours:{PT:'Urgências 24h',EN:'A&E 24h',ES:'Urgencias 24h',FR:'Urgences 24h',DE:'Notaufnahme 24h'}, addr:'Rua Leão Penedo, Faro · 65 km', lat:37.0079, lng:-7.9359, color:'#DC2626', bg:'#FEF2F2' },
  { icon:'🦷', name:{PT:'Serviço de Urgência Dentária',EN:'Emergency Dental',    ES:'Urgencia Dental',          FR:'Urgence Dentaire',           DE:'Zahnarzt Notdienst'},        phone:'+351 281 510 650', hours:{PT:'Via Centro de Saúde',EN:'Via Health Centre',ES:'Vía Centro Salud',FR:'Via Centre de Santé',DE:'Über Gesundheitszentrum'}, addr:'Centro de Saúde VRSA', lat:37.1952, lng:-7.4162, color:'#1D4ED8', bg:'#EFF6FF' },
  { icon:'🚑', name:{PT:'INEM — Emergência Médica', EN:'INEM — Medical Emergency',ES:'INEM — Emergencia Médica',FR:'INEM — Urgence Médicale',    DE:'INEM — Medizinischer Notfall'}, phone:'112', hours:{PT:'24 horas',EN:'24 hours',ES:'24 horas',FR:'24 heures',DE:'24 Stunden'}, addr:'Nacional', lat:0, lng:0, color:'#DC2626', bg:'#FEF2F2' },
]

const TIPS = {
  PT:['Guarda o número do centro de saúde antes de precisar', 'A farmácia de serviço muda semanalmente — está indicada na porta de cada farmácia', 'Com Cartão de Saúde Europeu (CESD) tens acesso gratuito ao SNS', 'Medicamentos simples como paracetamol podem ser comprados sem receita'],
  EN:['Save the health centre number before you need it', 'The duty pharmacy rotates weekly — shown on every pharmacy door', 'With a European Health Insurance Card (EHIC) you get free NHS access', 'Simple medicines like paracetamol are available without prescription'],
  ES:['Guarda el número del centro de salud antes de necesitarlo', 'La farmacia de guardia cambia semanalmente — indicada en la puerta de cada farmacia', 'Con Tarjeta Sanitaria Europea (TSE) tienes acceso gratuito', 'Medicamentos simples como paracetamol sin receta'],
  FR:['Sauvegardez le numéro du centre de santé avant d\'en avoir besoin', 'La pharmacie de garde change chaque semaine — indiquée sur la porte', 'Avec la Carte Européenne d\'Assurance Maladie vous avez accès gratuit', 'Médicaments simples comme paracétamol disponibles sans ordonnance'],
  DE:['Speichere die Nummer des Gesundheitszentrums vorab', 'Die Notdienstapotheke wechselt wöchentlich — an jeder Apothekentür angezeigt', 'Mit der Europäischen Krankenversicherungskarte (EHIC) kostenloser Zugang', 'Einfache Medikamente wie Paracetamol rezeptfrei erhältlich'],
}

export default function Health({ lang, focusName, onFocusClear }) {
  const L = lang || 'PT'
  const t = tr('health', L)
  const tips = TIPS[L] || TIPS.PT
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    if (!focusName) return
    const found = PHARMACIES.find(p => p.name.toLowerCase().includes(focusName.toLowerCase()) || focusName.toLowerCase().includes(p.name.toLowerCase()))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (found) setDetail(found)
    onFocusClear?.()
  }, [focusName])

  if (detail) {
    const p = detail
    const navLabel  = L==='EN'?'Navigate':L==='ES'?'Navegar':L==='FR'?'Naviguer':L==='DE'?'Navigieren':'Navegar'
    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        <div style={{ background:'linear-gradient(160deg,#065F46 0%,#047857 100%)', paddingRight:'20px', paddingBottom:'24px', paddingLeft:'20px', paddingTop:'calc(64px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
          <button onClick={() => setDetail(null)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>←</button>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:56, height:56, borderRadius:16, background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>💊</div>
            <div>
              <div style={{ fontSize:18, fontWeight:800, color:'#fff' }}>{p.name}</div>
              {p.emergency && <span style={{ fontSize:10, fontWeight:700, background:'#BBF7D0', color:'#15803D', padding:'2px 8px', borderRadius:50, marginTop:4, display:'inline-block' }}>{t.dutyPharmacy}</span>}
            </div>
          </div>
        </div>
        <div style={{ overflowY:'auto', flex:1, padding:'16px 16px 40px' }}>
          <div className="card" style={{ padding:'16px', marginBottom:14 }}>
            {[
              { icon:'📍', val: p.addr },
              { icon:'⏰', val: p.hours },
            ].map((r,i) => (
              <div key={i} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:i===0?'1px solid var(--surface)':'none' }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{r.icon}</span>
                <span style={{ fontSize:13, color:'var(--ink-70)' }}>{r.val}</span>
              </div>
            ))}
          </div>
          <a href={`tel:${p.phone.replace(/\s/g,'')}`} style={{ textDecoration:'none', display:'block', marginBottom:8 }}>
            <button style={{ width:'100%', padding:'13px 0', background:'#059669', color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer' }}>📞 {p.phone}</button>
          </a>
          <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', margin:'16px 0 10px' }}>{navLabel}</div>
          {[
            { icon:'🗺️', label:'Google Maps', url:`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}` },
            { icon:'🍎', label:'Apple Maps',  url:`https://maps.apple.com/?daddr=${p.lat},${p.lng}` },
            { icon:'🔵', label:'Waze',        url:`https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes` },
          ].map(({ icon, label, url }) => (
            <button key={label} onClick={() => window.open(url,'_blank','noopener,noreferrer')} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 14px', background:'var(--white)', border:'1px solid var(--border-lt)', borderRadius:12, width:'100%', textAlign:'left', marginBottom:8, cursor:'pointer' }}>
              <span style={{ fontSize:26 }}>{icon}</span>
              <span style={{ flex:1, fontSize:14, fontWeight:700, color:'var(--ink)' }}>{label}</span>
              <span style={{ color:'var(--ink-20)', fontSize:18 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div style={{
        background: 'url("/images/health_hero_hr.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '18px 20px 24px',
        paddingTop: 'calc(64px + env(safe-area-inset-top,0px))',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Cinematic gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.95) 100%)' }} />
        
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'-.5px', textShadow: '0 2px 14px rgba(0,0,0,0.5)', marginBottom:4 }}>{t.title}</div>
          <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.8)', textShadow: '0 2px 8px rgba(0,0,0,0.5)', letterSpacing: '.5px' }}>Vila Real de Santo António</div>
        </div>
      </div>

      <div style={{ padding:'14px 16px 40px' }}>

        {/* 112 button */}
        <a href="tel:112" style={{ textDecoration:'none', display:'block', marginBottom:14 }}>
          <div style={{ background:'linear-gradient(135deg,#DC2626,#B91C1C)', borderRadius:16, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, boxShadow:'0 4px 20px rgba(220,38,38,.3)' }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>🚨</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>{L==='EN'?'EMERGENCY':L==='FR'?'URGENCE':L==='DE'?'NOTFALL':L==='ES'?'EMERGENCIA':'EMERGÊNCIA'}</div>
              <div style={{ fontSize:36, fontWeight:900, color:'#fff', lineHeight:1 }}>112</div>
            </div>
            <span style={{ fontSize:26, color:'rgba(255,255,255,.7)' }}>📞</span>
          </div>
        </a>

        {/* Health services */}
        <div className="sec-label">{t.health}</div>
        <div className="card" style={{ marginBottom:14 }}>
          {HEALTH.map((h,i,arr) => (
            <div key={i} style={{ padding:'13px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:h.phone?6:0 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:h.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{h.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{h.name[L]||h.name.PT}</div>
                  <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{h.hours[L]||h.hours.PT}</div>
                  <div style={{ fontSize:11, color:'var(--ink-40)' }}>{h.addr}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, marginLeft:56 }}>
                <a href={`tel:${h.phone.replace(/\s/g,'')}`} style={{ textDecoration:'none', flex:1 }}>
                  <button style={{ width:'100%', padding:'7px 0', background:h.color, color:'#fff', border:'none', borderRadius:9, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>📞 {h.phone}</button>
                </a>
                {h.lat !== 0 && (
                  <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`,'_blank','noopener,noreferrer')} style={{ padding:'7px 12px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:9, fontSize:12, fontWeight:700, color:'var(--ink-40)', cursor:'pointer' }}>🧭</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pharmacies */}
        <div className="sec-label">{t.pharmacies}</div>
        <div className="card" style={{ marginBottom:14 }}>
          {PHARMACIES.map((p,i,arr) => (
            <button key={p.id} onClick={() => setDetail(p)} style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'13px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none', background:'none', border:'none', textAlign:'left', cursor:'pointer' }}>
              <div style={{ width:44, height:44, borderRadius:12, background: p.emergency ? '#ECFDF5' : 'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>💊</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{p.name}</div>
                  {p.emergency && <span style={{ background:'#DCFCE7', color:'#15803D', fontSize:10, fontWeight:700, padding:'1px 7px', borderRadius:50 }}>{t.dutyPharmacy}</span>}
                </div>
                <div style={{ fontSize:11, color:'var(--ink-40)' }}>{p.addr}</div>
                <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>⏰ {p.hours}</div>
              </div>
              <span style={{ fontSize:16, color:'var(--ink-20)', flexShrink:0 }}>›</span>
            </button>
          ))}

        </div>

        {/* Tips */}
        <div className="sec-label">{t.tips}</div>
        <div className="card">
          {tips.map((tip,i,arr) => (
            <div key={i} style={{ display:'flex', gap:12, padding:'12px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
              <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>💡</span>
              <span style={{ fontSize:13, color:'var(--ink-40)', lineHeight:1.6 }}>{tip}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}