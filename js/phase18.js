/*
 * 404: NO WAY OUT — PHASE 18
 * Final browser-side integration layer:
 * dynamic relationships + mission trigger graph + world simulation +
 * witness/police investigation contracts + dynamic weather/business state.
 *
 * This is intentionally a 2D browser-prototype layer. It does not claim
 * production 3D animation, physics, or authoritative multiplayer.
 */
(function(){
"use strict";

const P18={
  lastWorldTick:0,
  lastMissionSignature:"",
  weatherTimer:0,
  businessTimer:0
};

const RELATIONSHIP_SEEDS={
  darius:{malik:{type:"friend",trust:65,affection:8},amara:{type:"ally",trust:50,affection:18}},
  malik:{darius:{type:"friend",trust:65,affection:8},amara:{type:"contact",trust:45,affection:10}},
  amara:{darius:{type:"ally",trust:50,affection:18},malik:{type:"contact",trust:45,affection:10}}
};

const WORLD_DISTRICTS=[
  {id:"central",name:"Veyron Central",pressure:55},
  {id:"east",name:"East Veyron",pressure:48},
  {id:"west",name:"West Coast",pressure:35},
  {id:"north",name:"North Hills",pressure:28},
  {id:"iron",name:"Iron District",pressure:62},
  {id:"airport",name:"Airport",pressure:42},
  {id:"port",name:"Veyron Port",pressure:70},
  {id:"island",name:"Blackwater Island",pressure:58}
];

const WEATHER=["clear","cloudy","rain","storm"];
const BUSINESS_TYPES=["retail","nightlife","garage","warehouse","hotel","restaurant","financial"];
const TRIGGER_TYPES=["marker","approach","call","location","condition"];

function G(){return window.gameState||{}}
function save(){if(typeof window.saveAll==="function")window.saveAll()}
function note(t){if(typeof window.notice==="function")window.notice(t)}
function safeClone(v){return JSON.parse(JSON.stringify(v))}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function ensure(){
  const g=G();
  g.p18=g.p18||{};
  const p=g.p18;
  if(!p.relationships)p.relationships=safeClone(RELATIONSHIP_SEEDS);
  if(!p.npcRelations)p.npcRelations={};
  if(!p.missionTriggers)p.missionTriggers={};
  if(!p.policeCases)p.policeCases=[];
  if(!p.worldSim)p.worldSim={
    traffic:50,crowd:50,emergency:0,businessActivity:55,
    weather:"clear",weatherIntensity:0.15,dayPhase:"day",
    districtPressure:{},activeEvents:[],lastTick:Date.now()
  };
  if(!p.businesses)p.businesses=seedBusinesses();
  if(!p.npcSimulation)p.npcSimulation={nearby:[],districtCounts:{},lastUpdate:Date.now()};
  if(!p.lastResults)p.lastResults={};
  WORLD_DISTRICTS.forEach(d=>{
    if(typeof p.worldSim.districtPressure[d.id]!=="number")p.worldSim.districtPressure[d.id]=d.pressure;
  });
}
function seedBusinesses(){
  return [
    {id:"biz_central_retail",name:"Central Market Row",district:"central",type:"retail",activity:60,open:true},
    {id:"biz_iron_garage",name:"Reed Workshop",district:"iron",type:"garage",activity:72,open:true},
    {id:"biz_west_hotel",name:"West Coast Hotel",district:"west",type:"hotel",activity:52,open:true},
    {id:"biz_port_warehouse",name:"Port Warehouse 7",district:"port",type:"warehouse",activity:68,open:true},
    {id:"biz_central_finance",name:"Veyron Central Bank",district:"central",type:"financial",activity:48,open:true},
    {id:"biz_nightlife",name:"Northline Club",district:"central",type:"nightlife",activity:70,open:false},
    {id:"biz_airport_hotel",name:"Terminal Hotel",district:"airport",type:"hotel",activity:45,open:true},
    {id:"biz_east_restaurant",name:"Lena's Cafe",district:"east",type:"restaurant",activity:58,open:true}
  ];
}
function currentProtagonistId(){
  return String(G().active||"darius").toLowerCase();
}
function setRelation(a,b,trustDelta=0,affectionDelta=0,reason="interaction"){
  ensure();
  const keyA=String(a).toLowerCase(),keyB=String(b).toLowerCase();
  G().p18.relationships[keyA]=G().p18.relationships[keyA]||{};
  const r=G().p18.relationships[keyA][keyB]||(G().p18.relationships[keyA][keyB]={
    type:"contact",trust:50,affection:0
  });
  r.trust=clamp(Number(r.trust||0)+Number(trustDelta||0),0,100);
  r.affection=clamp(Number(r.affection||0)+Number(affectionDelta||0),0,100);
  r.lastInteraction=Date.now();
  r.lastReason=reason;
  save();
  return r;
}
function relation(a,b){ensure();return G().p18.relationships?.[String(a).toLowerCase()]?.[String(b).toLowerCase()]||null}

function triggerTypeForMission(m,index){
  if(m.id==="M01")return "marker";
  if(m.prototype_trigger)return m.prototype_trigger.type||"marker";
  const t=TRIGGER_TYPES[index%TRIGGER_TYPES.length];
  return t==="condition"?"condition":t;
}
function buildMissionTrigger(m,index){
  const type=triggerTypeForMission(m,index);
  const previous=(m.required_previous_missions||[])[0]||null;
  return {
    missionId:m.id,title:m.title,type,
    previous:previous,
    location:m.location||"Veyron Central",
    protagonist:m.protagonist||"darius",
    discoverable:true,
    unlockedBy:previous?{mission:previous}:null,
    state:"locked"
  };
}
function buildMissionTriggers(){
  ensure();
  const missions=Array.isArray(window.campaign88?.missions)?window.campaign88.missions:[];
  if(!missions.length)return;
  missions.forEach((m,i)=>{
    const id=m.id;
    if(!G().p18.missionTriggers[id])G().p18.missionTriggers[id]=buildMissionTrigger(m,i);
  });
}
function missionCompleted(id){
  const g=G();
  return !!(g.missionRuntime?.results?.[id] && g.missionRuntime.results[id].failed===false)
    || !!(g.story?.completedMissions||[]).includes(id)
    || !!(g.p16?.missions||[]).some(x=>x.id===id&&x.completed);
}
function missionUnlocked(id){
  const m=(window.campaign88?.missions||[]).find(x=>x.id===id);
  if(!m)return false;
  if(id==="M01")return true;
  const req=m.required_previous_missions||[];
  return !req.length || req.every(missionCompleted);
}
function refreshMissionTriggers(){
  ensure();buildMissionTriggers();
  Object.values(G().p18.missionTriggers).forEach(t=>{
    const old=t.state;
    t.state=missionUnlocked(t.missionId)?"available":"locked";
    if(old!==t.state&&t.state==="available")t.availableAt=Date.now();
  });
}
function discoverMission(id,source="world"){
  ensure();refreshMissionTriggers();
  const t=G().p18.missionTriggers[id];
  if(!t||t.state!=="available")return false;
  t.discovered=true;t.discoveredAt=Date.now();t.source=source;save();
  note(`${t.title} · NEW LEAD`);
  return true;
}
function startDiscoveredMission(id){
  ensure();
  const t=G().p18.missionTriggers[id];
  if(!t||!t.discovered)return false;
  if(typeof window.startPlayableMission==="function")return window.startPlayableMission(id);
  if(window.phase16?.start)return window.phase16.start(id);
  return false;
}

function reportIncident(data={}){
  ensure();
  const now=Date.now(), id=`case-${now}-${Math.random().toString(16).slice(2)}`;
  const c={
    id,type:data.type||"disturbance",
    district:data.district||"central",
    witnessCount:Math.max(0,Number(data.witnessCount??1)),
    cameraEvidence:!!data.cameraEvidence,
    recognized:!!data.recognized,
    vehicleId:data.vehicleId||null,
    suspect:data.suspect||currentProtagonistId(),
    stage:"incident",
    confidence:0,
    createdAt:now,
    evidence:[]
  };
  if(c.witnessCount)c.evidence.push("witness report");
  if(c.cameraEvidence)c.evidence.push("camera footage");
  if(c.vehicleId)c.evidence.push("vehicle description");
  G().p18.policeCases.push(c);
  advancePoliceCase(c.id);
  save();
  return c;
}
function advancePoliceCase(id){
  ensure();
  const c=G().p18.policeCases.find(x=>x.id===id);if(!c)return null;
  const chain=["incident","witness","report","dispatch","investigation","search","identification","pursuit"];
  let i=chain.indexOf(c.stage);
  if(i<0)i=0;
  if(c.witnessCount>0||c.cameraEvidence)i++;
  if(c.witnessCount>0)c.confidence+=clamp(c.witnessCount*0.12,0,0.35);
  if(c.cameraEvidence)c.confidence+=0.25;
  if(c.recognized)c.confidence+=0.3;
  if(c.vehicleId)c.confidence+=0.12;
  if(i>=chain.length-1&&c.confidence>=0.55)c.stage="pursuit";
  else c.stage=chain[Math.min(i,chain.length-1)];
  c.confidence=clamp(c.confidence,0,1);
  return c;
}

function dayPhase(){
  const mins=typeof window.worldClock==="number"?window.worldClock:(G().p18.worldSim.minutes||720);
  if(mins<360)return"night";
  if(mins<660)return"morning";
  if(mins<1020)return"day";
  if(mins<1320)return"evening";
  return"night";
}
function updateWeather(dt){
  ensure();const w=G().p18.worldSim;
  P18.weatherTimer-=dt;
  if(P18.weatherTimer>0)return;
  const roll=Math.random();
  const current=w.weather;
  let next=current;
  if(current==="storm")next=roll<0.6?"rain":roll<0.85?"cloudy":"clear";
  else if(current==="rain")next=roll<0.2?"storm":roll<0.65?"rain":"cloudy";
  else if(current==="cloudy")next=roll<0.25?"rain":roll<0.55?"cloudy":"clear";
  else next=roll<0.12?"rain":roll<0.38?"cloudy":"clear";
  w.weather=next;
  w.weatherIntensity=next==="storm"?0.95:next==="rain"?0.65:next==="cloudy"?0.35:0.1;
  P18.weatherTimer=45+Math.random()*90;
}
function updateBusinesses(){
  ensure();const w=G().p18.worldSim, phase=dayPhase();
  G().p18.businesses.forEach(b=>{
    const base=phase==="night"?(b.type==="nightlife"?88:42):(b.type==="financial"?75:b.type==="restaurant"?68:55);
    const district=w.districtPressure[b.district]||50;
    b.activity=clamp((b.activity*0.75)+(base*0.15)+(district*0.10)+(Math.random()*8-4),0,100);
    b.open=!(phase==="night"&&["financial"].includes(b.type)) || b.type==="nightlife";
  });
  w.businessActivity=G().p18.businesses.reduce((a,b)=>a+b.activity,0)/Math.max(1,G().p18.businesses.length);
}
function updateWorld(dt){
  ensure();const w=G().p18.worldSim;
  w.dayPhase=dayPhase();
  const wanted=Number(G().wanted||0);
  const weatherPenalty=w.weather==="storm"?8:w.weather==="rain"?4:0;
  w.traffic=clamp(w.traffic+(Math.random()-.5)*5+(w.dayPhase==="evening"?2:0)-weatherPenalty*.1,0,100);
  w.crowd=clamp(w.crowd+(Math.random()-.5)*4+(w.dayPhase==="evening"?3:0),0,100);
  w.emergency=clamp(w.emergency+(wanted*1.8)+(Math.random()-.55)*3-(wanted?0:2),0,100);
  WORLD_DISTRICTS.forEach(d=>{
    const delta=(wanted?wanted*0.25:0)+(Math.random()-.5)*1.5;
    w.districtPressure[d.id]=clamp((w.districtPressure[d.id]||d.pressure)+delta,0,100);
  });
  w.activeEvents=(w.activeEvents||[]).filter(e=>e.expiresAt>Date.now());
  if(Math.random()<0.035){
    const d=WORLD_DISTRICTS[Math.floor(Math.random()*WORLD_DISTRICTS.length)];
    const type=["traffic","medical","argument","police","delivery"][Math.floor(Math.random()*5)];
    w.activeEvents.push({id:`evt-${Date.now()}`,type,district:d.id,expiresAt:Date.now()+90000});
  }
  w.lastTick=Date.now();
}
function updateNPCSimulation(){
  ensure();
  const g=G(), near=[];
  const npcs=Object.values(g.npcs||{});
  const p=typeof window.currentPlayer==="function"?window.currentPlayer():null;
  npcs.forEach(n=>{
    const pos=n.position||{x:0,y:0};
    let distance=9999;
    if(p?.position)distance=Math.hypot(pos.x-p.position.x,pos.y-p.position.y);
    const tier=distance<120?"near":distance<450?"district":"aggregate";
    near.push({id:n.id,name:n.name,tier,distance:Math.round(distance),mood:n.mood||"neutral"});
  });
  G().p18.npcSimulation.nearby=near.sort((a,b)=>a.distance-b.distance).slice(0,30);
  G().p18.npcSimulation.lastUpdate=Date.now();
}
function onMissionCompleted(id,result={}){
  ensure();
  G().p18.lastResults[id]={...result,recordedAt:Date.now()};
  const m=(window.campaign88?.missions||[]).find(x=>x.id===id);
  if(!m)return;
  const player=String(m.protagonist||"darius").split(/[\s,+]/)[0].toLowerCase();
  if(result.failed===false){
    if(player==="malik")setRelation("darius","malik",1,0,"mission-success");
    if(player==="amara")setRelation("darius","amara",1,1,"mission-success");
    (m.consequences?Object.entries(m.consequences):[]).forEach(([k,v])=>{
      G().storyFlags=G().storyFlags||{};G().storyFlags[k]=v;
    });
  }
  refreshMissionTriggers();save();
}
function openPanel(){
  ensure();refreshMissionTriggers();
  const w=G().p18.worldSim;
  const available=Object.values(G().p18.missionTriggers).filter(x=>x.state==="available").slice(0,12);
  const rel=[];
  Object.entries(G().p18.relationships).forEach(([a,rs])=>Object.entries(rs).forEach(([b,r])=>{
    if(a<b)rel.push(`<div class="p18-row"><b>${a} ↔ ${b}</b><span>Trust ${Math.round(r.trust)} · Affection ${Math.round(r.affection)}</span></div>`);
  }));
  const cases=G().p18.policeCases.slice(-5).reverse().map(c=>`<div class="p18-row"><b>${c.type}</b><span>${c.stage} · ${Math.round(c.confidence*100)}% · ${c.district}</span></div>`).join("");
  const events=(w.activeEvents||[]).map(e=>`${e.type} @ ${e.district}`).join(" · ")||"none";
  const html=`<h3>PHASE 18 · WORLD / RELATIONSHIPS <button class="close" onclick="closePanel()">×</button></h3>
  <div class="p18-grid">
   <div><b>Weather</b><span>${w.weather.toUpperCase()}</span></div>
   <div><b>Traffic</b><span>${Math.round(w.traffic)}</span></div>
   <div><b>Crowd</b><span>${Math.round(w.crowd)}</span></div>
   <div><b>Emergency</b><span>${Math.round(w.emergency)}</span></div>
   <div><b>Business</b><span>${Math.round(w.businessActivity)}</span></div>
  </div>
  <h4>ACTIVE WORLD EVENTS</h4><p>${events}</p>
  <h4>RELATIONSHIPS</h4>${rel.join("")||"<p>No relationship state.</p>"}
  <h4>AVAILABLE LEADS</h4>${available.map(t=>`<div class="p18-row"><b>${t.missionId} · ${t.title}</b><span>${t.type} · ${t.location}</span><button onclick="phase18.discover('${t.missionId}')">DISCOVER</button></div>`).join("")||"<p>No newly available leads.</p>"}
  <h4>POLICE CASES</h4>${cases||"<p>No active cases.</p>"}`;
  if(typeof window.panel==="function")window.panel(html);
}
function loop(now){
  ensure();
  const dt=Math.min(0.25,((now-(P18.lastWorldTick||now))/1000)||0);
  if(dt>0){
    P18.lastWorldTick=now;
    if(now%1>=0)updateWeather(dt);
    if(now-(G().p18.worldSim.lastTick||0)>2200){updateWorld(dt);updateNPCSimulation();}
    if(now-(G().p18.businessTick||0)>5000){updateBusinesses();G().p18.businessTick=now;}
    refreshMissionTriggers();
    const active=G().missionRuntime?.active||G().activeMission||"";
    if(active!==P18.lastMissionSignature){
      P18.lastMissionSignature=active;
    }
  }
  requestAnimationFrame(loop);
}
window.phase18={
  ensure,setRelation,relation,buildMissionTriggers,refreshMissionTriggers,
  discover:discoverMission,start:startDiscoveredMission,
  reportIncident,advancePoliceCase,updateWorld,updateBusinesses,updateNPCSimulation,
  onMissionCompleted,openPanel,
  getState:()=>{ensure();return G().p18},
  getWeather:()=>{ensure();return G().p18.worldSim.weather}
};
window.addEventListener("load",()=>{
  ensure();buildMissionTriggers();refreshMissionTriggers();
  setTimeout(()=>{
    const q=document.querySelector(".quick-menu");
    if(q&&!document.getElementById("phase18Button")){
      const b=document.createElement("button");b.id="phase18Button";b.textContent="WORLD SIM";b.onclick=openPanel;q.appendChild(b);
    }
  },1200);
  requestAnimationFrame(loop);
});
})();
