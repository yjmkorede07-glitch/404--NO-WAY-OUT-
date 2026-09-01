/* 404: NO WAY OUT — Build 012 Playable Campaign Layer
 * Turns the existing Build 011/012 registries into a coherent browser prototype.
 * This is the playable 2D prototype layer; future 3D/online production can consume the same contracts.
 */
(function(){
'use strict';

const PLAYABLE_LOCATIONS={
 airport:{name:'Veyron International Airport',x:820,y:-370},
 family:{name:'Cole Family House',x:-260,y:-280},
 central:{name:'Veyron Central',x:180,y:120},
 bank:{name:'Central Bank',x:170,y:105},
 market:{name:'East Market',x:-115,y:70},
 north:{name:'North Hills',x:-260,y:-280},
 iron:{name:'Iron District',x:410,y:150},
 port:{name:'Veyron Port',x:870,y:500},
 island:{name:'Blackwater Island',x:1260,y:-30},
 west:{name:'West Coast',x:120,y:520},
 cafe:{name:"Lena's Cafe",x:-500,y:100},
 workshop:{name:'Reed Workshop',x:410,y:150},
 safehouse:{name:'Darius Safehouse',x:-20,y:135},
 police:{name:'Veyron Police Headquarters',x:-60,y:-90},
 casino:{name:'Blackwater Casino',x:1250,y:-20},
 jewelry:{name:'Veyron Jewelers',x:280,y:180},
 tower:{name:'Meridian Corporate Tower',x:360,y:20},
 prison:{name:'Blackwater Remote Prison',x:1320,y:20},
 military:{name:'Veyron Defense Facility',x:-260,y:-300}
};

const PROTAGONIST_NAMES={darius:'Darius Cole',malik:'Malik Reed',amara:'Amara Vale',npc:'NPC-led',all:'Darius + Malik + Amara'};

function ensurePlayableState(){
  if(!window.gameState)return;
  const s=gameState;
  s.story=s.story||{};
  s.story.completedMissions=s.story.completedMissions||[];
  s.story.endingPath=s.story.endingPath||null;
  s.story.evidence=Number(s.story.evidence)||0;
  s.story.exposure=Number(s.story.exposure)||0;
  s.story.policePressure=Number(s.story.policePressure)||0;
  s.story.factionRep=s.story.factionRep||{};
  s.story.factionRep.control=Number(s.story.factionRep.control)||0;
  s.story.majorChoices=s.story.majorChoices||[];
  s.story.survivors=Object.assign({darius:true,malik:true,amara:true},s.story.survivors||{});
  s.story.money=totalMoney();
  s.missionRuntime=s.missionRuntime||{active:null,startedAt:0,attempt:0,results:{},step:0,optional:0};
  s.missionRuntime.results=s.missionRuntime.results||{};
  s.missionRuntime.step=Number(s.missionRuntime.step)||0;
  s.missionRuntime.optional=Number(s.missionRuntime.optional)||0;
  s.missionRuntime.resultsByMission=s.missionRuntime.resultsByMission||{};
  if(Array.isArray(s.vehicles))s.vehicles.forEach(v=>typeof vehiclePhase5Init==='function'&&vehiclePhase5Init(v));
  if(Array.isArray(s.vehicles)&&s.vehicles.length<8){
    const publicCars=[['city_sedan_01',210,40],['city_sedan_02',-250,80],['city_sedan_03',360,260],['city_sedan_04',40,500],['city_sedan_05',760,450],['city_sedan_06',760,-300]];
    publicCars.forEach(([id,x,y])=>{if(!s.vehicles.some(v=>v.id===id))s.vehicles.push({id,name:'Veyron Sedan',type:'Car',owner:'public',x,y,health:100,owned:false});});
  }
  if(Array.isArray(s.vehicles))s.vehicles.forEach(v=>typeof vehiclePhase5Init==='function'&&vehiclePhase5Init(v));
}
function totalMoney(){return Object.values(gameState?.characters||{}).reduce((sum,p)=>sum+Number(p.cash||0)+Number(p.bank||0),0);}
function campaignReady(){return Array.isArray(window.campaign88?.missions)&&campaign88.missions.length===88;}
function missionById(id){return campaign88?.missions?.find(m=>m.id===id)||null;}
function resultFor(id){ensurePlayableState();return gameState.missionRuntime.results[id]||null;}
function completed(id){return !!resultFor(id)&&resultFor(id).failed===false;}
function unlocked(id){const m=missionById(id);if(!m)return false;if(m.id==='M01')return true;const n=Number(m.id.slice(1));return completed(`M${String(n-1).padStart(2,'0')}`)||!!gameState.story.postgame;}
function locationData(key){return PLAYABLE_LOCATIONS[key]||PLAYABLE_LOCATIONS.central;}
function currentMission(){return missionById(gameState?.missionRuntime?.active);}
function currentStep(){const m=currentMission();return m?.prototype_steps?.[gameState.missionRuntime.step]||null;}
function targetForStep(step){return step?locationData(step.target):null;}
function distanceToTarget(step){const t=targetForStep(step);const p=currentPlayer();if(!t||!p)return Infinity;return Math.hypot(p.position.x-t.x,p.position.y-t.y);}

function canonicalizeCampaign(){
  if(!campaignReady())return;
  campaign88.mission_count=88;
  campaign88.missions.forEach((m,i)=>{
    m.prototypePlayable=true;
    if(!m.prototype_steps||!m.prototype_steps.length){m.prototype_steps=[{id:'travel',kind:'travel',target:'central',text:'Reach the mission location.'},{id:'action',kind:'action',target:'central',text:m.win_condition||'Complete the objective.'}];}
    m.required_previous_missions=i?['M'+String(i).padStart(2,'0')]:[];
    m.protagonist=m.protagonist||['darius','malik','amara'][i%3];
    m.supporting_npcs=m.supporting_npcs||[];
    m.score_weights={critical:50,optional:20,time:10,survival:10,precision:10};
  });
}

function openPlayableMissions(){
  ensurePlayableState();canonicalizeCampaign();
  if(!campaignReady())return panel('<h3>MISSION JOURNAL</h3><p>Loading the 88-mission campaign...</p>');
  const filter=(window.__missionFilter||'ALL');
  let html=`<h3>STORY MODE — 88 MISSIONS <button class="close" onclick="closePanel()">×</button></h3>`;
  html+=`<p>Canonical opening: <b>M01 — First Night</b>. Darius arrives at the airport, takes a cab, returns to the Cole family house, and begins the investigation.</p>`;
  html+=`<div class="row"><span>Progress</span><b>${gameState.story.completedMissions.length}/88</b></div>`;
  html+=`<div class="choice-grid"><button onclick="setMissionFilter('ALL')">ALL</button><button onclick="setMissionFilter('AVAILABLE')">AVAILABLE</button><button onclick="setMissionFilter('DONE')">DONE</button><button onclick="setMissionFilter('LOCKED')">LOCKED</button></div>`;
  const phases={};
  campaign88.missions.forEach(m=>{if(filter==='AVAILABLE'&&!unlocked(m.id))return;if(filter==='DONE'&&!completed(m.id))return;if(filter==='LOCKED'&&unlocked(m.id))return;(phases[m.phase]??=[]).push(m);});
  Object.entries(phases).forEach(([phase,list])=>{
    html+=`<h4>${escapeHtml(phase)}</h4>`;
    list.forEach(m=>{
      const done=completed(m.id), active=gameState.missionRuntime.active===m.id, open=unlocked(m.id);
      const r=resultFor(m.id);
      html+=`<div class="mission ${done?'done':''} ${active?'active':''} ${!open?'locked':''}`+`>`;
      html+=`<b>${m.id} — ${escapeHtml(m.title)}</b>`;
      html+=`<small>${escapeHtml(m.type||'story')} · ${escapeHtml(PROTAGONIST_NAMES[m.protagonist]||m.protagonist||'Darius Cole')} · ${m.location||'Veyron Central'}</small>`;
      html+=`<span>${escapeHtml(m.brief||'')}</span>`;
      html+=`<span class="tag">${done?'COMPLETED':open?'AVAILABLE':'LOCKED'}</span>`;
      if(r)html+=`<span class="tag">${r.score}/100 · ${escapeHtml(r.grade||'')}</span>`;
      if(open&&!gameState.missionRuntime.active)html+=`<button onclick="startPlayableMission('${m.id}')">${done?'REPLAY':'START'}</button>`;
      else if(active)html+=`<button onclick="resumeMission('${m.id}')">RESUME</button>`;
      html+='</div>';
    });
  });
  panel(html);
}
function setMissionFilter(f){window.__missionFilter=f;openPlayableMissions();}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}

function startPlayableMission(id){
  ensurePlayableState();canonicalizeCampaign();
  const m=missionById(id);if(!m)return notice('Mission not found.');
  if(gameState.missionRuntime.active&&gameState.missionRuntime.active!==id)return notice('Finish the active mission first.');
  if(!unlocked(id))return notice('Mission locked. Complete the previous mission first.');
  const n=Number(id.slice(1));
  if(m.protagonist&&['darius','malik','amara'].includes(m.protagonist))switchCharacter(m.protagonist);
  // Canonical opening: Darius arrives at the airport before M01 begins.
  if(id==='M01'){gameState.characters.darius.position={x:820,y:-370};gameState.characters.darius.location='Veyron International Airport';gameState.active='darius';}
  const old=resultFor(id);
  gameState.missionRuntime.active=id;
  gameState.missionRuntime.startedAt=performance.now();
  gameState.missionRuntime.attempt=(old?.attempt||0)+1;
  gameState.missionRuntime.step=0;
  gameState.missionRuntime.optional=0;
  gameState.missionRuntime.results=gameState.missionRuntime.results||{};
  saveAll();closePanel();
  showMissionBrief(m);
  updateHUD();draw();
}
function resumeMission(id){if(gameState.missionRuntime.active===id){closePanel();return;}startPlayableMission(id);}
function showMissionBrief(m){
  const first=m.prototype_steps?.[0];
  panel(`<div class="mission-result"><small>${escapeHtml(m.id)} · ${escapeHtml(m.type||'story')}</small><h2>${escapeHtml(m.title)}</h2><p>${escapeHtml(m.brief||'')}</p><p><b>Protagonist:</b> ${escapeHtml(PROTAGONIST_NAMES[m.protagonist]||m.protagonist)}</p><p><b>Objective:</b> ${escapeHtml(first?.text||m.win_condition)}</p><button onclick="closePanel()">BEGIN</button></div>`);
}

function advanceMissionStep(){
  ensurePlayableState();const m=currentMission();if(!m)return;const step=currentStep();if(!step)return finishPlayableMission(m.id);
  applyStepEffects(m,step);
  gameState.missionRuntime.step++;
  if(gameState.missionRuntime.step>=m.prototype_steps.length){finishPlayableMission(m.id);return;}
  const next=m.prototype_steps[gameState.missionRuntime.step];
  if(next?.id==='malik'&&gameState.active!=='malik')switchCharacter('malik');
  if(next?.id==='amara'&&gameState.active!=='amara')switchCharacter('amara');
  if(next?.id==='darius'&&gameState.active!=='darius')switchCharacter('darius');
  saveAll();updateHUD();notice('Objective updated.');
}
function applyStepEffects(m,step){
  const n=Number(m.id.slice(1));
  if(step.kind==='action'||step.kind==='character'||step.kind==='choice'){
    gameState.story.evidence+=n%3===0?1:0;
    gameState.story.exposure+=m.type==='crime'||m.type==='police'||m.type==='heist'?1:0;
    if(m.protagonist&&m.protagonist!=='npc'&&m.protagonist!=='all'){
      const p=gameState.characters[m.protagonist];if(p)p.reputation=(p.reputation||0)+1;
    }
    if(n%7===0)gameState.story.factionRep.control=Math.min(100,(gameState.story.factionRep.control||0)+4);
    if(m.type==='relationship'||m.type==='social')gameState.missionRuntime.optional=Math.min(20,gameState.missionRuntime.optional+5);
  }
}
function missionTimeScore(m){const elapsed=(performance.now()-gameState.missionRuntime.startedAt)/1000;const target=Math.max(45,Number(m.hours||0.6)*90);return Math.max(0,Math.min(10,Math.round(10*Math.max(0,1-elapsed/(target*2)))));}
function finishPlayableMission(id){
  ensurePlayableState();const m=missionById(id);if(!m)return;
  const p=currentPlayer();
  const critical=50, optional=Math.min(20,gameState.missionRuntime.optional||0), time=missionTimeScore(m), survival=Math.max(0,Math.min(10,Math.round((p.health/100)*10))), precision=8;
  const score=calculateMissionScore({critical,optional,time,survival,precision});
  const failed=score<40||p.health<=0;
  const result={id,score,failed,grade:failed?'FAILED':missionGrade(score),attempt:gameState.missionRuntime.attempt,time:Math.round((performance.now()-gameState.missionRuntime.startedAt)/1000),optional,timeScore:time,survival,precision};
  gameState.missionRuntime.results[id]=result;
  gameState.missionRuntime.resultsByMission[id]=result;
  if(!failed){
    if(!gameState.story.completedMissions.includes(id))gameState.story.completedMissions.push(id);
    const reward=Number(m.rewards?.cash||500+Number(id.slice(1))*125);
    p.cash=(p.cash||0)+reward;
    p.reputation=(p.reputation||0)+Number(m.rewards?.reputation||1);
    gameState.story.evidence+=Number(m.consequences?.evidence||0);
    gameState.story.policePressure+=Number(m.consequences?.policePressure||0);
    gameState.story.money=totalMoney();
    if(id==='M88') finalizePlayableEnding();
  }
  gameState.missionRuntime.active=null;
  gameState.missionRuntime.step=0;
  saveAll();updateHUD();
  if(id!=='M88'||failed)showMissionResult(m.title,score,failed?'Mission requirements were not met.':'');
  else applyPostGame?.();
}

function showPlayableResult(name,score,failedReason=''){
  const r=gameState.missionRuntime.results[gameState.missionRuntime.lastResultId];
  const title=failedReason?'MISSION FAILED':'MISSION PASSED';
  panel(`<div class="mission-result"><h2>${title}</h2><h3>${escapeHtml(name)}</h3><div class="score">${failedReason?0:score}<small>/100</small></div><b>${failedReason?'FAILED':missionGrade(score)}</b>${failedReason?`<p>${escapeHtml(failedReason)}</p>`:''}<p>Critical 50 · Optional ${r?.optional||0} · Time ${r?.timeScore||0} · Survival ${r?.survival||0} · Precision ${r?.precision||0}</p><p>Complete the next mission to continue the campaign.</p>${failedReason?'<button onclick="retryActivePlayableMission()">RETRY</button>':''}<button onclick="closePanel()">CONTINUE</button></div>`);
}
function retryActivePlayableMission(){const id=gameState.missionRuntime.lastResultId||Object.keys(gameState.missionRuntime.results).reverse().find(k=>gameState.missionRuntime.results[k].failed);if(id)startPlayableMission(id);else notice('No failed mission to retry.');}
function showMissionResult(name,score,reason=''){gameState.missionRuntime.lastResultId=gameState.missionRuntime.results&&Object.keys(gameState.missionRuntime.results).pop();showPlayableResult(name,score,reason);}

function missionAction(){
  ensurePlayableState();const m=currentMission();const step=currentStep();if(!m||!step)return;
  if(step.kind==='choice'&&m.id==='M83')return window.phase19Batch09Runtime?.openRouteChoice?.()||notice('Final route choice unavailable.');
  if(step.kind==='choice'&&m.id==='M86')return window.phase19Batch09Runtime?.openEndingChoice?.()||openEndingChoice();
  const d=distanceToTarget(step);if(d>90)return notice('Move closer to the objective.');
  if(window.phase19Runtime?.handleAction?.(m,step))return;
  advanceMissionStep();
}
function openEndingChoice(){
  panel(`<div class="mission-result"><small>M86 — THE LAST CHOICE</small><h2>Choose the truth.</h2><p>This decision changes the final state of Veyron. The four endings remain distinct.</p><div class="choice-grid"><button onclick="selectEndingPath('A')">A · THE ESCAPE</button><button onclick="selectEndingPath('B')">B · THE CROWN</button><button onclick="selectEndingPath('C')">C · THE SACRIFICE</button><button onclick="selectEndingPath('D')">D · NO WAY OUT</button></div></div>`);
}
function selectEndingPath(path){
  ensurePlayableState();gameState.story.endingPath=path;gameState.story.majorChoices.push('path_'+path);
  if(path==='A'){gameState.story.evidence=Math.max(gameState.story.evidence,8);gameState.story.exposure=Math.max(gameState.story.exposure,5);}
  if(path==='B'){gameState.story.factionRep.control=Math.max(gameState.story.factionRep.control,65);gameState.story.exposure=Math.min(gameState.story.exposure,6);}
  if(path==='C'){gameState.story.majorChoices.push('sacrifice');gameState.story.survivors.malik=false;}
  if(path==='D'){gameState.story.exposure=Math.max(gameState.story.exposure,8);gameState.story.evidence=Math.min(gameState.story.evidence,7);}
  saveAll();closePanel();advanceMissionStep();notice('Final path locked: Ending '+path+'.');
}

function wantedStars(level){const n=Math.max(0,Math.min(5,Math.floor(Number(level)||0)));return `<span class="stars" aria-label="Wanted level ${n}">${'★'.repeat(n)}${'☆'.repeat(5-n)}</span>`;}
function updatePlayableHUD(){
  if(!gameState)return;const w=document.getElementById('wanted');if(w)w.innerHTML=wantedStars(gameState.wanted||0);
  let box=document.getElementById('objectiveBox');if(!box){box=document.createElement('div');box.id='objectiveBox';box.className='objective-box';document.getElementById('world').appendChild(box);}
  const m=currentMission(),step=currentStep();
  if(m&&step){const t=targetForStep(step);const d=distanceToTarget(step);box.innerHTML=`<strong>${escapeHtml(m.id)} · ${escapeHtml(m.title)}</strong><small>${escapeHtml(step.text)} · ${Math.round(d)}m</small>`;box.classList.remove('hidden');}
  else box.classList.add('hidden');
  const action=document.getElementById('actionBtn'),car=document.getElementById('vehicleBtn'),fire=document.getElementById('fireBtn');
  if(action){action.textContent=(step?.kind==='choice'?'DECIDE':'ACTION');action.disabled=!!step&&distanceToTarget(step)>90&&step.kind!=='choice';}
  const p=currentPlayer();const nearV=nearestVehicle(80);if(car)car.textContent=p.inVehicle?'EXIT':'CAR';if(fire)fire.disabled=!nearV||!!p.inVehicle;
}
function nearestVehicle(max=90){const p=currentPlayer();let best=null,dist=Infinity;(gameState.vehicles||[]).forEach(v=>{const d=Math.hypot((v.x||0)-p.position.x,(v.y||0)-p.position.y);if(d<dist&&d<=max){dist=d;best=v;}});return best;}
function enterPlayableVehicle(v){const p=currentPlayer();if(!v)return false;vehiclePhase5Init?.(v);p.inVehicle=v.id;v.driverState='player';p.position.x=v.x;p.position.y=v.y;saveAll();notice('Entered '+v.name+'. Use the arrows/WASD to drive.');return true;}
function exitPlayableVehicle(){const p=currentPlayer();if(!p.inVehicle)return false;const v=(gameState.vehicles||[]).find(x=>x.id===p.inVehicle);if(v){p.position.x=v.x+26;p.position.y=v.y+10;v.speed=0;v.driverState='calm';}p.inVehicle=null;saveAll();notice('Exited vehicle.');return true;}
function toggleVehicle(){ensurePlayableState();const p=currentPlayer();if(p.inVehicle)return exitPlayableVehicle();const v=nearestVehicle(95);if(!v)return notice('Move closer to a vehicle.');if(v.owner&&v.owner!==p.id&&v.owner!==p.name&&v.owner!=='public')return notice('This vehicle belongs to another protagonist.');enterPlayableVehicle(v);}
function fireAction(){ensurePlayableState();if(currentPlayer().inVehicle)return notice('Exit the vehicle to fire.');const v=nearestVehicle(105);if(!v)return notice('No vehicle in range.');vehiclePhase5Init?.(v);const keys=Array.isArray(v.tires)?v.tires:[{state:'healthy',pressure:100},{state:'healthy',pressure:100},{state:'healthy',pressure:100},{state:'healthy',pressure:100}];if(!Array.isArray(v.tires))v.tires=keys;const tire=v.tires.find(t=>t.state!=='popped'&&t.pressure!==0)||v.tires.find(t=>t.state!=='popped');if(!tire)return notice('All tires are already popped.');tire.state='popped';tire.pressure=0;v.handlingPenalty=(v.handlingPenalty||0)+0.25;v.driverState='panic';v.damageLog=v.damageLog||[];v.damageLog.push({part:'tire',reason:'player_fire',time:worldClock});v.health=Math.max(1,(v.health||100)-5);saveAll();notice('TIRE POPPED — driver reaction triggered.');reportCrimeEvent?.(1);}
function contextAction(){ensurePlayableState();const m=currentMission(),step=currentStep();if(m&&step)return missionAction();if(near){talkTo(near.id);return;}const v=nearestVehicle(90);if(v){enterPlayableVehicle(v);return;}notice('Nothing nearby to interact with.');}

function playableVehicleTick(dt){
  ensurePlayableState();const p=currentPlayer();if(!p?.inVehicle)return;const v=(gameState.vehicles||[]).find(x=>x.id===p.inVehicle);if(!v){p.inVehicle=null;return;}
  vehiclePhase5Init?.(v);const dx=(keys.d?1:0)-(keys.a?1:0),dy=(keys.s?1:0)-(keys.w?1:0);if(dx||dy){const len=Math.hypot(dx,dy);const tireValues=Array.isArray(v.tires)?v.tires.map(t=>t.pressure??(t.state==='popped'?0:100)):Object.values(v.tires||{});const popped=tireValues.filter(x=>x<=0).length;const handling=Math.max(.35,1-popped*.18);const speed=145*handling;v.x+=dx/len*speed*dt;v.y+=dy/len*speed*dt;v.speed=speed;v.heading=Math.atan2(dy,dx);p.position.x=v.x;p.position.y=v.y;p.location=getDistrict(v.x,v.y);}else{v.speed=Math.max(0,(v.speed||0)-120*dt);}p.position.x=v.x;p.position.y=v.y;p.location=getDistrict(v.x,v.y);saveAll();}

function playableTick(dt){
  playableVehicleTick(dt);
  const m=currentMission(),step=currentStep();
  if(m&&step&&step.kind==='travel'&&distanceToTarget(step)<=90)advanceMissionStep();
  // Context reactions and HUD are cheap enough for the browser prototype.
  updatePlayableHUD();
}

function renderMissionOverride(){openPlayableMissions();}
window.openMissions=renderMissionOverride;
window.startPlayableMission=startPlayableMission;window.resumeMission=resumeMission;window.contextAction=contextAction;window.toggleVehicle=toggleVehicle;window.fireAction=fireAction;window.setMissionFilter=setMissionFilter;window.openEndingChoice=openEndingChoice;window.selectEndingPath=selectEndingPath;window.retryActivePlayableMission=retryActivePlayableMission;window.wantedStars=wantedStars;
window.playableTick=playableTick;

// Upgrade the original vehicle panel with real proximity instructions.
const oldOpenVehicles=window.openVehicles;
window.openVehicles=function(){ensurePlayableState();panel(`<h3>VEHICLES <button class="close" onclick="closePanel()">×</button></h3>${(gameState.vehicles||[]).map(v=>{vehiclePhase5Init?.(v);return `<div class="vehicle"><b>${escapeHtml(v.name)}</b><span>${escapeHtml(v.type||'Car')} · Owner: ${escapeHtml(gameState.characters[v.owner]?.name||v.owner||'Public')}</span><small>Condition ${Math.round(v.health)}% · Tires ${Array.isArray(v.tires)?v.tires.map(t=>t.state==='popped'?'POP':Math.round(t.pressure??100)).join(' / '):Object.values(v.tires||{}).map(x=>Math.round(x)).join(' / ')}</small><button onclick="focusVehicle('${v.id}')">GO TO CAR</button></div>`}).join('')}<p>Walk to a car in the world and tap CAR, or use GO TO CAR to set a navigation target.</p>`);};
window.focusVehicle=function(id){const v=(gameState.vehicles||[]).find(x=>x.id===id);if(!v)return;window.__vehicleTarget={id};closePanel();notice('Vehicle marked on the map.');};

// Replace the old 34-mission journal after campaign data arrives.
let tries=0;const wait=setInterval(()=>{tries++;if(campaignReady()||tries>80){clearInterval(wait);canonicalizeCampaign();ensurePlayableState();if(document.getElementById('missionCount'))document.getElementById('missionCount').textContent='88';updatePlayableHUD();}},100);
window.addEventListener('load',()=>{ensurePlayableState();canonicalizeCampaign();setTimeout(updatePlayableHUD,300);});

// Ensure the four final outcomes are real state transitions, not just cards.
window.finalizePlayableEnding=function(){
  ensurePlayableState();const path=gameState.story.endingPath||'D';const e={A:'THE ESCAPE',B:'THE CROWN',C:'THE SACRIFICE',D:'NO WAY OUT'}[path];gameState.story.ending=path;gameState.story.postgame=true;gameState.worldState=gameState.worldState||{districts:{},businesses:{},law:{heat:0}};gameState.worldState.ending=path;gameState.worldState.freeRoam=true;gameState.worldState.availableActivities=['properties','businesses','free-roam heists','social activities','collectibles','mission replay','driving','NPC social events'];if(path==='B')gameState.worldState.availableActivities.push('network management');if(path==='D')gameState.worldState.districts['Veyron Central']={lawPresence:'high',publicFear:'high'};if(path==='A')gameState.worldState.districts['Veyron Central']={lawPresence:'investigative',publicFear:'low'};if(path==='C')gameState.worldState.districts['Veyron Central']={memorial:'active',publicFear:'mixed'};gameState.story.money=totalMoney();saveAll();panel(`<div class="mission-result"><small>FINAL OUTCOME</small><h2>ENDING ${path}</h2><h3>${e}</h3><p>${path==='A'?'404 is exposed and Darius attempts to disappear from Veyron.':path==='B'?'The power structure fractures and the player inherits a dangerous network.':path==='C'?'One protagonist is lost so the others can survive and carry the truth forward.':'The 404 operation survives the collapse and Veyron becomes a darker city.'}</p><p><b>FREE ROAM CONTINUES.</b> The ending is now part of the persistent world state.</p><button onclick="closePanel()">ENTER FREE ROAM</button></div>`);
};

// Playable building/interior browser layer.
function buildingCanAccess(id){ensurePlayableState();const b=gameState.buildings.find(x=>x.id===id);if(!b)return false;if(b.access==='full')return true;if(gameState.story.postgame)return true;return (b.missions||[]).some(mid=>gameState.missionRuntime.results?.[mid]?.failed===false);}
window.openInteriors=function(){
  ensurePlayableState();
  const buildings=gameState.buildings||[];
  panel(`<h3>VEYRON INTERIORS <button class="close" onclick="closePanel()">×</button></h3><p>Full-access locations can be entered now in the browser prototype. Conditional locations unlock through missions/story state.</p>`+
    buildings.map(b=>`<div class="mission"><b>${escapeHtml(b.name)}</b><small>${escapeHtml(b.district)} · ${b.floors} floors · ${String(b.access).toUpperCase()}</small><span>${buildingCanAccess(b.id)?'ACCESS AVAILABLE':'ACCESS LOCKED / CONDITIONAL'}</span>${buildingCanAccess(b.id)?`<div class="choice-grid">${Array.from({length:Math.min(b.floors,6)},(_,i)=>`<button onclick="openBuildingFloor('${b.id}',${i+1})">FLOOR ${i+1}</button>`).join('')}</div>`:''}</div>`).join(''));
};
window.openBuildingFloor=function(id,floor){
  ensurePlayableState();const b=gameState.buildings.find(x=>x.id===id);if(!b||!buildingCanAccess(id))return notice('This building is not accessible yet.');
  const rooms={bank:['Lobby','Teller Hall','Security','Records'],police:['Lobby','Operations','Interview','Evidence'],garage:['Workshop','Parts','Office'],restaurant:['Dining Room','Kitchen','Storage'],warehouse:['Loading Floor','Storage'],airport:['Check-in','Gates','Baggage','Service'],casino:['Gaming Floor','Restaurant','VIP','Security'],jewelry:['Showroom','Office'],corporate:['Lobby','Offices','Executive','Archive'],prison:['Intake','Cells','Administration','Service'],military:['Gate','Operations','Armory'],hotel:['Lobby','Room','Restaurant','Terrace'],house:['Living Room','Kitchen','Bedroom','Terrace']}[b.type]||['Main Hall','Room','Office','Service'];
  const room=rooms[(floor-1)%rooms.length];panel(`<h3>${escapeHtml(b.name)} · FLOOR ${floor} <button class="close" onclick="closePanel()">×</button></h3><div class="row"><span>Primary space</span><b>${escapeHtml(room)}</b></div><p>Prototype interaction layer: enter, inspect, use phones/laptops, social interactions and mission staging can attach to this floor.</p><button onclick="notice('Inspected '+escapeHtml(room)+'.')">INSPECT</button><button onclick="closePanel()">LEAVE</button>`);
};

})();
