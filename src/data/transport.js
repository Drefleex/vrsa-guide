export const FERRY_TIMES = ['09:00','09:45','10:30','11:15','12:00','12:45','13:30','14:15','15:00','15:45','16:30','17:15','18:00','18:45','19:30']
export const TRAIN_TIMES = [{dep:'06:12',arr:'07:19'},{dep:'07:45',arr:'08:52'},{dep:'09:10',arr:'10:17'},{dep:'10:40',arr:'11:47'},{dep:'12:05',arr:'13:12'},{dep:'13:35',arr:'14:42'},{dep:'15:00',arr:'16:07'},{dep:'16:30',arr:'17:37'},{dep:'18:00',arr:'19:07'},{dep:'19:45',arr:'20:52'},{dep:'21:10',arr:'22:17'}]

export const toMin = t => { const [h,m]=t.split(':').map(Number); return h*60+m }
export const fmtEta = t => { const d=toMin(t)-(new Date().getHours()*60+new Date().getMinutes()); if(d<=0)return null; return d<60?`${d}min`:`${Math.floor(d/60)}h${d%60?` ${d%60}min`:''}` }
