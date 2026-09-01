/* 404: NO WAY OUT — Online Synchronization Foundation */
const ONLINE_SYNC={
  tickRate:20,
  interpolation:0.12,
  interestRadius:850,
  status:"offline",
  sessionId:null,
  playerId:"local-"+Math.random().toString(36).slice(2,9),
  seq:0,
  lastAck:0,
  outbox:[],
  snapshots:new Map()
};

function syncMakeEvent(type,payload){
  return {type,seq:++ONLINE_SYNC.seq,sessionId:ONLINE_SYNC.sessionId,playerId:ONLINE_SYNC.playerId,time:Date.now(),payload};
}
function syncQueue(type,payload){
  ONLINE_SYNC.outbox.push(syncMakeEvent(type,payload));
  if(ONLINE_SYNC.outbox.length>100)ONLINE_SYNC.outbox.shift();
}
function syncLocalPlayer(){
  if(!ONLINE_SYNC.sessionId||!gameState)return;
  const p=currentPlayer();
  syncQueue("player_state",{character:p.id,x:p.position.x,y:p.position.y,health:p.health,stamina:p.stamina,inVehicle:p.inVehicle});
}
function syncVehicle(v){
  if(!ONLINE_SYNC.sessionId)return;
  vehiclePhase5Init(v);
  syncQueue("vehicle_state",{id:v.id,x:v.x,y:v.y,health:v.health,engine:v.engine,tires:v.tires});
}
function syncMission(id,state){
  if(!ONLINE_SYNC.sessionId)return;
  syncQueue("mission_state",{id,state});
}
function syncNPCEvent(n,event){
  if(!ONLINE_SYNC.sessionId)return;
  syncQueue("npc_event",{npcId:n.id,event});
}
function syncGetRelevantEntities(){
  const p=currentPlayer(),result=[];
  if(gameState?.vehicles)gameState.vehicles.forEach(v=>{
    const d=Math.hypot(v.x-p.position.x,v.y-p.position.y);
    if(d<=ONLINE_SYNC.interestRadius)result.push({kind:"vehicle",id:v.id,distance:d});
  });
  if(gameState?.npcs)Object.values(gameState.npcs).forEach(n=>{
    const d=Math.hypot(n.position.x-p.position.x,n.position.y-p.position.y);
    if(d<=ONLINE_SYNC.interestRadius)result.push({kind:"npc",id:n.id,distance:d});
  });
  return result;
}
function onlineConnectLocalSession(sessionId){
  ONLINE_SYNC.status="connected";
  ONLINE_SYNC.sessionId=sessionId||("VY-"+Math.random().toString(36).slice(2,8).toUpperCase());
  if(typeof onlineSession!=="undefined")onlineSession.sessionId=ONLINE_SYNC.sessionId;
  notice("Sync layer connected: "+ONLINE_SYNC.sessionId);
}
function onlineDisconnectSync(){
  ONLINE_SYNC.status="offline";ONLINE_SYNC.sessionId=null;ONLINE_SYNC.outbox=[];
}
function openSyncMonitor(){
  const relevant=syncGetRelevantEntities();
  panel(`<h3>ONLINE SYNC MONITOR <button class="close" onclick="closePanel()">×</button></h3>
  <div class="row"><span>Status</span><b>${ONLINE_SYNC.status}</b></div>
  <div class="row"><span>Session</span><b>${ONLINE_SYNC.sessionId||"—"}</b></div>
  <div class="row"><span>Outgoing events</span><b>${ONLINE_SYNC.outbox.length}</b></div>
  <div class="row"><span>Relevant entities</span><b>${relevant.length}</b></div>
  <p>Authority: server. High-frequency replication is limited to nearby entities.</p>
  <button onclick="onlineConnectLocalSession(ONLINE_SYNC.sessionId||null)">CONNECT TEST</button>
  <button onclick="onlineDisconnectSync()">DISCONNECT</button>`);
}

/* Safe periodic local serialization of state changes. */
setInterval(()=>{
  try{
    if(ONLINE_SYNC.status==="connected"){
      syncLocalPlayer();
      gameState?.vehicles?.forEach(v=>{if(Math.hypot(v.x-currentPlayer().position.x,v.y-currentPlayer().position.y)<ONLINE_SYNC.interestRadius)syncVehicle(v)});
    }
  }catch(e){}
},1000/ONLINE_SYNC.tickRate);
