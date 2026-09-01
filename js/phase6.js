/* 404: NO WAY OUT — Phase 6 Combat/Crime/Police */
const PHASE6={wantedNames:["CLEAR","SUSPICIOUS","SEARCHING","PURSUIT","HEAVY RESPONSE","MANHUNT"]};

function phase6Init(){
  gameState.wanted=gameState.wanted??0;
  gameState.incidents=gameState.incidents||[];
  gameState.evidence=gameState.evidence||[];
  gameState.policeUnits=gameState.policeUnits||[];
  Object.values(gameState.npcs||{}).forEach(n=>{
    n.health=n.health??100;n.combatState=n.combatState||"calm";
    n.alert=n.alert??0;
  });
}
function createCrimeIncident(type,severity=1){
  phase6Init();
  const p=currentPlayer();
  const incident={id:"INC-"+Math.random().toString(36).slice(2,9).toUpperCase(),type,severity:Math.max(1,Math.min(5,severity)),
    x:p.position.x,y:p.position.y,time:worldClock,protagonist:p.id,witnesses:[],reported:false};
  Object.values(gameState.npcs||{}).forEach(n=>{
    if(typeof npcPhase4ReactToCrime==="function"){
      const result=npcPhase4ReactToCrime(n,incident.severity);
      if(result?.npc)incident.witnesses.push({id:n.id,reported:!!result.reported});
      if(result?.reported)incident.reported=true;
    }
  });
  if(incident.reported){
    gameState.wanted=Math.max(gameState.wanted,incident.severity);
    dispatchPolice(incident);
  }
  gameState.incidents.push(incident);saveAll();updateHUD();
  return incident;
}
function dispatchPolice(incident){
  const count=Math.min(incident.severity+1,8);
  for(let i=0;i<count;i++)gameState.policeUnits.push({
    id:"P-"+Math.random().toString(36).slice(2,7),x:incident.x+(i*35),y:incident.y+(i*22),
    state:incident.severity>=3?"pursuit":"search",target:gameState.active,incidentId:incident.id
  });
  notice("Police response dispatched.");
}
function phase6CombatHit(target,damage=15){
  if(!target)return;
  target.health=Math.max(0,(target.health??100)-damage);
  target.combatState=target.health<=0?"down":"fighting";
  if(target.health<=0)createCrimeIncident("assault",2);
  saveAll();
}
function phase6RaiseWanted(amount=1){
  phase6Init();gameState.wanted=Math.min(5,gameState.wanted+amount);updateHUD();
}
function phase6ReduceWanted(){
  phase6Init();
  if(gameState.wanted>0)gameState.wanted=Math.max(0,gameState.wanted-0.01);
  updateHUD();
}
function phase6PoliceTick(dt){
  phase6Init();
  gameState.policeUnits.forEach(u=>{
    const p=currentPlayer();const dx=p.position.x-u.x,dy=p.position.y-u.y,d=Math.hypot(dx,dy);
    if(u.state==="search" && d<400)u.state="pursuit";
    if(u.state==="pursuit" && d>700)u.state="search";
    if(d>5){u.x+=dx/d*70*dt;u.y+=dy/d*70*dt;}
    if(d<28 && u.state==="pursuit"){notice("Police reached you.");p.health=Math.max(0,p.health-10*dt);}
  });
  if(gameState.wanted===0)gameState.policeUnits=[];
  else if(Math.random()<dt*0.15)phase6ReduceWanted();
}
function openCrimePolice(){
  phase6Init();
  panel(`<h3>CRIME & POLICE <button class="close" onclick="closePanel()">×</button></h3>
  <div class="row"><span>Wanted</span><b>${PHASE6.wantedNames[gameState.wanted]}</b></div>
  <div class="row"><span>Active incidents</span><b>${gameState.incidents.length}</b></div>
  <div class="row"><span>Police units</span><b>${gameState.policeUnits.length}</b></div>
  <button onclick="createCrimeIncident('test incident',1)">TEST INCIDENT</button>
  <p>Witnesses, evidence and wanted status are designed to become server-authoritative online events.</p>`);
}
const oldLoopPhase6=loop;
loop=function(t){
  oldLoopPhase6(t);
  phase6PoliceTick(Math.min((t-(loop._last||t))/1000,.05));
  loop._last=t;
};
phase6Init();
