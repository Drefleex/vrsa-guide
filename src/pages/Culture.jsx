import { useState } from 'react'
import { getInitials, getAvatarColor } from '../utils/avatarUtils'



const MONUMENTS = [
  {
    id:1, emoji:'🏛️',
    name:'Praça Marquês de Pombal',
    lat:37.19437, lng:-7.41558,
    photo:'/images/praa_marques_de_pombal.webp',
    year:'1776',
    tag:{PT:'Praça · Pombalino',EN:'Square · Pombaline',ES:'Plaza · Pombalino',FR:'Place · Pombalin',DE:'Platz · Pombalinisch'},
    desc:{
      PT:'O coração de VRSA. Desenhada pelo Marquês de Pombal em 1776, é uma das mais belas praças pombalinas de Portugal. Rodeada de laranjas e com o busto do Marquês ao centro, é o ponto de encontro da cidade. O pavimento em calçada portuguesa cria um padrão radial único.',
      EN:'The heart of VRSA. Designed by the Marquis of Pombal in 1776, it is one of the most beautiful Pombaline squares in Portugal. Surrounded by orange trees and with the Marquis\' bust at the centre, it is the city\'s meeting point.',
      ES:'El corazón de VRSA. Diseñada por el Marqués de Pombal en 1776, es una de las más bellas plazas pombalinas de Portugal.',
      FR:'Le cœur de VRSA. Conçue par le Marquis de Pombal en 1776, c\'est l\'une des plus belles places pombalines du Portugal.',
      DE:'Das Herz von VRSA. 1776 vom Marquis von Pombal entworfen, ist es einer der schönsten pombalinischen Plätze Portugals.'
    }
  },
  {
    id:2, emoji:'🔦',
    name:'Farol de Vila Real',
    lat:37.187156, lng:-7.416435,
    photo:'/images/farolvrsa.webp',
    year:'1923',
    tag:{PT:'Farol · Património',EN:'Lighthouse · Heritage',ES:'Faro · Patrimonio',FR:'Phare · Patrimoine',DE:'Leuchtturm · Erbe'},
    desc:{
      PT:'Farol construído em 1923, guia os navegantes na foz do Guadiana. Com 22 metros de altura, oferece uma vista deslumbrante sobre o oceano e a costa algarvia. Símbolo da cidade e ponto fotográfico obrigatório.',
      EN:'Lighthouse built in 1923, guiding sailors at the mouth of the Guadiana. At 22 metres tall, it offers a stunning view over the ocean and the Algarve coast.',
      ES:'Faro construido en 1923, guía a los navegantes en la desembocadura del Guadiana.',
      FR:'Phare construit en 1923, guidant les navigateurs à l\'embouchure du Guadiana.',
      DE:'1923 erbauter Leuchtturm, der Seefahrer an der Guadiana-Mündung führt.'
    }
  },
  {
    id:3, emoji:'⛪',
    name:'Igreja Matriz de VRSA',
    lat:37.195027, lng:-7.415957,
    photo:'/images/igreja_nossa_senhora.webp',
    year:'1783',
    tag:{PT:'Igreja · Barroco',EN:'Church · Baroque',ES:'Iglesia · Barroco',FR:'Église · Baroque',DE:'Kirche · Barock'},
    desc:{
      PT:'Construída em 1783, a Igreja Paroquial de VRSA é um belo exemplo da arquitectura religiosa pombalina. O interior revela um retábulo dourado deslumbrante e painéis de azulejos que contam a história da cidade.',
      EN:'Built in 1783, the Parish Church of VRSA is a beautiful example of Pombaline religious architecture. The interior reveals a stunning golden altarpiece and azulejo panels telling the city\'s history.',
      ES:'Construida en 1783, es un bello ejemplo de arquitectura religiosa pombalina con un retablo dorado.',
      FR:'Construite en 1783, c\'est un bel exemple d\'architecture religieuse pombaline avec un retable doré.',
      DE:'1783 erbaut, ein schönes Beispiel pombalinischer Sakralarchitektur mit einem goldenen Altarbild.'
    }
  },
  {
    id:4, emoji:'🏛️',
    name:'Museu de VRSA',
    lat:37.197724, lng:-7.42709,
    photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Vila%20Real%20de%20Santo%20António%20-%20Portugal%20(48131457857).jpg',
    year:'1992',
    tag:{PT:'Museu · História',EN:'Museum · History',ES:'Museo · Historia',FR:'Musée · Histoire',DE:'Museum · Geschichte'},
    desc:{
      PT:'O Museu Municipal alberga colecções de arqueologia, etnografia e arte local. Destaque para a sala dedicada à fundação pombalina e a colecção de azulejos históricos. Entrada gratuita aos domingos.',
      EN:'The Municipal Museum houses collections of archaeology, ethnography and local art. Highlights include the room dedicated to the Pombaline foundation and the historic azulejo collection. Free entry on Sundays.',
      ES:'El Museo Municipal alberga colecciones de arqueología, etnografía y arte local. Entrada gratuita los domingos.',
      FR:'Le Musée Municipal abrite des collections d\'archéologie, d\'ethnographie et d\'art local. Entrée gratuite le dimanche.',
      DE:'Das Stadtmuseum beherbergt Sammlungen zu Archäologie, Ethnografie und lokaler Kunst. Sonntags freier Eintritt.'
    }
  },
  {
    id:5, emoji:'🌊',
    name:'Esporão de VRSA',
    lat:37.16507, lng:-7.400837,
    photo:'/images/por_do_sol_sapal.webp',
    year:'Séc. XIX',
    tag:{PT:'Monumento · Natureza',EN:'Monument · Nature',ES:'Monumento · Naturaleza',FR:'Monument · Nature',DE:'Denkmal · Natur'},
    desc:{
      PT:'O Esporão marca a ponta sul de VRSA onde o Rio Guadiana encontra o Oceano Atlântico. É um dos pontos mais fotogénicos da cidade, especialmente ao pôr do sol. Local ideal para observar barcos e aves marinhas.',
      EN:'The Esporão marks the southern tip of VRSA where the Guadiana River meets the Atlantic Ocean. It is one of the most photogenic spots in the city, especially at sunset.',
      ES:'El Esporão marca la punta sur donde el río Guadiana se encuentra con el Océano Atlántico.',
      FR:'L\'Esporão marque la pointe sud où le Guadiana rejoint l\'Atlantique. Un des endroits les plus photographiés.',
      DE:'Das Esporão markiert die Südspitze, wo der Guadiana auf den Atlantik trifft. Ideal für Sonnenuntergänge.'
    }
  },
  {
    id:6, emoji:'🎨',
    name:'Galeria Arte A.V. Cardoso',
    lat:37.195762, lng:-7.41589,
    photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Vila%20Real%20de%20Santo%20António%20-%20Portugal%20(48131457857).jpg',
    year:'2001',
    tag:{PT:'Galeria · Arte',EN:'Gallery · Art',ES:'Galería · Arte',FR:'Galerie · Art',DE:'Galerie · Kunst'},
    desc:{
      PT:'Galeria de arte contemporânea com exposições permanentes e temporárias de artistas algarvios e nacionais. Entrada gratuita. Programa cultural regular com vernissages e workshops de cerâmica.',
      EN:'Contemporary art gallery with permanent and temporary exhibitions by Algarve and national artists. Free entry. Regular cultural programme with vernissages and ceramics workshops.',
      ES:'Galería de arte contemporáneo con exposiciones de artistas del Algarve y nacionales. Entrada gratuita.',
      FR:'Galerie d\'art contemporain avec expositions d\'artistes de l\'Algarve. Entrée gratuite.',
      DE:'Zeitgenössische Kunstgalerie mit Ausstellungen algarvischer und nationaler Künstler. Freier Eintritt.'
    }
  },
  {
    id:7, emoji:'🎄',
    name:'Presépio Gigante',
    lat:37.194467, lng:-7.416426,
    photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Vila%20Real%20de%20Santo%20António%20-%20Portugal%20(48131457857).jpg',
    year:'2003',
    tag:{PT:'Tradição · Natal',EN:'Tradition · Christmas',ES:'Tradición · Navidad',FR:'Tradition · Noël',DE:'Tradition · Weihnachten'},
    desc:{
      PT:'O Presépio Gigante de VRSA é um dos maiores de Portugal, com mais de 200 figuras artesanais de grande escala. Montado anualmente desde 2003, atrai visitantes de todo o país de Dezembro a Janeiro.',
      EN:'The Giant Nativity Scene of VRSA is one of the largest in Portugal, with over 200 large-scale handcrafted figures. Mounted annually since 2003, it attracts visitors from across the country from December to January.',
      ES:'El Belén Gigante de VRSA es uno de los más grandes de Portugal con más de 200 figuras artesanales.',
      FR:'La Grande Crèche de VRSA est l\'une des plus grandes du Portugal avec plus de 200 figurines artisanales.',
      DE:'Die Riesenkrippe von VRSA ist eine der größten Portugals mit über 200 handgefertigten Figuren.'
    }
  },
  {
    id:8, emoji:'🦩',
    name:'Reserva Natural do Sapal',
    lat:37.21028, lng:-7.458453,
    photo:'/images/sapal.webp',
    year:'1978',
    tag:{PT:'Natureza · Reserva',EN:'Nature · Reserve',ES:'Naturaleza · Reserva',FR:'Nature · Réserve',DE:'Natur · Reservat'},
    desc:{
      PT:'Reserva Natural classificada desde 1978, o Sapal de Castro Marim e VRSA é um dos mais importantes habitats para aves migratórias do sul de Portugal. Com mais de 200 espécies registadas, incluindo flamingos e cegonhas.',
      EN:'A classified Nature Reserve since 1978, the Castro Marim and VRSA Marshes are one of the most important habitats for migratory birds in southern Portugal. With over 200 recorded species including flamingos and storks.',
      ES:'Reserva Natural desde 1978, hábitat para aves migratorias con más de 200 especies registradas.',
      FR:'Réserve Naturelle depuis 1978, habitat pour oiseaux migrateurs avec plus de 200 espèces.',
      DE:'Seit 1978 Naturreservat, Lebensraum für Zugvögel mit über 200 registrierten Arten.'
    }
  },
]

const TR = {
  PT:{ title:'Cultura & Monumentos', sub:'Património de Vila Real de Santo António', back:'← Voltar', year:'Ano', navigate:'Navegar', history:'História', openMaps:'Ver no Google Maps', freeEntry:'Entrada livre', hours:'Aberto diariamente', fav:'Favorito' },
  EN:{ title:'Culture & Monuments', sub:'Heritage of Vila Real de Santo António', back:'← Back', year:'Year', navigate:'Navigate', history:'History', openMaps:'View on Google Maps', freeEntry:'Free entry', hours:'Open daily', fav:'Favourite' },
  ES:{ title:'Cultura & Monumentos', sub:'Patrimonio de Vila Real de Santo António', back:'← Volver', year:'Año', navigate:'Navegar', history:'Historia', openMaps:'Ver en Google Maps', freeEntry:'Entrada libre', hours:'Abierto diariamente', fav:'Favorito' },
  FR:{ title:'Culture & Monuments', sub:'Patrimoine de Vila Real de Santo António', back:'← Retour', year:'Année', navigate:'Naviguer', history:'Histoire', openMaps:'Voir sur Google Maps', freeEntry:'Entrée libre', hours:'Ouvert tous les jours', fav:'Favori' },
  DE:{ title:'Kultur & Denkmäler', sub:'Kulturerbe von Vila Real de Santo António', back:'← Zurück', year:'Jahr', navigate:'Navigieren', history:'Geschichte', openMaps:'In Google Maps anzeigen', freeEntry:'Freier Eintritt', hours:'Täglich geöffnet', fav:'Favorit' },
}

export default function Culture({ lang, favs, toggleFav, onNav }) {
  const L = lang || 'PT'
  const t = TR[L] || TR.PT
  const [detail, setDetail]   = useState(null)

  if (detail) {
    const isFav = favs.includes(detail.id)
    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        <div style={{ background:getAvatarColor(detail.name), padding:'20px 18px 24px', paddingTop:'calc(64px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <button aria-label={t.back} onClick={() => setDetail(null)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
            <button aria-label={t.fav} onClick={() => toggleFav(detail.id)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav ? '❤️' : '🤍'}</button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:60, height:60, borderRadius:14, background:'rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:28 }}>{detail.emoji}</span>
            </div>
            <div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>{detail.tag[L]||detail.tag.PT} · {detail.year}</div>
              <div style={{ fontSize:20, fontWeight:700, color:'#fff', lineHeight:1.2 }}>{detail.name}</div>
            </div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 40px' }}>
          <p style={{ fontSize:14, color:'var(--ink-40)', lineHeight:1.8, marginBottom:20 }}>{detail.desc[L]||detail.desc.PT}</p>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${detail.lat},${detail.lng}`,'_blank')} style={{ flex:1, padding:'13px 0', background:'var(--navy)', color:'#fff', border:'none', borderRadius:14, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>📍 {t.navigate}</button>
            <button aria-label={t.fav} onClick={() => toggleFav(detail.id)} style={{ width:50, height:50, background: isFav?'#FEE2E2':'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav?'❤️':'🤍'}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ display:'flex', flexDirection:'column' }}>
      <div style={{ background:'linear-gradient(160deg,#2D1B69 0%,#1E1145 100%)', padding:'18px 20px 18px', paddingTop:'calc(62px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-.3px' }}>{t.title}</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,.38)', marginTop:2 }}>{t.sub}</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px 40px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {MONUMENTS.map(m => {
            const isFav = favs.includes(m.id)
                    return (
              <div key={m.id} onClick={() => setDetail(m)} className="card" style={{ cursor:'pointer', overflow:'hidden' }}>
                <div style={{ height:90, background:getAvatarColor(m.name), display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ fontSize:32 }}>{m.emoji}</span>
                    <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.7)', background:'rgba(255,255,255,.15)', padding:'2px 8px', borderRadius:50 }}>{m.tag[L]||m.tag.PT}</span>
                  </div>
                  <button aria-label={t.fav} onClick={e => { e.stopPropagation(); toggleFav(m.id) }} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav?'❤️':'🤍'}</button>
                </div>
                <div style={{ padding:'12px 14px 14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:18 }}>{m.emoji}</span>
                    <div style={{ fontSize:15, fontWeight:800, color:'var(--ink)' }}>{m.name}</div>
                  </div>
                  <div style={{ fontSize:12, color:'var(--ink-40)', lineHeight:1.55 }}>{(m.desc[L]||m.desc.PT).substring(0,100)}...</div>
                  <div style={{ fontSize:11, color:'var(--ink-20)', marginTop:6, fontWeight:600 }}>📅 {t.year}: {m.year}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}