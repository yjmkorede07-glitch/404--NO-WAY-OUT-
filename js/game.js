let canvas,ctx,keys={},world={x:0,y:0},last=0,nearNPC=null;
const buildings=[
 {x:-320,y:-230,w:230,h:160,name:"NORTH HILLS"},
 {x:80,y:-270,w:300,h:150,name:"VEYRON CENTRAL"},
 {x:-390,y:50,w:250,h:190,name:"EAST MARKET"},
 {x:120,y:40,w:330,h:210,name:"IRON DISTRICT"},
 {x:-100,y:300,w:500,h:130,name:"WEST COAST"},
 {x:-520,y:-390,w:160,h:100,name:"POLICE HQ"}
];
function init(){initializePlayer();canvas=document.getElementById("cityCanvas");ctx=canvas.getContext("2d");resize();addInput();updateHUD();requestAnimationFrame(loop)}
function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0)}
window.addEventListener("resize",resize);
function addInput(){
 addEventListener("keydown",e=>{keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==="e")interact()});
 addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
 document.querySelectorAll("[data-key]").forEach(b=>{const k=b.dataset.key;b.onpointerdown=()=>keys[k]=true;b.onpointerup=b.onpointercancel=()=>keys[k]=false})
}
function loop(t){const dt=Math.min((t-last)/1000||0,.05);last=t;move(dt);draw();requestAnimationFrame(loop)}
function move(dt){
 let dx=(keys.d?1:0)-(keys.a?1:0),dy=(keys.s?1:0)-(keys.w?1:0);if(!dx&&!dy){player.stamina=Math.min(100,player.stamina+22*dt);return}
 const sprint=keys.shift&&player.stamina>1,speed=sprint?210:130;if(sprint)player.stamina=Math.max(0,player.stamina-28*dt);else player.stamina=Math.min(100,player.stamina+12*dt);
 const l=Math.hypot(dx,dy);player.position.x+=dx/l*speed*dt;player.position.y+=dy/l*speed*dt;world.x=player.position.x;world.y=player.position.y;player.location=getDistrict(player.position.x,player.position.y);savePlayer();updateHUD()
}
function getDistrict(x,y){if(y>250)return"West Coast";if(x<-250&&y<0)return"North Hills";if(x>120&&y>0)return"Iron District";if(x<-250)return"East Market";return"Veyron Central"}
function draw(){
 const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(w/2-world.x,h/2-world.y);
 ctx.fillStyle="#171d21";ctx.fillRect(-900,-700,1800,1400);
 // roads
 ctx.fillStyle="#2a3034";ctx.fillRect(-900,-35,1800,70);ctx.fillRect(-35,-700,70,1400);ctx.fillRect(-900,190,1800,55);
 ctx.strokeStyle="#697078";ctx.setLineDash([20,18]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-900,0);ctx.lineTo(900,0);ctx.moveTo(0,-700);ctx.lineTo(0,700);ctx.stroke();ctx.setLineDash([]);
 buildings.forEach(b=>{ctx.fillStyle="#222a31";ctx.fillRect(b.x,b.y,b.w,b.h);ctx.strokeStyle="#485460";ctx.strokeRect(b.x,b.y,b.w,b.h);ctx.fillStyle="#84909b";ctx.font="12px Arial";ctx.fillText(b.name,b.x+10,b.y+20)});
 // NPCs
 getNPCList().forEach(n=>{ctx.beginPath();ctx.fillStyle=n.id==="malik_reed"?"#4da3ff":n.id==="amara_vale"?"#c77dff":"#f0b35a";ctx.arc(n.position.x,n.position.y,13,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.font="11px Arial";ctx.fillText(n.name,n.position.x-28,n.position.y-18)});
 // player
 ctx.beginPath();ctx.fillStyle="#42e58c";ctx.arc(player.position.x,player.position.y,15,0,Math.PI*2);ctx.fill();ctx.fillStyle="#07110b";ctx.font="bold 11px Arial";ctx.fillText("DC",player.position.x-8,player.position.y+4);
 ctx.restore();updateNearby()
}
function updateNearby(){
 let best=null,dist=999;getNPCList().forEach(n=>{const d=Math.hypot(n.position.x-player.position.x,n.position.y-player.position.y);if(d<dist){dist=d;best=n}});nearNPC=dist<55?best:null;
 const hint=document.getElementById("interactHint");if(nearNPC){hint.textContent=`E / tap: talk to ${nearNPC.name}`;hint.classList.remove("hidden")}else hint.classList.add("hidden")
}
function interact(){if(!nearNPC)return;talkTo(nearNPC.id)}
function talkTo(id){const n=getNPCById(id);if(!n)return;player.reputation.public+=1;n.trust=Math.min(100,n.trust+1);n.memory.push(`Spoke with Darius on ${new Date().toLocaleDateString()}`);savePlayer();showDialogue(n.name,getLine(n));updateHUD()}
function getLine(n){if(n.id==="malik_reed")return"“Darius! You're back. Veyron hasn't gotten any quieter. Your brother's name is still being whispered around the city.”";if(n.id==="amara_vale")return"“You came back. That changes the equation. Don't ask questions in the open.”";return"“I don't know you well enough yet. But I've seen your face around Central.”"}
function showDialogue(name,text){const d=document.getElementById("dialogue");d.innerHTML=`<strong>${name}</strong><p>${text}</p>`;d.classList.remove("hidden");clearTimeout(showDialogue.t);showDialogue.t=setTimeout(()=>d.classList.add("hidden"),5500)}
function updateHUD(){if(!player)return;document.getElementById("cashDisplay").textContent=money(player.cash);document.getElementById("playerName").textContent=player.name;document.getElementById("playerStatus").textContent=player.location;document.getElementById("location").textContent=player.location.toUpperCase();document.getElementById("hp").textContent=Math.round(player.health);document.getElementById("stamina").textContent=Math.round(player.stamina);document.getElementById("rep").textContent=player.reputation.public}
function panel(html){const p=document.getElementById("panel");p.innerHTML=html;p.classList.remove("hidden");p.scrollIntoView({behavior:"smooth",block:"nearest"})}
function closePanel(){document.getElementById("panel").classList.add("hidden")}
function notice(text){const t=document.getElementById("toast");t.textContent=text;t.classList.remove("hidden");clearTimeout(notice.t);notice.t=setTimeout(()=>t.classList.add("hidden"),2200)}
function openPhone(){panel(`<h3>Darius's Phone <button class="close" onclick="closePanel()">×</button></h3><div class="row"><span>Messages</span><b>1 new</b></div><div class="row"><span>Clue board</span><b>Locked</b></div><div class="row"><span>Emergency</span><b>911</b></div><p>Phone systems are being built into the world. The first major clue will connect Darius's missing brother to Veyron City.</p>`)}
function openMap(){panel(`<h3>Veyron City Map <button class="close" onclick="closePanel()">×</button></h3><div class="row"><span>Current district</span><b>${player.location}</b></div><div class="row"><span>Veyron Central</span><span>Commercial core</span></div><div class="row"><span>North Hills</span><span>Wealthy / quiet</span></div><div class="row"><span>East Market</span><span>Busy / residential</span></div><div class="row"><span>Iron District</span><span>Industrial / dangerous</span></div><div class="row"><span>West Coast</span><span>Beach / tourist</span></div><p>More districts, interiors, traffic and world events will plug into this same world layer.</p>`)}
function openNPCs(){const rows=getNPCList().map(n=>`<div class="npc-card"><b>${n.name}</b><span>${n.occupation} · Trust ${n.trust} · ${n.personality}</span></div>`).join("");panel(`<h3>People of Veyron <button class="close" onclick="closePanel()">×</button></h3>${rows}<p>NPC identity, personality, relationships, memory and reactions are now data-driven, ready for deeper simulation.</p>`)}
window.addEventListener("load",init);
