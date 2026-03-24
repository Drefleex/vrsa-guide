import { useState, useEffect, useRef } from 'react'
import { usePhotos } from '../hooks/usePhotos'

const CATEGORIES = [
  { id:'lixo',       icon:'🗑️', color:'#92400E', bg:'#FEF3C7', label:{PT:'Lixo / Sujidade',     EN:'Waste / Dirt',       ES:'Basura / Suciedad',  FR:'Déchets / Saleté',  DE:'Müll / Schmutz'    } },
  { id:'iluminacao', icon:'💡', color:'#1E40AF', bg:'#EFF6FF', label:{PT:'Iluminação',            EN:'Street Lighting',    ES:'Iluminación',        FR:'Éclairage',         DE:'Beleuchtung'       } },
  { id:'pavimento',  icon:'🚧', color:'#9A3412', bg:'#FEF2F2', label:{PT:'Pavimento / Estrada',   EN:'Pavement / Road',    ES:'Pavimento / Carretera',FR:'Chaussée / Route', DE:'Belag / Straße'    } },
  { id:'jardins',    icon:'🌳', color:'#166534', bg:'#F0FDF4', label:{PT:'Parques e Jardins',      EN:'Parks & Gardens',    ES:'Parques y Jardines', FR:'Parcs et Jardins',  DE:'Parks & Gärten'    } },
  { id:'vandalismo', icon:'🔨', color:'#7C3AED', bg:'#F5F3FF', label:{PT:'Vandalismo',             EN:'Vandalism',          ES:'Vandalismo',         FR:'Vandalisme',        DE:'Vandalismus'       } },
  { id:'sinalizacao',icon:'🚦', color:'#0369A1', bg:'#F0F9FF', label:{PT:'Sinalização',            EN:'Road Signage',       ES:'Señalización',       FR:'Signalisation',     DE:'Beschilderung'     } },
  { id:'agua',       icon:'💧', color:'#0E7490', bg:'#ECFEFF', label:{PT:'Água / Saneamento',      EN:'Water / Sewage',     ES:'Agua / Saneamiento', FR:'Eau / Assainissement',DE:'Wasser / Abwasser'} },
  { id:'outro',      icon:'📋', color:'#374151', bg:'#F9FAFB', label:{PT:'Outro',                  EN:'Other',              ES:'Otro',               FR:'Autre',             DE:'Sonstiges'         } },
]

const TR = {
  PT:{ title:'Reportar Problema', sub:'Câmara Municipal de VRSA', step1:'Qual é o problema?', step2:'Localização', step3:'Foto (opcional)', step4:'Descrição (opcional)', gps:'A obter localização...', gpsOk:'Localização obtida', gpsErr:'Não foi possível obter localização. Podes indicar manualmente.', gpsManual:'Morada ou local:', gpsPlaceholder:'Ex: Rua 5 de Outubro, junto ao café', photoBtn:'Adicionar foto', photoChange:'Alterar foto', desc:'Descreve o problema brevemente...', send:'Enviar Relatório', sending:'A preparar...', sent:'Email preparado', sentSub:'Abrimos o teu cliente de email. Envia a mensagem para completar o reporte. Obrigado pela colaboração!', sentCopied:'Conteúdo copiado. Cola no email para geral@cm-vrsa.pt', newReport:'Novo Relatório', privacy:'O teu relatório será enviado por email à Câmara Municipal de VRSA.', required:'Selecciona uma categoria para continuar.', descLabel:'Descrição (opcional)', locLabel:'Localização manual', photoRemind:'📎 Anexo: (Por favor, não se esqueça de anexar a foto a este email antes de enviar!)', photoWarn:'Se tiraste uma foto, não te esqueças de a anexar manualmente na tua aplicação de email antes de enviar!' },
  EN:{ title:'Report a Problem', sub:'VRSA Town Hall', step1:'What is the problem?', step2:'Location', step3:'Photo (optional)', step4:'Description (optional)', gps:'Getting location...', gpsOk:'Location obtained', gpsErr:'Could not get location. You can enter it manually.', gpsManual:'Address or location:', gpsPlaceholder:'E.g: Rua 5 de Outubro, near the café', photoBtn:'Add photo', photoChange:'Change photo', desc:'Briefly describe the problem...', send:'Send Report', sending:'Preparing...', sent:'Email client opened', sentSub:'We opened your email client. Send the message to complete your report. Thank you!', sentCopied:'Content copied. Paste it into an email to geral@cm-vrsa.pt', newReport:'New Report', privacy:'Your report will be sent by email to VRSA Town Hall.', required:'Please select a category to continue.', descLabel:'Description (optional)', locLabel:'Manual location', photoRemind:'📎 Attachment: (Please remember to attach your photo to this email before sending!)', photoWarn:'If you took a photo, remember to attach it manually in your email app before sending!' },
  ES:{ title:'Reportar Problema', sub:'Ayuntamiento de VRSA', step1:'¿Cuál es el problema?', step2:'Ubicación', step3:'Foto (opcional)', step4:'Descripción (opcional)', gps:'Obteniendo ubicación...', gpsOk:'Ubicación obtenida', gpsErr:'No se pudo obtener la ubicación.', gpsManual:'Dirección o lugar:', gpsPlaceholder:'Ej: Rua 5 de Outubro, junto al café', photoBtn:'Añadir foto', photoChange:'Cambiar foto', desc:'Describe brevemente el problema...', send:'Enviar Informe', sending:'Preparando...', sent:'Cliente de email abierto', sentSub:'Abrimos tu cliente de email. Envía el mensaje para completar el informe. ¡Gracias!', sentCopied:'Contenido copiado. Pégalo en un email a geral@cm-vrsa.pt', newReport:'Nuevo Informe', privacy:'Tu informe será enviado por email al Ayuntamiento.', required:'Selecciona una categoría para continuar.', descLabel:'Descripción (opcional)', locLabel:'Ubicación manual', photoRemind:'📎 Adjunto: (¡No olvides adjuntar la foto a este email antes de enviar!)', photoWarn:'Si tomaste una foto, recuerda adjuntarla manualmente en tu app de email antes de enviar.' },
  FR:{ title:'Signaler un Problème', sub:'Mairie de VRSA', step1:'Quel est le problème?', step2:'Localisation', step3:'Photo (optionnel)', step4:'Description (optionnel)', gps:'Localisation en cours...', gpsOk:'Localisation obtenue', gpsErr:'Impossible d\'obtenir la localisation.', gpsManual:'Adresse ou lieu:', gpsPlaceholder:'Ex: Rua 5 de Outubro, près du café', photoBtn:'Ajouter une photo', photoChange:'Changer la photo', desc:'Décrivez brièvement le problème...', send:'Envoyer le rapport', sending:'Préparation...', sent:'Client email ouvert', sentSub:'Nous avons ouvert votre client email. Envoyez le message pour finaliser le signalement. Merci!', sentCopied:'Contenu copié. Collez-le dans un email à geral@cm-vrsa.pt', newReport:'Nouveau Rapport', privacy:'Votre rapport sera envoyé par email à la Mairie.', required:'Sélectionnez une catégorie pour continuer.', descLabel:'Description (optionnel)', locLabel:'Localisation manuelle', photoRemind:'📎 Pièce jointe: (N\'oubliez pas de joindre la photo à cet email avant d\'envoyer!)', photoWarn:'Si vous avez pris une photo, pensez à la joindre manuellement dans votre client email.' },
  DE:{ title:'Problem melden', sub:'Stadtverwaltung VRSA', step1:'Was ist das Problem?', step2:'Standort', step3:'Foto (optional)', step4:'Beschreibung (optional)', gps:'Standort wird ermittelt...', gpsOk:'Standort ermittelt', gpsErr:'Standort konnte nicht ermittelt werden.', gpsManual:'Adresse oder Ort:', gpsPlaceholder:'Bsp: Rua 5 de Outubro, beim Café', photoBtn:'Foto hinzufügen', photoChange:'Foto ändern', desc:'Beschreibe das Problem kurz...', send:'Bericht senden', sending:'Wird vorbereitet...', sent:'E-Mail-Client geöffnet', sentSub:'Wir haben Ihren E-Mail-Client geöffnet. Senden Sie die Nachricht, um den Bericht abzuschließen. Danke!', sentCopied:'Inhalt kopiert. In eine E-Mail an geral@cm-vrsa.pt einfügen', newReport:'Neuer Bericht', privacy:'Ihr Bericht wird per E-Mail an die Stadtverwaltung gesendet.', required:'Bitte wähle eine Kategorie aus.', descLabel:'Beschreibung (optional)', locLabel:'Manuelle Adresse', photoRemind:'📎 Anhang: (Vergiss nicht, das Foto vor dem Senden an diese E-Mail anzuhängen!)', photoWarn:'Wenn du ein Foto gemacht hast, denk daran, es manuell in deiner E-Mail-App anzuhängen.' },
}

const CAMARA_EMAIL = 'geral@cm-vrsa.pt'

export default function Report({ lang }) {
  const L  = lang || 'PT'
  const t  = TR[L] || TR.PT

  const [category, setCategory] = useState(null)
  const [gpsState, setGpsState] = useState('idle') // idle | loading | ok | error
  const [coords,   setCoords]   = useState(null)
  const [manual,   setManual]   = useState('')
  const [desc,     setDesc]     = useState('')
  const [photo,    setPhoto]    = useState(null)  // base64
  const [sent,     setSent]     = useState(false)
  const [copied,   setCopied]   = useState(false)
  const [error,    setError]    = useState('')
  const fileRef = useRef()

  // Auto-get GPS when component mounts
  useEffect(() => {
    setGpsState('loading')
    navigator.geolocation?.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude.toFixed(5), lng: pos.coords.longitude.toFixed(5) })
        setGpsState('ok')
      },
      () => setGpsState('error'),
      { timeout: 8000 }
    )
  }, [])

  function handlePhoto(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => setPhoto(e.target.result)
    reader.readAsDataURL(file)
  }

  function buildEmailBody() {
    const cat = CATEGORIES.find(c => c.id === category)
    const loc = coords ? `${coords.lat}, ${coords.lng}` : manual || 'Não indicada'
    const googleMapsLink = coords ? `https://maps.google.com/?q=${coords.lat},${coords.lng}` : ''
    const lines = [
      `RELATÓRIO DE PROBLEMA — VRSA GUIDE`,
      ``,
      `Categoria: ${cat?.label.PT || category}`,
      ``,
      `Localização: ${loc}`,
      googleMapsLink ? `Google Maps: ${googleMapsLink}` : '',
      ``,
      `Descrição: ${desc || '(sem descrição)'}`,
      ``,
      photo ? t.photoRemind : null,
      `---`,
      `Enviado via VRSA Guide App`,
      `Data: ${new Date().toLocaleString('pt-PT')}`,
    ].filter(l => l !== null).join('\n')
    return lines
  }

  function handleSend() {
    if (!category) { setError(t.required); return }
    setError('')

    const cat     = CATEGORIES.find(c => c.id === category)
    const subject = encodeURIComponent(`[VRSA Guide] Problema: ${cat?.label.PT}`)
    const body    = encodeURIComponent(buildEmailBody())
    const mailto  = `mailto:${CAMARA_EMAIL}?subject=${subject}&body=${body}`

    try {
      window.location.href = mailto
      setSent(true)
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard?.writeText(buildEmailBody()).then(() => {
        setCopied(true)
        setSent(true)
      }).catch(() => {
        setSent(true)
      })
    }
  }

  // ── Sent confirmation ──────────────────────────────────────
  if (sent) {
    return (
      <div className="page" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', textAlign:'center' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'#DCFCE7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:38, marginBottom:20 }}>📧</div>
        <div style={{ fontSize:20, fontWeight:700, color:'var(--ink)', marginBottom:8 }}>{t.sent}</div>
        <div style={{ fontSize:13, color:'var(--ink-40)', lineHeight:1.7, marginBottom:12 }}>{copied ? t.sentCopied : t.sentSub}</div>
        {copied && <div style={{ fontSize:12, color:'var(--ink-20)', marginBottom:12 }}>{CAMARA_EMAIL}</div>}
        {photo && (
          <div style={{ display:'flex', alignItems:'flex-start', gap:10, background:'#FFF7ED', border:'1px solid #FED7AA', borderRadius:12, padding:'12px 14px', marginBottom:24, textAlign:'left' }}>
            <span style={{ fontSize:20, flexShrink:0 }}>⚠️</span>
            <div style={{ fontSize:12, color:'#C2410C', fontWeight:600, lineHeight:1.6 }}>{t.photoWarn}</div>
          </div>
        )}
        <button onClick={() => { setSent(false); setCopied(false); setCategory(null); setDesc(''); setPhoto(null); setManual('') }} style={{ padding:'13px 28px', background:'var(--primary)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer' }}>
          + {t.newReport}
        </button>
      </div>
    )
  }

  const selectedCat = CATEGORIES.find(c => c.id === category)

  return (
    <div className="page" style={{ display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ background:'var(--primary)', padding:'16px 18px 18px', paddingTop:'calc(60px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:2 }}>
          <img src="/brasao-vrsa.png" alt="" style={{ width:28, height:28, objectFit:'contain', flexShrink:0 }} />
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:'#fff' }}>{t.title}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', letterSpacing:.3 }}>{t.sub}</div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 40px' }}>

        {/* Step 1 — Category */}
        <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.4, textTransform:'uppercase', marginBottom:10 }}>
          1 · {t.step1}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
          {CATEGORIES.map(cat => {
            const active = category === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat.id); setError('') }}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 13px', background: active ? cat.bg : 'var(--white)', border: active ? `2px solid ${cat.color}` : '1px solid var(--border-lt)', borderRadius:10, cursor:'pointer', textAlign:'left', transition:'all .12s' }}
              >
                <span style={{ fontSize:20, flexShrink:0 }}>{cat.icon}</span>
                <span style={{ fontSize:12, fontWeight: active ? 700 : 500, color: active ? cat.color : 'var(--ink-70)', lineHeight:1.3 }}>{cat.label[L]||cat.label.PT}</span>
              </button>
            )
          })}
        </div>
        {error && <div style={{ fontSize:12, color:'var(--red)', marginTop:-14, marginBottom:14, fontWeight:600 }}>⚠ {error}</div>}

        {/* Step 2 — Location */}
        <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.4, textTransform:'uppercase', marginBottom:10 }}>
          2 · {t.step2}
        </div>
        <div className="card" style={{ padding:'13px 14px', marginBottom:20 }}>
          {gpsState === 'loading' && (
            <div style={{ display:'flex', alignItems:'center', gap:10, color:'var(--ink-40)', fontSize:13 }}>
              <span style={{ fontSize:18 }}>📍</span> {t.gps}
            </div>
          )}
          {gpsState === 'ok' && (
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:18 }}>📍</span>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--green)' }}>{t.gpsOk} ✓</div>
                <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{coords?.lat}, {coords?.lng}</div>
              </div>
            </div>
          )}
          {gpsState === 'error' && (
            <div>
              <div style={{ fontSize:12, color:'var(--orange)', fontWeight:600, marginBottom:8 }}>⚠ {t.gpsErr}</div>
              <div style={{ fontSize:11, color:'var(--ink-40)', marginBottom:6 }}>{t.gpsManual}</div>
              <input
                value={manual}
                onChange={e => setManual(e.target.value)}
                placeholder={t.gpsPlaceholder}
                aria-label={t.locLabel}
                style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:8, fontSize:13, color:'var(--ink)', background:'var(--bg)', outline:'none', fontFamily:'var(--font)' }}
              />
            </div>
          )}
        </div>

        {/* Step 3 — Photo */}
        <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.4, textTransform:'uppercase', marginBottom:10 }}>
          3 · {t.step3}
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display:'none' }} onChange={e => handlePhoto(e.target.files?.[0])} />

        {photo ? (
          <div style={{ position:'relative', marginBottom:20, borderRadius:12, overflow:'hidden', height:160 }}>
            <img src={photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            <button onClick={() => fileRef.current?.click()} style={{ position:'absolute', bottom:10, right:10, background:'rgba(0,0,0,.55)', color:'#fff', border:'none', borderRadius:8, padding:'6px 12px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              📷 {t.photoChange}
            </button>
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()} style={{ width:'100%', padding:'16px', background:'var(--surface)', border:'2px dashed var(--border)', borderRadius:12, fontSize:13, fontWeight:600, color:'var(--ink-40)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:20 }}>
            <span style={{ fontSize:22 }}>📷</span> {t.photoBtn}
          </button>
        )}

        {/* Step 4 — Description */}
        <div style={{ fontSize:10, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.4, textTransform:'uppercase', marginBottom:10 }}>
          4 · {t.step4}
        </div>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder={t.desc}
          aria-label={t.descLabel}
          rows={3}
          style={{ width:'100%', padding:'11px 13px', border:'1px solid var(--border)', borderRadius:10, fontSize:13, color:'var(--ink)', background:'var(--white)', outline:'none', fontFamily:'var(--font)', resize:'none', lineHeight:1.6, marginBottom:20 }}
        />

        {/* Privacy note */}
        <div style={{ display:'flex', gap:8, padding:'10px 12px', background:'var(--primary-lt)', borderRadius:8, marginBottom:20, alignItems:'flex-start' }}>
          <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>ℹ️</span>
          <span style={{ fontSize:11, color:'var(--primary)', lineHeight:1.6 }}>{t.privacy}</span>
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          style={{ width:'100%', padding:'15px', background: category ? 'var(--primary)' : 'var(--border)', color: category ? '#fff' : 'var(--ink-20)', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor: category ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'background .15s' }}
        >
          📤 {t.send}
        </button>

      </div>
    </div>
  )
}