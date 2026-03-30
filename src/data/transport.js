// Ferry VRSA → Ayamonte — Partidas de Portugal (hora portuguesa UTC+0)
// Fonte: painel do cais de VRSA | €2.50 adulto, €1.50 criança (4–10 anos) | ~10 min travessia
export const FERRY_TIMES = ['10:30','11:30','12:30','13:30','14:30','15:30','16:30','18:00']

// CP Comboios Regionais VRSA → Lagos (via Faro) — Fonte: horário CP oficial
// Linha do Algarve · ~1h10 VRSA→Faro · ~2h30 VRSA→Lagos
export const CP_TRAINS = [
  {dep:'05:49', faro:'07:17', train:'R 5700'},
  {dep:'06:17', faro:'07:35', train:'R 5704'},
  {dep:'07:20', faro:'08:42', train:'R 5706'},
  {dep:'09:05', faro:'10:20', train:'R 5710'},
  {dep:'11:22', faro:'12:41', train:'R 5714'},
  {dep:'13:27', faro:'14:45', train:'R 5718'},
  {dep:'16:07', faro:'17:18', train:'R 5720'},
  {dep:'17:40', faro:'18:55', train:'R 5819'},
  {dep:'18:45', faro:'20:02', train:'R 5724'},
  {dep:'20:44', faro:'22:05', train:'R 5726'},
]

// Comboio Turístico VRSA — Fonte: touristtrainvrsa.com (tabela oficial de horários)
// Sazonal: 15 Jun → 15 Set | €1,30 bilhete | Grátis -4 anos
// Época normal (15 Jun–15 Jul e 1 Set–15 Set): 09:00–12:30, pausa, 14:00–18:30
// Época alta (15 Jul–31 Ago): estende até 19:30 (marcado peak:true)
// Circuito completo ~25 min | Partidas de 30 em 30 min da Paragem 1
export const TOURIST_TRAIN_STOPS = [
  { n:1, name:'Bombeiros',   addr:'Rua Francisco Sá Carneiro',               offset:0  },
  { n:2, name:'Jardim',      addr:'Av. dos Bombeiros Portugueses',            offset:0  },
  { n:3, name:'Lidl',        addr:'Rua das Comunidades Portuguesas',          offset:5  },
  { n:4, name:'Mata',        addr:'Início Cam. 3 Pauzinhos / Estr. da Mata', offset:10 },
  { n:5, name:'Praia',       addr:'Praia de Sto António – 3 Pauzinhos',      offset:15 },
  { n:6, name:'Farol',       addr:'Av. Min. Duarte Pacheco',                  offset:25 },
]

export const TRAIN_TIMES = [
  {dep:'09:00'},{dep:'09:30'},
  {dep:'10:00'},{dep:'10:30'},
  {dep:'11:00'},{dep:'11:30'},
  {dep:'12:00'},{dep:'12:30'},
  // pausa almoço 13:00–14:00
  {dep:'14:00'},{dep:'14:30'},
  {dep:'15:00'},{dep:'15:30'},
  {dep:'16:00'},{dep:'16:30'},
  {dep:'17:00'},{dep:'17:30'},
  {dep:'18:00'},{dep:'18:30'},
  {dep:'19:00', peak:true},   // só 15 Jul–31 Ago
  {dep:'19:30', peak:true},   // só 15 Jul–31 Ago
]

export const toMin = t => { const [h,m]=t.split(':').map(Number); return h*60+m }
export const fmtEta = t => { const d=toMin(t)-(new Date().getHours()*60+new Date().getMinutes()); if(d<=0)return null; return d<60?`${d}min`:`${Math.floor(d/60)}h${d%60?` ${d%60}min`:''}` }
