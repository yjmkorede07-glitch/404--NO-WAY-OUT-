const defaultPlayer={
 id:"player_darius_cole",name:"Darius Cole",age:24,cash:500,
 bank:{accountNumber:"40400001",balance:5000,card:{id:"card_40400001",number:"4040-0000-0000-0001",type:"debit",active:true}},
 health:100,armor:0,stamina:100,skills:{driving:1,shooting:1,strength:1,stealth:1},
 reputation:{public:0,local:0,criminal:0,police:0},
 position:{x:0,y:0},location:"Veyron Central",transactions:[]
};
const defaultNPCs={
 malik_reed:{id:"malik_reed",name:"Malik Reed",age:26,occupation:"Mechanic",personality:"Loud, funny, reckless, loyal",mood:"Good",friendliness:75,trust:55,relationship:"Friend",position:{x:140,y:100},cash:300,bank:{accountNumber:"40400002",balance:1200},memory:[]},
 amara_vale:{id:"amara_vale",name:"Amara Vale",age:25,occupation:"Investigative analyst",personality:"Intelligent, controlled, sarcastic, mysterious",mood:"Focused",friendliness:60,trust:35,relationship:"Acquaintance",position:{x:-160,y:-90},cash:250,bank:{accountNumber:"40400003",balance:2500},memory:[]},
 lena_brooks:{id:"lena_brooks",name:"Lena Brooks",age:31,occupation:"Cafe owner",personality:"Warm, observant, cautious",mood:"Busy",friendliness:70,trust:20,relationship:"Stranger",position:{x:250,y:-170},cash:420,bank:{accountNumber:"40400004",balance:3100},memory:[]}
};
let player,npcs;
function initializePlayer(){
 const saved=loadGame();
 player=saved?.player?{...structuredClone(defaultPlayer),...saved.player}:{...structuredClone(defaultPlayer)};
 npcs=saved?.npcs?{...structuredClone(defaultNPCs),...saved.npcs}:structuredClone(defaultNPCs);
 savePlayer();
}
function savePlayer(){saveGame({player,npcs})}
function getNPCById(id){return npcs[id]||null}
function getNPCList(){return Object.values(npcs)}
function addTransaction(title,amount,info=""){player.transactions.unshift({title,amount,info,date:new Date().toLocaleString()});player.transactions=player.transactions.slice(0,40)}
