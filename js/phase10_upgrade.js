/* 404: NO WAY OUT — Build 012 Phase 10 Integration Upgrades
 * Builds upward from Build 011. No existing subsystem is replaced wholesale.
 */
(function(){
'use strict';

const P10 = window.P10 = {
  version:'Build 012 — Phase 10 Integration',
  upgrades:[
    '01 documentation reconciliation','02 enriched 88-mission architecture','03 conditional four endings',
    '04 functional scoring and retry state','05 natural NPC reactions','06 connected witness/police consequences',
    '07 tire/vehicle damage reaction chain','08 building registry and access tiers','09 multi-floor properties',
    '10 hotel booking and rooms','11 character/cinematic bible','12 prototype/future-engine boundary',
    '13 post-game world-state consequences','14 Story Mode / Online separation'
  ]
};

function ensureState(){
  if(!window.gameState)return;
  const s=gameState;
  s.story=s.story||{};
  Object.assign(s.story,{evidence:s.story.evidence||0,policePressure:s.story.policePressure||0,
    factionRep:s.story.factionRep||{},relationships:s.story.relationships||{},
    survivors:s.story.survivors||{darius:true,malik:true,amara:true},
    exposure:s.story.exposure||0,majorChoices:s.story.majorChoices||[],
    ending:s.story.ending||null,postgame:s.story.postgame||false});
  s.relationships=s.relationships||{};
  s.buildings=s.buildings||structuredClone(P10_BUILDINGS);
  s.properties=s.properties||{};
  s.hotels=s.hotels||{};
  s.worldState=s.worldState||{districts:{},businesses:{},law:{heat:0},weather:'clear',ending:null};
  s.missionRuntime=s.missionRuntime||{active:null,startedAt:0,attempt:0,results:{}};
  s.onlineMode=s.onlineMode||'story';
  Object.values(s.npcs||{}).forEach(n=>{n.personalityProfile=n.personalityProfile||inferPersonality(n);n.lastInteraction=n.lastInteraction||null;n.reactiveCooldown=n.reactiveCooldown||0});
}

const P10_BUILDINGS=[
 {id:'central_bank',name:'Central Bank',district:'Veyron Central',type:'bank',floors:8,access:'conditional',interior:'bank',missions:['M19','M84']},
 {id:'police_hq',name:'Veyron Police Headquarters',district:'Veyron Central',type:'police',floors:6,access:'conditional',interior:'police',missions:['M17','M18']},
 {id:'reed_workshop',name:'Reed Workshop',district:'Iron District',type:'garage',floors:2,access:'full',interior:'workshop',missions:['M13','M14']},
 {id:'lena_cafe',name:"Lena's Cafe",district:'East Veyron',type:'restaurant',floors:1,access:'full',interior:'cafe',missions:['M09','M20']},
 {id:'port_warehouse_7',name:'Port Warehouse 7',district:'Veyron Port',type:'warehouse',floors:2,access:'conditional',interior:'warehouse',missions:['M08','M19']},
 {id:'airport_terminal',name:'Veyron International Airport Terminal',district:'Airport',type:'airport',floors:4,access:'conditional',interior:'terminal',missions:['M02']},
 {id:'blackwater_casino',name:'Blackwater Casino',district:'Blackwater Island',type:'casino',floors:5,access:'conditional',interior:'casino',missions:['M60','M75']},
 {id:'veyr_jewelry',name:'Veyron Jewelers',district:'Veyron Central',type:'jewelry',floors:2,access:'conditional',interior:'retail',missions:['M61']},
 {id:'meridian_tower',name:'Meridian Corporate Tower',district:'Veyron Central',type:'corporate',floors:32,access:'conditional',interior:'highrise',missions:['M45','M72','M84']},
 {id:'remote_prison',name:'Blackwater Remote Prison',district:'Blackwater Island',type:'prison',floors:4,access:'conditional',interior:'prison',missions:['M52','M53']},
 {id:'military_base',name:'Veyron Defense Facility',district:'North Hills',type:'military',floors:3,access:'conditional',interior:'military',missions:['M67','M68']},
 {id:'grand_hotel',name:'Grand Veyron Hotel',district:'West Coast',type:'hotel',floors:14,access:'full',interior:'hotel',missions:['M40','M70']},
 {id:'coast_hotel',name:'West Coast Suites',district:'West Coast',type:'hotel',floors:9,access:'full',interior:'hotel',missions:[]},
 {id:'north_house',name:'Cole Family House',district:'North Hills',type:'house',floors:3,access:'full',interior:'property',missions:['M01','M87']}
];

function inferPersonality(n){
  const s=(n.personality||'calm').toLowerCase();
  return {calm:s.includes('calm')||s.includes('warm'),aggressive:s.includes('aggressive')||s.includes('reckless'),
    friendly:s.includes('warm')||s.includes('friendly'),fearful:s.includes('cautious')||s.includes('nervous'),
    sarcastic:s.includes('sarcastic'),brave:s.includes('brave'),patience:s.includes('patient')?75:50};
}

// 01 + 02: Normalize the existing 88 mission registry without discarding it.
function enrichCampaign(){
  if(!Array.isArray(window.campaign88?.missions))return;
  const types=['investigation','driving','stealth','social','vehicle','police','crime','heist','character','relationship','infiltration','escape'];
  const proTags=['darius','malik','amara','npc'];
  campaign88.missions.forEach((m,i)=>{
    m.protagonist=m.protagonist||proTags[i%4];
    m.supporting_npcs=m.supporting_npcs||[];
    m.location=m.location||inferMissionLocation(m);
    m.objectives=m.objectives||[{id:'critical-1',text:m.win_condition,critical:true}];
    m.optional_objectives=m.optional_objectives||[{id:'optional-1',text:'Complete the mission cleanly and preserve optional evidence.',points:20}];
    m.failure_conditions=m.failure_conditions||['Critical objective failed','Player incapacitated'];
    m.success_conditions=m.success_conditions||[m.win_condition];
    m.rewards=m.rewards||{cash:Math.round(500+(i*125)),reputation:Math.min(20,2+Math.floor(i/10))};
    m.consequences=m.consequences||{evidence:1,policePressure:m.type==='police'?2:0};
    m.score_weights=m.score_weights||{critical:50,optional:20,time:10,survival:10,precision:10};
    m.replayable=m.replayable!==false;
    m.connected_buildings=m.connected_buildings||[];
    m.connected_characters=m.connected_characters||[m.protagonist];
    m.story_flags=m.story_flags||[];
    m.required_previous_missions=m.required_previous_missions||[];
    m.unlocked_content=m.unlocked_content||[];
    m.playablePrototype=m.playablePrototype||false;
    m.prototypeNote='Registry/mission contract is active; full 3D mission staging belongs to the future engine build.';
    if(!m.type)m.type=types[i%types.length];
  });
  campaign88.target_main_story_hours=Math.max(30,Number(campaign88.target_main_story_hours)||30);
  campaign88.design_note=(campaign88.design_note||'')+' Build 012 normalizes every mission into a shared mission contract.';
}
function inferMissionLocation(m){
  const t=(m.title+' '+m.brief).toLowerCase();
  if(t.includes('port')||t.includes('warehouse')||t.includes('container'))return'Veyron Port';
  if(t.includes('airport'))return'Veyron International Airport';
  if(t.includes('casino'))return'Blackwater Island';
  if(t.includes('bank'))return'Veyron Central';
  if(t.includes('north'))return'North Hills';
  if(t.includes('iron')||t.includes('workshop'))return'Iron District';
  if(t.includes('coast')||t.includes('hotel'))return'West Coast';
  return'Veyron Central';
}

// 03: Four genuinely different ending state machines.
const ENDINGS={
 A:{id:'A',title:'THE ESCAPE',conditions:s=>s.story.evidence>=8&&s.story.exposure>=5&&s.story.survivors.darius&&s.story.survivors.amara,finalMissions:['M85','M86','M87'],post:'404 is exposed; Darius leaves the city while Veyron begins a public reckoning.'},
 B:{id:'B',title:'THE CROWN',conditions:s=>s.story.factionRep.control>=60&&s.story.money>=250000&&s.story.exposure<7,finalMissions:['M84','M85','M86'],post:'A power vacuum opens and the player inherits a dangerous network.'},
 C:{id:'C',title:'THE SACRIFICE',conditions:s=>s.story.majorChoices.includes('sacrifice')&&s.story.survivors.malik===false,finalMissions:['M83','M86','M87'],post:'The city remembers the sacrifice; surviving protagonists carry the cost.'},
 D:{id:'D',title:'NO WAY OUT',conditions:s=>s.story.exposure>=8&&s.story.evidence<8,finalMissions:['M84','M86','M88'],post:'404 survives the public collapse; Veyron enters a darker post-game state.'}
};
function chooseEnding(){
  ensureState(); const s=gameState;
  for(const e of [ENDINGS.A,ENDINGS.B,ENDINGS.C,ENDINGS.D])if(e.conditions(s))return e;
  return ENDINGS.D;
}
function finalizeEnding(){ensureState();const e=chooseEnding();gameState.story.ending=e.id;gameState.story.postgame=true;gameState.worldState.ending=e.id;gameState.worldState.districts['Veyron Central']={heat:e.id==='D'?90:25};gameState.worldState.districts['West Coast']={activity:e.id==='B'?'high':'normal'};saveAll();showEndingCard(e);}
function showEndingCard(e){panel(`<div class="mission-result"><h2>ENDING ${e.id}</h2><h3>${e.title}</h3><p>${e.post}</p><p><b>Final missions:</b> ${e.finalMissions.join(', ')}</p><p>FREE ROAM CONTINUES — city state, relationships and available activities now reflect this ending.</p><button onclick="closePanel()">ENTER FREE ROAM</button></div>`);}

// 04: Real mission runtime, scoring and retry.
function startMission(id){ensureState();const m=(campaign88.missions||[]).find(x=>x.id===id);if(!m)return notice('Mission not found.');gameState.missionRuntime={active:id,startedAt:performance.now(),attempt:(gameState.missionRuntime?.attempt||0)+1,results:gameState.missionRuntime?.results||{}};saveAll();notice('Mission started: '+m.title);}
function finishMission(id,parts={},failedReason=''){ensureState();const m=(campaign88.missions||[]).find(x=>x.id===id);if(!m)return;const score=calculateMissionScore(parts);const failed=!!failedReason||score<40;const result={id,score,failed,grade:failed?'FAILED':missionGrade(score),attempt:gameState.missionRuntime.attempt,time:Math.round((performance.now()-gameState.missionRuntime.startedAt)/1000)};gameState.missionRuntime.results[id]=result;gameState.missionRuntime.active=null;if(!failed){gameState.story.evidence+=(m.consequences?.evidence||0);gameState.story.policePressure=Math.max(0,gameState.story.policePressure+(m.consequences?.policePressure||0));}saveAll();showMissionResult(m.title,score,failedReason);}
function retryActiveMission(){const id=gameState.missionRuntime.active||Object.values(gameState.missionRuntime.results||{}).find(r=>r.failed)?.id;if(id)startMission(id);else notice('No mission is available to retry.');}
window.startMission=startMission;window.finishMission=finishMission;
window.restartMission=function(){retryActiveMission();closePanel();};

// 05: Natural NPC reactions — no mandatory talk button.
function p10NPCReaction(n,event){
  if(!n||!gameState)return; npcPhase4Init?.(n); if(n.reactiveCooldown>0)return; n.reactiveCooldown=2.5;
  const p=inferPersonality(n); let line='';
  if(event==='bump') line=p.aggressive?'"Hey! Watch yourself."':p.fearful?'"Whoa—give me some space."':p.sarcastic?'"Great. Real smooth."':'"Hey, watch where you’re going."';
  if(event==='danger') line=p.fearful?'"I’m getting out of here!"':p.brave?'"Everybody stay calm."':'"What is happening?!"';
  if(event==='help') line=p.friendly?'"I appreciate that. Thank you."':'"Alright... thanks."';
  if(line){showDialogue(n.name,line);npcPhase4Remember(n,event);n.lastInteraction={event,time:worldClock,protagonist:gameState.active};saveAll();}
}
function tickReactiveNPC(dt){Object.values(gameState?.npcs||{}).forEach(n=>{n.reactiveCooldown=Math.max(0,(n.reactiveCooldown||0)-dt);});}
const oldMove=window.move; if(typeof oldMove==='function'){
  window.move=function(dt){const before=currentPlayer().position;oldMove(dt);const p=currentPlayer();Object.values(gameState.npcs||{}).forEach(n=>{if(!n.position)return;const d=Math.hypot(n.position.x-p.position.x,n.position.y-p.position.y);if(d<28&&Math.random()<dt*0.8)p10NPCReaction(n,'bump');});tickReactiveNPC(dt);};
}

// 06: Connect crime events to witnesses and world heat.
function reportCrimeEvent(severity=1){ensureState();let reports=0;Object.values(gameState.npcs||{}).forEach(n=>{const r=npcPhase4ReactToCrime?.(n,severity);if(r?.reported)reports++;});gameState.story.policePressure+=reports*severity;gameState.worldState.law.heat=Math.min(100,(gameState.worldState.law.heat||0)+severity*5+reports*8);gameState.wanted=Math.min(5,Math.max(gameState.wanted||0,Math.ceil(gameState.worldState.law.heat/20)));saveAll();notice(reports?`${reports} witness report${reports>1?'s':''} reached dispatch.`:'No confirmed witness report.');return reports;}
window.reportCrimeEvent=reportCrimeEvent;

// 07: Tire damage reaction chain.
function popNearestTire(){
  const vs=gameState?.vehicles||[];if(!vs.length)return null;const p=currentPlayer();let v=vs[0],best=Infinity;vs.forEach(x=>{const d=Math.hypot((x.x||0)-p.position.x,(x.y||0)-p.position.y);if(d<best){best=d;v=x;}});
  v.tires=v.tires||[{state:'good'},{state:'good'},{state:'good'},{state:'good'}];const tire=v.tires.find(t=>t.state!=='popped');if(!tire)return v;tire.state='popped';tire.pressure=0;v.health=Math.max(1,(v.health||100)-4);v.handlingPenalty=(v.handlingPenalty||0)+0.2;v.driverState='distressed';v.lastDamageEvent='tire_popped';saveAll();notice(`${v.name||'Vehicle'} tire popped.`);return v;
}
window.popNearestTire=popNearestTire;

// 08: Building registry/access tiers.
function buildingAccess(id){ensureState();const b=gameState.buildings.find(x=>x.id===id);if(!b)return false;if(b.access==='full')return true;const flags=gameState.story||{};if(flags.postgame&&b.access==='conditional')return true;return (b.missions||[]).some(mid=>gameState.missionRuntime.results?.[mid]?.failed===false);}
function openBuildingRegistry(){ensureState();panel(`<h3>VEYRON BUILDINGS <button class="close" onclick="closePanel()">×</button></h3><p>FULL = persistent public access · CONDITIONAL = mission/story/property access · BACKGROUND = exterior only.</p>${gameState.buildings.map(b=>`<div class="mission"><b>${b.name}</b><span>${b.district} · ${b.floors} floors · ${b.access.toUpperCase()}</span><small>${buildingAccess(b.id)?'ACCESS AVAILABLE':'ACCESS CONDITIONAL'}</small></div>`).join('')}`);}
window.openBuildingRegistry=openBuildingRegistry;

// 09: Multi-floor properties.
const PROPERTY_FLOORS={
 'house-01':[['Living Room','Kitchen','Garage'],['Bedrooms','Bathroom','Office'],['Gym','Private Room','Terrace']],
 'apartment-01':[['Lobby','Living Room','Kitchen'],['Bedroom','Bathroom','Office']],
 'grand-hotel-room':[['Room','Bathroom','Balcony']]
};
function propertyFloors(id){return PROPERTY_FLOORS[id]||[['Main Room','Storage']];}
function enterPropertyFloor(id,floor){ensureState();const floors=propertyFloors(id);if(floor<1||floor>floors.length)return notice('That floor is unavailable.');panel(`<h3>${id.replaceAll('-',' ').toUpperCase()} · FLOOR ${floor} <button class="close" onclick="closePanel()">×</button></h3>${floors[floor-1].map(x=>`<div class="row"><span>${x}</span><b>INTERACT</b></div>`).join('')}`);}
window.enterPropertyFloor=enterPropertyFloor;window.propertyFloors=propertyFloors;

// 10: Hotels — booking/payment/access state.
function bookHotel(hotelId,room=101){ensureState();const b=gameState.buildings.find(x=>x.id===hotelId);if(!b||b.type!=='hotel')return notice('Hotel unavailable.');const price=hotelId==='grand_hotel'?350:220;const p=currentPlayer();if((p.cash||0)<price)return notice('Not enough cash for the room.');p.cash-=price;gameState.hotels[hotelId]={room,paid:price,checkIn:worldClock,active:true};saveAll();panel(`<h3>${b.name} — ROOM ${room}</h3><p>Booking confirmed. Elevator access is active.</p><button onclick="enterPropertyFloor('grand-hotel-room',1)">ENTER ROOM</button>`);}
function openHotels(){ensureState();const hs=gameState.buildings.filter(b=>b.type==='hotel');panel(`<h3>HOTELS <button class="close" onclick="closePanel()">×</button></h3>${hs.map(h=>`<div class="mission"><b>${h.name}</b><span>${h.floors} floors · reception available</span><button onclick="bookHotel('${h.id}',${Math.floor(100+Math.random()*300)})">BOOK ROOM</button></div>`).join('')}`);}
window.bookHotel=bookHotel;window.openHotels=openHotels;

// 11: Character/cinematic bible as data, available to tools/UI.
const CHARACTER_BIBLE={
 darius:{face:'defined oval/jaw',eyes:'focused, observant',hair:'short textured black',build:'athletic lean',wardrobe:'dark fitted streetwear and practical jackets',mannerisms:'quiet eye contact, controlled gestures',voice:'low, calm, measured'},
 malik:{face:'broad expressive',eyes:'animated',hair:'short curls',build:'stocky athletic',wardrobe:'work jackets, tees, mechanic gear',mannerisms:'large gestures, quick smiles',voice:'energetic, humorous'},
 amara:{face:'sharp oval',eyes:'focused',hair:'long controlled style',build:'slim athletic',wardrobe:'minimal tailored streetwear',mannerisms:'subtle expressions, precise movement',voice:'controlled, dry sarcasm'}
};
window.CHARACTER_BIBLE=CHARACTER_BIBLE;

// 12: Prototype/future-engine boundary.
const PLATFORM_BOUNDARY={browser:{implemented:['2D world','state persistence','mission registry','NPC simulation foundation','economy contracts','ending state machine','UI'],notImplemented:['full 3D animation','production vehicle physics','cinematic facial animation','true MMO networking']},futureEngine:{recommended:'Unreal Engine 5.x Open World template with World Partition',reason:'large-world streaming and HLOD are designed for scalable open worlds'},futureOnline:{authority:'server authoritative',separateFromStory:true}};
window.PLATFORM_BOUNDARY=PLATFORM_BOUNDARY;

// 13: Post-game state.
function applyPostGame(){ensureState();if(!gameState.story.postgame)return;const e=gameState.story.ending;gameState.worldState.ending=e;gameState.worldState.freeRoam=true;gameState.worldState.availableActivities=['properties','businesses','free-roam heists','social activities','collectibles','mission replay'];if(e==='B')gameState.worldState.availableActivities.push('network management');if(e==='D')gameState.worldState.districts['Veyron Central']={lawPresence:'high',publicFear:'high'};if(e==='A')gameState.worldState.districts['Veyron Central']={lawPresence:'investigative',publicFear:'low'};saveAll();}

// 14: Explicit mode separation.
function setGameMode(mode){if(!['story','online'].includes(mode))return;ensureState();gameState.onlineMode=mode;saveAll();notice(mode==='story'?'STORY MODE: campaign save active.':'ONLINE MODE: separate player profile architecture.');}
function openModeStatus(){ensureState();panel(`<h3>MODE STATUS <button class="close" onclick="closePanel()">×</button></h3><div class="row"><span>Current mode</span><b>${gameState.onlineMode.toUpperCase()}</b></div><p>Story Mode and Online use separate progression boundaries. No Story Mode ending state is silently copied into Online progression.</p>`);}
window.setGameMode=setGameMode;window.openModeStatus=openModeStatus;

// UI hooks and boot.
function upgradeHUD(){const q=document.querySelector('.quick-menu');if(!q)return;if(!document.getElementById('p10Buildings')){const b=document.createElement('button');b.id='p10Buildings';b.textContent='BUILDINGS';b.onclick=openBuildingRegistry;q.appendChild(b);}if(!document.getElementById('p10Hotels')){const b=document.createElement('button');b.id='p10Hotels';b.textContent='HOTELS';b.onclick=openHotels;q.appendChild(b);}if(!document.getElementById('p10Finale')){const b=document.createElement('button');b.id='p10Finale';b.textContent='FINALE';b.onclick=openFinale;q.appendChild(b);}}
window.addEventListener('load',()=>{ensureState();enrichCampaign();applyPostGame();upgradeHUD();});
})();
