const protagonists={
 darius:{id:"darius",name:"Darius Cole",age:24,role:"The Investigator",cash:500,bank:5000,health:100,stamina:100,position:{x:0,y:0},skills:{driving:1,shooting:1,strength:1,stealth:1},reputation:0},
 malik:{id:"malik",name:"Malik Reed",age:26,role:"The Mechanic",cash:300,bank:1200,health:100,stamina:100,position:{x:140,y:100},skills:{driving:2,shooting:1,strength:2,stealth:1},reputation:0},
 amara:{id:"amara",name:"Amara Vale",age:25,role:"The Analyst",cash:250,bank:2500,health:100,stamina:100,position:{x:-160,y:-90},skills:{driving:1,shooting:1,strength:1,stealth:3},reputation:0}
};
let gameState;
function initializePlayer(){
 const saved=loadGame();gameState=saved||{active:"darius",characters:structuredClone(protagonists),npcs:defaultNPCs(),vehicles:defaultVehicles(),missions:defaultMissions(),wanted:0,story:{clue1:false}};
 if(!gameState.characters)gameState.characters=structuredClone(protagonists);
 if(!gameState.npcs)gameState.npcs=defaultNPCs(); if(!gameState.vehicles)gameState.vehicles=defaultVehicles();if(!gameState.missions)gameState.missions=defaultMissions();
 saveAll();
}
function currentPlayer(){return gameState.characters[gameState.active]}
function saveAll(){saveGame(gameState)}
function defaultNPCs(){return{
 malik_friend:{id:"malik_friend",name:"Malik Reed",occupation:"Mechanic",personality:"Loud, funny, reckless, loyal",trust:55,position:{x:140,y:100},memory:[]},
 amara_friend:{id:"amara_friend",name:"Amara Vale",occupation:"Investigative analyst",personality:"Intelligent, controlled, sarcastic, mysterious",trust:35,position:{x:-160,y:-90},memory:[]},
 lena:{id:"lena",name:"Lena Brooks",occupation:"Cafe owner",personality:"Warm, observant, cautious",trust:20,position:{x:250,y:-170},memory:[]}}}
function defaultVehicles(){return[
{id:"veyron_sedan",name:"Veyron Sedan",type:"Car",owner:"darius",x:70,y:75,health:100,owned:true},
{id:"malik_van",name:"Reed Workshop Van",type:"Van",owner:"malik",x:190,y:125,health:100,owned:true}
]}
function defaultMissions(){return[
{id:"m1",title:"The Missing Name",description:"Talk to Malik and Amara. Find out why Darius's missing brother is still being whispered about.",status:"available",reward:750,progress:0},
{id:"m2",title:"A Quiet Transfer",description:"Send Malik $100 through the bank. This is a small trust test.",status:"locked",reward:250,progress:0}
]}
function switchCharacter(id){if(!gameState.characters[id])return;gameState.active=id;const p=currentPlayer();saveAll();updateHUD();notice(p.name+" is now active.");draw()}
