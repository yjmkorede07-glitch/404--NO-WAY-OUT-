let canvas,ctx,keys={},world={x:0,y:0},last=0,near=null;
const P3_DISTRICTS=[
{x:0,y:0,w:620,h:420,name:"VEYRON CENTRAL",id:"central"},
{x:-620,y:20,w:320,h:300,name:"EAST MARKET",id:"east"},
{x:-470,y:-430,w:420,h:280,name:"NORTH HILLS",id:"north"},
{x:260,y:40,w:420,h:300,name:"IRON DISTRICT",id:"iron"},
{x:-180,y:430,w:700,h:190,name:"WEST COAST",id:"west"},
{x:600,y:-520,w:520,h:300,name:"VEYRON INTERNATIONAL AIRPORT",id:"airport"},
{x:690,y:390,w:520,h:300,name:"VEYRON PORT",id:"port"},
{x:1120,y:-180,w:360,h:300,name:"BLACKWATER ISLAND",id:"island"}];
const INTERIORS=[
{id:"bank",x:120,y:70,w:100,h:70,name:"BANK"},
{id:"safehouse",x:-70,y:100,w:100,h:70,name:"SAFEHOUSE"},
{id:"market",x:-170,y:30,w:110,h:70,name:"MARKET"},
{id:"police",x:-60,y:-90,w:130,h:75,name:"POLICE HQ"},
{id:"workshop",x:350,y:110,w:125,h:80,name:"REED WORKSHOP"},
{id:"cafe",x:-500,y:100,w:100,h:70,name:"LENA'S CAFE"},
{id:"warehouse",x:800,y:480,w:150,h:90,name:"WAREHOUSE 7"},
{id:"terminal",x:760,y:-410,w:180,h:100,name:"AIRPORT TERMINAL"}];
let traffic=[],worldWeather={kind:"clear",timer:0},worldClock=8*60;

function init(){initializePlayer();canvas=document.getElementById("cityCanvas");ctx=canvas.getContext("2d");resize();seedTraffic();addInput();updateHUD();requestAnimationFrame(loop)}
function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0)}
addEventListener("resize",resize);
function addInput(){addEventListener("keydown",e=>{keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==="e")interact()});addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);document.querySelectorAll("[data-key]").forEach(b=>{const k=b.dataset.key;b.onpointerdown=()=>keys[k]=true;b.onpointerup=b.onpointercancel=()=>keys[k]=false})}
function seedTraffic(){for(let i=0;i<32;i++){traffic.push({x:-800+Math.random()*1900,y:-650+Math.random()*1300,axis:Math.random()<.5?"x":"y",speed:45+Math.random()*45,phase:Math.random()*6.28})}}
function loop(t){const dt=Math.min((t-last)/1000||0,.05);last=t;worldClock=(worldClock+dt*.55)%1440;worldWeather.timer-=dt;if(worldWeather.timer<=0){worldWeather.kind=["clear","clear","cloudy","rain"][Math.floor(Math.random()*4)];worldWeather.timer=75+Math.random()*90}move(dt);updateTraffic(dt);if(typeof window.playableTick==="function")window.playableTick(dt);draw();requestAnimationFrame(loop)}
function move(dt){const p=currentPlayer();let dx=(keys.d?1:0)-(keys.a?1:0),dy=(keys.s?1:0)-(keys.w?1:0);if(!dx&&!dy){p.stamina=Math.min(100,p.stamina+22*dt);return}const sprint=keys.shift&&p.stamina>1,speed=sprint?210:130;if(sprint)p.stamina=Math.max(0,p.stamina-28*dt);else p.stamina=Math.min(100,p.stamina+12*dt);const l=Math.hypot(dx,dy);p.position.x+=dx/l*speed*dt;p.position.y+=dy/l*speed*dt;p.location=getDistrict(p.position.x,p.position.y);saveAll();updateHUD()}
function updateTraffic(dt){const density=trafficDensity();traffic.forEach(v=>{if(v.axis==="x")v.x+=v.speed*dt;else v.y+=v.speed*dt;if(v.x>1250)v.x=-850;if(v.y>800)v.y=-700})}
function trafficDensity(){const h=worldClock/60;if(h>=7&&h<10)return .75;if(h>=17&&h<21)return 1;if(h>=22||h<6)return .35;return .9}
function getDistrict(x,y){for(const d of P3_DISTRICTS)if(x>=d.x&&x<=d.x+d.w&&y>=d.y&&y<=d.y+d.h)return d.name.replace("VEYRON INTERNATIONAL AIRPORT","Airport").replace("VEYRON PORT","Veyron Port").replace("BLACKWATER ISLAND","Blackwater Island");return"Veyron Outskirts"}
function timeText(){let h=Math.floor(worldClock/60)%24,m=Math.floor(worldClock%60);return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")}
function draw(){const w=canvas.clientWidth,h=canvas.clientHeight;const cp=currentPlayer();const follow=cp&&cp.inVehicle?gameState.vehicles.find(v=>v.id===cp.inVehicle):null;const focus=follow||cp;if(focus){world.x=focus.position?focus.position.x:focus.x;world.y=focus.position?focus.position.y:focus.y;}ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(w/2-world.x,h/2-world.y);
ctx.fillStyle=worldWeather.kind==="rain"?"#11181c":"#171d21";ctx.fillRect(-1000,-800,2600,1600);
drawRoads();P3_DISTRICTS.forEach(d=>{ctx.fillStyle=d.id==="central"?"#202a31":d.id==="west"?"#1e2b2b":d.id==="iron"?"#272522":d.id==="north"?"#20292a":"#20252a";ctx.fillRect(d.x,d.y,d.w,d.h);ctx.strokeStyle="#3b4752";ctx.strokeRect(d.x,d.y,d.w,d.h);ctx.fillStyle="#8a96a2";ctx.font="12px Arial";ctx.fillText(d.name,d.x+12,d.y+20)});
INTERIORS.forEach(i=>{ctx.fillStyle="#34404a";ctx.fillRect(i.x,i.y,i.w,i.h);ctx.strokeStyle="#778391";ctx.strokeRect(i.x,i.y,i.w,i.h);ctx.fillStyle="#e0e6ec";ctx.font="10px Arial";ctx.fillText(i.name,i.x+7,i.y+i.h/2)});
traffic.forEach(v=>{ctx.fillStyle="#56616b";ctx.fillRect(v.x-8,v.y-5,16,10)});
Object.values(gameState.npcs).forEach(n=>{npcPosition(n);ctx.beginPath();ctx.fillStyle=n.id.includes("malik")?"#4da3ff":n.id.includes("amara")?"#c77dff":"#f0b35a";ctx.arc(n.position.x,n.position.y,13,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.font="11px Arial";ctx.fillText(n.name,n.position.x-28,n.position.y-18)});
gameState.vehicles.forEach(v=>{const active=v.id===gameState.characters[gameState.active]?.inVehicle;ctx.save();ctx.translate(v.x,v.y);ctx.rotate(v.heading||0);ctx.fillStyle=active?"#42e58c":v.owner===gameState.active?"#d6b36a":"#65717d";ctx.fillRect(-18,-9,36,18);ctx.fillStyle="#11181f";ctx.fillRect(-11,-6,22,12);ctx.fillStyle="#c8d2dc";ctx.font="8px Arial";ctx.fillText(v.name?.split(" ")[0]||"CAR",-15,23);ctx.restore()});Object.values(gameState.remotePlayers||{}).forEach(r=>{ctx.beginPath();ctx.fillStyle="#ffcf5a";ctx.arc(r.x,r.y,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.font="9px Arial";ctx.fillText(r.name||"Online",r.x-22,r.y-17)});
const p=currentPlayer();if(!p.inVehicle){ctx.beginPath();ctx.fillStyle=gameState.active==="darius"?"#42e58c":gameState.active==="malik"?"#4da3ff":"#c77dff";ctx.arc(p.position.x,p.position.y,15,0,Math.PI*2);ctx.fill();}
if(worldWeather.kind==="rain"){ctx.strokeStyle="#7e9bad";for(let i=0;i<80;i++){let x=(i*97)%1500-700,y=(i*53+worldClock*10)%1100-500;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-4,y+14);ctx.stroke()}}
ctx.restore();updateNearby()}
function drawRoads(){ctx.fillStyle="#2a3034";ctx.fillRect(-1000,-35,2600,70);ctx.fillRect(-35,-800,70,1600);ctx.fillRect(-800,300,1900,55);ctx.fillRect(500,-800,65,1600);ctx.strokeStyle="#697078";ctx.setLineDash([20,18]);ctx.beginPath();ctx.moveTo(-1000,0,1600,0);ctx.moveTo(0,-800,0,800);ctx.stroke();ctx.setLineDash([])}
function npcPosition(n){if(n.id==="malik_friend")n.position={x:140+Math.sin(worldClock/45)*35,y:100+Math.cos(worldClock/45)*25};else if(n.id==="amara_friend")n.position={x:-160+Math.sin(worldClock/60)*70,y:-90+Math.cos(worldClock/60)*45};else n.position={x:-500+Math.cos(worldClock/35)*60,y:100+Math.sin(worldClock/35)*40}}
function updateNearby(){const p=currentPlayer();near=null;let dist=999;Object.values(gameState.npcs).forEach(n=>{const d=Math.hypot(n.position.x-p.position.x,n.position.y-p.position.y);if(d<dist){dist=d;near=n}});const h=document.getElementById("interactHint");if(near&&dist<55){h.textContent=`E / tap: talk to ${near.name}`;h.classList.remove("hidden")}else h.classList.add("hidden")}
function interact(){if(near)talkTo(near.id)}
function talkTo(id){const n=gameState.npcs[id];if(!n)return;const p=currentPlayer();n.trust=Math.min(100,n.trust+1);n.memory.push("Spoke with "+p.name+" at "+timeText());showDialogue(n.name,dialogueFor(n,p));saveAll()}
function dialogueFor(n,p){if(n.id.includes("malik"))return`“${p.name}, you caught me at ${timeText()}. Reed Workshop is busy today. If you need wheels, come prepared.”`;if(n.id.includes("amara"))return`“The city changes after dark. Watch the schedules, not just the streets, ${p.name}. That's where the useful patterns are.”`;return`“You're in ${getDistrict(p.position.x,p.position.y)}. People notice who keeps coming back.”`}
function showDialogue(name,text){const d=document.getElementById("dialogue");d.innerHTML=`<strong>${name}</strong><p>${text}</p>`;d.classList.remove("hidden");clearTimeout(showDialogue.t);showDialogue.t=setTimeout(()=>d.classList.add("hidden"),5000)}
function updateHUD(){if(!gameState)return;const p=currentPlayer();document.getElementById("cashDisplay").textContent=money(p.cash);document.getElementById("playerName").textContent=p.name;document.getElementById("playerStatus").textContent=p.role+" · "+(p.location||getDistrict(p.position.x,p.position.y));document.getElementById("location").textContent=(p.location||getDistrict(p.position.x,p.position.y)).toUpperCase()+" · "+timeText()+" · "+worldWeather.kind.toUpperCase();document.getElementById("hp").textContent=Math.round(p.health);document.getElementById("stamina").textContent=Math.round(p.stamina);document.getElementById("wanted").textContent=gameState.wanted}
function panel(html){const p=document.getElementById("panel");p.innerHTML=html;p.classList.remove("hidden");p.scrollIntoView({behavior:"smooth",block:"nearest"})}
function closePanel(){document.getElementById("panel").classList.add("hidden")}
function notice(text){const t=document.getElementById("toast");t.textContent=text;t.classList.remove("hidden");clearTimeout(notice.t);notice.t=setTimeout(()=>t.classList.add("hidden"),2300)}
function openPhone(){panel(`<h3>Phone <button class="close" onclick="closePanel()">×</button></h3><div class="row"><span>Time</span><b>${timeText()}</b></div><div class="row"><span>Weather</span><b>${worldWeather.kind}</b></div><div class="row"><span>District</span><b>${currentPlayer().location}</b></div><p>Phase 3 phone foundation: time, weather, district awareness and future calls/messages/social systems.</p>`)}
function openMap(){panel(`<h3>Veyron City Map <button class="close" onclick="closePanel()">×</button></h3>${P3_DISTRICTS.map(d=>`<div class="row"><span><b>${d.name}</b></span><small>${d.w} × ${d.h}</small></div>`).join("")}<p>Airport, port and Blackwater Island are now represented in the world data and map. Later phases can attach missions and full interiors.</p>`)}
function openNPCs(){panel(`<h3>People <button class="close" onclick="closePanel()">×</button></h3>${Object.values(gameState.npcs).map(n=>`<div class="row"><span><b>${n.name}</b><small>${n.occupation}</small></span><b>Trust ${n.trust}</b></div>`).join("")}`)}
function openInteriors(){panel(`<h3>Interiors <button class="close" onclick="closePanel()">×</button></h3>${INTERIORS.map(i=>`<div class="row"><span><b>${i.name}</b><small>${i.kind} · ${i.district}</small></span><button onclick="enterInterior('${i.id}')">ENTER</button></div>`).join("")}`)}
function enterInterior(id){const i=INTERIORS.find(x=>x.id===id);if(!i)return;const p=currentPlayer();const d=Math.hypot(i.x-p.position.x,i.y-p.position.y);if(d>110)return notice("Move closer to "+i.name+".");notice("Entered "+i.name+". Interior scene foundation loaded.");}
window.addEventListener("load",init);
