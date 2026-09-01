/*
 * 404: NO WAY OUT — PHASE 17
 * Dynamic Relationships + Mission Triggers + World Simulation + Aim/Controller Contracts
 *
 * Browser prototype layer. Production-grade third-person controller, animation,
 * physics, networking and voice are future Unreal/backend responsibilities.
 */
(function(){
"use strict";
const P17={nearby:null,callQueue:[],simAccumulator:0,aimLocked:null};
const MISSION_TRIGGERS=[
 {id:"M01",type:"marker",location:"Veyron International Airport",marker:"m01_airport",title:"First Night"},
 {id:"M02",type:"approach",location:"Cole Family House",npc:"Local Contact",title:"Old Walls"},
 {id:"M03",type:"approach",location:"East Veyron",npc:"Street Mechanic",title:"Bad Timing"},
 {id:"M04",type:"call",caller:"Amara",title:"Quiet Contact"},
 {id:"M05",type:"marker",location:"Iron District",marker:"m05_safehouse",title:"Three Ways In"}
];
const RELATIONSHIPS={
 Darius:{Amara:{type:"ally",trust:50,affection:20},Malik:{type:"friend",trust:65,affection:5}},
 Malik:{Darius:{type:"friend",trust:65,affection:5}},
 Amara:{Darius:{type:"ally",trust:50,affection:20}}
};
function G(){return window.gameState||{}}
function save(){if(typeof window.saveAll==="function")window.saveAll()}
function note(t){if(typeof window.notice==="function")window.notice(t)}
function p(){return typeof window.currentPlayer==="function"?window.currentPlayer():null}
function ensure(){
 const g=G();
 g.p17=g.p17||{};
 g.p17.relationships=g.p17.relationships||JSON.parse(JSON.stringify(RELATIONSHIPS));
 g.p17.calls=g.p17.calls||[];
 g.p17.missionTriggers=g.p17.missionTriggers||{};
 g.p17.worldSim=g.p17.worldSim||{traffic:50,crowd:50,business:1,emergency:0,weather:"clear",timeScale:1};
 g.p17.aim=g.p17.aim||{enabled:true,mode:"soft-lock",target:null,range:42,assist:0.65};
 g.p17.controller=g.p17.controller||{connected:false,type:"unknown",layout:"gamepad"};
}
function distance(a,b){if(!a||!b)return Infinity;return Math.hypot((a.x||0)-(b.x||0),(a.y||0)-(b.y||0))}
function setRelation(a,b,deltaTrust,deltaAff=0){
 ensure();const r=G().p17.relationships;
 r[a]=r[a]||{};r[a][b]=r[a][b]||{type:"contact",trust:50,affection:0};
 r[a][b].trust=Math.max(0,Math.min(100,r[a][b].trust+deltaTrust));
 r[a][b].affection=Math.max(0,Math.min(100,r[a][b].affection+deltaAff));
 r[a][b].lastInteraction=Date.now();save()
}
function relation(a,b){ensure();return G().p17.relationships?.[a]?.[b]||null}
function speak(character,line){
 if(typeof window.phase16?.dialogue==="function")return window.phase16.dialogue(character,line,true);
 if(typeof window.phase11Speak==="function")return window.phase11Speak(line,character);
 if("speechSynthesis"in window){try{let u=new SpeechSynthesisUtterance(line);u.rate=.95;speechSynthesis.speak(u)}catch(e){}}
}
function conversationalResponse(npc,context){
 const n=(npc?.personality||"neutral").toLowerCase(), mood=(npc?.mood||"neutral").toLowerCase();
 if(context==="bump")return n.includes("funny")?"Watch it, man. You buying me a new shirt?":mood==="angry"?"You want a problem?":"Hey, watch where you're going.";
 if(context==="help")return n.includes("sarcastic")?"Sure. Because my day needed more trouble.":"Yeah, I can help. What happened?";
 if(context==="threat")return n.includes("brave")?"You're going to have to do better than that.":"Back off.";
 return "What's up?";
}
function interactNPC(npc,context="greet"){
 ensure();
 const playerName=p()?.name||"Darius";
 const line=conversationalResponse(npc,context);
 speak(npc?.name||"NPC",line);
 if(npc?.name)setRelation(playerName,npc.name,context==="help"?2:-1,context==="greet"?1:0);
 return line;
}
function queueCall(caller,missionId,text){
 ensure();
 const call={id:`call-${Date.now()}-${Math.random().toString(16).slice(2)}`,caller,missionId,text,status:"ringing",time:Date.now()};
 G().p17.calls.push(call);P17.callQueue.push(call);save();render();
 return call;
}
function answerCall(id){
 ensure();const c=G().p17.calls.find(x=>x.id===id);if(!c)return;
 c.status="answered";speak(c.caller,c.text);
 if(c.missionId&&window.phase16?.start)window.phase16.start(c.missionId);
 save();render()
}
function declineCall(id){
 ensure();const c=G().p17.calls.find(x=>x.id===id);if(!c)return;c.status="declined";save();render()
}
function enterMarker(markerId){
 ensure();
 const t=MISSION_TRIGGERS.find(x=>x.marker===markerId);if(!t)return false;
 if(t.type!=="marker")return false;
 note(`${t.title} · APPROACH MARKER`);
 return window.phase16?.start?t&&window.phase16.start(t.id):false
}
function approachNPC(npcName){
 ensure();
 const t=MISSION_TRIGGERS.find(x=>x.type==="approach"&&x.npc===npcName);
 if(t){
   note(`${t.title} · ${npcName}`);
   if(window.phase16?.start)window.phase16.start(t.id);
   return true
 }
 return false
}
function requestMissionCall(){
 ensure();
 const pending=MISSION_TRIGGERS.find(t=>t.type==="call"&&!G().p17.missionTriggers[t.id] &&
   !(G().p16?.missions||[]).some(m=>m.id===t.id&&m.completed));
 if(!pending)return false;
 G().p17.missionTriggers[pending.id]="queued";
 queueCall(pending.caller,pending.id,`I've got something you need to hear. Call me back when you're somewhere quiet.`);
 return true
}
function detectController(){
 ensure();
 const gp=navigator.getGamepads?Array.from(navigator.getGamepads()||[]).find(Boolean):null;
 if(gp){G().p17.controller.connected=true;G().p17.controller.type=gp.id||"gamepad";return true}
 G().p17.controller.connected=false;return false
}
function controllerInput(){
 ensure();
 const gp=navigator.getGamepads?Array.from(navigator.getGamepads()||[]).find(Boolean):null;
 if(!gp)return;
 const b=(i)=>!!gp.buttons?.[i]?.pressed;
 const ax=gp.axes||[];
 // Standard Gamepad mapping: right stick aims, left stick moves, RT fires, A interacts.
 G().p17.controller.axes={moveX:ax[0]||0,moveY:ax[1]||0,aimX:ax[2]||0,aimY:ax[3]||0};
 if(b(0)&&!P17.aPressed){P17.aPressed=true;note("INTERACT / ENTER VEHICLE")}
 if(!b(0))P17.aPressed=false;
 if(b(7)&&!P17.rtPressed){P17.rtPressed=true;window.phase14?.combatFire?.()}
 if(!b(7))P17.rtPressed=false;
}
function findAimTargets(){
 const g=G(),pl=p();if(!pl?.position)return[];
 const npcs=Object.values(g.npcs||{}),vehicles=Object.values(g.vehicles||{});
 return npcs.concat(vehicles).map(o=>({o,d:distance(pl.position,o.position)})).filter(x=>x.d<=42).sort((a,b)=>a.d-b.d)
}
function updateAim(){
 ensure();
 const a=G().p17.aim;
 if(!a.enabled){a.target=null;return}
 const targets=findAimTargets();
 a.target=targets[0]?.o?.id||targets[0]?.o?.name||null;
 a.assist=targets.length?0.65:0.2;
 P17.aimLocked=targets[0]?.o||null;
}
function simulate(dt){
 ensure();const w=G().p17.worldSim;
 P17.simAccumulator+=dt;
 if(P17.simAccumulator<2)return;P17.simAccumulator=0;
 // Tiered simulation contract: near/same-district/off-screen are represented as aggregate values in browser.
 w.traffic=Math.max(0,Math.min(100,w.traffic+(Math.random()-.5)*8));
 w.crowd=Math.max(0,Math.min(100,w.crowd+(Math.random()-.5)*5));
 w.business=w.business+(Math.random()-.5)*.03;
 if((G().wanted||0)>0)w.emergency=Math.min(100,w.emergency+(G().wanted*2));
 else w.emergency=Math.max(0,w.emergency-2);
}
function render(){
 ensure();
 const el=document.getElementById("p17Status");
 if(el){
  const c=G().p17.controller;
  const a=G().p17.aim;
  el.textContent=`${c.connected?"CONTROLLER":"TOUCH"} · AIM ${a.enabled?"ON":"OFF"}${a.target?" · "+a.target:""}`;
 }
 const call=G().p17.calls?.find(c=>c.status==="ringing");
 const ce=document.getElementById("p17Call");
 if(ce)ce.textContent=call?`INCOMING · ${call.caller}`:"NO INCOMING CALL";
}
function panel(){
 ensure();
 const rel=G().p17.relationships||{};
 const rows=[];
 Object.keys(rel).forEach(a=>Object.keys(rel[a]||{}).forEach(b=>{
  const r=rel[a][b];rows.push(`<div class="p17-row"><b>${a} ↔ ${b}</b><span>Trust ${Math.round(r.trust)} · Affection ${Math.round(r.affection)}</span></div>`)
 }));
 const call=G().p17.calls?.find(c=>c.status==="ringing");
 const fn=window.panel||window.openPanel;
 if(typeof fn==="function")fn(`<h3>WORLD & RELATIONSHIPS <button class="close" onclick="closePanel()">×</button></h3>
 <div class="p17-row"><b>Controller</b><span>${G().p17.controller.connected?"Connected":"Touch / keyboard"}</span></div>
 <div class="p17-row"><b>Auto Aim</b><span>${G().p17.aim.enabled?"Soft lock":"Off"}</span></div>
 <div class="p17-row"><b>World</b><span>Traffic ${Math.round(G().p17.worldSim.traffic)} · Crowd ${Math.round(G().p17.worldSim.crowd)}</span></div>
 ${call?`<button onclick="phase17.answer('${call.id}')">ANSWER ${call.caller}</button><button onclick="phase17.decline('${call.id}')">DECLINE</button>`:"<p>No incoming calls.</p>"}
 <h4>RELATIONSHIPS</h4>${rows.join("")||"<p>No relationships recorded yet.</p>"}`);
}
window.phase17={
 ensure,interactNPC,setRelation,relation,queueCall,answer:answerCall,decline:declineCall,
 enterMarker,approachNPC,requestMissionCall,detectController,updateAim,simulate,panel,
 getAimTarget:()=>P17.aimLocked,missionTriggers:MISSION_TRIGGERS
};
window.addEventListener("gamepadconnected",()=>{ensure();G().p17.controller.connected=true;save();render()});
window.addEventListener("gamepaddisconnected",()=>{ensure();G().p17.controller.connected=false;save();render()});
window.addEventListener("keydown",e=>{
 if(e.key.toLowerCase()==="q")requestMissionCall();
 if(e.key.toLowerCase()==="e")interactNPC({name:"Nearby NPC",personality:"neutral"},"greet");
 if(e.key.toLowerCase()==="tab"){ensure();G().p17.aim.enabled=!G().p17.aim.enabled;note(`AUTO AIM ${G().p17.aim.enabled?"ON":"OFF"}`);save();render()}
});
let last=performance.now();
function loop(now){const dt=Math.min(.1,(now-last)/1000);last=now;detectController();controllerInput();updateAim();simulate(dt);render();requestAnimationFrame(loop)}
window.addEventListener("load",()=>{
 ensure();
 setTimeout(()=>{
  const q=document.querySelector(".quick-menu");
  if(q&&!document.getElementById("worldRelationshipsButton")){
   const b=document.createElement("button");b.id="worldRelationshipsButton";b.textContent="WORLD / RELATIONSHIPS";b.onclick=panel;q.appendChild(b)
  }
  render()
 },1100);
 requestAnimationFrame(loop);
});
})();
