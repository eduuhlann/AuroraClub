import {garmentFronts} from './garment-fronts';
import {garmentBacks} from './garment-backs';

export type Face = 'frente'|'costas';
export const models = [
 {id:0,name:'Noah',style:'Streetwear',product:'oversized',front:garmentFronts[0],back:garmentBacks[0],area:[.29,.35,.43,.47]},
 {id:1,name:'Yuna',style:'Streetwear',product:'oversized',front:garmentFronts[1],back:garmentBacks[1],area:[.28,.37,.44,.47]},
 {id:2,name:'Theo',style:'Casual',product:'polo',front:garmentFronts[2],back:garmentBacks[2],area:[.29,.35,.4,.43]},
 {id:3,name:'Lia',style:'Essencial',product:'baby',front:garmentFronts[3],back:garmentBacks[3],area:[.33,.37,.37,.3]}
];
export const products = [
 {id:'oversized',name:'Oversized',tag:'AMPLITUDE É LIBERDADE',fit:'Caimento amplo • ombros deslocados',models:[0,1],sizes:['P','M','G','GG','XG']},
 {id:'polo',name:'Polo',tag:'UM CLÁSSICO. OUTRA VISÃO.',fit:'Gola estruturada • corte regular',models:[2],sizes:['P','M','G','GG']},
 {id:'baby',name:'Baby look',tag:'NA SUA MEDIDA',fit:'Corte ajustado • manga curta',models:[3],sizes:['PP','P','M','G']}
];
export function photoStyle(id:number,face:Face='frente'){const y=face==='frente'?'var(--photo-y,0%)':'var(--photo-y-back,100%)';return {backgroundImage:'url(/images/models.png)',backgroundSize:'400% auto',backgroundPosition:`${id*100/3}% ${y}`};}
