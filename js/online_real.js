/* 404 online client transport — connects to the authoritative server */
const REAL_ONLINE={
  ws:null,status:"offline",sessionId:null,playerId:null,lastSend:0,
  url: location.protocol==="https:" ? `wss://${location.host}` : `ws://${location.hostname||"localhost"}:8080`
};
function realOnlineConnect(name="Player",sessionId=null){
  if(REAL_ONLINE.ws?.readyState===1)return;
  REAL_ONLINE.ws=new WebSocket(REAL_ONLINE.url);
  REAL_ONLINE.ws.onopen=()=>{REAL_ONLINE.status="connecting";REAL_ONLINE.ws.send(JSON.stringify({type:"hello",payload:{name,sessionId,character:gameState.active,token:(typeof ACCOUNT!=="undefined"?ACCOUNT.token:null)}}));};
  REAL_ONLINE.ws.onmessage=e=>{
    const m=JSON.parse(e.data);
    if(m.type==="auth_ok"){ACCOUNT.token=m.payload.token;ACCOUNT.profile=m.payload.profile;localStorage.setItem("404_token",ACCOUNT.token);notice("Account authenticated.");}
    if(m.type==="economy_update"||m.type==="economy_snapshot"){economyApply(m.payload);}
    if(m.type==="vehicle_persisted"){economyApply({vehicles:m.payload.vehicles});}
    if(m.type==="welcome"){REAL_ONLINE.status="connected";REAL_ONLINE.sessionId=m.payload.sessionId;REAL_ONLINE.playerId=m.payload.playerId;notice("Connected to Veyron Online.");}
    if(m.type==="player_state")applyRemotePlayer(m.payload);
    if(m.type==="character_switch")applyRemoteCharacter(m.payload);
    if(m.type==="crime_incident")notice("Online crime event received.");
    if(m.type==="wanted"){gameState.wanted=m.payload.level;updateHUD();}
    if(m.type==="world_tick"){if(typeof worldClock!=="undefined")worldClock=m.payload.time;}
  };
  REAL_ONLINE.ws.onclose=()=>{REAL_ONLINE.status="offline";REAL_ONLINE.ws=null;};
}
function realOnlineSend(type,payload){if(REAL_ONLINE.ws?.readyState===1)REAL_ONLINE.ws.send(JSON.stringify({type,payload}))}
function realOnlineTick(){
  if(REAL_ONLINE.status!=="connected")return;
  const p=currentPlayer();
  realOnlineSend("player_state",{x:p.position.x,y:p.position.y,health:p.health,character:gameState.active});
}
function applyRemotePlayer(data){
  gameState.remotePlayers=gameState.remotePlayers||{};
  gameState.remotePlayers[data.id]=data;
}
function applyRemoteCharacter(data){if(gameState.remotePlayers?.[data.playerId])gameState.remotePlayers[data.playerId].character=data.character;}
setInterval(realOnlineTick,50);
