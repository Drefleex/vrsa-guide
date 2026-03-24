import { useState } from 'react'

const LANGS = ['PT','EN','ES','FR','DE']

const SVG_SEARCH = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const SVG_GLOBE = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

export default function TopBar({ lang, setLang, onSearch }) {
  const [langOpen, setLangOpen] = useState(false)

  return (
    <>
      {langOpen && <div onClick={() => setLangOpen(false)} style={{ position:'fixed', inset:0, zIndex:198 }} />}
      <div style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        zIndex: 199,
        background: 'var(--primary)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        boxSizing: 'border-box',
      }}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 6px', gap: 4 }}>

          {/* ── Pesquisa ── */}
          <button
            onClick={onSearch}
            aria-label="Pesquisar"
            style={{ display:'flex', alignItems:'center', justifyContent:'center', width:38, height:38, borderRadius:10, background:'rgba(255,255,255,.12)', border:'none', color:'#fff', cursor:'pointer' }}
          >
            {SVG_SEARCH}
          </button>

          {/* ── Idioma ── */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(o => !o)}
              aria-label="Idioma"
              style={{ display:'flex', alignItems:'center', gap:4, height:38, padding:'0 10px', borderRadius:10, background: langOpen ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.12)', border:'none', color:'#fff', cursor:'pointer', fontSize:12, fontWeight:700 }}
            >
              {SVG_GLOBE}
              <span>{lang}</span>
            </button>
            {langOpen && (
              <div style={{ position:'absolute', top:'calc(100% + 6px)', right:0, background:'var(--white)', borderRadius:12, boxShadow:'0 4px 24px rgba(0,0,0,.18)', border:'1px solid var(--border-lt)', padding:6, display:'flex', flexDirection:'column', gap:2, minWidth:88, zIndex:1 }}>
                {LANGS.map(l => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false) }}
                    style={{ padding:'8px 16px', borderRadius:8, border:'none', textAlign:'left', background: lang === l ? 'var(--primary)' : 'transparent', color: lang === l ? '#fff' : 'var(--ink-70)', fontSize:13, fontWeight:600, cursor:'pointer' }}
                  >{l}</button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
