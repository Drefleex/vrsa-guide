// Ferry VRSA → Ayamonte — temporada Inverno (15 Set–28 Fev)
// Fonte: rioguadiana.com via ayamonte.info (horário em hora portuguesa, UTC+0)
// Seg–Sáb: de hora a hora 09h–17h | €2.50 adulto, €1.50 criança (4–10 anos)
export const FERRY_TIMES = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00']

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
