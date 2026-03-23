import { useRef, useState } from 'react'

const TR = {
  PT:{ title:'Adicionar foto', take:'Tirar foto', choose:'Escolher da galeria', remove:'Remover foto', cancel:'Cancelar', hint:'A foto fica guardada neste dispositivo' },
  EN:{ title:'Add photo', take:'Take photo', choose:'Choose from gallery', remove:'Remove photo', cancel:'Cancel', hint:'Photo is saved on this device' },
  ES:{ title:'Agregar foto', take:'Tomar foto', choose:'Elegir de la galería', remove:'Eliminar foto', cancel:'Cancelar', hint:'La foto se guarda en este dispositivo' },
  FR:{ title:'Ajouter une photo', take:'Prendre une photo', choose:'Choisir de la galerie', remove:'Supprimer la photo', cancel:'Annuler', hint:'La photo est sauvegardée sur cet appareil' },
  DE:{ title:'Foto hinzufügen', take:'Foto aufnehmen', choose:'Aus Galerie wählen', remove:'Foto entfernen', cancel:'Abbrechen', hint:'Das Foto wird auf diesem Gerät gespeichert' },
}

// ─── Small camera button overlaid on a card ──────────────────
export function PhotoButton({ id, hasPhoto, onPress, style }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onPress() }}
      style={{
        width:32, height:32, borderRadius:'50%',
        background: hasPhoto ? 'rgba(29,78,216,.85)' : 'rgba(0,0,0,.45)',
        border: hasPhoto ? '2px solid rgba(255,255,255,.6)' : '1.5px solid rgba(255,255,255,.35)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:15, cursor:'pointer', backdropFilter:'blur(4px)',
        transition:'background .15s',
        ...style,
      }}
    >📷</button>
  )
}

// ─── Full picker sheet ────────────────────────────────────────
export default function PhotoPicker({ id, lang, currentPhoto, onSave, onDelete, onClose }) {
  const L       = lang || 'PT'
  const t       = TR[L] || TR.PT
  const camRef  = useRef()
  const galRef  = useRef()
  const [loading, setLoading] = useState(false)

  async function handleFile(file) {
    if (!file) return
    setLoading(true)
    try { await onSave(id, file) } catch {}
    setLoading(false)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:300 }}
      />

      {/* Sheet */}
      <div style={{
        position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
        width:'100%', maxWidth:430, zIndex:301,
        background:'var(--white)', borderRadius:'20px 20px 0 0',
        padding:'14px 20px calc(36px + env(safe-area-inset-bottom,0px))',
        animation:'slide-up .25s cubic-bezier(.22,.68,0,1.2)',
      }}>
        {/* Handle */}
        <div style={{ width:36, height:4, background:'var(--border)', borderRadius:2, margin:'0 auto 16px' }} />

        {/* Preview if existing */}
        {currentPhoto && (
          <div style={{ marginBottom:16, borderRadius:14, overflow:'hidden', height:160, background:'var(--surface)' }}>
            <img src={currentPhoto} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          </div>
        )}

        <div style={{ fontSize:15, fontWeight:800, color:'var(--ink)', marginBottom:4 }}>{t.title}</div>
        <div style={{ fontSize:11, color:'var(--ink-20)', marginBottom:16 }}>💾 {t.hint}</div>

        {/* Hidden inputs */}
        <input ref={camRef} type="file" accept="image/*" capture="environment"
          style={{ display:'none' }} onChange={e => handleFile(e.target.files?.[0])} />
        <input ref={galRef} type="file" accept="image/*"
          style={{ display:'none' }} onChange={e => handleFile(e.target.files?.[0])} />

        {/* Buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>

          <button
            onClick={() => camRef.current?.click()}
            disabled={loading}
            style={{ padding:'14px', background:'var(--navy)', color:'#fff', border:'none', borderRadius:14, fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}
          >
            <span style={{ fontSize:20 }}>📷</span> {t.take}
          </button>

          <button
            onClick={() => galRef.current?.click()}
            disabled={loading}
            style={{ padding:'14px', background:'var(--surface)', color:'var(--ink)', border:'1.5px solid var(--border)', borderRadius:14, fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}
          >
            <span style={{ fontSize:20 }}>🖼️</span> {t.choose}
          </button>

          {currentPhoto && (
            <button
              onClick={() => { onDelete(id); onClose() }}
              style={{ padding:'12px', background:'var(--red-lt)', color:'var(--red)', border:'none', borderRadius:14, fontSize:13, fontWeight:700, cursor:'pointer' }}
            >
              🗑️ {t.remove}
            </button>
          )}

          <button
            onClick={onClose}
            style={{ padding:'12px', background:'transparent', color:'var(--ink-40)', border:'none', fontSize:13, fontWeight:600, cursor:'pointer' }}
          >{t.cancel}</button>

        </div>

        {loading && (
          <div style={{ marginTop:12, textAlign:'center', fontSize:12, color:'var(--ink-20)' }}>
            {L==='EN'?'Saving...':L==='FR'?'Sauvegarde...':L==='DE'?'Speichern...':L==='ES'?'Guardando...':'A guardar...'}
          </div>
        )}
      </div>
    </>
  )
}