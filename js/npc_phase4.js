/* 404: NO WAY OUT — Phase 4 NPC Simulation */
const NPC_PHASE4 = {
  moods:["calm","happy","stressed","angry","afraid","suspicious","excited","tired"],
  relationships:["stranger","acquaintance","friend","trusted","rival","enemy"],
  weatherIndoor:{rain:1.22,storm:1.5,clear:1,cloudy:1.05}
};

function npcPhase4Init(n){
  n.mood=n.mood||"calm";
  n.energy=n.energy??70;
  n.trust=n.trust??20;
  n.relationship=n.relationship||"stranger";
  n.memory=n.memory||[];
  n.schedule=n.schedule||{
    morning:["home","commute","work"],
    workday:["work"],
    afternoon:["work","shop","social"],
    evening:["home","social"],
    night:["home","social"],
    late_night:["home"]
  };
  n.home=n.home||"residential";
  n.work=n.work||"commercial";
  n.social=n.social||"market";
  n.lastSimMinute=n.lastSimMinute??worldClock;
  n.fear=n.fear??0;
  n.suspicion=n.suspicion??0;
  n.witnessQuality=n.witnessQuality??0.5;
  return n;
}

function npcPhase4Block(){
  const h=(worldClock/60)%24;
  if(h<5)return"late_night";
  if(h<8)return"morning";
  if(h<16)return"workday";
  if(h<19)return"afternoon";
  if(h<23)return"evening";
  return"night";
}

function npcPhase4Simulate(n,dt){
  npcPhase4Init(n);
  const block=npcPhase4Block();
  const weather=(worldWeather&&worldWeather.kind)||"clear";
  const target=(n.schedule[block]||["home"])[0];

  n.energy=Math.max(0,Math.min(100,n.energy-dt*0.7));
  if(target==="work")n.position=npcPhase4Anchor(n.work,n);
  else if(target==="social")n.position=npcPhase4Anchor(n.social,n);
  else if(target==="shop")n.position=npcPhase4Anchor("market",n);
  else n.position=npcPhase4Anchor(n.home,n);

  if(weather==="rain"||weather==="storm"){
    n.indoorBias=NPC_PHASE4.weatherIndoor[weather];
    if(n.archetype!=="criminal" && Math.random()<dt*0.03)n.position=npcPhase4Anchor(n.home,n);
  }
  n.mood=npcPhase4Mood(n);
  npcPhase4MemoryDecay(n,dt);
}

function npcPhase4Anchor(place,n){
  const anchors={
    residential:{x:-80,y:110},commercial:{x:140,y:50},market:{x:-170,y:60},
    industrial:{x:380,y:120},port:{x:800,y:480},beach:{x:80,y:500}
  };
  const a=anchors[place]||anchors.residential;
  const seed=(n.id||"npc").split("").reduce((s,c)=>s+c.charCodeAt(0),0);
  return {x:a.x+Math.sin(seed+npcPhase4Block().length)*65,y:a.y+Math.cos(seed+npcPhase4Block().length)*45};
}

function npcPhase4Mood(n){
  if(n.fear>65)return"afraid";
  if(n.suspicion>70)return"suspicious";
  if(n.energy<18)return"tired";
  if(n.trust>75)return"happy";
  return n.mood||"calm";
}

function npcPhase4MemoryDecay(n,dt){
  if(!n.memory?.length)return;
  if(Math.random()<dt*0.002 && n.memory.length>5)n.memory.shift();
}

function npcPhase4Remember(n,event,detail=""){
  npcPhase4Init(n);
  n.memory.push({event,detail,time:worldClock,protagonist:gameState.active});
  if(n.memory.length>12)n.memory.shift();
}

function npcPhase4Relationship(n,delta){
  npcPhase4Init(n);
  n.trust=Math.max(0,Math.min(100,n.trust+delta));
  if(n.trust>=80)n.relationship="trusted";
  else if(n.trust>=55)n.relationship="friend";
  else if(n.trust>=30)n.relationship="acquaintance";
  else if(n.trust<10)n.relationship="rival";
}

function npcPhase4WitnessChance(n,crimeSeverity){
  npcPhase4Init(n);
  const p=currentPlayer();
  const dx=n.position.x-p.position.x,dy=n.position.y-p.position.y;
  const distance=Math.hypot(dx,dy);
  if(distance>260)return 0;
  const visibility=Math.max(0,1-distance/260);
  const lighting=(worldClock/60>=21||worldClock/60<6)?0.55:1;
  const obstruction=0.8;
  const recognition=npcPhase4Recognition(n);
  const fearFactor=Math.max(0.25,1-n.fear/160);
  return Math.min(0.98,visibility*lighting*obstruction*recognition*fearFactor*(0.35+crimeSeverity*0.16));
}

function npcPhase4Recognition(n){
  npcPhase4Init(n);
  const known=n.memory.some(m=>m.protagonist===gameState.active && ["meeting","helped","threatened"].includes(m.event));
  return known?1:0.55;
}

function npcPhase4ReactToCrime(n,severity){
  const chance=npcPhase4WitnessChance(n,severity);
  if(Math.random()<chance){
    npcPhase4Remember(n,"witnessed_crime","severity "+severity);
    n.suspicion=Math.min(100,n.suspicion+severity*18);
    n.fear=Math.min(100,n.fear+severity*12);
    if(n.archetype==="police"||severity>=3){
      if(Math.random()<0.7) return {reported:true,npc:n};
    }
  }
  return {reported:false,npc:n};
}

function npcPhase4ApplySocialEvent(n,event,amount=0){
  if(event==="help")npcPhase4Relationship(n,Math.max(2,amount||8));
  if(event==="threat") { npcPhase4Relationship(n,-Math.max(5,amount||15)); n.fear=Math.min(100,n.fear+20); }
  if(event==="bribe") npcPhase4Relationship(n,Math.max(1,amount||5));
  if(event==="insult") npcPhase4Relationship(n,-Math.max(3,amount||8));
  npcPhase4Remember(n,event);
  n.mood=npcPhase4Mood(n);
  saveAll();
}

function npcPhase4Dialogue(n,p){
  npcPhase4Init(n);
  const prefix = n.mood==="afraid" ? "Keep your voice down." :
    n.mood==="suspicious" ? "I don't know you well enough for this." :
    n.relationship==="trusted" ? "You know I've got your back." :
    "What do you need?";
  return `${prefix} ${p.name}.`;
}

/* Hook Phase 4 into the existing world loop without replacing Phase 3 rendering. */
const oldNpcPosition = typeof npcPosition==="function" ? npcPosition : null;
function npcPosition(n){
  npcPhase4Simulate(n,0.016);
}

function phase4Tick(dt){
  if(!gameState?.npcs)return;
  Object.values(gameState.npcs).forEach(n=>npcPhase4Simulate(n,dt));
}

const oldLoopPhase4 = loop;
loop = function(t){
  const before = last;
  oldLoopPhase4(t);
  const dt=Math.min((t-before)/1000||0,.05);
  phase4Tick(dt);
};

function openNPCSimulation(){
  const rows=Object.values(gameState.npcs).map(n=>{
    npcPhase4Init(n);
    return `<div class="row"><span><b>${n.name}</b><small>${n.archetype||"resident"} · ${n.relationship} · ${n.mood}</small></span><b>Trust ${Math.round(n.trust)}</b></div>`;
  }).join("");
  panel(`<h3>NPC SIMULATION <button class="close" onclick="closePanel()">×</button></h3>
  <p>Phase 4 gives NPCs schedules, moods, relationships, memories, witness behavior and protagonist-specific recognition.</p>${rows}`);
}
