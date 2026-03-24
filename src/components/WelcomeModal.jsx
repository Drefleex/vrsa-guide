import { useState } from 'react'
import { tr } from '../utils/i18n'

export default function WelcomeModal({ lang, visible, onClose }) {
  const [step, setStep] = useState(0)

  const L = lang || 'PT'
  const t = tr('welcomeModal', L)

  if (!visible) return null

  const handleNext = () => {
    if (step < t.steps.length - 1) {
      setStep(s => s + 1)
    } else {
      onClose()
    }
  }

  const current = t.steps[step]

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:400, animation:'fade-in .3s ease' }}
      />

      {/* Modal */}
      <div
        style={{
          position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
          width:'100%', maxWidth:430, zIndex:401,
          background:'var(--white)',
          borderRadius:'24px 24px 0 0',
          padding:'20px 24px calc(30px + env(safe-area-inset-bottom,0px))',
          textAlign:'center',
          animation:'slide-up .4s cubic-bezier(.22,.68,0,1)',
          boxShadow:'0 -8px 40px rgba(0,0,0,.15)',
        }}
      >
        {/* Top bar: drag handle + skip */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ width:40 }} />
          <div style={{ width:40, height:4, borderRadius:2, background:'var(--border)' }} />
          <button onClick={onClose} style={{ width:40, background:'none', border:'none', color:'var(--ink-40)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
            {step < t.steps.length - 1 ? t.skip : ''}
          </button>
        </div>

        {/* Content — key forces re-mount on step change for cross-fade */}
        <div key={step} style={{ animation:'fade-in .3s ease-out' }}>
          <div style={{
            width:80, height:80, borderRadius:20,
            background: step === 0 ? 'var(--primary-lt)' : step === 1 ? '#FEE2E2' : '#EFF6FF',
            display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px',
            fontSize:40, boxShadow:'0 4px 20px rgba(0,0,0,.08)',
          }}>
            {current.emoji}
          </div>

          <div style={{ fontSize:22, fontWeight:800, color:'var(--primary)', marginBottom:12, lineHeight:1.2 }}>
            {current.title}
          </div>

          <p style={{ fontSize:14, color:'var(--ink-40)', lineHeight:1.6, maxWidth:300, margin:'0 auto 24px', minHeight:66 }}>
            {current.desc}
          </p>
        </div>

        {/* Progress dots */}
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:24 }}>
          {t.steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 8, height:8, borderRadius:4,
              background: i === step ? 'var(--primary)' : 'var(--border)',
              transition:'all .3s ease',
            }} />
          ))}
        </div>

        {/* Action button */}
        <button
          onClick={handleNext}
          style={{
            display:'block', width:'100%', maxWidth:300, margin:'0 auto',
            padding:'16px', background:'var(--primary)', color:'#fff',
            border:'none', borderRadius:14, fontSize:15, fontWeight:800,
            cursor:'pointer', boxShadow:'0 4px 16px rgba(10,22,40,.2)',
          }}
        >
          {step < t.steps.length - 1 ? t.next : t.start}
        </button>
      </div>
    </>
  )
}
