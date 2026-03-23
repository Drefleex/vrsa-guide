import { useState, useEffect } from 'react'

const SPOTS = [
  { id:1, emoji:'🏰', name:'Castillo de Ayamonte', desc:{PT:'Castelo árabe do século XII com vista panorâmica para o Guadiana e VRSA. Vale muito a subida.',EN:'12th century Moorish castle with panoramic views over the Guadiana and VRSA. Well worth the climb.',ES:'Castillo árabe del siglo XII con vistas panorámicas al Guadiana.',FR:'Château maure du XIIe siècle avec vue panoramique sur le Guadiana.',DE:'Maurische Burg aus dem 12. Jahrhundert mit Panoramablick auf den Guadiana.'}, walk:'20 min', free:true, lat:37.2128, lng:-7.4081 },
  { id:2, emoji:'🏛️', name:'Plaza de la Laguna',   desc:{PT:'A praça principal de Ayamonte rodeada de bares de tapas e restaurantes. Perfeita para um café.',EN:'Ayamonte\'s main square surrounded by tapas bars and restaurants. Perfect for a coffee.',ES:'La plaza principal de Ayamonte rodeada de bares de tapas.',FR:'La place principale d\'Ayamonte entourée de bars à tapas.',DE:'Der Hauptplatz von Ayamonte mit Tapas-Bars ringsum.'}, walk:'5 min', free:true, lat:37.2136, lng:-7.4072 },
  { id:3, emoji:'🍤', name:'Tapas na Calle Palma',  desc:{PT:'A rua das tapas de Ayamonte. Gambas al ajillo, puntillitas, jamón ibérico. €1–€3 por tapa.',EN:'Ayamonte\'s tapas street. Garlic prawns, baby squid, Iberian ham. €1–€3 per tapa.',ES:'La calle de las tapas de Ayamonte. Gambas al ajillo, puntillitas.',FR:'La rue des tapas d\'Ayamonte. Crevettes à l\'ail, petits calamars.',DE:'Die Tapas-Straße von Ayamonte. Knoblauchgarnelen, Tintenfische.'}, walk:'8 min', free:false, lat:37.2131, lng:-7.4068 },
  { id:4, emoji:'⛪', name:'Iglesia de las Angustias', desc:{PT:'Igreja do século XVIII com belo retábulo dourado. Uma das mais belas igrejas do Algarve espanhol.',EN:'18th century church with beautiful golden altarpiece. One of the most beautiful churches in Spanish Algarve.',ES:'Iglesia del siglo XVIII con bello retablo dorado.',FR:'Église du XVIIIe siècle avec un magnifique retable doré.',DE:'Kirche aus dem 18. Jahrhundert mit wunderschönem goldenen Altarbild.'}, walk:'10 min', free:true, lat:37.2140, lng:-7.4063 },
  { id:5, emoji:'🌊', name:'Playa de la Ribera',     desc:{PT:'Praia fluvial junto ao cais com vista para VRSA. Boa para um mergulho depois das tapas.',EN:'River beach next to the pier with views of VRSA. Good for a dip after tapas.',ES:'Playa fluvial junto al muelle con vistas a VRSA.',FR:'Plage fluviale près du quai avec vue sur VRSA.',DE:'Flussstrand neben dem Pier mit Blick auf VRSA.'}, walk:'3 min', free:true, lat:37.2122, lng:-7.4090 },
  { id:6, emoji:'🍷', name:'Bodegas locais',         desc:{PT:'Lojas de vinho espanhol a preços imbatíveis. Rioja, Ribera del Duero e vinhos da Extremadura.',EN:'Spanish wine shops at unbeatable prices. Rioja, Ribera del Duero and Extremadura wines.',ES:'Bodegas con precios increíbles. Rioja, Ribera del Duero.',FR:'Caves à vins espagnols à prix imbattables.',DE:'Spanische Weinläden zu unschlagbaren Preisen.'}, walk:'12 min', free:false, lat:37.2145, lng:-7.4055 },
  { id:7, emoji:'🛍️', name:'Mercado de Abastos',    desc:{PT:'Mercado local com produtos frescos, charcutaria espanhola e queijos. Uma experiência sensorial.',EN:'Local market with fresh produce, Spanish charcuterie and cheeses. A sensory experience.',ES:'Mercado local con productos frescos y charcutería española.',FR:'Marché local avec produits frais et charcuterie espagnole.',DE:'Lokaler Markt mit frischen Produkten und spanischer Wurstwaren.'}, walk:'15 min', free:true, lat:37.2149, lng:-7.4050 },
  { id:8, emoji:'🌅', name:'Mirador del Puerto',     desc:{PT:'O melhor ponto para ver o pôr do sol sobre o Rio Guadiana com Portugal ao fundo. Imperdível.',EN:'The best viewpoint to watch the sunset over the Guadiana river with Portugal in the background. Not to be missed.',ES:'El mejor mirador para ver el atardecer sobre el Guadiana.',FR:'Le meilleur point de vue pour le coucher de soleil sur le Guadiana.',DE:'Der beste Aussichtspunkt für den Sonnenuntergang über dem Guadiana.'}, walk:'5 min', free:true, lat:37.2118, lng:-7.4095 },
]

const ESSENTIALS = [
  { icon:'💶', label:{PT:'Moeda',EN:'Currency',ES:'Moneda',FR:'Monnaie',DE:'Währung'}, val:'Euro (€)' },
  { icon:'🗣️', label:{PT:'Língua',EN:'Language',ES:'Idioma',FR:'Langue',DE:'Sprache'}, val:'Español' },
  { icon:'🛂', label:{PT:'Fronteira',EN:'Border',ES:'Frontera',FR:'Frontière',DE:'Grenze'}, val:{PT:'Passaporte obrigatório',EN:'Passport required',ES:'Pasaporte obligatorio',FR:'Passeport obligatoire',DE:'Ausweis erforderlich'} },
  { icon:'⛴️', label:{PT:'Ferry',EN:'Ferry',ES:'Ferry',FR:'Ferry',DE:'Fähre'},          val:{PT:'€2,50 · 15 min · último 19:30',EN:'€2.50 · 15 min · last 19:30',ES:'€2,50 · 15 min · último 19:30',FR:'€2,50 · 15 min · dernier 19h30',DE:'€2,50 · 15 min · letzter 19:30'} },
  { icon:'🕐', label:{PT:'Fuso Horário',EN:'Timezone',ES:'Zona Horaria',FR:'Fuseau',DE:'Zeitzone'}, val:{PT:'+1h em relação a Portugal',EN:'+1h ahead of Portugal',ES:'+1h respecto a Portugal',FR:'+1h par rapport au Portugal',DE:'+1h gegenüber Portugal'} },
]

const TR = {
  PT:{ title:'Ayamonte', sub:'Espanha · 15 min de ferry', topSpots:'O Que Ver e Fazer', essentials:'Informações Essenciais', tip:'💡 O último ferry de volta para VRSA parte às 19:30. Não percas!', walkTime:'a pé', free:'Grátis', paid:'Pago', navigate:'Google Maps', back:'← Voltar' },
  EN:{ title:'Ayamonte', sub:'Spain · 15 min by ferry', topSpots:'Top Spots', essentials:'Essential Info', tip:'💡 The last ferry back to VRSA leaves at 19:30. Don\'t miss it!', walkTime:'walk', free:'Free', paid:'Paid', navigate:'Google Maps', back:'← Back' },
  ES:{ title:'Ayamonte', sub:'España · 15 min en ferry', topSpots:'Qué Ver y Hacer', essentials:'Información Esencial', tip:'💡 El último ferry de vuelta a VRSA sale a las 19:30. ¡No te lo pierdas!', walkTime:'a pie', free:'Gratis', paid:'Pago', navigate:'Google Maps', back:'← Volver' },
  FR:{ title:'Ayamonte', sub:'Espagne · 15 min en ferry', topSpots:'À Voir et Faire', essentials:'Infos Essentielles', tip:'💡 Le dernier ferry retour pour VRSA part à 19h30. Ne le ratez pas!', walkTime:'à pied', free:'Gratuit', paid:'Payant', navigate:'Google Maps', back:'← Retour' },
  DE:{ title:'Ayamonte', sub:'Spanien · 15 min mit der Fähre', topSpots:'Sehenswürdigkeiten', essentials:'Wichtige Infos', tip:'💡 Die letzte Fähre zurück nach VRSA fährt um 19:30 Uhr. Nicht verpassen!', walkTime:'zu Fuß', free:'Kostenlos', paid:'Kostenpflichtig', navigate:'Google Maps', back:'← Zurück' },
}

export default function Ayamonte({ lang, onNav }) {
  const L = lang || 'PT'
  const t = TR[L] || TR.PT

  const [esTime, setEsTime] = useState(() => {
    const now = new Date()
    const h = (now.getHours() + 1) % 24
    const m = now.getMinutes()
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
  })

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const h = (now.getHours() + 1) % 24
      const m = now.getMinutes()
      setEsTime(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`)
    }
    const iv = setInterval(tick, 60000)
    return () => clearInterval(iv)
  }, [])

  const esH = parseInt(esTime.split(':')[0])
  const esMoodEmoji = esH >= 12 && esH < 16 ? '🍤' : esH >= 20 && esH < 23 ? '🍽️' : '🕐'

  return (
    <div className="page">
      {/* Hero */}
      <div style={{ background:'linear-gradient(160deg,var(--primary-dark) 0%,var(--primary) 100%)', padding:'18px 20px 18px', paddingTop:'calc(18px + env(safe-area-inset-top,0px))', flexShrink:0, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }} />
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <span style={{ fontSize:16 }}>🇪🇸</span>
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.45)', letterSpacing:'2px', textTransform:'uppercase' }}>{t.sub}</div>
        </div>
        <div style={{ fontSize:28, fontWeight:700, color:'#fff', letterSpacing:'-.3px' }}>{t.title}</div>
      </div>

      <div style={{ padding:'14px 16px 40px' }}>
        {/* Ferry warning + live ES time */}
        <div style={{ background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:14, padding:'12px 14px', marginBottom:16 }}>
          <div style={{ fontSize:12, color:'#92400E', fontWeight:600, marginBottom:8 }}>{t.tip}</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, paddingTop:8, borderTop:'1px solid #FDE68A' }}>
            <span style={{ fontSize:16 }}>{esMoodEmoji}</span>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:'#B45309', letterSpacing:.5, textTransform:'uppercase' }}>
                {L==='EN'?'Spain time now':L==='FR'?'Heure espagnole':L==='DE'?'Spanien jetzt':L==='ES'?'Hora española ahora':'Hora em Espanha agora'}
              </div>
              <div style={{ fontSize:20, fontWeight:800, color:'#92400E', lineHeight:1.1, marginTop:2 }}>{esTime}</div>
            </div>
          </div>
        </div>

        {/* Essentials */}
        <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>{t.essentials}</div>
        <div className="card" style={{ marginBottom:16 }}>
          {ESSENTIALS.map((e,i,arr) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
              <span style={{ fontSize:20 }}>{e.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--ink)' }}>{e.label[L]||e.label.PT}</div>
              </div>
              <div style={{ fontSize:12, color:'var(--ink-40)', textAlign:'right', maxWidth:180 }}>
                {typeof e.val === 'object' ? (e.val[L]||e.val.PT) : e.val}
              </div>
            </div>
          ))}
        </div>

        {/* Spots */}
        <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>{t.topSpots}</div>
        <div className="card">
          {SPOTS.map((s,i,arr) => (
            <div key={s.id} style={{ padding:'14px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:6 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:'var(--ink)', marginBottom:2 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:'var(--ink-40)' }}>{s.desc[L]||s.desc.PT}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginLeft:56 }}>
                <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:50, background: s.free ? '#DCFCE7' : '#FEF3C7', color: s.free ? '#15803D' : '#B45309' }}>{s.free ? t.free : t.paid}</span>
                <span style={{ fontSize:10, color:'var(--ink-40)' }}>🚶 {s.walk} {t.walkTime}</span>
                <button aria-label={t.navigate} onClick={() => window.open('https://www.google.com/maps/search/?api=1&query='+s.lat+','+s.lng,'_blank')} style={{ marginLeft:'auto', padding:'3px 10px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:50, fontSize:10, fontWeight:700, color:'var(--ink-40)', cursor:'pointer' }}>📍 {t.navigate}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}