import React, { useState, useEffect } from 'react'
import { Sun, Users, UtensilsCrossed, Landmark, Sunset, Leaf, MapPin as MapPinIcon } from 'lucide-react'
import { tr } from '../utils/i18n'
import { FERRY_TIMES, TRAIN_TIMES, toMin } from '../data/transport'

const ROUTES = [
  { id:1, Icon:Sun, color:'#1D4ED8',
    title:{PT:'Um Dia em VRSA',EN:'A Day in VRSA',ES:'Un Día en VRSA',FR:'Une Journée à VRSA',DE:'Ein Tag in VRSA'},
    dur:{PT:'6 paradas · ~10h',EN:'6 stops · ~10h',ES:'6 paradas · ~10h',FR:'6 étapes · ~10h',DE:'6 Stops · ~10h'},
    steps:[
      {n:{PT:'Praça Marquês de Pombal',EN:'Praça Marquês de Pombal',ES:'Plaza Marqués de Pombal',FR:'Praça Marquês de Pombal',DE:'Praça Marquês de Pombal'},lat:37.19437,lng:-7.41558,tip:{PT:'O coração da cidade. Admira o obelisco pombalino ao nascer do sol.',EN:'The heart of the city. Admire the obelisk at sunrise.',ES:'El corazón de la ciudad.',FR:'Le cœur de la ville.',DE:'Das Herz der Stadt.'}},
      {n:{PT:'Farol de VRSA',EN:'VRSA Lighthouse',ES:'Faro de VRSA',FR:'Phare de VRSA',DE:'Leuchtturm VRSA'},lat:37.187156,lng:-7.416435,tip:{PT:'Vista panorâmica do Oceano Atlântico. Vai de manhã cedo.',EN:'Panoramic ocean view. Go early morning.',ES:'Vista panorámica del Atlántico.',FR:'Vue panoramique sur l’Atlantique.',DE:'Panoramablick auf den Atlantik.'}},
      {n:{PT:'Praia de VRSA',EN:'VRSA Beach',ES:'Playa de VRSA',FR:'Plage de VRSA',DE:'Strand von VRSA'},lat:37.173516,lng:-7.422291,tip:{PT:'Bandeira Azul. Ideal para banho a meio da manhã.',EN:'Blue Flag beach. Ideal for a mid-morning swim.',ES:'Bandera Azul.',FR:'Pavillon Bleu.',DE:'Blaue Flagge.'}},
      {n:{PT:'Restaurante Cuca',EN:'Restaurante Cuca',ES:'Restaurante Cuca',FR:'Restaurante Cuca',DE:'Restaurante Cuca'},lat:37.194446,lng:-7.416193,tip:{PT:'O melhor peixe fresco de VRSA. Reserva com antecedência: +351 281 403 370.',EN:'Best fresh fish in VRSA. Book ahead.',ES:'El mejor pescado fresco.',FR:'Meilleur poisson frais de VRSA.',DE:'Bester Frischfisch in VRSA.'}},
      {n:{PT:'Cais do Ferry',EN:'Ferry Pier',ES:'Muelle del Ferry',FR:'Embarcadère du Ferry',DE:'Fähranleger'},lat:37.196981,lng:-7.413997,tip:{PT:'Ferry para Ayamonte às 15:00. €2,50. Passaporte obrigatório.',EN:'Ferry to Ayamonte at 15:00. €2.50. Passport needed.',ES:'Ferry a Ayamonte a las 15:00.',FR:'Ferry vers Ayamonte à 15h.',DE:'Fähre nach Ayamonte um 15:00.'}},
      {n:{PT:'Jardim Municipal',EN:'Municipal Garden',ES:'Jardín Municipal',FR:'Jardin Municipal',DE:'Stadtgarten'},lat:37.1911,lng:-7.412957,tip:{PT:'Relaxa no jardim ao fim do dia. Laranjas históricas.',EN:'Relax in the garden at end of day.',ES:'Relájate al final del día.',FR:'Détends-toi dans le jardin en fin de journée.',DE:'Am Abend im Garten entspannen.'}},
    ]
  },
  { id:2, Icon:Users, color:'#059669',
    title:{PT:'VRSA com Crianças',EN:'VRSA with Kids',ES:'VRSA con Niños',FR:'VRSA en Famille',DE:'VRSA mit Kindern'},
    dur:{PT:'5 paradas · ~8h',EN:'5 stops · ~8h',ES:'5 paradas · ~8h',FR:'5 étapes · ~8h',DE:'5 Stops · ~8h'},
    steps:[
      {n:{PT:'Jardim Municipal',EN:'Municipal Garden',ES:'Jardín Municipal',FR:'Jardin Municipal',DE:'Stadtgarten'},lat:37.1911,lng:-7.412957,tip:{PT:'Parque infantil e espaço verde. Boa primeira paragem para as crianças.',EN:'Playground and green space. Great first stop for kids.',ES:'Parque infantil.',FR:'Aire de jeux pour enfants.',DE:'Spielplatz für Kinder.'}},
      {n:{PT:'Praia de Monte Gordo',EN:'Monte Gordo Beach',ES:'Playa Monte Gordo',FR:'Plage de Monte Gordo',DE:'Strand Monte Gordo'},lat:37.177989,lng:-7.449761,tip:{PT:'Águas quentes e calmas, ideais para crianças. Bar de praia disponível.',EN:'Warm, calm waters ideal for children. Beach bar available.',ES:'Aguas cálidas y tranquilas para niños.',FR:'Eaux chaudes et calmes pour les enfants.',DE:'Warmes, ruhiges Wasser für Kinder.'}},
      {n:{PT:'Praça Marquês de Pombal',EN:'Praça Marquês de Pombal',ES:'Plaza Marqués de Pombal',FR:'Praça Marquês de Pombal',DE:'Praça Marquês de Pombal'},lat:37.19437,lng:-7.41558,tip:{PT:'Gelados na Gelataria Klassik mesmo ao lado. As crianças adoram!',EN:'Ice cream at nearby Gelataria Klassik. Kids love it!',ES:'Helados en Gelataria Klassik al lado.',FR:'Glaces à la Gelataria Klassik à côté.',DE:'Eis bei der Gelataria Klassik nebenan.'}},
      {n:{PT:'Ferry para Ayamonte',EN:'Ferry to Ayamonte',ES:'Ferry a Ayamonte',FR:'Ferry vers Ayamonte',DE:'Fähre nach Ayamonte'},lat:37.196981,lng:-7.413997,tip:{PT:'As crianças adoram a travessia de barco! 15 minutos sobre o Guadiana.',EN:'Kids love the boat crossing! 15 minutes over the Guadiana.',ES:'Los niños adoran el viaje en barco.',FR:'Les enfants adorent la traversée en bateau.',DE:'Kinder lieben die Bootsfahrt!'}},
      {n:{PT:'Praia Verde',EN:'Praia Verde',ES:'Praia Verde',FR:'Praia Verde',DE:'Praia Verde'},lat:37.170101,lng:-7.49767,tip:{PT:'Pinhal atrás da praia com sombra natural. Perfeito para picnic.',EN:'Pine forest behind beach with natural shade. Perfect for a picnic.',ES:'Pinar con sombra natural. Perfecto para picnic.',FR:'Forêt de pins avec ombre naturelle.',DE:'Kiefernwald mit natürlichem Schatten.'}},
    ]
  },
  { id:3, Icon:UtensilsCrossed, color:'#D97706',
    title:{PT:'Rota Gastronómica',EN:'Gastronomy Route',ES:'Ruta Gastronómica',FR:'Route Gastronomique',DE:'Gastronomie-Route'},
    dur:{PT:'5 paradas · ~6h',EN:'5 stops · ~6h',ES:'5 paradas · ~6h',FR:'5 étapes · ~6h',DE:'5 Stops · ~6h'},
    steps:[
      {n:{PT:'Mercado Municipal',EN:'Municipal Market',ES:'Mercado Municipal',FR:'Marché Municipal',DE:'Stadtmarkt'},lat:37.19405,lng:-7.421662,tip:{PT:'Chega antes das 9h para os melhores peixes frescos do dia.',EN:'Arrive before 9am for the best fresh fish of the day.',ES:'Llega antes de las 9h para el mejor pescado fresco.',FR:'Arrivez avant 9h pour le meilleur poisson frais.',DE:'Vor 9 Uhr für den besten Frischfisch.'}},
      {n:{PT:'Restaurante Cuca',EN:'Restaurante Cuca',ES:'Restaurante Cuca',FR:'Restaurante Cuca',DE:'Restaurante Cuca'},lat:37.194446,lng:-7.416193,tip:{PT:'Peixe grelhado e atum fresco. Almoço: 12h–15h. Tel: 281 403 370.',EN:'Grilled fish and fresh tuna. Lunch: 12–3pm.',ES:'Pescado a la brasa y atún fresco.',FR:'Poisson grillé et thon frais.',DE:'Gegrillter Fisch und frischer Thunfisch.'}},
      {n:{PT:'Assoc. Naval do Guadiana',EN:'Naval Association',ES:'Asoc. Naval del Guadiana',FR:'Assoc. Navale du Guadiana',DE:'Naval Association Guadiana'},lat:37.192943,lng:-7.413413,tip:{PT:'Cataplana e arroz de marisco com vista para o rio. Reservar: 281 513 038.',EN:'Seafood cataplana with river views. Book: +351 281 513 038.',ES:'Cataplana de marisco con vista al río.',FR:'Cataplana de fruits de mer avec vue sur le fleuve.',DE:'Meeresfrüchte-Cataplana mit Flussblick.'}},
      {n:{PT:'Pastelaria Andrade',EN:'Pastelaria Andrade',ES:'Pastelaria Andrade',FR:'Pastelaria Andrade',DE:'Pastelaria Andrade'},lat:37.188271,lng:-7.44519,tip:{PT:'Pastel de nata e bolo de amêndoa algarvio. Café de qualidade.',EN:'Pastel de nata and almond cake. Quality coffee.',ES:'Pastel de nata y tarta de almendra.',FR:'Pastel de nata et gâteau aux amandes.',DE:'Pastel de nata und Mandelkuchen.'}},
      {n:{PT:'Ferry + Tapas em Ayamonte',EN:'Ferry + Tapas in Ayamonte',ES:'Ferry + Tapas en Ayamonte',FR:'Ferry + Tapas à Ayamonte',DE:'Fähre + Tapas in Ayamonte'},lat:37.196981,lng:-7.413997,tip:{PT:'Tapas na Calle Palma: gambas al ajillo €2, puntillitas €2,50. Último ferry: 19h30.',EN:'Tapas on Calle Palma. Last ferry back: 19:30.',ES:'Tapas en Calle Palma. Último ferry: 19:30.',FR:'Tapas rue Palma. Dernier ferry: 19h30.',DE:'Tapas in der Calle Palma. Letztes Fähre: 19:30.'}},
    ]
  },
  { id:4, Icon:Landmark, color:'#7C3AED',
    title:{PT:'Rota Histórica Pombalina',EN:'Pombaline Historic Route',ES:'Ruta Histórica Pombalina',FR:'Route Historique Pombaline',DE:'Pombalinische Historische Route'},
    dur:{PT:'4 paradas · ~3h',EN:'4 stops · ~3h',ES:'4 paradas · ~3h',FR:'4 étapes · ~3h',DE:'4 Stops · ~3h'},
    steps:[
      {n:{PT:'Praça Marquês de Pombal',EN:'Praça Marquês de Pombal',ES:'Plaza Marqués de Pombal',FR:'Praça Marquês de Pombal',DE:'Praça Marquês de Pombal'},lat:37.19437,lng:-7.41558,tip:{PT:'Construída em 1776 em apenas 5 meses. O obelisco central é único em Portugal.',EN:'Built in 1776 in just 5 months. The central obelisk is unique in Portugal.',ES:'Construida en 1776 en solo 5 meses.',FR:'Construite en 1776 en seulement 5 mois.',DE:'1776 in nur 5 Monaten erbaut.'}},
      {n:{PT:'Igreja Matriz de VRSA',EN:'VRSA Parish Church',ES:'Iglesia Parroquial de VRSA',FR:'Église Paroissiale de VRSA',DE:'Pfarrkirche von VRSA'},lat:37.195027,lng:-7.415957,tip:{PT:'Retábulo dourado de 1783. Entra — é gratuito e surpreendente.',EN:'Golden altarpiece from 1783. Enter — free and surprising.',ES:'Retablo dorado de 1783. Entrada gratuita.',FR:'Retable doré de 1783. Entrée gratuite.',DE:'Goldenes Altarbild von 1783. Eintritt frei.'}},
      {n:{PT:'Câmara Municipal de VRSA',EN:'VRSA Town Hall',ES:'Ayuntamiento de VRSA',FR:'Mairie de VRSA',DE:'Rathaus von VRSA'},lat:37.194388,lng:-7.416418,tip:{PT:'Edifício pombalino original de 1776. Fachada com azulejos históricos.',EN:'Original Pombaline building from 1776. Historic tile facade.',ES:'Edificio pombalino original de 1776.',FR:'Bâtiment pombalin original de 1776.',DE:'Originales pombalinisches Gebäude von 1776.'}},
      {n:{PT:'Museu de VRSA',EN:'VRSA Museum',ES:'Museo de VRSA',FR:'Musée de VRSA',DE:'Museum von VRSA'},lat:37.197724,lng:-7.42709,tip:{PT:'Colecção arqueológica e história da fundação pombalina. Grátis ao domingo.',EN:'Archaeological collection and Pombaline founding history. Free on Sundays.',ES:'Colección arqueológica. Gratis el domingo.',FR:'Collection archéologique. Gratuit le dimanche.',DE:'Archäologische Sammlung. Sonntags kostenlos.'}},
    ]
  },
  { id:5, Icon:Sunset, color:'#DC2626',
    title:{PT:'Rota ao Pôr do Sol',EN:'Sunset Route',ES:'Ruta al Atardecer',FR:'Route du Coucher du Soleil',DE:'Sonnenuntergangs-Route'},
    dur:{PT:'4 paradas · ~4h',EN:'4 stops · ~4h',ES:'4 paradas · ~4h',FR:'4 étapes · ~4h',DE:'4 Stops · ~4h'},
    steps:[
      {n:{PT:'Farol de VRSA',EN:'VRSA Lighthouse',ES:'Faro de VRSA',FR:'Phare de VRSA',DE:'Leuchtturm VRSA'},lat:37.187156,lng:-7.416435,tip:{PT:'Começa aqui às 17h. Vista 360° do oceano e do rio.',EN:'Start here at 5pm. 360° view of ocean and river.',ES:'Empieza aquí a las 17h. Vista 360°.',FR:'Commencez ici à 17h. Vue à 360°.',DE:'Hier um 17 Uhr beginnen. 360° Aussicht.'}},
      {n:{PT:'Esporão de VRSA',EN:'VRSA Esporão',ES:'Esporón de VRSA',FR:'Esporão de VRSA',DE:'VRSA Esporão'},lat:37.16507,lng:-7.400837,tip:{PT:'A ponta sul onde o Guadiana encontra o Atlântico. Pôr do sol espectacular.',EN:'Southern tip where Guadiana meets the Atlantic. Spectacular sunset.',ES:'La punta sur donde el Guadiana encuentra el Atlántico.',FR:'La pointe sud où le Guadiana rencontre l’Atlantique.',DE:'Südspitze, wo Guadiana und Atlantik zusammentreffen.'}},
      {n:{PT:'Miradouro do Guadiana',EN:'Guadiana Viewpoint',ES:'Mirador del Guadiana',FR:'Belvédère du Guadiana',DE:'Guadiana Aussichtspunkt'},lat:37.196981,lng:-7.413997,tip:{PT:'O melhor ponto para fotografar o rio e Ayamonte ao entardecer.',EN:'Best spot to photograph the river and Ayamonte at dusk.',ES:'Mejor punto para fotografiar el río al atardecer.',FR:'Meilleur endroit pour photographier le fleuve au coucher.',DE:'Bester Fotopunkt für Fluss und Ayamonte bei Dämmerung.'}},
      {n:{PT:'Cais do Ferry — Pôr do Sol',EN:'Ferry Pier — Sunset',ES:'Muelle del Ferry — Atardecer',FR:'Embarcadère — Coucher du Soleil',DE:'Fähranleger — Sonnenuntergang'},lat:37.196981,lng:-7.413997,tip:{PT:'Senta na marginal com uma bebida e vê o sol desaparecer atrás de Ayamonte.',EN:'Sit on the waterfront with a drink and watch the sun set behind Ayamonte.',ES:'Siéntate en el paseo marítimo y contempla el atardecer.',FR:'Assis sur le bord de l’eau avec un verre pour regarder le coucher.',DE:'Am Ufer sitzen und den Sonnenuntergang hinter Ayamonte beobachten.'}},
    ]
  },
  { id:6, Icon:Leaf, color:'#0E7490',
    title:{PT:'Rota de Natureza',EN:'Nature Route',ES:'Ruta de Naturaleza',FR:'Route Nature',DE:'Natur-Route'},
    dur:{PT:'4 paradas · ~5h',EN:'4 stops · ~5h',ES:'4 paradas · ~5h',FR:'4 étapes · ~5h',DE:'4 Stops · ~5h'},
    steps:[
      {n:{PT:'Reserva Natural do Sapal',EN:'Sapal Nature Reserve',ES:'Reserva Natural del Sapal',FR:'Réserve Naturelle du Sapal',DE:'Naturreservat Sapal'},lat:37.21028,lng:-7.458453,tip:{PT:'Vai de manhã cedo para ver flamingos e garças. Leva binóculos.',EN:'Go early morning to see flamingos and herons. Bring binoculars.',ES:'Ve de mañana para ver flamencos y garzas.',FR:'Allez tôt le matin pour voir flamants roses et hérons.',DE:'Früh morgens für Flamingos und Reiher. Fernglas mitbringen.'}},
      {n:{PT:'Salinas do Sapal',EN:'Sapal Salt Pans',ES:'Salinas del Sapal',FR:'Marais Salants du Sapal',DE:'Sapal-Salinen'},lat:37.199253,lng:-7.428088,tip:{PT:'Salinas históricas com vista para o Guadiana. Zona de observação de aves.',EN:'Historic salt pans with Guadiana views. Bird watching area.',ES:'Salinas históricas con vistas al Guadiana.',FR:'Salines historiques avec vue sur le Guadiana.',DE:'Historische Salinen mit Blick auf den Guadiana.'}},
      {n:{PT:'Mata Nacional das Dunas',EN:'National Dune Forest',ES:'Bosque Nacional de las Dunas',FR:'Forêt Nationale des Dunes',DE:'Nationales Dünenwald'},lat:37.185467,lng:-7.436929,tip:{PT:'Pinheiros centenários. Trilho pedonal de 3km. Óptimo para ciclismo.',EN:'Century-old pines. 3km walking trail. Great for cycling.',ES:'Pinos centenarios. Sendero de 3km.',FR:'Pins centenaires. Sentier de 3km.',DE:'Jahrhundertealte Kiefern. 3km Wanderweg.'}},
      {n:{PT:'Praia Verde',EN:'Praia Verde',ES:'Praia Verde',FR:'Praia Verde',DE:'Praia Verde'},lat:37.170101,lng:-7.49767,tip:{PT:'A praia mais selvagem e tranquila do concelho. Pinheiros até à areia.',EN:'The most wild and peaceful beach in the municipality. Pines to the sand.',ES:'La playa más salvaje y tranquila del municipio.',FR:'La plage la plus sauvage et tranquille de la commune.',DE:'Der wildeste und ruhigste Strand der Gemeinde.'}},
    ]
  },
]

// ─── Inline SVG icons (no dependencies) ─────────────────────
const SVGS = {
  map:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  food:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/></svg>,
  waves:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>,
  landmark:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  hotel:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>,
  bus:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M7 15h.01"/><path d="M17 15h.01"/><path d="M6 19v2"/><path d="M18 19v2"/></svg>,
  calendar:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  shopping:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  heart:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  alert:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
}

const QA = [
  { page:'map',         svg:'map',      color:'#1D4ED8', bg:'#EFF6FF', label:{PT:'Explorar',  EN:'Explore',  ES:'Explorar',  FR:'Explorer', DE:'Erkunden'  } },
  { page:'restaurants', svg:'food',     color:'#DC2626', bg:'#FEF2F2', label:{PT:'Comer',     EN:'Eat',       ES:'Comer',     FR:'Manger',   DE:'Essen'     } },
  { page:'beaches',     svg:'waves',    color:'#0277BD', bg:'#F0F9FF', label:{PT:'Praias',    EN:'Beaches',   ES:'Playas',    FR:'Plages',   DE:'Strände'   } },
  { page:'culture',     svg:'landmark', color:'#7C3AED', bg:'#EDE9FE', label:{PT:'Cultura',   EN:'Culture',   ES:'Cultura',   FR:'Culture',  DE:'Kultur'    } },
  { page:'hotels',      svg:'hotel',    color:'#9333EA', bg:'#FDF4FF', label:{PT:'Hotéis',    EN:'Hotels',    ES:'Hoteles',   FR:'Hôtels',   DE:'Hotels'    } },
  { page:'transport',   svg:'bus',      color:'#D97706', bg:'#FFFBEB', label:{PT:'Transporte',EN:'Transport', ES:'Transporte',FR:'Transport', DE:'Transport' } },
  { page:'events',      svg:'calendar', color:'#6D28D9', bg:'#F5F3FF', label:{PT:'Eventos',   EN:'Events',    ES:'Eventos',   FR:'Événements',DE:'Events'   } },
  { page:'shopping',    svg:'shopping', color:'#059669', bg:'#ECFDF5', label:{PT:'Compras',   EN:'Shopping',  ES:'Compras',   FR:'Shopping', DE:'Einkaufen' } },
  { page:'favorites',   svg:'heart',    color:'#DC2626', bg:'#FEF2F2', label:{PT:'Favoritos', EN:'Saved',     ES:'Favoritos', FR:'Favoris',  DE:'Favoriten' } },
  { page:'report',      svg:'alert',    color:'#DC2626', bg:'#FEF2F2', label:{PT:'Reportar',  EN:'Report',    ES:'Reportar',  FR:'Signaler', DE:'Melden'    } },
]

const GALLERY = [
  { url:'/images/marina_guadiana.webp',                   cap:'Marina do Guadiana' },
  { url:'/images/praa_marques_de_pombal.webp',            cap:'Praça Marquês de Pombal' },
  { url:'/images/praia_vila_real_santo_antonio.webp',     cap:'Praia de VRSA' },
  { url:'/images/farolvrsa.webp',                         cap:'Farol de VRSA' },
  { url:'/images/por_do_sol_sapal.webp',                  cap:'Pôr do Sol no Guadiana' },
  { url:'/images/ponte_guadiana.webp',                    cap:'Ponte Internacional do Guadiana' },
  { url:'/images/praia_verde1.webp',                      cap:'Praia Verde' },
  { url:'/images/monte_gordo.webp',                       cap:'Monte Gordo' },
  { url:'/images/praia_montegordo2.webp',                 cap:'Praia de Monte Gordo' },
  { url:'/images/castelo_castro_marim.webp',              cap:'Castelo de Castro Marim' },
  { url:'/images/sapal.webp',                             cap:'Sapal de Castro Marim' },
  { url:'/images/caminha_dos_3_pauzinhos.webp',           cap:'Caminho dos 3 Pauzinhos' },
  { url:'/images/marina_guadiana2.webp',                  cap:'Marina · Rio Guadiana' },
  { url:'/images/estatua_marques_pombal.webp',            cap:'Estátua Marquês de Pombal' },
  { url:'/images/camara_municipal.webp',                  cap:'Câmara Municipal de VRSA' },
  { url:'/images/praia_do_cabeo.webp',                    cap:'Praia do Cabeço' },
]

const wIcon = c => c===0?'☀️':c<=3?'⛅':c<=48?'🌫️':c<=67?'🌧️':c<=82?'🌦️':'⛈️'
const wDesc = (c,l) => {
  const m = {PT:{0:'Céu limpo',2:'Parcialmente nublado',3:'Nublado',61:'Chuva leve',80:'Aguaceiros'},EN:{0:'Clear sky',2:'Partly cloudy',3:'Overcast',61:'Light rain',80:'Showers'},ES:{0:'Despejado',2:'Parcialmente nublado',3:'Nublado',61:'Lluvia leve',80:'Chubascos'},FR:{0:'Ciel dégagé',2:'Partiellement nuageux',3:'Couvert',61:'Pluie légère',80:'Averses'},DE:{0:'Klarer Himmel',2:'Teilweise bewölkt',3:'Bedeckt',61:'Leichter Regen',80:'Schauer'}}
  return (m[l]||m.PT)[c]||''
}


// ─── Dica do dia ─────────────────────────────────────────────
const DAILY_TIPS = [
  { icon:'⛴️', color:'#1D4ED8', bg:'#EFF6FF', border:'#BFDBFE',
    text:{PT:'O ferry para Ayamonte parte de hora a hora. Compra bilhete a bordo — €2,50. Leva o passaporte!',EN:'Ferry to Ayamonte departs hourly. Buy ticket on board — €2.50. Bring your passport!',ES:'El ferry a Ayamonte sale cada hora. Billete a bordo — €2,50. ¡Lleva el pasaporte!',FR:'Le ferry pour Ayamonte part toutes les heures. Billet à bord — €2,50. Prenez votre passeport!',DE:'Fähre nach Ayamonte stündlich. Ticket an Bord — €2,50. Reisepass mitbringen!'} },
  { icon:'🏖️', color:'#0277BD', bg:'#F0F9FF', border:'#BAE6FD',
    text:{PT:'A Praia Verde tem pinheiros até à areia — sombra natural gratuita. Leva picnic!',EN:'Praia Verde has pine trees to the sand — free natural shade. Bring a picnic!',ES:'Praia Verde tiene pinos hasta la arena — sombra natural gratis. ¡Lleva picnic!',FR:'Praia Verde: des pins jusqu’au sable, ombre naturelle. Apportez un pique-nique!',DE:'Praia Verde hat Kiefern bis zum Sand — kostenloser natürlicher Schatten. Picknick mitbringen!'} },
  { icon:'🦩', color:'#0E7490', bg:'#ECFEFF', border:'#A5F3FC',
    text:{PT:'No Sapal podes ver flamingos ao amanhecer. Vai antes das 9h para os melhores avistamentos.',EN:'At the Sapal you can see flamingos at dawn. Go before 9am for the best sightings.',ES:'En el Sapal puedes ver flamencos al amanecer. Ve antes de las 9h.',FR:'Au Sapal: flamants roses au lever du jour. Avant 9h pour les meilleures observations.',DE:'Im Sapal kann man bei Sonnenaufgang Flamingos sehen. Vor 9 Uhr für die besten Sichtungen.'} },
  { icon:'🍽️', color:'#D97706', bg:'#FFFBEB', border:'#FDE68A',
    text:{PT:'No Mercado Municipal o peixe fresco chega de manhã. Vai antes das 9h para escolher o melhor.',EN:'At the Municipal Market fresh fish arrives in the morning. Go before 9am for the best selection.',ES:'En el Mercado Municipal el pescado fresco llega por la mañana. Ve antes de las 9h.',FR:'Au Marché Municipal le poisson frais arrive le matin. Allez avant 9h.',DE:'Auf dem Stadtmarkt kommt morgens frischer Fisch. Vor 9 Uhr für die beste Auswahl.'} },
  { icon:'🌅', color:'#DC2626', bg:'#FEF2F2', border:'#FECACA',
    text:{PT:'O pôr do sol visto do Cais do Ferry com Ayamonte ao fundo é um dos melhores do Algarve.',EN:'The sunset from the Ferry Pier with Ayamonte in the background is one of the best in the Algarve.',ES:'La puesta de sol desde el muelle del ferry con Ayamonte al fondo es una de las mejores del Algarve.',FR:"Le coucher de soleil depuis le quai du ferry avec Ayamonte est un des plus beaux de l'Algarve.",DE:'Der Sonnenuntergang vom Fähranleger mit Ayamonte im Hintergrund ist einer der schönsten an der Algarve.'} },
  { icon:'🏛️', color:'#7C3AED', bg:'#F5F3FF', border:'#DDD6FE',
    text:{PT:'A Praça Marquês de Pombal foi construída em apenas 5 meses em 1776. Entra na Igreja Matriz — é gratuito.',EN:'Praça Marquês de Pombal was built in just 5 months in 1776. Enter the Parish Church — free!',ES:'La Plaza Marqués de Pombal se construyó en solo 5 meses en 1776. Entra en la Iglesia Parroquial — es gratis.',FR:'La Praça Pombal fut construite en 5 mois en 1776. Entrez dans l’église, c’est gratuit.',DE:'Der Praça Marquês de Pombal wurde 1776 in nur 5 Monaten erbaut. Betreten Sie die Kirche — kostenlos.'} },
  { icon:'🚂', color:'#059669', bg:'#ECFDF5', border:'#A7F3D0',
    text:{PT:'O Comboio Turístico percorre a cidade de Junho a Setembro. Parte da Praça Pombal — ~€3 adulto.',EN:'The Tourist Train runs through the city from June to September. Departs from Praça Pombal — ~€3 adult.',ES:'El Tren Turístico recorre la ciudad de junio a septiembre. Sale de la Plaza Pombal — ~€3 adulto.',FR:'Le Train Touristique parcourt la ville de juin à septembre. Départ de la Praça Pombal — ~€3 adulte.',DE:'Der Touristenzug fährt von Juni bis September durch die Stadt. Abfahrt am Praça Pombal — ~€3 Erwachsener.'} },
]

function getDailyTip() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(),0,0)) / 86400000)
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length]
}

export default function Home({ lang, pins, loading, favs, onNav }) {
  const L = lang || 'PT'
  const t = tr('home', L)
  const h = new Date().getHours()
  const [wx, setWx]       = useState(null)
  const [wx7, setWx7]     = useState(null)
  const [wxError, setWxError] = useState(false)
  const [ferry, setFerry] = useState(null)
  const [train, setTrain] = useState(null)
  const [route, setRoute] = useState(null)
  const [lb, setLb]       = useState(null)
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vrsa_routes') || '{}') } catch { return {} }
  })
  const [mode, setMode] = useState(() => localStorage.getItem('vrsa_mode') || 'rio')

  const DAY = {PT:['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],EN:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],ES:['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],FR:['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],DE:['So','Mo','Di','Mi','Do','Fr','Sa']}

  useEffect(() => {
    const update = () => {
      const nm  = new Date().getHours()*60 + new Date().getMinutes()
      const nxt = FERRY_TIMES.find(f => toMin(f) > nm)
      setFerry(nxt || null)
      const nxtTrain = TRAIN_TIMES.find(f => toMin(f.dep) > nm)
      setTrain(nxtTrain || null)
    }
    update()
    const iv = setInterval(update, 60000)

    // Weather: use cache if < 30 min old
    try {
      const raw = localStorage.getItem('vrsa_wx_cache')
      if (raw) {
        const { ts, current, daily } = JSON.parse(raw)
        if (Date.now() - ts < 30 * 60 * 1000) { setWx(current); setWx7(daily); return () => clearInterval(iv) }
      }
    } catch {}

    const wxTimer = setTimeout(() => setWxError(true), 8000)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=37.1948&longitude=-7.4161&current=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe/Lisbon&forecast_days=7')
      .then(r => r.json())
      .then(d => {
        clearTimeout(wxTimer)
        if (d?.current) {
          setWx(d.current); setWx7(d.daily)
          try { localStorage.setItem('vrsa_wx_cache', JSON.stringify({ ts: Date.now(), current: d.current, daily: d.daily })) } catch {}
        } else { setWxError(true) }
      })
      .catch(() => { clearTimeout(wxTimer); setWxError(true) })

    return () => clearInterval(iv)
  }, [])

  // Persist mode
  useEffect(() => { try { localStorage.setItem('vrsa_mode', mode) } catch {} }, [mode])

  // Persist route progress
  useEffect(() => {
    try { localStorage.setItem('vrsa_routes', JSON.stringify(checked)) } catch {}
  }, [checked])

  // ── Route detail ──────────────────────────────────────────────
  if (route) {
    const done      = checked[route.id] || []
    const total     = route.steps.length
    const pct       = Math.round((done.length / total) * 100)
    const allDone   = done.length === total

    function toggleStep(i) {
      setChecked(prev => {
        const cur = prev[route.id] || []
        const next = cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i]
        return { ...prev, [route.id]: next }
      })
    }

    function resetRoute() {
      setChecked(prev => ({ ...prev, [route.id]: [] }))
    }

    const mapUrl = 'https://www.google.com/maps/dir/' +
      route.steps.map(s => s.lat + ',' + s.lng).join('/')

    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>

        {/* Hero */}
        <div style={{ background:`linear-gradient(135deg,${route.color},${route.color}bb)`, padding:'20px', paddingTop:'calc(64px + env(safe-area-inset-top,0px))', flexShrink:0, position:'relative' }}>
          <button onClick={() => setRoute(null)} style={{ position:'absolute', top:'calc(58px + env(safe-area-inset-top,0px))', left:14, width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.25)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>

          <div style={{ textAlign:'center', paddingTop:8 }}>
            <span style={{ display:'inline-flex', color:'rgba(255,255,255,.92)' }}><route.Icon size={44} strokeWidth={1.5} /></span>
            <div style={{ fontSize:20, fontWeight:800, color:'#fff', marginTop:8 }}>{route.title[L]}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.6)', marginTop:4 }}>{total} {t.steps} · {route.dur[L]}</div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:600 }}>
                {done.length}/{total} {L==='EN'?'completed':L==='FR'?'complétés':L==='DE'?'erledigt':L==='ES'?'completados':'completos'}
              </span>
              <span style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:700 }}>{pct}%</span>
            </div>
            <div style={{ height:6, background:'rgba(255,255,255,.2)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ height:'100%', width:pct+'%', background:'#fff', borderRadius:3, transition:'width .4s ease' }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 40px' }}>

          {/* Completed banner */}
          {allDone && (
            <div style={{ background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:14, padding:'12px 16px', marginBottom:14, display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:24 }}>🎉</span>
              <div style={{ fontSize:13, fontWeight:700, color:'#065F46' }}>
                {L==='EN'?'Route completed! Well done!':L==='FR'?'Route complétée ! Bravo !':L==='DE'?'Route abgeschlossen! Gut gemacht!':L==='ES'?'¡Ruta completada! ¡Bien hecho!':'Roteiro concluído! Parabéns!'}
              </div>
            </div>
          )}

          {/* Checklist */}
          <div className="card" style={{ marginBottom:14 }}>
            {route.steps.map((s, i) => {
              const isDone = done.includes(i)
              return (
                <div
                  key={i}
                  onClick={() => toggleStep(i)}
                  style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'14px 16px', borderBottom: i < total-1 ? '1px solid var(--surface)' : 'none', cursor:'pointer', transition:'background .1s' }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width:26, height:26, borderRadius:8, flexShrink:0, marginTop:1,
                    background: isDone ? route.color : 'transparent',
                    border: `2px solid ${isDone ? route.color : 'var(--border)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all .15s',
                  }}>
                    {isDone && <span style={{ color:'#fff', fontSize:14, fontWeight:900, lineHeight:1 }}>✓</span>}
                  </div>

                  {/* Step info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{
                      fontSize:14, fontWeight:700,
                      color: isDone ? 'var(--ink-20)' : 'var(--ink)',
                      textDecoration: isDone ? 'line-through' : 'none',
                      transition:'all .15s',
                    }}>{s.n[L] || s.n.PT}</div>
                    <div style={{ display:'flex', gap:8, marginTop:6, flexWrap:'wrap' }}>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`}
                        target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ display:'inline-flex', alignItems:'center', gap:4, background:`${route.color}15`, color:route.color, border:`1px solid ${route.color}25`, borderRadius:50, padding:'3px 10px', fontSize:11, fontWeight:700, textDecoration:'none' }}
                      >
                        📍 {L==='EN'?'Map':L==='FR'?'Carte':L==='DE'?'Karte':L==='ES'?'Mapa':'Mapa'}
                      </a>
                      {s.tip && (
                        <span style={{ fontSize:11, color:'var(--ink-40)', fontStyle:'italic' }}>💡 {s.tip[L] || s.tip.PT}</span>
                      )}
                    </div>
                  </div>

                  {/* Step number badge */}
                  <div style={{ fontSize:11, fontWeight:800, color: isDone ? route.color : 'var(--ink-20)', flexShrink:0, marginTop:4 }}>
                    {i+1}/{total}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" style={{ flex:1, textDecoration:'none' }}>
              <button style={{ width:'100%', padding:'13px 0', background:'var(--navy)', color:'#fff', border:'none', borderRadius:14, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                🗺️ {L==='EN'?'Open full route':L==='FR'?'Ouvrir l\'itinéraire':L==='DE'?'Route öffnen':L==='ES'?'Abrir ruta completa':'Abrir rota completa'}
              </button>
            </a>
            {done.length > 0 && (
              <button onClick={resetRoute} style={{ width:50, height:50, background:'var(--red-lt)', border:'1px solid #FECACA', borderRadius:14, fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>↺</button>
            )}
          </div>

        </div>
      </div>
    )
  }

  const restaurantPins = (pins||[]).filter(p => p.cat === 'restaurante').slice(0,4)

  // ── ES timezone helper ────────────────────────────────────────
  function getEsTime() {
    const now = new Date()
    const h = (now.getHours() + 1) % 24
    const m = now.getMinutes()
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
  }
  function esHint(esTime) {
    const h = parseInt(esTime.split(':')[0])
    if (h >= 12 && h < 16) return { PT:`🇪🇸 Ayamonte: ${esTime} — hora de tapas! 🍤`, EN:`🇪🇸 Ayamonte: ${esTime} — tapas time! 🍤`, ES:`🇪🇸 Ayamonte: ${esTime} — ¡tapas! 🍤`, FR:`🇪🇸 Ayamonte: ${esTime} — tapas ! 🍤`, DE:`🇪🇸 Ayamonte: ${esTime} — Tapas! 🍤` }
    if (h >= 20 && h < 23) return { PT:`🇪🇸 Ayamonte: ${esTime} — hora de jantar! 🍽️`, EN:`🇪🇸 Ayamonte: ${esTime} — dinner time! 🍽️`, ES:`🇪🇸 Ayamonte: ${esTime} — ¡a cenar! 🍽️`, FR:`🇪🇸 Ayamonte: ${esTime} — dîner ! 🍽️`, DE:`🇪🇸 Ayamonte: ${esTime} — Abendessen! 🍽️` }
    return { PT:`🇪🇸 Ayamonte agora: ${esTime}`, EN:`🇪🇸 Ayamonte now: ${esTime}`, ES:`🇪🇸 Ayamonte ahora: ${esTime}`, FR:`🇪🇸 Ayamonte: ${esTime}`, DE:`🇪🇸 Ayamonte jetzt: ${esTime}` }
  }
  const esTime = getEsTime()
  const esHintText = esHint(esTime)[L]

  // ── Sugestões baseadas no modo ────────────────────────────────
  const suggestedPins = (() => {
    if (!pins || pins.length === 0) return []
    if (mode === 'praia') return pins.filter(p => p.cat === 'praia').slice(0, 5)
    return pins.filter(p =>
      p.lat > 37.190 && p.lat < 37.199 && p.lng > -7.420 && p.lng < -7.411 &&
      ['restaurante','cultura','natureza'].includes(p.cat)
    ).slice(0, 5)
  })()

  return (
    <>
    <div className="page">

      {/* ── Hero ── */}
      <div className="home-hero" style={mode==='praia' ? {background:'linear-gradient(160deg,#0277BD,#00838F)'} : {}}>

        {/* Top row: logo */}
        <img
          src="/logo_vrsa_light.svg"
          alt="VRSA Guide"
          loading="eager"
          decoding="async"
          style={{ width:200, marginBottom:10 }}
        />

        {/* Mode toggle: Rio/Centro ↔ Praia */}
        <div style={{ display:'flex', gap:2, background:'rgba(0,0,0,.18)', borderRadius:50, padding:3, marginBottom:12 }}>
          <button
            onClick={() => setMode('rio')}
            style={{ flex:1, padding:'6px 0', borderRadius:50, border:'none', background:mode==='rio'?'#fff':'transparent', color:mode==='rio'?'var(--primary)':'rgba(255,255,255,.75)', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all .2s', touchAction:'manipulation' }}
          >⛵ {t.modeRio}</button>
          <button
            onClick={() => setMode('praia')}
            style={{ flex:1, padding:'6px 0', borderRadius:50, border:'none', background:mode==='praia'?'#fff':'transparent', color:mode==='praia'?'#0277BD':'rgba(255,255,255,.75)', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all .2s', touchAction:'manipulation' }}
          >🏖️ {t.modePraia}</button>
        </div>

        {/* Weather + Ferry strip */}
        <button onClick={() => onNav('info')} style={{ width:'100%', display:'flex', alignItems:'center', gap:0, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius:10, overflow:'hidden', cursor:'pointer', marginBottom:0 }}>

          {/* Temp */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', flex:1 }}>
            {wx ? (
              <>
                <span style={{ fontSize:24, lineHeight:1 }}>{wIcon(wx.weathercode)}</span>
                <div>
                  <div style={{ fontSize:20, fontWeight:700, color:'#fff', lineHeight:1 }}>{Math.round(wx.temperature_2m)}°C</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.8)', marginTop:1 }}>{wDesc(wx.weathercode, L)}</div>
                </div>
              </>
            ) : wxError ? (
              <>
                <span style={{ fontSize:20, lineHeight:1, opacity:.5 }}>🌡️</span>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:'rgba(255,255,255,.5)', lineHeight:1 }}>—°C</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', marginTop:1 }}>{L==='EN'?'No data':L==='FR'?'Sans données':L==='DE'?'Keine Daten':L==='ES'?'Sin datos':'Sem dados'}</div>
                </div>
              </>
            ) : (
              <>
                <div className="skeleton-inv" style={{ width:26, height:26, borderRadius:'50%' }} />
                <div>
                  <div className="skeleton-inv" style={{ width:52, height:16, marginBottom:5 }} />
                  <div className="skeleton-inv" style={{ width:38, height:10 }} />
                </div>
              </>
            )}
          </div>

          {/* Divider */}
          <div style={{ width:1, height:36, background:'rgba(255,255,255,.12)', flexShrink:0 }} />

          {/* Ferry */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', flex:1 }}>
            <span style={{ fontSize:20 }}>⛴️</span>
            <div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,.75)', fontWeight:600, textTransform:'uppercase', letterSpacing:.8 }}>{t.ferry}</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#fff', lineHeight:1, marginTop:1 }}>{ferry || t.noFerry}</div>
            </div>
          </div>

          {/* ETA badge */}
          {ferry && (
            <div style={{ paddingRight:12, flexShrink:0 }}>
              <div style={{ background:'rgba(201,168,76,.25)', border:'1px solid rgba(201,168,76,.4)', borderRadius:50, padding:'3px 10px', fontSize:10, fontWeight:800, color:'#E8C96A', whiteSpace:'nowrap' }}>
                {(() => { const d = toMin(ferry) - (new Date().getHours()*60+new Date().getMinutes()); return d < 60 ? `${d}min` : `${Math.floor(d/60)}h${d%60?` ${d%60}m`:''}` })()}
              </div>
            </div>
          )}
        </button>

        {/* ES timezone hint */}
        <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:6, padding:'5px 10px', background:'rgba(0,0,0,.15)', borderRadius:8 }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,.6)', fontWeight:600, lineHeight:1.4 }}>{esHintText}</span>
        </div>
      </div>

      <div style={{ padding:'16px 16px 40px' }}>

        {/* ── Próximas Partidas ── */}
        <button
          onClick={() => onNav('transport')}
          style={{ width:'100%', display:'flex', alignItems:'stretch', background:'var(--white)', border:'1px solid var(--border-lt)', borderRadius:14, overflow:'hidden', boxShadow:'var(--sh-xs)', marginBottom:16, cursor:'pointer', touchAction:'manipulation' }}
        >
          <div style={{ width:4, background:'linear-gradient(180deg,#1D4ED8,#059669)', flexShrink:0 }} />
          <div style={{ flex:1, padding:'11px 14px', display:'flex', gap:0 }}>
            {/* Ferry */}
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:22 }}>⛴️</span>
              <div>
                <div style={{ fontSize:9, fontWeight:700, color:'var(--ink-20)', textTransform:'uppercase', letterSpacing:.8 }}>Ferry → Ayamonte</div>
                <div style={{ fontSize:16, fontWeight:800, color:'var(--ink)', lineHeight:1.1 }}>{ferry || '—'}</div>
                {ferry && (
                  <div style={{ fontSize:10, fontWeight:700, color:'#1D4ED8', marginTop:1 }}>
                    {(() => { const d=toMin(ferry)-(new Date().getHours()*60+new Date().getMinutes()); return d>0?(d<60?`em ${d}min`:`em ${Math.floor(d/60)}h${d%60?` ${d%60}m`:''}`):'A partir' })()}
                  </div>
                )}
              </div>
            </div>
            {/* Divider */}
            <div style={{ width:1, background:'var(--border-lt)', margin:'0 4px', alignSelf:'stretch' }} />
            {/* Train */}
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:10, paddingLeft:10 }}>
              <span style={{ fontSize:22 }}>🚂</span>
              <div>
                <div style={{ fontSize:9, fontWeight:700, color:'var(--ink-20)', textTransform:'uppercase', letterSpacing:.8 }}>Comboio → Faro</div>
                <div style={{ fontSize:16, fontWeight:800, color:'var(--ink)', lineHeight:1.1 }}>{train?.dep || '—'}</div>
                {train && (
                  <div style={{ fontSize:10, fontWeight:700, color:'#059669', marginTop:1 }}>
                    {(() => { const d=toMin(train.dep)-(new Date().getHours()*60+new Date().getMinutes()); return d>0?(d<60?`em ${d}min`:`em ${Math.floor(d/60)}h${d%60?` ${d%60}m`:''}`):'A partir' })()}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', paddingRight:12, color:'var(--ink-20)', fontSize:18 }}>›</div>
        </button>

        {/* ── Acesso Principal — 3 botões grandes ── */}
        <div className="sec-label">{t.qa}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:8 }}>
          {QA.slice(0,3).map((q,i) => (
            <button key={i} onClick={() => onNav(q.page)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, padding:'14px 6px 12px', background:'var(--white)', borderRadius:12, border:'1px solid var(--border-lt)', cursor:'pointer', boxShadow:'var(--sh-xs)', touchAction:'manipulation' }}>
              <div style={{ width:44, height:44, borderRadius:10, background:q.bg, display:'flex', alignItems:'center', justifyContent:'center', color:q.color, padding:10 }}>{React.cloneElement(SVGS[q.svg], { width:'100%', height:'100%' })}</div>
              <span style={{ fontSize:11, fontWeight:600, color:'var(--ink-40)', textAlign:'center' }}>{q.label[L]}</span>
            </button>
          ))}
        </div>

        {/* ── Serviços secundários — lista compacta ── */}
        <div className="card" style={{ marginBottom:24 }}>
          {QA.slice(3).map((q, i, arr) => (
            <button
              key={i}
              onClick={() => onNav(q.page)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'none', border:'none', borderBottom: i < arr.length-1 ? '1px solid var(--surface)' : 'none', cursor:'pointer', textAlign:'left', touchAction:'manipulation' }}
            >
              <div style={{ width:34, height:34, borderRadius:8, background:q.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:q.color, padding:7 }}>{React.cloneElement(SVGS[q.svg], { width:'100%', height:'100%' })}</div>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--ink-70)', flex:1 }}>{q.label[L]}</span>
              <span style={{ fontSize:16, color:'var(--ink-20)' }}>›</span>
            </button>
          ))}
        </div>

        {/* ── Sugestões baseadas no modo ── */}
        {suggestedPins.length > 0 && (
          <>
            <div className="sec-label" style={{ marginBottom:10 }}>{t.suggested}</div>
            <div className="h-scroll" style={{ marginBottom:20 }}>
              {suggestedPins.map(p => (
                <a key={p.id}
                  href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ flexShrink:0, display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'var(--white)', border:'1px solid var(--border-lt)', borderRadius:14, boxShadow:'var(--sh-xs)', textDecoration:'none', minWidth:160, maxWidth:200 }}
                >
                  <span style={{ fontSize:22, flexShrink:0 }}>{p.emoji}</span>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'var(--ink)', lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize:10, color:'var(--ink-40)', marginTop:2 }}>📍 Maps</div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        {/* ── 7-day forecast ── */}
        {wx7 && (
          <>
            <div className="sec-label">{L==='EN'?'7-DAY FORECAST':L==='FR'?'PRÉVISION 7 JOURS':L==='DE'?'7-TAGE-VORHERSAGE':L==='ES'?'PREVISIÓN 7 DÍAS':'PREVISÃO 7 DIAS'}</div>
            <div className="card" style={{ marginBottom:24 }}>
              <div style={{ display:'flex', overflowX:'auto', padding:'12px 4px' }}>
                {wx7.time.map((date,i) => {
                  // Add T12:00:00 so the date is parsed as local noon, not UTC midnight
                  // which can shift the weekday by 1 in timezones east/west of UTC
                  const dn = (DAY[L]||DAY.PT)[new Date(date + 'T12:00:00').getDay()]
                  const isToday = i === 0
                  return (
                    <div key={i} style={{ flexShrink:0, flex:1, minWidth:42, textAlign:'center', padding:'6px 4px', borderRight:i<6?'1px solid var(--surface)':'none', background: isToday ? 'var(--primary-lt)' : 'transparent', borderRadius: isToday ? 8 : 0 }}>
                      <div style={{ fontSize:10, fontWeight:700, color: isToday ? 'var(--primary)' : 'var(--ink-20)' }}>{isToday?(L==='EN'?'Today':L==='FR'?'Auj.':L==='DE'?'Heute':L==='ES'?'Hoy':'Hoje'):dn}</div>
                      <div style={{ fontSize:20, margin:'5px 0' }}>{wIcon(wx7.weathercode[i])}</div>
                      <div style={{ fontSize:13, fontWeight:800, color:'var(--ink)' }}>{Math.round(wx7.temperature_2m_max[i])}°</div>
                      <div style={{ fontSize:11, color:'var(--ink-20)' }}>{Math.round(wx7.temperature_2m_min[i])}°</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* ── Roteiros ── */}
        <div className="sec-label" style={{ marginBottom:12 }}>{t.routes}</div>
        <div className="h-scroll" style={{ marginBottom:24 }}>
          {ROUTES.map(r => {
            const done = (checked[r.id] || []).length
            const pct  = Math.round((done / r.steps.length) * 100)
            return (
              <button key={r.id} onClick={() => setRoute(r)} aria-label={r.title[L]} className="route-card" style={{ background:`linear-gradient(135deg,${r.color},${r.color}cc)`, boxShadow:`0 4px 18px ${r.color}40`, border:'none', textAlign:'left' }}>
                <div style={{ marginBottom:10, opacity:.92, color:'#fff' }}><r.Icon size={28} strokeWidth={1.8} /></div>
                <div style={{ fontSize:13, fontWeight:800, color:'#fff', lineHeight:1.35, marginBottom:4 }}>{r.title[L]}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.6)', fontWeight:600, marginBottom: pct > 0 ? 8 : 0 }}>{r.dur[L]}</div>
                {pct > 0 && (
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                      <span style={{ fontSize:9, color:'rgba(255,255,255,.7)', fontWeight:700 }}>{pct === 100 ? '✓ ' : ''}{pct}%</span>
                    </div>
                    <div style={{ height:3, background:'rgba(255,255,255,.25)', borderRadius:2 }}>
                      <div style={{ height:'100%', width:pct+'%', background:'#fff', borderRadius:2 }} />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Populares ── */}
        {(() => {
          // Read top visited from analytics localStorage
          let topPins = []
          try {
            const raw = JSON.parse(localStorage.getItem('vrsa_analytics') || '{}')
            const pinClicks = Object.entries(raw)
              .filter(([k]) => k.startsWith('pin_'))
              .sort((a,b) => b[1]-a[1])
              .slice(0,4)
              .map(([k]) => parseInt(k.replace('pin_','')))
            topPins = pinClicks.map(id => pins.find(p => p.id === id)).filter(Boolean)
          } catch {}
          // Fallback to handpicked popular spots
          if (topPins.length < 4) {
            const fallback = [
              pins.find(p => p.name?.includes('Pombal')),
              pins.find(p => p.name?.includes('Naval')),
              pins.find(p => p.name?.includes('Farol')),
              pins.find(p => p.cat === 'praia'),
            ].filter(Boolean)
            topPins = [...new Set([...topPins, ...fallback])].slice(0,4)
          }
          const AVCOL = ['#003B6F','#1A5FA8','#1A6B3A','#7C3AED','#D97706','#0E7490']
          function avi(name) {
            const w = name.trim().split(/\s+/)
            return w.length>=2?(w[0][0]+w[1][0]).toUpperCase():name.slice(0,2).toUpperCase()
          }
          function avc(name) {
            let h=0; for(let i=0;i<name.length;i++) h=name.charCodeAt(i)+((h<<5)-h)
            return AVCOL[Math.abs(h)%AVCOL.length]
          }
          const CAT_L = {
            restaurante:{PT:'Restaurante',EN:'Restaurant',ES:'Restaurante',FR:'Restaurant',DE:'Restaurant'},
            pastelaria:{PT:'Café',EN:'Café',ES:'Café',FR:'Café',DE:'Café'},
            praia:{PT:'Praia',EN:'Beach',ES:'Playa',FR:'Plage',DE:'Strand'},
            cultura:{PT:'Monumento',EN:'Monument',ES:'Monumento',FR:'Monument',DE:'Monument'},
            natureza:{PT:'Natureza',EN:'Nature',ES:'Naturaleza',FR:'Nature',DE:'Natur'},
            hotel:{PT:'Hotel',EN:'Hotel',ES:'Hotel',FR:'Hôtel',DE:'Hotel'},
            mercado:{PT:'Mercado',EN:'Market',ES:'Mercado',FR:'Marché',DE:'Markt'},
          }
          if (topPins.length === 0) return null
          return (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <div className="sec-label" style={{ marginBottom:0 }}>{L==='EN'?'POPULAR':L==='FR'?'POPULAIRES':L==='DE'?'BELIEBT':L==='ES'?'POPULARES':'POPULARES'}</div>
                <button onClick={() => onNav('map')} style={{ background:'none', border:'none', fontSize:12, fontWeight:700, color:'var(--blue)', cursor:'pointer' }}>{t.seeAll}</button>
              </div>
              <div className="card" style={{ marginBottom:24 }}>
                {topPins.map((p,i,arr) => (
                  <button key={p.id} onClick={() => onNav('map')} aria-label={p.name}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:i<arr.length-1?'1px solid var(--surface)':'none', cursor:'pointer', width:'100%', background:'none', border:'none', textAlign:'left' }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:avc(p.name), display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{avi(p.name)}</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:1 }}>{(CAT_L[p.cat]||{})[L] || p.cat}</div>
                    </div>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer"
                      onClick={e=>e.stopPropagation()}
                      style={{ fontSize:11, fontWeight:700, color:'var(--primary)', background:'var(--primary-lt)', padding:'4px 10px', borderRadius:50, textDecoration:'none', flexShrink:0 }}>
                      📍 {L==='EN'?'Map':L==='FR'?'Carte':L==='DE'?'Karte':L==='ES'?'Mapa':'Mapa'}
                    </a>
                  </button>
                ))}
              </div>
            </>
          )
        })()}

        {/* ── Gallery premium ── */}
        <div className="sec-label" style={{ marginBottom:12 }}>{t.gallery}</div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gridTemplateRows:'140px 140px', gap:5, marginBottom:24, borderRadius:16, overflow:'hidden' }}>
          {/* Grande à esquerda */}
          <button onClick={() => setLb(0)} aria-label={GALLERY[0].cap} style={{ gridRow:'1 / 3', position:'relative', cursor:'pointer', overflow:'hidden', background:'var(--surface)', border:'none', padding:0 }}>
            <img src={GALLERY[0].url} alt={GALLERY[0].cap} className="gallery-img"
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
            />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent,rgba(0,0,0,.65))', padding:'24px 12px 10px' }}>
              <div style={{ fontSize:11, color:'#fff', fontWeight:700 }}>{GALLERY[0].cap}</div>
            </div>
          </button>
          {/* Pequenas à direita */}
          {[1,2].map(i => (
            <button key={i} onClick={() => setLb(i)} aria-label={GALLERY[i].cap} style={{ position:'relative', cursor:'pointer', overflow:'hidden', background:'var(--surface)', border:'none', padding:0 }}>
              <img src={GALLERY[i].url} alt={GALLERY[i].cap} className="gallery-img"
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
              />
              {i === 2 && GALLERY.length > 3 && (
                <button onClick={e => { e.stopPropagation(); setLb(3) }} aria-label={`Ver mais ${GALLERY.length - 2} fotos`}
                  style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.52)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'none' }}>
                  <div style={{ color:'#fff', fontSize:18, fontWeight:800 }}>+{GALLERY.length - 2}</div>
                </button>
              )}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent,rgba(0,0,0,.6))', padding:'14px 8px 6px' }}>
                <div style={{ fontSize:9, color:'rgba(255,255,255,.85)', fontWeight:600 }}>{GALLERY[i].cap}</div>
              </div>
            </button>
          ))}
        </div>

        {/* ── Dica do dia ── */}
        {(() => {
          const tip = getDailyTip()
          return (
            <div style={{ background:tip.bg, border:`1px solid ${tip.border}`, borderRadius:14, padding:'14px 16px', marginBottom:20, display:'flex', alignItems:'flex-start', gap:12 }}>
              <span style={{ fontSize:28, flexShrink:0, lineHeight:1 }}>{tip.icon}</span>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:tip.color, letterSpacing:1.2, textTransform:'uppercase', marginBottom:4 }}>
                  {L==='EN'?'TIP OF THE DAY':L==='FR'?'CONSEIL DU JOUR':L==='DE'?'TIPP DES TAGES':L==='ES'?'CONSEJO DEL DÍA':'DICA DO DIA'}
                </div>
                <div style={{ fontSize:13, color:tip.color, fontWeight:500, lineHeight:1.6 }}>{tip.text[L]||tip.text.PT}</div>
              </div>
            </div>
          )
        })()}

        {/* ── About ── */}
        <div className="sec-label" style={{ marginBottom:10 }}>{t.history}</div>
        <div className="card" style={{ padding:'16px 18px' }}>
          <p style={{ fontSize:13, color:'var(--ink-40)', lineHeight:1.75, margin:0 }}>{t.histText}</p>
        </div>

      </div>

    </div>

    {/* Lightbox — fora do .page para position:fixed funcionar */}
    {lb !== null && (
        <div
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.95)', zIndex:300, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}
          onClick={() => setLb(null)}
        >
          {/* Fechar */}
          <button
            onClick={() => setLb(null)}
            style={{ position:'absolute', top:'calc(16px + env(safe-area-inset-top,0px))', right:16, width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,.15)', border:'none', color:'#fff', fontSize:22, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2 }}
          >×</button>

          {/* Anterior */}
          {lb > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setLb(lb - 1) }}
              style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,.15)', border:'none', color:'#fff', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2 }}
            >‹</button>
          )}

          {/* Imagem */}
          <img
            src={GALLERY[lb].url}
            alt={GALLERY[lb].cap}
            loading="lazy"
            decoding="async"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth:'92%', maxHeight:'75vh', objectFit:'contain', borderRadius:12, display:'block' }}
          />

          {/* Caption */}
          <div style={{ color:'rgba(255,255,255,.7)', fontSize:13, marginTop:14, fontWeight:500 }}>
            {GALLERY[lb].cap}
          </div>

          {/* Dots */}
          <div style={{ display:'flex', gap:6, marginTop:12 }}>
            {GALLERY.map((_,i) => (
              <div
                key={i}
                onClick={e => { e.stopPropagation(); setLb(i) }}
                style={{ width: i === lb ? 20 : 6, height:6, borderRadius:3, background: i === lb ? '#fff' : 'rgba(255,255,255,.35)', cursor:'pointer', transition:'all .2s' }}
              />
            ))}
          </div>

          {/* Próximo */}
          {lb < GALLERY.length - 1 && (
            <button
              onClick={e => { e.stopPropagation(); setLb(lb + 1) }}
              style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,.15)', border:'none', color:'#fff', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2 }}
            >›</button>
          )}
        </div>
      )}
    </>
  )
}