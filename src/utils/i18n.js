/**
 * i18n.js — Dicionário central de traduções do VRSA Guide
 *
 * Uso:
 *   import { tr } from '../utils/i18n'
 *   const t = tr('restaurants', lang)
 *   <div>{t.title}</div>
 *
 * A função tr(page, lang) devolve o objeto de traduções da página
 * para o idioma dado, com fallback para PT se o idioma não existir.
 */

// ─── Home ─────────────────────────────────────────────────────
const home = {
  PT: { qa:'Guia do Município', routes:'Roteiros', gallery:'Galeria de VRSA', history:'Sobre VRSA', seeAll:'Ver todos →', noFerry:'Sem mais hoje', ferryTo:'Próximo ferry para Ayamonte', histText:'Fundada em 1776 pelo Marquês de Pombal numa forma de urbanismo pioneira. Vila Real de Santo António é construída em grelha perfeita, com a Praça Marquês de Pombal como coração. Situada na foz do Guadiana, na fronteira com Espanha, é uma das cidades mais singulares do Algarve.', greet:h=>h<12?'Bom dia':h<19?'Boa tarde':'Boa noite', steps:'paradas', modeRio:'Rio/Centro', modePraia:'Praia', suggested:'SUGESTÕES PARA SI' },
  EN: { qa:'Municipal Guide', routes:'Itineraries', gallery:'VRSA Gallery', history:'About VRSA', seeAll:'See all →', noFerry:'No more today', ferryTo:'Next ferry to Ayamonte', histText:'Founded in 1776 by the Marquis of Pombal using pioneering urban planning. Vila Real de Santo António is built on a perfect grid, with Praça Marquês de Pombal at its heart. Located at the Guadiana estuary on the Spanish border, it is one of the most unique towns in the Algarve.', greet:h=>h<12?'Good morning':h<19?'Good afternoon':'Good evening', steps:'stops', modeRio:'River/Centre', modePraia:'Beach', suggested:'SUGGESTED FOR YOU' },
  ES: { qa:'Guía Municipal', routes:'Itinerarios', gallery:'Galería de VRSA', history:'Sobre VRSA', seeAll:'Ver todos →', noFerry:'Sin más hoy', ferryTo:'Próximo ferry a Ayamonte', histText:'Fundada en 1776 por el Marqués de Pombal con un urbanismo pionero. Vila Real de Santo António está construida en cuadrícula perfecta, con la Plaza Marqués de Pombal como corazón. En la desembocadura del Guadiana, en la frontera con España.', greet:h=>h<12?'Buenos días':h<19?'Buenas tardes':'Buenas noches', steps:'paradas', modeRio:'Río/Centro', modePraia:'Playa', suggested:'SUGERENCIAS PARA TI' },
  FR: { qa:'Guide Municipal', routes:'Itinéraires', gallery:'Galerie de VRSA', history:'À propos de VRSA', seeAll:'Voir tout →', noFerry:"Plus de ferry aujourd'hui", ferryTo:'Prochain ferry pour Ayamonte', histText:"Fondée en 1776 par le Marquis de Pombal avec un urbanisme pionnier. Vila Real de Santo António est construite en quadrillage parfait, avec la Praça Marquês de Pombal en son coeur. Située à l'embouchure du Guadiana, à la frontière espagnole.", greet:h=>h<12?'Bonjour':h<19?'Bonne après-midi':'Bonsoir', steps:'étapes', modeRio:'Rivière/Centre', modePraia:'Plage', suggested:'SUGGESTIONS POUR VOUS' },
  DE: { qa:'Stadtführer', routes:'Routen', gallery:'VRSA Galerie', history:'Über VRSA', seeAll:'Alle anzeigen →', noFerry:'Keine Fähre mehr heute', ferryTo:'Nächste Fähre nach Ayamonte', histText:'1776 von Marquis de Pombal mit pionierem Städtebau gegründet. Vila Real de Santo António ist auf einem perfekten Raster gebaut, mit dem Praça Marquês de Pombal als Herzstück. An der Guadiana-Mündung, an der spanischen Grenze.', greet:h=>h<12?'Guten Morgen':h<19?'Guten Tag':'Guten Abend', steps:'Stops', modeRio:'Fluss/Zentrum', modePraia:'Strand', suggested:'VORSCHLÄGE FÜR SIE' },
}

// ─── Restaurants ──────────────────────────────────────────────
const restaurants = {
  PT: { title:'Restaurantes', search:'Pesquisar restaurantes...', all:'Todos', fish:'Peixe & Mar', cafe:'Cafés & Pastéis', pizza:'Pizza', burger:'Burgers', kebab:'Kebab', sushi:'Sushi', icecream:'Gelados', open:'Aberto', closed:'Fechado', reviews:'avaliações', hours:'Horário', phone:'Telefone', navigate:'Navegar', call:'Ligar', share:'Partilhar', back:'← Voltar', fav:'Favorito', noResults:'Sem resultados. Tenta outra pesquisa.' },
  EN: { title:'Restaurants', search:'Search restaurants...', all:'All', fish:'Fish & Sea', cafe:'Cafés & Pastries', pizza:'Pizza', burger:'Burgers', kebab:'Kebab', sushi:'Sushi', icecream:'Ice Cream', open:'Open', closed:'Closed', reviews:'reviews', hours:'Hours', phone:'Phone', navigate:'Navigate', call:'Call', share:'Share', back:'← Back', fav:'Favourite', noResults:'No results. Try another search.' },
  ES: { title:'Restaurantes', search:'Buscar restaurantes...', all:'Todos', fish:'Pescado & Mar', cafe:'Cafés & Pasteles', pizza:'Pizza', burger:'Burgers', kebab:'Kebab', sushi:'Sushi', icecream:'Helados', open:'Abierto', closed:'Cerrado', reviews:'reseñas', hours:'Horario', phone:'Teléfono', navigate:'Navegar', call:'Llamar', share:'Compartir', back:'← Volver', fav:'Favorito', noResults:'Sin resultados. Intenta otra búsqueda.' },
  FR: { title:'Restaurants', search:'Rechercher des restaurants...', all:'Tous', fish:'Poisson & Mer', cafe:'Cafés & Pâtisseries', pizza:'Pizza', burger:'Burgers', kebab:'Kebab', sushi:'Sushi', icecream:'Glaces', open:'Ouvert', closed:'Fermé', reviews:'avis', hours:'Horaires', phone:'Téléphone', navigate:'Naviguer', call:'Appeler', share:'Partager', back:'← Retour', fav:'Favori', noResults:'Aucun résultat.' },
  DE: { title:'Restaurants', search:'Restaurants suchen...', all:'Alle', fish:'Fisch & Meer', cafe:'Cafés & Gebäck', pizza:'Pizza', burger:'Burger', kebab:'Kebab', sushi:'Sushi', icecream:'Eis', open:'Geöffnet', closed:'Geschlossen', reviews:'Bewertungen', hours:'Öffnungszeiten', phone:'Telefon', navigate:'Navigieren', call:'Anrufen', share:'Teilen', back:'← Zurück', fav:'Favorit', noResults:'Keine Ergebnisse.' },
}

// ─── Events ───────────────────────────────────────────────────
const events = {
  PT: { title:'Eventos', featured:'DESTAQUE', upcoming:'EM BREVE', past:'JÁ PASSOU', days:'dias', today:'HOJE', navigate:'Ver no Mapa', back:'← Voltar', reminder:'Lembrete', free:'Grátis', allYear:'Todos os Eventos', noUpcoming:'Sem eventos próximos', noUpcomingSub:'Volta em breve!' },
  EN: { title:'Events', featured:'FEATURED', upcoming:'UPCOMING', past:'PAST', days:'days', today:'TODAY', navigate:'View on Map', back:'← Back', reminder:'Remind me', free:'Free', allYear:'All Events', noUpcoming:'No upcoming events', noUpcomingSub:'Check back soon!' },
  ES: { title:'Eventos', featured:'DESTAQUE', upcoming:'PRÓXIMO', past:'YA PASÓ', days:'días', today:'HOY', navigate:'Ver en Mapa', back:'← Volver', reminder:'Recordatorio', free:'Gratis', allYear:'Todos los Eventos', noUpcoming:'Sin eventos próximos', noUpcomingSub:'¡Vuelve pronto!' },
  FR: { title:'Événements', featured:'À LA UNE', upcoming:'À VENIR', past:'PASSÉ', days:'jours', today:"AUJOURD'HUI", navigate:'Voir sur la Carte', back:'← Retour', reminder:'Me le rappeler', free:'Gratuit', allYear:'Tous les Événements', noUpcoming:'Aucun événement à venir', noUpcomingSub:'Revenez bientôt!' },
  DE: { title:'Events', featured:'HIGHLIGHT', upcoming:'BALD', past:'VORBEI', days:'Tage', today:'HEUTE', navigate:'Auf der Karte', back:'← Zurück', reminder:'Erinnerung', free:'Kostenlos', allYear:'Alle Events', noUpcoming:'Keine bevorstehenden Events', noUpcomingSub:'Bald zurückschauen!' },
}

// ─── Culture ──────────────────────────────────────────────────
const culture = {
  PT: { title:'Cultura & Monumentos', sub:'Património de Vila Real de Santo António', back:'← Voltar', year:'Ano', navigate:'Navegar', history:'História', openMaps:'Ver no Google Maps', freeEntry:'Entrada livre', hours:'Aberto diariamente', fav:'Favorito' },
  EN: { title:'Culture & Monuments', sub:'Heritage of Vila Real de Santo António', back:'← Back', year:'Year', navigate:'Navigate', history:'History', openMaps:'View on Google Maps', freeEntry:'Free entry', hours:'Open daily', fav:'Favourite' },
  ES: { title:'Cultura & Monumentos', sub:'Patrimonio de Vila Real de Santo António', back:'← Volver', year:'Año', navigate:'Navegar', history:'Historia', openMaps:'Ver en Google Maps', freeEntry:'Entrada libre', hours:'Abierto diariamente', fav:'Favorito' },
  FR: { title:'Culture & Monuments', sub:'Patrimoine de Vila Real de Santo António', back:'← Retour', year:'Année', navigate:'Naviguer', history:'Histoire', openMaps:'Voir sur Google Maps', freeEntry:'Entrée libre', hours:'Ouvert tous les jours', fav:'Favori' },
  DE: { title:'Kultur & Denkmäler', sub:'Kulturerbe von Vila Real de Santo António', back:'← Zurück', year:'Jahr', navigate:'Navigieren', history:'Geschichte', openMaps:'In Google Maps anzeigen', freeEntry:'Freier Eintritt', hours:'Täglich geöffnet', fav:'Favorit' },
}

// ─── Favorites ────────────────────────────────────────────────
const favorites = {
  PT: { title:'Favoritos', empty:'Ainda não tens favoritos.', emptyHint:'Toca em ❤️ nos restaurantes, eventos e monumentos para guardar.', places:'Restaurantes & Locais', events:'Eventos Guardados', culture:'Cultura & Monumentos', explore:'Explorar Restaurantes', removeFav:'Remover favorito' },
  EN: { title:'Favourites', empty:'No favourites yet.', emptyHint:'Tap ❤️ on restaurants, events and monuments to save them.', places:'Restaurants & Places', events:'Saved Events', culture:'Culture & Monuments', explore:'Explore Restaurants', removeFav:'Remove favourite' },
  ES: { title:'Favoritos', empty:'Aún no tienes favoritos.', emptyHint:'Toca ❤️ en restaurantes, eventos y monumentos para guardar.', places:'Restaurantes & Lugares', events:'Eventos Guardados', culture:'Cultura & Monumentos', explore:'Explorar Restaurantes', removeFav:'Quitar favorito' },
  FR: { title:'Favoris', empty:'Pas encore de favoris.', emptyHint:'Tapez ❤️ sur les restaurants, événements et monuments pour les sauvegarder.', places:'Restaurants & Lieux', events:'Événements Sauvegardés', culture:'Culture & Monuments', explore:'Explorer les Restaurants', removeFav:'Supprimer des favoris' },
  DE: { title:'Favoriten', empty:'Noch keine Favoriten.', emptyHint:'Tippe auf ❤️ bei Restaurants, Events und Denkmälern zum Speichern.', places:'Restaurants & Orte', events:'Gespeicherte Events', culture:'Kultur & Denkmäler', explore:'Restaurants erkunden', removeFav:'Aus Favoriten entfernen' },
}

// ─── Hotels ───────────────────────────────────────────────────
const hotels = {
  PT: { title:'Hotéis', search:'Pesquisar alojamento...', all:'Todos', luxury:'Luxo', mid:'Conforto', budget:'Económico', book:'Reservar', navigate:'Navegar', back:'← Voltar', priceLabel:'Preço/noite', stars:'estrelas', noResults:'Sem resultados.', fav:'Favorito' },
  EN: { title:'Hotels', search:'Search accommodation...', all:'All', luxury:'Luxury', mid:'Comfort', budget:'Budget', book:'Book', navigate:'Navigate', back:'← Back', priceLabel:'Price/night', stars:'stars', noResults:'No results.', fav:'Favourite' },
  ES: { title:'Hoteles', search:'Buscar alojamiento...', all:'Todos', luxury:'Lujo', mid:'Confort', budget:'Económico', book:'Reservar', navigate:'Navegar', back:'← Volver', priceLabel:'Precio/noche', stars:'estrellas', noResults:'Sin resultados.', fav:'Favorito' },
  FR: { title:'Hôtels', search:'Rechercher hébergement...', all:'Tous', luxury:'Luxe', mid:'Confort', budget:'Économique', book:'Réserver', navigate:'Naviguer', back:'← Retour', priceLabel:'Prix/nuit', stars:'étoiles', noResults:'Aucun résultat.', fav:'Favori' },
  DE: { title:'Hotels', search:'Unterkunft suchen...', all:'Alle', luxury:'Luxus', mid:'Komfort', budget:'Budget', book:'Buchen', navigate:'Navigieren', back:'← Zurück', priceLabel:'Preis/Nacht', stars:'Sterne', noResults:'Keine Ergebnisse.', fav:'Favorit' },
}

// ─── Shopping ─────────────────────────────────────────────────
const shopping = {
  PT: { title:'Compras & Mercados', all:'Todos', market:'Mercado', super:'Supermercados', shops:'Lojas', hours:'Horário', navigate:'Navegar', fav:'Favorito', back:'← Voltar', tip:'💡 Dica: O Mercado Municipal tem os melhores preços de peixe fresco — vai de manhã cedo!', search:'Pesquisar...', noResults:'Sem resultados.' },
  EN: { title:'Shopping & Markets', all:'All', market:'Market', super:'Supermarkets', shops:'Shops', hours:'Hours', navigate:'Navigate', fav:'Favourite', back:'← Back', tip:'💡 Tip: The Municipal Market has the best fresh fish prices — go early in the morning!', search:'Search...', noResults:'No results.' },
  ES: { title:'Compras & Mercados', all:'Todos', market:'Mercado', super:'Supermercados', shops:'Tiendas', hours:'Horario', navigate:'Navegar', fav:'Favorito', back:'← Volver', tip:'💡 Consejo: El Mercado Municipal tiene los mejores precios de pescado fresco.', search:'Buscar...', noResults:'Sin resultados.' },
  FR: { title:'Shopping & Marchés', all:'Tous', market:'Marché', super:'Supermarchés', shops:'Boutiques', hours:'Horaires', navigate:'Naviguer', fav:'Favori', back:'← Retour', tip:'💡 Astuce: Le Marché Municipal a les meilleurs prix pour le poisson frais!', search:'Rechercher...', noResults:'Aucun résultat.' },
  DE: { title:'Einkaufen & Märkte', all:'Alle', market:'Markt', super:'Supermärkte', shops:'Geschäfte', hours:'Öffnungszeiten', navigate:'Navigieren', fav:'Favorit', back:'← Zurück', tip:'💡 Tipp: Der Stadtmarkt hat die besten Preise für frischen Fisch!', search:'Suchen...', noResults:'Keine Ergebnisse.' },
}

// ─── Beaches ──────────────────────────────────────────────────
const beaches = {
  PT: { title:'Praias', sub:'Vila Real de Santo António · Algarve', seaTemp:'Temperatura do Mar', seaConditions:'Condições Hoje', flagGuide:'Guia de Bandeiras', beaches:'Praias Próximas', parking:'Parque', bar:'Bar', wc:'WC', directions:'Navegar', loading:'A carregar dados marinhos...', summer:'Verão (Jun–Set)', winter:'Inverno (Out–Mai)', tipTitle:'Dica do dia', uv:'Índice UV', wave:'Altura de Onda', wind:'Vento', conditions:{0:'Excelente',1:'Bom',2:'Razoável',3:'Mau'} },
  EN: { title:'Beaches', sub:'Vila Real de Santo António · Algarve', seaTemp:'Sea Temperature', seaConditions:"Today's Conditions", flagGuide:'Flag Guide', beaches:'Nearby Beaches', parking:'Parking', bar:'Bar', wc:'WC', directions:'Navigate', loading:'Loading marine data...', summer:'Summer (Jun–Sep)', winter:'Winter (Oct–May)', tipTitle:'Tip of the day', uv:'UV Index', wave:'Wave Height', wind:'Wind', conditions:{0:'Excellent',1:'Good',2:'Fair',3:'Poor'} },
  ES: { title:'Playas', sub:'Vila Real de Santo António · Algarve', seaTemp:'Temperatura del Mar', seaConditions:'Condiciones de Hoy', flagGuide:'Guía de Banderas', beaches:'Playas Cercanas', parking:'Aparcamiento', bar:'Bar', wc:'WC', directions:'Navegar', loading:'Cargando datos marinos...', summer:'Verano (Jun–Sep)', winter:'Invierno (Oct–May)', tipTitle:'Consejo del día', uv:'Índice UV', wave:'Altura Olas', wind:'Viento', conditions:{0:'Excelente',1:'Buenas',2:'Regulares',3:'Malas'} },
  FR: { title:'Plages', sub:'Vila Real de Santo António · Algarve', seaTemp:'Température de la Mer', seaConditions:'Conditions du Jour', flagGuide:'Guide des Drapeaux', beaches:'Plages Proches', parking:'Parking', bar:'Bar', wc:'WC', directions:'Naviguer', loading:'Chargement des données marines...', summer:'Été (Jun–Sep)', winter:'Hiver (Oct–Mai)', tipTitle:'Conseil du jour', uv:'Indice UV', wave:'Hauteur des Vagues', wind:'Vent', conditions:{0:'Excellentes',1:'Bonnes',2:'Correctes',3:'Mauvaises'} },
  DE: { title:'Strände', sub:'Vila Real de Santo António · Algarve', seaTemp:'Meerestemperatur', seaConditions:'Heutige Bedingungen', flagGuide:'Flaggenführer', beaches:'Nahe Strände', parking:'Parkplatz', bar:'Bar', wc:'WC', directions:'Navigieren', loading:'Marine Daten laden...', summer:'Sommer (Jun–Sep)', winter:'Winter (Okt–Mai)', tipTitle:'Tipp des Tages', uv:'UV-Index', wave:'Wellenhöhe', wind:'Wind', conditions:{0:'Ausgezeichnet',1:'Gut',2:'Mäßig',3:'Schlecht'} },
}

// ─── Ayamonte ─────────────────────────────────────────────────
const ayamonte = {
  PT: { title:'Ayamonte', sub:'Espanha · 15 min de ferry', topSpots:'O Que Ver e Fazer', essentials:'Informações Essenciais', tip:'💡 O último ferry de volta para VRSA parte às 19:30. Não percas!', walkTime:'a pé', free:'Grátis', paid:'Pago', navigate:'Google Maps', back:'← Voltar' },
  EN: { title:'Ayamonte', sub:'Spain · 15 min by ferry', topSpots:'Top Spots', essentials:'Essential Info', tip:"💡 The last ferry back to VRSA leaves at 19:30. Don't miss it!", walkTime:'walk', free:'Free', paid:'Paid', navigate:'Google Maps', back:'← Back' },
  ES: { title:'Ayamonte', sub:'España · 15 min en ferry', topSpots:'Qué Ver y Hacer', essentials:'Información Esencial', tip:'💡 El último ferry de vuelta a VRSA sale a las 19:30. ¡No te lo pierdas!', walkTime:'a pie', free:'Gratis', paid:'Pago', navigate:'Google Maps', back:'← Volver' },
  FR: { title:'Ayamonte', sub:'Espagne · 15 min en ferry', topSpots:'À Voir et Faire', essentials:'Infos Essentielles', tip:"💡 Le dernier ferry retour pour VRSA part à 19h30. Ne le ratez pas!", walkTime:'à pied', free:'Gratuit', paid:'Payant', navigate:'Google Maps', back:'← Retour' },
  DE: { title:'Ayamonte', sub:'Spanien · 15 min mit der Fähre', topSpots:'Sehenswürdigkeiten', essentials:'Wichtige Infos', tip:'💡 Die letzte Fähre zurück nach VRSA fährt um 19:30 Uhr. Nicht verpassen!', walkTime:'zu Fuß', free:'Kostenlos', paid:'Kostenpflichtig', navigate:'Google Maps', back:'← Zurück' },
}

// ─── Health ───────────────────────────────────────────────────
const health = {
  PT: { title:'Farmácias & Saúde', pharmacies:'Farmácias', dutyPharmacy:'Farmácia de Serviço', health:'Serviços de Saúde', tips:'Dicas Úteis', call:'Ligar', navigate:'Navegar', emergency:'Serviço', open:'Aberta' },
  EN: { title:'Pharmacies & Health', pharmacies:'Pharmacies', dutyPharmacy:'Duty Pharmacy', health:'Health Services', tips:'Useful Tips', call:'Call', navigate:'Navigate', emergency:'On Duty', open:'Open' },
  ES: { title:'Farmacias & Salud', pharmacies:'Farmacias', dutyPharmacy:'Farmacia de Guardia', health:'Servicios de Salud', tips:'Consejos Útiles', call:'Llamar', navigate:'Navegar', emergency:'Guardia', open:'Abierta' },
  FR: { title:'Pharmacies & Santé', pharmacies:'Pharmacies', dutyPharmacy:'Pharmacie de Garde', health:'Services de Santé', tips:'Conseils Utiles', call:'Appeler', navigate:'Naviguer', emergency:'Garde', open:'Ouverte' },
  DE: { title:'Apotheken & Gesundheit', pharmacies:'Apotheken', dutyPharmacy:'Notdienstapotheke', health:'Gesundheitsdienste', tips:'Nützliche Tipps', call:'Anrufen', navigate:'Navigieren', emergency:'Notdienst', open:'Geöffnet' },
}

// ─── Transport ────────────────────────────────────────────────
const transport = {
  PT: { title:'Transportes', sub:'Como chegar e como sair', ferry:'Ferry', train:'Comboio', bus:'Autocarro', taxi:'Táxi', airport:'Aeroporto', car:'Carro', next:'Próximo', noMore:'Sem mais hoje', book:'Reservar', navigate:'Ver mapa', toFaro:'até Faro', toAyamonte:'para Ayamonte', airportNote:'Faro (FAO) · ~65 km · ~50 min', trainNote:'Via Monte Gordo · Tavira · Olhão', ferryNote:'€2,50 · 15 min · Passaporte obrigatório', carRentals:'Rent-a-Car VRSA', parkings:'Parques de Estacionamento' },
  EN: { title:'Transport', sub:'Getting around & getting out', ferry:'Ferry', train:'Train', bus:'Bus', taxi:'Taxi', airport:'Airport', car:'Car', next:'Next', noMore:'No more today', book:'Book', navigate:'View map', toFaro:'to Faro', toAyamonte:'to Ayamonte', airportNote:'Faro (FAO) · ~65 km · ~50 min', trainNote:'Via Monte Gordo · Tavira · Olhão', ferryNote:'€2.50 · 15 min · Passport required', carRentals:'Car Rentals VRSA', parkings:'Car Parks' },
  ES: { title:'Transportes', sub:'Cómo llegar y cómo salir', ferry:'Ferry', train:'Tren', bus:'Autobús', taxi:'Taxi', airport:'Aeropuerto', car:'Coche', next:'Próximo', noMore:'Sin más hoy', book:'Reservar', navigate:'Ver mapa', toFaro:'hasta Faro', toAyamonte:'a Ayamonte', airportNote:'Faro (FAO) · ~65 km · ~50 min', trainNote:'Vía Monte Gordo · Tavira · Olhão', ferryNote:'€2,50 · 15 min · Pasaporte obligatorio', carRentals:'Alquiler de Coches', parkings:'Aparcamientos' },
  FR: { title:'Transports', sub:'Comment circuler', ferry:'Ferry', train:'Train', bus:'Bus', taxi:'Taxi', airport:'Aéroport', car:'Voiture', next:'Prochain', noMore:"Plus aujourd'hui", book:'Réserver', navigate:'Voir carte', toFaro:"jusqu'à Faro", toAyamonte:'vers Ayamonte', airportNote:'Faro (FAO) · ~65 km · ~50 min', trainNote:'Via Monte Gordo · Tavira · Olhão', ferryNote:'€2,50 · 15 min · Passeport obligatoire', carRentals:'Location de voitures', parkings:'Parkings' },
  DE: { title:'Transport', sub:'Anreise und Abreise', ferry:'Fähre', train:'Zug', bus:'Bus', taxi:'Taxi', airport:'Flughafen', car:'Auto', next:'Nächster', noMore:'Heute nicht mehr', book:'Buchen', navigate:'Karte', toFaro:'nach Faro', toAyamonte:'nach Ayamonte', airportNote:'Faro (FAO) · ~65 km · ~50 min', trainNote:'Über Monte Gordo · Tavira · Olhão', ferryNote:'€2,50 · 15 min · Reisepass erforderlich', carRentals:'Autovermietung', parkings:'Parkplätze' },
}

// ─── Report ───────────────────────────────────────────────────
const report = {
  PT: { title:'Reportar Problema', sub:'Câmara Municipal de VRSA', step1:'Qual é o problema?', step2:'Localização', step3:'Foto (opcional)', step4:'Descrição (opcional)', gps:'A obter localização...', gpsOk:'Localização obtida', gpsErr:'Não foi possível obter localização. Podes indicar manualmente.', gpsManual:'Morada ou local:', gpsPlaceholder:'Ex: Rua 5 de Outubro, junto ao café', photoBtn:'Adicionar foto', photoChange:'Alterar foto', desc:'Descreve o problema brevemente...', send:'Enviar Relatório', sending:'A preparar...', sent:'Email preparado', sentSub:'Abrimos o teu cliente de email. Envia a mensagem para completar o reporte. Obrigado pela colaboração!', sentCopied:'Conteúdo copiado. Cola no email para geral@cm-vrsa.pt', newReport:'Novo Relatório', privacy:'O teu relatório será enviado por email à Câmara Municipal de VRSA.', required:'Selecciona uma categoria para continuar.', descLabel:'Descrição (opcional)', locLabel:'Localização manual', photoRemind:'📎 Anexo: (Por favor, não se esqueça de anexar a foto a este email antes de enviar!)', photoWarn:'Se tiraste uma foto, não te esqueças de a anexar manualmente na tua aplicação de email antes de enviar!' },
  EN: { title:'Report a Problem', sub:'VRSA Town Hall', step1:'What is the problem?', step2:'Location', step3:'Photo (optional)', step4:'Description (optional)', gps:'Getting location...', gpsOk:'Location obtained', gpsErr:'Could not get location. You can enter it manually.', gpsManual:'Address or location:', gpsPlaceholder:'E.g: Rua 5 de Outubro, near the café', photoBtn:'Add photo', photoChange:'Change photo', desc:'Briefly describe the problem...', send:'Send Report', sending:'Preparing...', sent:'Email client opened', sentSub:'We opened your email client. Send the message to complete your report. Thank you!', sentCopied:'Content copied. Paste it into an email to geral@cm-vrsa.pt', newReport:'New Report', privacy:'Your report will be sent by email to VRSA Town Hall.', required:'Please select a category to continue.', descLabel:'Description (optional)', locLabel:'Manual location', photoRemind:'📎 Attachment: (Please remember to attach your photo to this email before sending!)', photoWarn:'If you took a photo, remember to attach it manually in your email app before sending!' },
  ES: { title:'Reportar Problema', sub:'Ayuntamiento de VRSA', step1:'¿Cuál es el problema?', step2:'Ubicación', step3:'Foto (opcional)', step4:'Descripción (opcional)', gps:'Obteniendo ubicación...', gpsOk:'Ubicación obtenida', gpsErr:'No se pudo obtener la ubicación.', gpsManual:'Dirección o lugar:', gpsPlaceholder:'Ej: Rua 5 de Outubro, junto al café', photoBtn:'Añadir foto', photoChange:'Cambiar foto', desc:'Describe brevemente el problema...', send:'Enviar Informe', sending:'Preparando...', sent:'Cliente de email abierto', sentSub:'Abrimos tu cliente de email. Envía el mensaje para completar el informe. ¡Gracias!', sentCopied:'Contenido copiado. Pégalo en un email a geral@cm-vrsa.pt', newReport:'Nuevo Informe', privacy:'Tu informe será enviado por email al Ayuntamiento.', required:'Selecciona una categoría para continuar.', descLabel:'Descripción (opcional)', locLabel:'Ubicación manual', photoRemind:'📎 Adjunto: (¡No olvides adjuntar la foto a este email antes de enviar!)', photoWarn:'Si tomaste una foto, recuerda adjuntarla manualmente en tu app de email antes de enviar.' },
  FR: { title:'Signaler un Problème', sub:'Mairie de VRSA', step1:'Quel est le problème?', step2:'Localisation', step3:'Photo (optionnel)', step4:'Description (optionnel)', gps:'Localisation en cours...', gpsOk:'Localisation obtenue', gpsErr:"Impossible d'obtenir la localisation.", gpsManual:'Adresse ou lieu:', gpsPlaceholder:'Ex: Rua 5 de Outubro, près du café', photoBtn:'Ajouter une photo', photoChange:'Changer la photo', desc:'Décrivez brièvement le problème...', send:'Envoyer le rapport', sending:'Préparation...', sent:'Client email ouvert', sentSub:'Nous avons ouvert votre client email. Envoyez le message pour finaliser le signalement. Merci!', sentCopied:'Contenu copié. Collez-le dans un email à geral@cm-vrsa.pt', newReport:'Nouveau Rapport', privacy:'Votre rapport sera envoyé par email à la Mairie.', required:'Sélectionnez une catégorie pour continuer.', descLabel:'Description (optionnel)', locLabel:'Localisation manuelle', photoRemind:"📎 Pièce jointe: (N'oubliez pas de joindre la photo à cet email avant d'envoyer!)", photoWarn:'Si vous avez pris une photo, pensez à la joindre manuellement dans votre client email.' },
  DE: { title:'Problem melden', sub:'Stadtverwaltung VRSA', step1:'Was ist das Problem?', step2:'Standort', step3:'Foto (optional)', step4:'Beschreibung (optional)', gps:'Standort wird ermittelt...', gpsOk:'Standort ermittelt', gpsErr:'Standort konnte nicht ermittelt werden.', gpsManual:'Adresse oder Ort:', gpsPlaceholder:'Bsp: Rua 5 de Outubro, beim Café', photoBtn:'Foto hinzufügen', photoChange:'Foto ändern', desc:'Beschreibe das Problem kurz...', send:'Bericht senden', sending:'Wird vorbereitet...', sent:'E-Mail-Client geöffnet', sentSub:'Wir haben Ihren E-Mail-Client geöffnet. Senden Sie die Nachricht, um den Bericht abzuschließen. Danke!', sentCopied:'Inhalt kopiert. In eine E-Mail an geral@cm-vrsa.pt einfügen', newReport:'Neuer Bericht', privacy:'Ihr Bericht wird per E-Mail an die Stadtverwaltung gesendet.', required:'Bitte wähle eine Kategorie aus.', descLabel:'Beschreibung (optional)', locLabel:'Manuelle Adresse', photoRemind:'📎 Anhang: (Vergiss nicht, das Foto vor dem Senden an diese E-Mail anzuhängen!)', photoWarn:'Wenn du ein Foto gemacht hast, denk daran, es manuell in deiner E-Mail-App anzuhängen.' },
}

// ─── Analytics ────────────────────────────────────────────────
const analytics = {
  PT: { title:'Analytics', sub:'Dados de uso da app', pages:'Páginas mais visitadas', pins:'Pins mais clicados', langs:'Idiomas usados', hourly:'Actividade por hora', sessions:'Sessões', clicks:'Cliques', total:'Total de interacções', reset:'Limpar dados', resetConfirm:'Tens a certeza? Isto apaga todos os dados.', noData:'Ainda sem dados. Usa a app para gerar estatísticas.', today:'Hoje', week:'Esta semana', export:'Exportar' },
  EN: { title:'Analytics', sub:'App usage data', pages:'Most visited pages', pins:'Most clicked pins', langs:'Languages used', hourly:'Activity by hour', sessions:'Sessions', clicks:'Clicks', total:'Total interactions', reset:'Clear data', resetConfirm:'Are you sure? This deletes all data.', noData:'No data yet. Use the app to generate statistics.', today:'Today', week:'This week', export:'Export' },
  ES: { title:'Analytics', sub:'Datos de uso de la app', pages:'Páginas más visitadas', pins:'Pins más clicados', langs:'Idiomas usados', hourly:'Actividad por hora', sessions:'Sesiones', clicks:'Clics', total:'Total interacciones', reset:'Borrar datos', resetConfirm:'¿Estás seguro? Esto borra todos los datos.', noData:'Sin datos aún.', today:'Hoy', week:'Esta semana', export:'Exportar' },
  FR: { title:'Analytics', sub:"Données d'utilisation", pages:'Pages les plus visitées', pins:'Pins les plus cliqués', langs:'Langues utilisées', hourly:'Activité par heure', sessions:'Sessions', clicks:'Clics', total:'Total interactions', reset:'Effacer données', resetConfirm:'Êtes-vous sûr?', noData:'Pas encore de données.', today:"Aujourd'hui", week:'Cette semaine', export:'Exporter' },
  DE: { title:'Analytics', sub:'App-Nutzungsdaten', pages:'Meist besuchte Seiten', pins:'Meist geklickte Pins', langs:'Verwendete Sprachen', hourly:'Aktivität nach Stunde', sessions:'Sitzungen', clicks:'Klicks', total:'Gesamtinteraktionen', reset:'Daten löschen', resetConfirm:'Bist du sicher?', noData:'Noch keine Daten.', today:'Heute', week:'Diese Woche', export:'Exportieren' },
}

// ─── GlobalSearch ─────────────────────────────────────────────
const globalSearch = {
  PT: { placeholder:'Pesquisar em VRSA...', pages:'Páginas', places:'Locais', noResults:'Sem resultados para', tryAnother:'Tenta outra pesquisa', suggestions:'Sugestões', recents:'Pesquisas recentes' },
  EN: { placeholder:'Search in VRSA...', pages:'Pages', places:'Places', noResults:'No results for', tryAnother:'Try another search', suggestions:'Suggestions', recents:'Recent searches' },
  ES: { placeholder:'Buscar en VRSA...', pages:'Páginas', places:'Lugares', noResults:'Sin resultados para', tryAnother:'Intenta otra búsqueda', suggestions:'Sugerencias', recents:'Búsquedas recientes' },
  FR: { placeholder:'Rechercher à VRSA...', pages:'Pages', places:'Lieux', noResults:'Aucun résultat pour', tryAnother:'Essayez une autre recherche', suggestions:'Suggestions', recents:'Recherches récentes' },
  DE: { placeholder:'In VRSA suchen...', pages:'Seiten', places:'Orte', noResults:'Keine Ergebnisse für', tryAnother:'Andere Suche versuchen', suggestions:'Vorschläge', recents:'Letzte Suchen' },
}

// ─── InstallBanner ────────────────────────────────────────────
const installBanner = {
  PT: { title:'Instalar VRSA Guide', sub:'Adicionar ao ecrã inicial — grátis', btn:'Instalar', dismiss:'Agora não' },
  EN: { title:'Install VRSA Guide', sub:'Add to home screen — free', btn:'Install', dismiss:'Not now' },
  ES: { title:'Instalar VRSA Guide', sub:'Añadir a la pantalla de inicio — gratis', btn:'Instalar', dismiss:'Ahora no' },
  FR: { title:'Installer VRSA Guide', sub:"Ajouter à l'écran d'accueil — gratuit", btn:'Installer', dismiss:'Plus tard' },
  DE: { title:'VRSA Guide installieren', sub:'Zum Startbildschirm hinzufügen — kostenlos', btn:'Installieren', dismiss:'Nicht jetzt' },
}

// ─── WelcomeModal ─────────────────────────────────────────────
const welcomeModal = {
  PT: { skip:'Saltar', next:'Seguinte', start:'Começar a Explorar', steps:[
    { emoji:'👋', title:'Bem-vindo ao VRSA Guide', desc:'O teu guia turístico oficial de Vila Real de Santo António no bolso. Restaurantes, praias, cultura e muito mais.' },
    { emoji:'❤️', title:'Cria o teu Roteiro', desc:'Toca no coração nos teus restaurantes e eventos preferidos para os guardares e acederes facilmente.' },
    { emoji:'🗺️', title:'Navega sem Internet', desc:'Traça rotas a pé no mapa interativo para qualquer monumento ou praia, mesmo sem gastar dados móveis!' },
  ]},
  EN: { skip:'Skip', next:'Next', start:'Start Exploring', steps:[
    { emoji:'👋', title:'Welcome to VRSA Guide', desc:'Your official tourist guide for Vila Real de Santo António in your pocket. Restaurants, beaches, culture and more.' },
    { emoji:'❤️', title:'Create your Itinerary', desc:'Tap the heart on your favourite restaurants and events to save them for easy access later.' },
    { emoji:'🗺️', title:'Navigate Offline', desc:'Get walking directions on the interactive map to any monument or beach, without using mobile data!' },
  ]},
  ES: { skip:'Saltar', next:'Siguiente', start:'Empezar a Explorar', steps:[
    { emoji:'👋', title:'Bienvenido a VRSA Guide', desc:'Tu guía turística oficial de Vila Real de Santo António en el bolsillo. Restaurantes, playas, cultura y mucho más.' },
    { emoji:'❤️', title:'Crea tu Itinerario', desc:'Toca el corazón en tus restaurantes y eventos favoritos para guardarlos y acceder fácilmente.' },
    { emoji:'🗺️', title:'Navega sin Internet', desc:'¡Traza rutas a pie en el mapa interactivo hacia cualquier monumento o playa, sin gastar datos móviles!' },
  ]},
  FR: { skip:'Passer', next:'Suivant', start:'Commencer à Explorer', steps:[
    { emoji:'👋', title:'Bienvenue sur VRSA Guide', desc:'Votre guide touristique officiel de Vila Real de Santo António dans la poche. Restaurants, plages, culture et plus.' },
    { emoji:'❤️', title:'Créez votre Itinéraire', desc:'Tapez sur le cœur de vos restaurants et événements préférés pour les sauvegarder facilement.' },
    { emoji:'🗺️', title:'Naviguez hors-ligne', desc:'Obtenez des itinéraires à pied sur la carte interactive sans utiliser vos données mobiles !' },
  ]},
  DE: { skip:'Überspringen', next:'Weiter', start:'Erkunden beginnen', steps:[
    { emoji:'👋', title:'Willkommen beim VRSA Guide', desc:'Ihr offizieller Reiseführer für Vila Real de Santo António in der Tasche. Restaurants, Strände, Kultur und mehr.' },
    { emoji:'❤️', title:'Erstelle deine Reiseroute', desc:'Tippe bei deinen Lieblingsrestaurants und -events auf das Herz, um sie für später zu speichern.' },
    { emoji:'🗺️', title:'Offline navigieren', desc:'Lass dir auf der interaktiven Karte Fußwege zu Denkmälern oder Stränden anzeigen, ganz ohne mobile Daten!' },
  ]},
}

// ─── Exportações ──────────────────────────────────────────────

/**
 * Mapa completo de todas as traduções.
 * Chave = nome da página/componente (camelCase).
 */
export const TRANSLATIONS = {
  home,
  restaurants,
  events,
  culture,
  favorites,
  hotels,
  shopping,
  beaches,
  ayamonte,
  health,
  transport,
  report,
  analytics,
  globalSearch,
  installBanner,
  welcomeModal,
}

/**
 * Função acessora principal.
 *
 * @param {string} page  - Chave da secção (ex: 'restaurants', 'home')
 * @param {string} lang  - Código do idioma ('PT' | 'EN' | 'ES' | 'FR' | 'DE')
 * @returns {object}     - Objeto de traduções para o idioma pedido, com fallback para PT
 *
 * @example
 * import { tr } from '../utils/i18n'
 * const t = tr('restaurants', lang)
 * <div>{t.title}</div>
 */
export function tr(page, lang) {
  const section = TRANSLATIONS[page]
  if (!section) {
    console.warn(`[i18n] Secção desconhecida: "${page}"`)
    return {}
  }
  return section[lang] || section.PT || {}
}
