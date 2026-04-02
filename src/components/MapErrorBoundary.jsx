import { Component } from 'react'

// Mensagens de fallback por idioma
const T = {
  PT: { title:'O mapa encontrou um problema', sub:'Isto acontece quando o dispositivo perde o contexto gráfico (WebGL) ao voltar para o app.', btn:'Recarregar', auto:'A recarregar em' },
  EN: { title:'The map ran into a problem',   sub:'This can happen when the device loses its graphics context (WebGL) when returning to the app.', btn:'Reload', auto:'Reloading in' },
  ES: { title:'El mapa encontró un problema', sub:'Esto ocurre cuando el dispositivo pierde el contexto gráfico (WebGL) al volver a la app.',    btn:'Recargar', auto:'Recargando en' },
  FR: { title:'La carte a rencontré un problème', sub:'Cela arrive quand le contexte graphique (WebGL) est perdu au retour dans l\'app.',          btn:'Recharger', auto:'Rechargement dans' },
  DE: { title:'Die Karte hat ein Problem',    sub:'Dies passiert, wenn der Grafikkontext (WebGL) beim Zurückkehren zur App verloren geht.',        btn:'Neu laden', auto:'Neustart in' },
}

export default class MapErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { crashed: false, countdown: 5 }
    this._timer = null
  }

  static getDerivedStateFromError() {
    return { crashed: true, countdown: 5 }
  }

  componentDidCatch(error, info) {
    console.error('[MapErrorBoundary]', error, info)
  }

  componentDidUpdate(_, prevState) {
    // Inicia o countdown automático na primeira vez que crasha
    if (this.state.crashed && !prevState.crashed) {
      this._timer = setInterval(() => {
        this.setState(s => {
          if (s.countdown <= 1) {
            clearInterval(this._timer)
            window.location.reload()
            return s
          }
          return { countdown: s.countdown - 1 }
        })
      }, 1000)
    }
  }

  componentWillUnmount() {
    clearInterval(this._timer)
  }

  render() {
    if (!this.state.crashed) return this.props.children

    const lang = this.props.lang || 'PT'
    const t = T[lang] || T.PT
    const { countdown } = this.state

    return (
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', padding: '32px 28px', gap: 0,
        fontFamily: "'Inter',-apple-system,sans-serif",
      }}>
        {/* Ícone */}
        <div style={{
          width: 72, height: 72, borderRadius: 18,
          background: 'var(--surface)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, marginBottom: 20,
          boxShadow: '0 4px 16px rgba(0,0,0,.06)',
        }}>🗺️</div>

        {/* Título */}
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', textAlign: 'center', marginBottom: 10, lineHeight: 1.3 }}>
          {t.title}
        </div>

        {/* Subtítulo */}
        <div style={{ fontSize: 13, color: 'var(--ink-40)', textAlign: 'center', lineHeight: 1.6, marginBottom: 32, maxWidth: 280 }}>
          {t.sub}
        </div>

        {/* Botão de reload */}
        <button
          onClick={() => window.location.reload()}
          style={{
            width: '100%', maxWidth: 260, padding: '14px 0',
            background: 'var(--primary)', border: 'none', borderRadius: 50,
            fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer',
            letterSpacing: '.3px', marginBottom: 14,
          }}
        >
          {t.btn}
        </button>

        {/* Countdown automático */}
        <div style={{ fontSize: 12, color: 'var(--ink-20)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{t.auto}</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 22, height: 22, borderRadius: '50%',
            background: 'var(--surface)', border: '1px solid var(--border)',
            fontSize: 12, fontWeight: 700, color: 'var(--ink-40)',
          }}>{countdown}</span>
        </div>
      </div>
    )
  }
}
