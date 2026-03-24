import React, { useState, useEffect } from 'react'

// ─── 15 real-context 2026 VRSA events ───────────────────────
export const EVENTS = [
  {
    id:1, emoji:'🎷', color:'#1D4ED8', month:4, day:25,
    title:{PT:'Celebração do 25 de Abril',EN:'April 25th Celebration',ES:'Celebración 25 de Abril',FR:'Fête du 25 Avril',DE:'25. April Feier'},
    time:'11:00', loc:'Praça Marquês de Pombal', price:'🆓',
    desc:{PT:'Celebração do Dia da Liberdade com concertos, discursos e flores de cravos na Praça Pombal. Um dos momentos mais emocionantes do calendário local.',EN:'Freedom Day celebration with concerts, speeches and carnation flowers at Praça Pombal. One of the most moving moments of the local calendar.',ES:'Celebración del Día de la Libertad con conciertos y flores de clavel.',FR:'Célébration de la Liberté avec concerts et oeillets.',DE:'Tag der Freiheit mit Konzerten und Nelken.'},
    lat:37.19437, lng:-7.41558
  },
  {
    id:2, emoji:'🎵', color:'#7C3AED', month:5, day:10,
    title:{PT:'Festival de Jazz do Guadiana',EN:'Guadiana Jazz Festival',ES:'Festival de Jazz del Guadiana',FR:'Festival de Jazz du Guadiana',DE:'Guadiana Jazz Festival'},
    time:'21:00', loc:'Jardim Municipal', price:'€8–€15',
    desc:{PT:'Uma das maiores noites de jazz do Algarve. Artistas nacionais e internacionais no Jardim Municipal, com o Rio Guadiana como pano de fundo.',EN:'One of the biggest jazz nights in the Algarve. National and international artists at the Municipal Garden, with the Guadiana river as backdrop.',ES:'Una de las mayores noches de jazz del Algarve.',FR:'Une des plus grandes soirées jazz de l\'Algarve.',DE:'Eine der größten Jazznächte des Algarve.'},
    lat:37.1911, lng:-7.412957
  },
  {
    id:3, emoji:'🦐', color:'#059669', month:5, day:23,
    title:{PT:'Festival do Marisco de VRSA',EN:'VRSA Seafood Festival',ES:'Festival del Marisco de VRSA',FR:'Festival des Fruits de Mer',DE:'VRSA Meeresfrüchte-Festival'},
    time:'18:00–24:00', loc:'Cais do Guadiana', price:'€ entrada livre · pratos €5–€15',
    desc:{PT:'Quatro dias de gastronomia junto ao rio. Cataplanas, gambas, percebes, mariscos frescos e vinhos algarvios. O maior evento gastronómico do concelho.',EN:'Four days of gastronomy by the river. Cataplanas, prawns, barnacles, fresh shellfish and Algarve wines. The largest gastronomic event in the municipality.',ES:'Cuatro días de gastronomía junto al río.',FR:'Quatre jours de gastronomie au bord du fleuve.',DE:'Vier Tage Gastronomie am Fluss.'},
    lat:37.192943, lng:-7.413413
  },
  {
    id:4, emoji:'🎨', color:'#C85A3B', month:6, day:7,
    title:{PT:'Mercado de Artesanato',EN:'Crafts Market',ES:'Mercado de Artesanía',FR:'Marché Artisanal',DE:'Kunsthandwerksmarkt'},
    time:'10:00–20:00', loc:'Jardim Municipal', price:'🆓',
    desc:{PT:'Mais de 60 expositores com artesanato local: azulejos pintados à mão, cerâmica algarvia, bordados, cestos e produtos regionais. Ideal para levar recordações.',EN:'Over 60 exhibitors with local crafts: hand-painted tiles, Algarve ceramics, embroidery, baskets and regional products. Ideal for souvenirs.',ES:'Más de 60 expositores con artesanía local.',FR:'Plus de 60 exposants avec artisanat local.',DE:'Über 60 Aussteller mit lokalem Kunsthandwerk.'},
    lat:37.1911, lng:-7.412957
  },
  {
    id:5, emoji:'🌊', color:'#0891B2', month:6, day:21,
    title:{PT:'Dia Mundial do Surf — VRSA',EN:'World Surf Day — VRSA',ES:'Día Mundial del Surf',FR:'Journée Mondiale du Surf',DE:'Welt-Surf-Tag'},
    time:'09:00', loc:'Praia de Monte Gordo', price:'🆓',
    desc:{PT:'Celebração do Dia Mundial do Surf com provas livres, aulas de iniciação gratuitas e beach clean-up. Participa mesmo sem experiência!',EN:'World Surf Day celebration with free competitions, beginner lessons and beach clean-up. Join even without experience!',ES:'Celebración del Día Mundial del Surf con competiciones y clases gratuitas.',FR:'Journée mondiale du surf avec compétitions et cours gratuits.',DE:'Welt-Surf-Tag mit Wettbewerben und kostenlosen Anfänger-Kursen.'},
    lat:37.177989, lng:-7.449761
  },
  {
    id:6, emoji:'🏊', color:'#1D4ED8', month:7, day:5,
    title:{PT:'Campeonato Regional de Natação',EN:'Regional Swimming Championship',ES:'Campeonato Regional de Natación',FR:'Championnat Régional de Natation',DE:'Regionales Schwimmturnier'},
    time:'09:00–18:00', loc:'Piscina Municipal', price:'🆓 para espectadores',
    desc:{PT:'Campeonato regional com nadadores de toda a região do Algarve. Categorias desde juvenis a seniores. Entrada gratuita para o público.',EN:'Regional championship with swimmers from across the Algarve region. All age categories. Free entry for spectators.',ES:'Campeonato regional con nadadores de toda la región.',FR:'Championnat régional avec nageurs de tout l\'Algarve.',DE:'Regionale Meisterschaft mit Schwimmern aus dem gesamten Algarve.'},
    lat:37.195, lng:-7.416
  },
  {
    id:7, emoji:'🎭', color:'#D97706', month:7, day:18,
    title:{PT:'Noite Pombalina',EN:'Pombaline Night',ES:'Noche Pombalina',FR:'Nuit Pombaline',DE:'Pombalinische Nacht'},
    time:'20:00', loc:'Praça Marquês de Pombal', price:'🆓',
    desc:{PT:'Celebração da herança histórica com teatro de rua, fado ao vivo, exposição de fotografia histórica e animação nocturna na maior praça da cidade.',EN:'Celebration of historical heritage with street theatre, live fado, historical photography exhibition and night entertainment in the main square.',ES:'Celebración del patrimonio histórico con teatro callejero, fado en vivo y exposición fotográfica.',FR:'Célébration du patrimoine historique avec théâtre de rue, fado et exposition.',DE:'Feier des historischen Erbes mit Straßentheater, Fado und Fotoausstellung.'},
    lat:37.19437, lng:-7.41558
  },
  {
    id:8, emoji:'🎆', color:'#7C3AED', month:7, day:31,
    title:{PT:'Festas do Mar — Fogo de Artifício',EN:'Sea Festivals — Fireworks',ES:'Fiestas del Mar — Fuegos Artificiales',FR:'Fêtes de la Mer — Feux d\'Artifice',DE:'Meeresfestspiele — Feuerwerk'},
    time:'22:30', loc:'Cais do Guadiana', price:'🆓',
    desc:{PT:'O maior fogo de artifício do verão algarvio sobre o Rio Guadiana. Vista privilegiada da margem de VRSA ou do ferry. Um espectáculo inesquecível.',EN:'The biggest summer fireworks display in the Algarve over the Guadiana river. Best viewed from the VRSA riverbank or the ferry. An unforgettable spectacle.',ES:'Los fuegos artificiales más grandes del verano en el río Guadiana.',FR:'Le plus grand feu d\'artifice de l\'été sur le Guadiana.',DE:'Das größte Sommerfeuerwerk am Guadiana.'},
    lat:37.196981, lng:-7.413997
  },
  {
    id:9, emoji:'🏄', color:'#059669', month:8, day:8,
    title:{PT:'Campeonato Regional de Surf',EN:'Regional Surf Championship',ES:'Campeonato Regional de Surf',FR:'Championnat Régional de Surf',DE:'Regionales Surf-Turnier'},
    time:'08:00–18:00', loc:'Praia de Monte Gordo', price:'🆓',
    desc:{PT:'Competição regional de surf com categorias júnior e sénior. Participantes de toda a região algarvia em ondas de Monte Gordo.',EN:'Regional surf competition with junior and senior categories. Participants from across the Algarve on Monte Gordo\'s waves.',ES:'Competición regional de surf con categorías junior y senior.',FR:'Compétition régionale de surf avec catégories junior et senior.',DE:'Regionale Surf-Meisterschaft mit Junior- und Senior-Kategorien.'},
    lat:37.177989, lng:-7.449761
  },
  {
    id:10, emoji:'🎉', color:'#C85A3B', month:8, day:15,
    title:{PT:'Festas da Cidade — Dia de VRSA',EN:'City Festival — VRSA Day',ES:'Fiestas de la Ciudad',FR:'Fête de la Ville',DE:'Stadtfest — VRSA-Tag'},
    time:'Todo o dia', loc:'Centro histórico', price:'🆓',
    desc:{PT:'Aniversário da fundação de VRSA em 1776. Desfiles históricos, música tradicional, gastronomia nas ruas e animação para toda a família.',EN:'Anniversary of the founding of VRSA in 1776. Historical parades, traditional music, street food and family entertainment.',ES:'Aniversario de la fundación de VRSA en 1776. Desfiles, música y gastronomía.',FR:'Anniversaire de la fondation de VRSA en 1776. Défilés, musique et gastronomie.',DE:'Jahrestag der Stadtgründung 1776. Historische Umzüge, Musik und Gastronomie.'},
    lat:37.194583, lng:-7.41551
  },
  {
    id:11, emoji:'🎸', color:'#1D4ED8', month:8, day:22,
    title:{PT:'VRSA Live Music Festival',EN:'VRSA Live Music Festival',ES:'VRSA Live Music Festival',FR:'VRSA Live Music Festival',DE:'VRSA Live Music Festival'},
    time:'19:00', loc:'Cais do Guadiana', price:'€10–€20',
    desc:{PT:'Festival de música ao vivo com bandas regionais e nacionais. Pop, rock, música portuguesa e fado moderno num palco à beira-rio.',EN:'Live music festival with regional and national bands. Pop, rock, Portuguese music and modern fado on a riverside stage.',ES:'Festival de música en directo junto al río.',FR:'Festival de musique live au bord du fleuve.',DE:'Live-Musikfestival mit Regional- und Nationalbands am Flussufer.'},
    lat:37.196981, lng:-7.413997
  },
  {
    id:12, emoji:'🍷', color:'#D97706', month:9, day:12,
    title:{PT:'Festival Gastronómico do Algarve',EN:'Algarve Gastronomy Festival',ES:'Festival Gastronómico del Algarve',FR:'Festival Gastronomique de l\'Algarve',DE:'Algarve-Gastronomie-Festival'},
    time:'12:00–22:00', loc:'Jardim Municipal', price:'🆓 entrada · pratos €3–€10',
    desc:{PT:'Os melhores restaurantes do Algarve reunidos no Jardim Municipal. Petiscos, pratos principais e sobremesas típicas. Concurso de cataplana em directo.',EN:'The best Algarve restaurants gathered at the Municipal Garden. Petiscos, mains and typical desserts. Live cataplana competition.',ES:'Los mejores restaurantes del Algarve reunidos en el jardín.',FR:'Les meilleurs restaurants de l\'Algarve réunis au jardin.',DE:'Die besten Restaurants des Algarve im Stadtgarten.'},
    lat:37.1911, lng:-7.412957
  },
  {
    id:13, emoji:'🎃', color:'#EA580C', month:10, day:31,
    title:{PT:'Halloween em VRSA',EN:'Halloween in VRSA',ES:'Halloween en VRSA',FR:'Halloween à VRSA',DE:'Halloween in VRSA'},
    time:'18:00–23:00', loc:'Centro histórico', price:'🆓',
    desc:{PT:'Animação de Halloween no centro histórico com desfile de fantasmas, decorações nas ruas e actividades para crianças.',EN:'Halloween entertainment in the historic centre with ghost parade, street decorations and children\'s activities.',ES:'Animación de Halloween con desfile de disfraces y actividades para niños.',FR:'Animation Halloween avec parade de fantômes et activités pour enfants.',DE:'Halloween-Unterhaltung mit Geister-Parade und Kinderaktivitäten.'},
    lat:37.194583, lng:-7.41551
  },
  {
    id:14, emoji:'🎄', color:'#059669', month:12, day:6,
    title:{PT:'Natal em VRSA — Inauguração',EN:'Christmas in VRSA — Inauguration',ES:'Navidad en VRSA',FR:'Noël à VRSA',DE:'Weihnachten in VRSA'},
    time:'18:30', loc:'Praça Marquês de Pombal', price:'🆓',
    desc:{PT:'Iluminação natalícia da cidade com concerto coral, Pai Natal e chocolatada quente para todos. O Presépio Gigante abre oficialmente.',EN:'City Christmas lights with choral concert, Santa Claus and hot chocolate for everyone. The Giant Nativity Scene officially opens.',ES:'Iluminación navideña con concierto coral, Papá Noel y chocolate caliente.',FR:'Illuminations de Noël avec concert choral, Père Noël et chocolat chaud.',DE:'Weihnachtsbeleuchtung mit Chorkonzert, Weihnachtsmann und heißer Schokolade.'},
    lat:37.19437, lng:-7.41558
  },
  {
    id:15, emoji:'🎆', color:'#7C3AED', month:12, day:31,
    title:{PT:'Passagem de Ano — Rio Guadiana',EN:'New Year\'s Eve — Guadiana River',ES:'Nochevieja — Río Guadiana',FR:'Saint-Sylvestre — Rivière Guadiana',DE:'Silvester — Fluss Guadiana'},
    time:'22:00–01:00', loc:'Cais do Guadiana', price:'🆓',
    desc:{PT:'Contagem decrescente e fogo de artifício sobre o Rio Guadiana para celebrar o novo ano. Com Espanha à vista, é um momento único na fronteira.',EN:'Countdown and fireworks over the Guadiana river to ring in the new year. With Spain in view, it\'s a unique border moment.',ES:'Cuenta atrás y fuegos artificiales sobre el río Guadiana en el año nuevo.',FR:'Compte à rebours et feux d\'artifice sur le Guadiana pour la nouvelle année.',DE:'Countdown und Feuerwerk über dem Guadiana zum Jahreswechsel.'},
    lat:37.196981, lng:-7.413997
  },
  {
    id:16, emoji:'⚔️', color:'#92400E', month:7, day:12,
    title:{PT:'Feira Medieval de VRSA',EN:'VRSA Medieval Fair',ES:'Feria Medieval de VRSA',FR:'Foire Médiévale de VRSA',DE:'VRSA Mittelaltermesse'},
    time:'18:00–24:00', loc:'Centro Histórico', price:'🆓',
    desc:{PT:'Três dias de mercado medieval no centro histórico com artesãos, comida típica medieval, espectáculos de falcoaria, música de época e reconstituições históricas. Crianças e adultos adoram.',EN:'Three days of medieval market in the historic centre with craftsmen, medieval food, falconry shows, period music and historical re-enactments. Loved by children and adults alike.',ES:'Tres días de mercado medieval en el centro histórico con artesanos, comida medieval y espectáculos de cetrería.',FR:'Trois jours de marché médiéval dans le centre historique avec artisans, nourriture médiévale et fauconnerie.',DE:'Drei Tage mittelalterlicher Markt im historischen Zentrum mit Handwerkern, mittelalterlichem Essen und Falknerei.'},
    lat:37.194583, lng:-7.41551
  },
  {
    id:17, emoji:'🎁', color:'#059669', month:12, day:13,
    title:{PT:'Mercado de Natal de VRSA',EN:'VRSA Christmas Market',ES:'Mercado de Navidad de VRSA',FR:'Marché de Noël de VRSA',DE:'VRSA Weihnachtsmarkt'},
    time:'17:00–22:00', loc:'Praça Marquês de Pombal', price:'🆓',
    desc:{PT:'O tradicional Mercado de Natal na Praça Pombal com artesanato, presentes regionais, iguarias natalícias e pista de gelo para crianças. Uma das melhores épocas do ano para visitar VRSA.',EN:'The traditional Christmas Market at Praça Pombal with crafts, regional gifts, Christmas delicacies and an ice rink for children. One of the best times of year to visit VRSA.',ES:'El tradicional Mercado de Navidad en la Plaza Pombal con artesanía, regalos regionales y pista de hielo para niños.',FR:'Le marché de Noël traditionnel à la Praça Pombal avec artisanat, cadeaux régionaux et patinoire pour enfants.',DE:'Der traditionelle Weihnachtsmarkt am Praça Pombal mit Kunsthandwerk, regionalen Geschenken und Eisbahn für Kinder.'},
    lat:37.19437, lng:-7.41558
  },
  // ── Eventos confirmados cm-vrsa.pt ───────────────────────────
  {
    id:18, emoji:'🎭', color:'#92400E', month:5, day:9,
    title:{PT:'Festival Histórico Setecentista',EN:'18th Century Historical Festival',ES:'Festival Histórico del Siglo XVIII',FR:'Festival Historique du XVIIIe Siècle',DE:'Historisches Festival des 18. Jahrhunderts'},
    time:'18:00', loc:'Centro Histórico', price:'🆓',
    desc:{PT:'Reconstituição histórica da fundação da cidade em 1776. Trajes do século XVIII, artesanato, música de época, teatro de rua e gastronomia histórica. Um dos maiores eventos culturais do Algarve — regressa sempre em maio.',EN:'Historical re-enactment of the city\'s 1776 founding. 18th century costumes, crafts, period music, street theatre and historical cuisine. One of the biggest cultural events in the Algarve — always returns in May.',ES:'Recreación de la fundación de la ciudad en 1776: trajes del siglo XVIII, artesanía, teatro y gastronomía histórica.',FR:'Reconstitution de la fondation de la ville en 1776: costumes, artisanat, théâtre de rue et gastronomie historique.',DE:'Historische Nachstellung der Stadtgründung 1776 mit Kostümen des 18. Jh., Handwerk, Theater und historischer Küche.'},
    lat:37.194583, lng:-7.41551
  },
  {
    id:19, emoji:'🕍', color:'#1565C0', month:5, day:13,
    title:{PT:'Procissão Histórica — Fundação de VRSA',EN:'Historical Procession — VRSA Founding Day',ES:'Procesión Histórica — Fundación de VRSA',FR:'Procession Historique — Fondation de VRSA',DE:'Historische Prozession — Gründungstag von VRSA'},
    time:'17:00', loc:'Centro Histórico', price:'🆓',
    desc:{PT:'Procissão etnográfica a assinalar o aniversário da fundação de Vila Real de Santo António. Trajes tradicionais, música folclórica e celebração da identidade pombalina única desta cidade.',EN:'Ethnographic procession marking the anniversary of Vila Real de Santo António\'s founding. Traditional costumes, folk music and celebration of the city\'s unique Pombaline identity.',ES:'Procesión etnográfica con trajes tradicionales y música folclórica para celebrar el aniversario de la fundación de la ciudad.',FR:'Procession ethnographique avec costumes traditionnels et musique folklorique pour célébrer l\'anniversaire de la fondation.',DE:'Ethnografische Prozession mit Trachten und Volksmusik zum Jahrestag der Stadtgründung.'},
    lat:37.194583, lng:-7.41551
  },
  {
    id:20, emoji:'🧂', color:'#0277BD', month:3, day:4,
    title:{PT:'Exposição "Histórias de Sal"',EN:'Exhibition "Stories of Salt"',ES:'Exposición "Historias de Sal"',FR:'Exposition "Histoires de Sel"',DE:'Ausstellung "Geschichten des Salzes"'},
    time:'10:00–18:00', loc:'Centro Cultural António Aleixo', price:'🆓',
    desc:{PT:'Exposição sobre a história das salinas do Guadiana e o seu papel na economia e identidade de VRSA. Fotografias históricas, objetos e documentos originais sobre o "ouro branco" do Algarve.',EN:'Exhibition on the history of the Guadiana salt pans and their role in VRSA\'s economy and identity. Historical photographs, objects and original documents about the Algarve\'s "white gold".',ES:'Exposición sobre la historia de las salinas del Guadiana con fotografías históricas y documentos sobre el "oro blanco" del Algarve.',FR:'Exposition sur l\'histoire des marais salants du Guadiana avec photos historiques sur l\'"or blanc" de l\'Algarve.',DE:'Ausstellung zur Geschichte der Guadiana-Salinen mit historischen Fotos und Dokumenten über das "weiße Gold" des Algarve.'},
    lat:37.194583, lng:-7.41551
  },
  {
    id:21, emoji:'👑', color:'#7C3AED', month:1, day:4,
    title:{PT:'Reis de Ayamonte chegam a VRSA',EN:'Kings from Ayamonte Arrive in VRSA',ES:'Los Reyes de Ayamonte llegan a VRSA',FR:'Les Rois d\'Ayamonte arrivent à VRSA',DE:'Könige aus Ayamonte kommen nach VRSA'},
    time:'11:30', loc:'Cais do Ferry', price:'🆓',
    desc:{PT:'Os Três Reis Magos de Ayamonte chegam de barco pelo Rio Guadiana para entregar presentes às crianças de VRSA. Uma tradição única de amizade luso-espanhola que une as duas margens do rio.',EN:'The Three Wise Men from Ayamonte arrive by boat across the Guadiana to deliver gifts to VRSA\'s children. A unique tradition of Luso-Spanish friendship uniting both riverbanks.',ES:'Los Tres Reyes Magos de Ayamonte llegan en barco por el Guadiana para entregar regalos a los niños. Una tradición única de amistad hispano-portuguesa.',FR:'Les Trois Rois Mages d\'Ayamonte arrivent en bateau sur le Guadiana pour offrir des cadeaux aux enfants. Une tradition unique d\'amitié luso-espagnole.',DE:'Die Heiligen Drei Könige kommen per Boot aus Ayamonte über den Guadiana, um Geschenke zu verteilen. Eine einzigartige luso-spanische Freundschaftstradition.'},
    lat:37.196981, lng:-7.413997
  },
  {
    id:22, emoji:'🏃', color:'#059669', month:12, day:6,
    title:{PT:'Corrida São Silvestre de VRSA',EN:'São Silvestre Race VRSA',ES:'Carrera San Silvestre de VRSA',FR:'Course São Silvestre de VRSA',DE:'São Silvestre Lauf VRSA'},
    time:'16:45', loc:'Praça Marquês de Pombal', price:'🆓',
    desc:{PT:'Corrida pedestre de São Silvestre pelas ruas históricas de VRSA. Categorias para todas as idades — uma das tradições desportivas mais queridas da cidade. Inscrição gratuita no local.',EN:'São Silvestre foot race through the historic streets of VRSA. Categories for all ages — one of the city\'s most beloved sporting traditions. Free registration on-site.',ES:'Carrera popular de San Silvestre por las calles históricas. Categorías para todas las edades. Inscripción gratuita en el lugar.',FR:'Course pédestre São Silvestre dans les rues historiques pour tous les âges. Inscription gratuite sur place.',DE:'São Silvestre Volkslauf durch die historischen Straßen für alle Altersgruppen. Kostenlose Anmeldung vor Ort.'},
    lat:37.19437, lng:-7.41558
  },
]

const MONTHS = {
  PT:['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  EN:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  ES:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  FR:['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
  DE:['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
}

function countdown(month, day) {
  const now  = new Date()
  const year = now.getFullYear()
  let target = new Date(year, month-1, day)
  if (target < now) target = new Date(year+1, month-1, day)
  const diff = Math.ceil((target - now) / 86400000)
  return diff
}

const TR = {
  PT:{ title:'Eventos', featured:'DESTAQUE', upcoming:'EM BREVE', past:'JÁ PASSOU', days:'dias', today:'HOJE', navigate:'Ver no Mapa', back:'← Voltar', reminder:'Lembrete', free:'Grátis', allYear:'Todos os Eventos', noUpcoming:'Sem eventos próximos', noUpcomingSub:'Volta em breve!' },
  EN:{ title:'Events',  featured:'FEATURED',  upcoming:'UPCOMING',  past:'PAST',       days:'days', today:'TODAY', navigate:'View on Map', back:'← Back', reminder:'Remind me', free:'Free', allYear:'All Events', noUpcoming:'No upcoming events', noUpcomingSub:'Check back soon!' },
  ES:{ title:'Eventos', featured:'DESTAQUE',   upcoming:'PRÓXIMO',   past:'YA PASÓ',    days:'días', today:'HOY',  navigate:'Ver en Mapa', back:'← Volver', reminder:'Recordatorio', free:'Gratis', allYear:'Todos los Eventos', noUpcoming:'Sin eventos próximos', noUpcomingSub:'¡Vuelve pronto!' },
  FR:{ title:'Événements',featured:'À LA UNE', upcoming:'À VENIR',   past:'PASSÉ',      days:'jours',today:"AUJOURD'HUI", navigate:'Voir sur la Carte', back:'← Retour', reminder:'Me le rappeler', free:'Gratuit', allYear:'Tous les Événements', noUpcoming:'Aucun événement à venir', noUpcomingSub:'Revenez bientôt!' },
  DE:{ title:'Events',  featured:'HIGHLIGHT',  upcoming:'BALD',      past:'VORBEI',     days:'Tage', today:'HEUTE', navigate:'Auf der Karte', back:'← Zurück', reminder:'Erinnerung', free:'Kostenlos', allYear:'Alle Events', noUpcoming:'Keine bevorstehenden Events', noUpcomingSub:'Bald zurückschauen!' },
}


// ── Collapsible past events ───────────────────────────────────
function PastEvents({ past, favs, toggleFav, setDetail, MONTHS, L, t }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <button onClick={() => setOpen(o => !o)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', background:'none', border:'none', cursor:'pointer', marginBottom: open ? 10 : 0 }}>
        <span style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase' }}>
          {L==='EN'?'PAST EVENTS':L==='FR'?'ÉVÉNEMENTS PASSÉS':L==='DE'?'VERGANGENE EVENTS':L==='ES'?'EVENTOS PASADOS':'EVENTOS PASSADOS'} ({past.length})
        </span>
        <span style={{ fontSize:16, color:'var(--ink-20)', transform: open ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}>▾</span>
      </button>
      {open && (
        <div className="card">
          {past.map((ev, i) => {
            const mon   = (MONTHS[L] || MONTHS.PT)[ev.month - 1]
            const isFav = favs.includes('ev_' + ev.id)
            return (
              <div key={ev.id} onClick={() => setDetail(ev)} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom: i < past.length-1 ? '1px solid var(--surface)' : 'none', cursor:'pointer', opacity:.5 }}>
                <div style={{ width:42, height:42, borderRadius:10, flexShrink:0, background:'var(--surface)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ fontSize:14, fontWeight:800, color:'var(--ink-40)', lineHeight:1 }}>{ev.day}</div>
                  <div style={{ fontSize:9, fontWeight:700, color:'var(--ink-20)', textTransform:'uppercase' }}>{mon}</div>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--ink-40)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ev.title[L] || ev.title.PT}</div>
                  <div style={{ fontSize:11, color:'var(--ink-20)', marginTop:1 }}>{ev.loc}</div>
                </div>
                <span style={{ fontSize:11, color:'var(--ink-20)' }}>✓</span>
                <button onClick={e => { e.stopPropagation(); toggleFav('ev_' + ev.id) }} style={{ background:'none', border:'none', fontSize:14, cursor:'pointer', padding:2, opacity:.6 }}>{isFav ? '❤️' : '🤍'}</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Events({ lang, favs, toggleFav, onNav }) {
  const L = lang || 'PT'
  const t = TR[L] || TR.PT
  const [detail, setDetail]  = useState(null)
  const [tick, setTick]      = useState(0)

  useEffect(() => { const iv = setInterval(() => setTick(x => x+1), 60000); return () => clearInterval(iv) }, [])

  const now     = new Date()
  const nowMon  = now.getMonth() + 1
  const nowDay  = now.getDate()

  function isToday(ev)  { return ev.month === nowMon && ev.day === nowDay }
  function isPast(ev)   { return ev.month < nowMon || (ev.month === nowMon && ev.day < nowDay) }
  function isUpcoming(ev){ return !isToday(ev) && !isPast(ev) }

  const sorted = [...EVENTS].sort((a,b) => a.month !== b.month ? a.month - b.month : a.day - b.day)
  const featured = sorted.find(e => isUpcoming(e) || isToday(e)) || sorted[0]

  // ── Detail view ──────────────────────────────────────────────
  if (detail) {
    const ev    = detail
    const isFav = favs.includes('ev_' + ev.id)
    const days  = countdown(ev.month, ev.day)
    const mon   = (MONTHS[L] || MONTHS.PT)[ev.month - 1]
    const past  = isPast(ev)
    const today = isToday(ev)

    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        {/* Hero */}
        <div style={{ height:200, background:`linear-gradient(135deg,${ev.color},${ev.color}cc)`, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'20px', position:'relative', flexShrink:0 }}>
          <button onClick={() => setDetail(null)} style={{ position:'absolute', top:'calc(60px + env(safe-area-inset-top,0px))', left:16, width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.3)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <button onClick={() => toggleFav('ev_' + ev.id)} style={{ position:'absolute', top:'calc(60px + env(safe-area-inset-top,0px))', right:16, width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.3)', border:'none', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav ? '❤️' : '🤍'}</button>
          <span style={{ fontSize:52, marginBottom:8 }}>{ev.emoji}</span>
          <div style={{ fontSize:20, fontWeight:800, color:'#fff', lineHeight:1.2 }}>{ev.title[L] || ev.title.PT}</div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'18px 20px 40px' }}>
          {/* Countdown / status */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:50, marginBottom:14,
            background: today ? '#FEF3C7' : past ? '#F3F4F6' : '#EFF6FF',
            color:      today ? '#B45309' : past ? '#6B7280' : '#1D4ED8',
          }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:.5 }}>
              {today ? t.today : past ? t.past : days <= 7 ? `${days} ${t.days}` : t.upcoming}
            </span>
          </div>

          {/* Chips */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
            {[
              { icon:'📅', text: ev.day + ' ' + mon },
              { icon:'🕐', text: ev.time },
              { icon:'📍', text: ev.loc },
              { icon:'🎫', text: ev.price === '🆓' ? t.free : ev.price },
            ].map((chip,i) => (
              <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:5, background:'var(--surface)', color:'var(--ink-70)', fontSize:12, fontWeight:600, padding:'5px 12px', borderRadius:50, border:'1px solid var(--border)' }}>
                {chip.icon} {chip.text}
              </span>
            ))}
          </div>

          <p style={{ fontSize:13, color:'var(--ink-40)', lineHeight:1.75, marginBottom:20 }}>
            {ev.desc[L] || ev.desc.PT}
          </p>

          <div style={{ display:'flex', gap:8 }}>
            <button
              onClick={() => { const c = ev.lat+','+ev.lng; window.open('https://www.google.com/maps/search/?api=1&query='+c,'_blank') }}
              style={{ flex:1, padding:'13px 0', background:ev.color, color:'#fff', border:'none', borderRadius:14, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
            >📍 {t.navigate}</button>
            <button
              onClick={() => toggleFav('ev_' + ev.id)}
              style={{ width:50, height:50, background: isFav ? '#FEE2E2' : 'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
            >{isFav ? '❤️' : '🤍'}</button>
          </div>
        </div>
      </div>
    )
  }

  // ── List view ────────────────────────────────────────────────
  return (
    <div className="page">
      {/* Header */}
      <div style={{ background:'linear-gradient(160deg,var(--navy) 0%,#162844 100%)', padding:'18px 20px 18px', paddingTop:'calc(62px + env(safe-area-inset-top,0px))' }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-.3px' }}>{t.title}</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,.38)', marginTop:2 }}>Vila Real de Santo António · Algarve</div>
      </div>

      <div style={{ padding:'14px 16px 40px' }}>

        {/* Featured card */}
        {featured && (
          <div
            onClick={() => setDetail(featured)}
            style={{ background:`linear-gradient(135deg,${featured.color},${featured.color}bb)`, borderRadius:20, padding:'18px', marginBottom:20, cursor:'pointer', boxShadow:`0 6px 28px ${featured.color}44`, position:'relative', overflow:'hidden' }}
          >
            <div style={{ position:'absolute', top:0, right:0, width:120, height:120, background:'rgba(255,255,255,.07)', borderRadius:'50%', transform:'translate(20px,-20px)' }} />
            <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,.6)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:10 }}>{t.featured}</div>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <span style={{ fontSize:42 }}>{featured.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:800, color:'#fff', lineHeight:1.25, marginBottom:4 }}>{featured.title[L] || featured.title.PT}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.65)' }}>{featured.day} {(MONTHS[L]||MONTHS.PT)[featured.month-1]} · {featured.time}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', marginTop:2 }}>{featured.loc}</div>
              </div>
              <div style={{ textAlign:'center', flexShrink:0 }}>
                <div style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1 }}>{countdown(featured.month, featured.day)}</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,.55)', fontWeight:700 }}>{t.days}</div>
              </div>
            </div>
          </div>
        )}

        {/* All events — split upcoming vs past */}
        {(() => {
          const upcoming = sorted.filter(e => !isPast(e))
          const past     = sorted.filter(e => isPast(e))
          return (
            <>
              {upcoming.length === 0 && (
                <div style={{ textAlign:'center', padding:'32px 20px', color:'var(--ink-20)' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>📅</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--ink-40)', marginBottom:6 }}>{t.noUpcoming}</div>
                  <div style={{ fontSize:12 }}>{t.noUpcomingSub}</div>
                </div>
              )}

              {upcoming.length > 0 && (
                <>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-20)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:10 }}>
                    {L==='EN'?'UPCOMING EVENTS':L==='FR'?'ÉVÉNEMENTS À VENIR':L==='DE'?'NÄCHSTE EVENTS':L==='ES'?'PRÓXIMOS EVENTOS':'PRÓXIMOS EVENTOS'}
                  </div>
                  <div className="card" style={{ marginBottom:16 }}>
                    {upcoming.map((ev, i) => {
                      const mon   = (MONTHS[L] || MONTHS.PT)[ev.month - 1]
                      const isFav = favs.includes('ev_' + ev.id)
                      const today = isToday(ev)
                      const days  = countdown(ev.month, ev.day)
                      return (
                        <div key={ev.id} onClick={() => setDetail(ev)} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom: i < upcoming.length-1 ? '1px solid var(--surface)' : 'none', cursor:'pointer' }}>
                          <div style={{ width:46, height:46, borderRadius:12, flexShrink:0, background:`${ev.color}18`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', border:`1px solid ${ev.color}30` }}>
                            <div style={{ fontSize:15, fontWeight:900, color:ev.color, lineHeight:1 }}>{ev.day}</div>
                            <div style={{ fontSize:9, fontWeight:700, color:ev.color, textTransform:'uppercase' }}>{mon}</div>
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ev.title[L] || ev.title.PT}</div>
                            <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:2 }}>{ev.loc} · {ev.time}</div>
                          </div>
                          <div style={{ textAlign:'right', flexShrink:0 }}>
                            {today ? (
                              <span style={{ background:'#FEF3C7', color:'#B45309', fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:50 }}>{t.today}</span>
                            ) : days <= 30 ? (
                              <div><div style={{ fontSize:15, fontWeight:900, color:ev.color }}>{days}</div><div style={{ fontSize:9, color:'var(--ink-20)', fontWeight:600 }}>{t.days}</div></div>
                            ) : <span style={{ fontSize:18 }}>{ev.emoji}</span>}
                          </div>
                          <button onClick={e => { e.stopPropagation(); toggleFav('ev_' + ev.id) }} style={{ background:'none', border:'none', fontSize:16, cursor:'pointer', padding:2, flexShrink:0 }}>{isFav ? '❤️' : '🤍'}</button>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {past.length > 0 && (
                <PastEvents past={past} favs={favs} toggleFav={toggleFav} setDetail={setDetail} isPast={isPast} MONTHS={MONTHS} L={L} t={t} />
              )}
            </>
          )
        })()}
      </div>
    </div>
  )
}