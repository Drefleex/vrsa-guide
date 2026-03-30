// Ferry VRSA → Ayamonte — temporada Inverno (15 Set–28 Fev)
// Fonte: rioguadiana.com via ayamonte.info (hora portuguesa UTC+0)
// Seg–Sáb: de hora a hora 09h–17h | €2.50 adulto, €1.50 criança (4–10 anos)
export const FERRY_TIMES = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00']

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

// Comboio Turístico VRSA — Fonte: touristtrainvrsa.com
// Diário 09h–20h, a cada 30 min; pausa almoço 13h–14h | €1.00 bilhete
// 6 paragens: Bombeiros → Jardim → Lidl → Estrada da Mata → Praia Sto António → Farol
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
  {dep:'19:00'},{dep:'19:30'},
  {dep:'20:00'},
]

export const toMin = t => { const [h,m]=t.split(':').map(Number); return h*60+m }
export const fmtEta = t => { const d=toMin(t)-(new Date().getHours()*60+new Date().getMinutes()); if(d<=0)return null; return d<60?`${d}min`:`${Math.floor(d/60)}h${d%60?` ${d%60}min`:''}` }
