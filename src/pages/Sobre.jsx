const PRINT_CSS = `
@media print {
  .no-print { display: none !important; }
  body { background: white !important; }
  .page { overflow: visible !important; }
}
`

export default function Sobre({ lang }) {
  const L = lang || 'PT'

  const T = {
    PT: {
      hero:       'Guia Turístico Digital',
      heroSub:    'Vila Real de Santo António · Algarve · Portugal',
      pitch:      'Uma proposta de parceria digital para o Município',
      whatTitle:  'O que é o VRSA Guide?',
      whatDesc:   'Uma Progressive Web App (PWA) gratuita e instalável em qualquer telemóvel, concebida para servir os visitantes e residentes de Vila Real de Santo António. Sem necessidade de App Store — funciona como um site, instala-se como uma app.',
      statsTitle: 'Em números',
      featTitle:  'Funcionalidades',
      feats: [
        { e:'📍', t:'476+ pontos de interesse com GPS preciso — restaurantes, hotéis, praias, cultura, compras, saúde' },
        { e:'🍽️', t:'Ementa completa com preços de 19 restaurantes, integrada com o Bairro Digital VRSA' },
        { e:'🌍', t:'Interface em 5 idiomas: Português, Inglês, Espanhol, Francês e Alemão' },
        { e:'📴', t:'Funciona offline — o turista acede às informações mesmo sem dados móveis' },
        { e:'⛴️', t:'Horários do ferry VRSA–Ayamonte em tempo real, com contagem decrescente' },
        { e:'🌤️', t:'Previsão meteorológica em direto via Open-Meteo (Serviço Meteorológico Europeu)' },
        { e:'📅', t:'Agenda de eventos municipais com exportação para calendário (.ics)' },
        { e:'🏖️', t:'Condições das praias com bandeiras em tempo real e dados de UV' },
        { e:'🚌', t:'Horários de transportes: ferry, comboio, autocarros e comboio turístico' },
        { e:'🗺️', t:'Mapa interativo com Google Maps — pesquisar, filtrar, calcular distância' },
        { e:'🔔', t:'Sistema de alertas municipais (avisos de obra, eventos urgentes, etc.)' },
        { e:'🌙', t:'Modo claro e escuro, otimizado para uso ao sol na praia' },
      ],
      partnerTitle: 'Proposta para a Câmara Municipal',
      partnerDesc:  'Este guia foi desenvolvido como prova de conceito de um serviço digital de turismo para VRSA. Propomos uma parceria com a Câmara Municipal para:',
      partners: [
        'Integrar a agenda oficial de eventos da Câmara (Google Sheets / CMS)',
        'Publicar alertas municipais em tempo real diretamente na app',
        'Disponibilizar como guia digital oficial em balcões de turismo e QR codes',
        'Expandir com conteúdos de Castro Marim, Monte Gordo e toda a região',
        'Integrar com o Bairro Digital VRSA para promoções e campanhas locais',
        'Adicionar visitas virtuais a monumentos e percursos pedestres guiados',
      ],
      techTitle:  'Tecnologia',
      techDesc:   'Desenvolvido com React + Vite (PWA), alojamento gratuito via Netlify. Código aberto e 100% auditável. Sem recolha de dados pessoais — não há registo, não há login, não há cookies de tracking.',
      contactTitle: 'Contacto',
      contactDesc: 'Para discussão de parceria ou demonstração ao vivo:',
      builtBy: 'Desenvolvido como iniciativa independente de valorização digital de VRSA',
      version: 'Versão 1.0 · Março 2026',
    },
    EN: {
      hero:       'Digital Tourism Guide',
      heroSub:    'Vila Real de Santo António · Algarve · Portugal',
      pitch:      'A digital partnership proposal for the Municipality',
      whatTitle:  'What is VRSA Guide?',
      whatDesc:   'A free Progressive Web App (PWA) installable on any smartphone, designed to serve visitors and residents of Vila Real de Santo António. No App Store needed — works like a website, installs like an app.',
      statsTitle: 'By the numbers',
      featTitle:  'Features',
      feats: [
        { e:'📍', t:'476+ points of interest with precise GPS — restaurants, hotels, beaches, culture, shopping, health' },
        { e:'🍽️', t:'Full menu with prices from 19 restaurants, integrated with Bairro Digital VRSA' },
        { e:'🌍', t:'Interface in 5 languages: Portuguese, English, Spanish, French and German' },
        { e:'📴', t:'Works offline — tourists access information even without mobile data' },
        { e:'⛴️', t:'VRSA–Ayamonte ferry schedule in real time, with countdown' },
        { e:'🌤️', t:'Live weather forecast via Open-Meteo (European Meteorological Service)' },
        { e:'📅', t:'Municipal events calendar with export to calendar (.ics)' },
        { e:'🏖️', t:'Beach conditions with real-time flags and UV data' },
        { e:'🚌', t:'Transport schedules: ferry, train, buses and tourist train' },
        { e:'🗺️', t:'Interactive map with Google Maps — search, filter, calculate distance' },
        { e:'🔔', t:'Municipal alert system (roadworks, urgent events, etc.)' },
        { e:'🌙', t:'Light and dark mode, optimised for use in bright sunlight' },
      ],
      partnerTitle: 'Proposal for the Municipality',
      partnerDesc:  'This guide was developed as a proof of concept for a digital tourism service for VRSA. We propose a partnership with the Municipal Council to:',
      partners: [
        'Integrate the official municipal events calendar (Google Sheets / CMS)',
        'Publish real-time municipal alerts directly in the app',
        'Deploy as official digital guide at tourism desks and QR codes',
        'Expand with content for Castro Marim, Monte Gordo and the wider region',
        'Integrate with Bairro Digital VRSA for local promotions and campaigns',
        'Add virtual tours of monuments and guided walking routes',
      ],
      techTitle:  'Technology',
      techDesc:   'Built with React + Vite (PWA), hosted for free on Netlify. Open source and 100% auditable. No personal data collected — no registration, no login, no tracking cookies.',
      contactTitle: 'Contact',
      contactDesc: 'For partnership discussion or live demo:',
      builtBy: 'Developed as an independent initiative to digitally promote VRSA',
      version: 'Version 1.0 · March 2026',
    },
    ES: {
      hero:       'Guía Turística Digital',
      heroSub:    'Vila Real de Santo António · Algarve · Portugal',
      pitch:      'Una propuesta de colaboración digital para el Municipio',
      whatTitle:  '¿Qué es VRSA Guide?',
      whatDesc:   'Una Progressive Web App (PWA) gratuita e instalable en cualquier smartphone, diseñada para visitantes y residentes de Vila Real de Santo António.',
      statsTitle: 'En cifras',
      featTitle:  'Funcionalidades',
      feats: [
        { e:'📍', t:'476+ puntos de interés con GPS — restaurantes, hoteles, playas, cultura, compras, salud' },
        { e:'🍽️', t:'Menú completo con precios de 19 restaurantes, integrado con Bairro Digital VRSA' },
        { e:'🌍', t:'Interfaz en 5 idiomas: Portugués, Inglés, Español, Francés y Alemán' },
        { e:'📴', t:'Funciona sin conexión — los turistas acceden a información sin datos móviles' },
        { e:'⛴️', t:'Horario del ferry VRSA–Ayamonte en tiempo real, con cuenta regresiva' },
        { e:'🌤️', t:'Previsión meteorológica en directo vía Open-Meteo' },
        { e:'📅', t:'Agenda de eventos municipales con exportación a calendario (.ics)' },
        { e:'🏖️', t:'Condiciones de las playas con banderas en tiempo real y datos UV' },
        { e:'🚌', t:'Horarios de transportes: ferry, tren, autobuses y tren turístico' },
        { e:'🗺️', t:'Mapa interactivo con Google Maps — buscar, filtrar, calcular distancia' },
        { e:'🔔', t:'Sistema de alertas municipales (obras, eventos urgentes, etc.)' },
        { e:'🌙', t:'Modo claro y oscuro, optimizado para uso al sol en la playa' },
      ],
      partnerTitle: 'Propuesta para el Ayuntamiento',
      partnerDesc:  'Esta guía fue desarrollada como prueba de concepto de un servicio digital de turismo para VRSA. Proponemos una colaboración con el Ayuntamiento para:',
      partners: [
        'Integrar la agenda oficial de eventos del Ayuntamiento',
        'Publicar alertas municipales en tiempo real directamente en la app',
        'Desplegar como guía digital oficial en oficinas de turismo y códigos QR',
        'Expandir con contenidos de Castro Marim, Monte Gordo y la región',
        'Integrar con Bairro Digital VRSA para promociones y campañas locales',
        'Añadir visitas virtuales a monumentos y rutas pedestres guiadas',
      ],
      techTitle:  'Tecnología',
      techDesc:   'Desarrollado con React + Vite (PWA), alojado gratis en Netlify. Código abierto y 100% auditable. Sin recopilación de datos personales.',
      contactTitle: 'Contacto',
      contactDesc: 'Para discusión de colaboración o demostración en vivo:',
      builtBy: 'Desarrollado como iniciativa independiente de promoción digital de VRSA',
      version: 'Versión 1.0 · Marzo 2026',
    },
  }

  const t = T[L] || T.PT

  const STATS = [
    { n:'476+', l:{ PT:'Pins no mapa', EN:'Map pins', ES:'Pins en el mapa' } },
    { n:'5',    l:{ PT:'Idiomas', EN:'Languages', ES:'Idiomas' } },
    { n:'19',   l:{ PT:'Restaurantes c/ ementa', EN:'Restaurants with menu', ES:'Restaurantes con menú' } },
    { n:'PWA',  l:{ PT:'Offline + Instalável', EN:'Offline + Installable', ES:'Offline + Instalable' } },
  ]

  return (
    <div className="page" style={{ overflowY:'auto' }}>
      <style>{PRINT_CSS}</style>

      {/* Botão PDF — fixo no topo direito */}
      <button
        className="no-print"
        onClick={() => window.print()}
        style={{ position:'fixed', top:'calc(14px + env(safe-area-inset-top,0px))', right:16, zIndex:200, display:'flex', alignItems:'center', gap:6, background:'#C9A84C', border:'none', borderRadius:50, padding:'8px 14px', cursor:'pointer', boxShadow:'0 2px 12px rgba(0,0,0,.2)' }}
      >
        <span style={{ fontSize:14 }}>📄</span>
        <span style={{ fontSize:12, fontWeight:700, color:'#fff' }}>PDF</span>
      </button>

      {/* Hero */}
      <div style={{ background:'linear-gradient(160deg,#002D55 0%,#003B6F 55%,#004F96 100%)', paddingRight:'24px', paddingBottom:'36px', paddingLeft:'24px', paddingTop:'calc(72px + env(safe-area-inset-top,0px))', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, right:0, width:200, height:200, borderRadius:'0 0 0 100%', background:'rgba(255,255,255,.03)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, width:140, height:140, borderRadius:'0 100% 0 0', background:'rgba(255,255,255,.03)' }} />

        <div style={{ width:72, height:72, borderRadius:14, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <img src="/brasao-vrsa.webp" alt="Brasão VRSA" style={{ width:56, height:56, objectFit:'contain' }} />
        </div>
        <div style={{ fontSize:22, fontWeight:800, color:'#fff', lineHeight:1.2, marginBottom:6 }}>{t.hero}</div>
        <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.5)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:12 }}>{t.heroSub}</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#C9A84C', borderRadius:50, padding:'5px 14px' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#fff', flexShrink:0 }} />
          <span style={{ fontSize:11, fontWeight:700, color:'#fff', letterSpacing:.5 }}>{t.pitch}</span>
        </div>
      </div>

      <div style={{ padding:'20px 18px 40px' }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
          {STATS.map((s, i) => (
            <div key={i} className="card" style={{ padding:'14px 16px', textAlign:'center', borderRadius:14 }}>
              <div style={{ fontSize:26, fontWeight:900, color:'var(--primary)', letterSpacing:'-1px', lineHeight:1 }}>{s.n}</div>
              <div style={{ fontSize:11, fontWeight:600, color:'var(--ink-40)', marginTop:4 }}>{s.l[L] || s.l.PT}</div>
            </div>
          ))}
        </div>

        {/* What is it */}
        <div style={{ marginBottom:22 }}>
          <div style={{ fontSize:16, fontWeight:800, color:'var(--ink)', marginBottom:8 }}>{t.whatTitle}</div>
          <p style={{ fontSize:13, color:'var(--ink-40)', lineHeight:1.75, margin:0 }}>{t.whatDesc}</p>
        </div>

        {/* Features */}
        <div style={{ marginBottom:22 }}>
          <div style={{ fontSize:16, fontWeight:800, color:'var(--ink)', marginBottom:12 }}>{t.featTitle}</div>
          <div className="card" style={{ overflow:'hidden' }}>
            {t.feats.map((f, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'11px 14px', borderBottom: i < t.feats.length-1 ? '1px solid var(--surface)' : 'none' }}>
                <span style={{ fontSize:18, flexShrink:0, lineHeight:1.4 }}>{f.e}</span>
                <span style={{ fontSize:12, color:'var(--ink-40)', lineHeight:1.6 }}>{f.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership proposal */}
        <div style={{ background:'linear-gradient(135deg,#002D55,#004F96)', borderRadius:18, padding:'20px 18px', marginBottom:22 }}>
          <div style={{ fontSize:16, fontWeight:800, color:'#fff', marginBottom:8 }}>{t.partnerTitle}</div>
          <p style={{ fontSize:12, color:'rgba(255,255,255,.65)', lineHeight:1.7, margin:'0 0 16px' }}>{t.partnerDesc}</p>
          {t.partners.map((p, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
              <span style={{ width:20, height:20, borderRadius:'50%', background:'#C9A84C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#fff', flexShrink:0, marginTop:1 }}>{i+1}</span>
              <span style={{ fontSize:12, color:'rgba(255,255,255,.8)', lineHeight:1.6 }}>{p}</span>
            </div>
          ))}
        </div>

        {/* Technology */}
        <div className="card" style={{ padding:'16px', marginBottom:22, borderRadius:14 }}>
          <div style={{ fontSize:14, fontWeight:800, color:'var(--ink)', marginBottom:6 }}>{t.techTitle}</div>
          <p style={{ fontSize:12, color:'var(--ink-40)', lineHeight:1.7, margin:0 }}>{t.techDesc}</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:12 }}>
            {['React + Vite','PWA','Google Maps API','Open-Meteo','Bairro Digital API','Netlify','5 idiomas','WCAG AA'].map(tag => (
              <span key={tag} style={{ fontSize:10, fontWeight:700, color:'var(--primary)', background:'var(--primary-lt)', borderRadius:50, padding:'3px 9px' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="card" style={{ padding:'16px', borderRadius:14, textAlign:'center' }}>
          <div style={{ fontSize:14, fontWeight:800, color:'var(--ink)', marginBottom:6 }}>{t.contactTitle}</div>
          <p style={{ fontSize:12, color:'var(--ink-40)', lineHeight:1.7, margin:'0 0 12px' }}>{t.contactDesc}</p>
          <a href="mailto:geral@cm-vrsa.pt" style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--primary)', color:'#fff', textDecoration:'none', borderRadius:10, padding:'10px 18px', fontSize:13, fontWeight:700 }}>
            📧 geral@cm-vrsa.pt
          </a>
        </div>

        <div style={{ textAlign:'center', marginTop:24 }}>
          <div style={{ fontSize:11, color:'var(--ink-20)', marginBottom:4 }}>{t.builtBy}</div>
          <div style={{ fontSize:10, color:'var(--ink-20)', fontWeight:600, letterSpacing:'.5px' }}>{t.version}</div>
        </div>

      </div>
    </div>
  )
}
