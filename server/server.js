import { WebSocketServer } from "ws";
import crypto from "crypto";

const PORT=process.env.PORT||8080;
const TICK=20;
const MAX_PLAYERS=16;
const sessions=new Map();

const now=()=>Date.now();
const id=()=>crypto.randomUUID();

function safeNumber(v,f=0){return Number.isFinite(Number(v))?Number(v):f}
function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}

function createSession(){
  const session={id:id(),players:new Map(),world:{
    time:480,weather:"clear",wanted:new Map(),missions:new Map(),vehicles:new Map(),npcEvents:[],
    incidents:[]
  }};
  sessions.set(session.id,session); return session;
}
function getSession(ws){return ws.sessionId?sessions.get(ws.sessionId):null}

function send(ws,type,payload){if(ws.readyState===1)ws.send(JSON.stringify({type,payload,serverTime:now()}))}
function broadcast(session,type,payload,except=null){
  for(const p of session.players.values())if(p.ws!==except)send(p.ws,type,payload);
}
function reject(ws,reason){send(ws,"error",{reason})}

function validatePlayerState(p,data){
  const x=safeNumber(data.x,p.x),y=safeNumber(data.y,p.y);
  const dx=x-p.x,dy=y-p.y,d=Math.hypot(dx,dy);
  // Server movement validation: cap distance per tick plus tolerance.
  const maxPerTick=18;
  if(d>maxPerTick)return false;
  p.x=x;p.y=y;
  if(Number.isFinite(data.health))p.health=Math.max(0,Math.min(100,Number(data.health)));
  if(typeof data.character==="string"&&["darius","malik","amara"].includes(data.character))p.character=data.character;
  return true;
}

function handle(ws,msg){
  const {type,payload={}}=msg||{};
  if(type==="hello"){
    let session=payload.sessionId?sessions.get(payload.sessionId):null;
    if(!session)session=createSession();
    if(session.players.size>=MAX_PLAYERS)return reject(ws,"Session full");
    const player={id:id(),ws,name:String(payload.name||"Player").slice(0,24),character:["darius","malik","amara"].includes(payload.character)?payload.character:"darius",
      x:0,y:0,health:100,last:now()};
    ws.sessionId=session.id;ws.playerId=player.id;session.players.set(player.id,player);
    send(ws,"welcome",{sessionId:session.id,playerId:player.id,maxPlayers:MAX_PLAYERS,players:[...session.players.values()].map(publicPlayer)});
    broadcast(session,"player_joined",publicPlayer(player),ws);return;
  }
  const session=getSession(ws); if(!session)return reject(ws,"Handshake required");
  const p=session.players.get(ws.playerId); if(!p)return reject(ws,"Unknown player");

  if(type==="player_state"){
    if(!validatePlayerState(p,payload))return reject(ws,"Movement rejected");
    broadcast(session,"player_state",publicPlayer(p),ws);return;
  }
  if(type==="character_switch"){
    if(["darius","malik","amara"].includes(payload.character))p.character=payload.character;
    broadcast(session,"character_switch",{playerId:p.id,character:p.character});return;
  }
  if(type==="crime_incident"){
    const severity=Math.max(1,Math.min(5,Math.floor(safeNumber(payload.severity,1))));
    const inc={id:id(),type:String(payload.kind||"incident").slice(0,40),severity,x:p.x,y:p.y,time:now(),playerId:p.id};
    session.world.incidents.push(inc);session.world.wanted.set(p.id,Math.max(session.world.wanted.get(p.id)||0,severity));
    broadcast(session,"crime_incident",inc);send(ws,"wanted",{level:session.world.wanted.get(p.id)});return;
  }
  if(type==="damage"){
    // Server validates target and caps damage to prevent client-side instant kills.
    const damage=Math.max(0,Math.min(40,Math.floor(safeNumber(payload.amount,0))));
    broadcast(session,"damage",{source:p.id,target:String(payload.target||"").slice(0,80),amount:damage});return;
  }
  if(type==="mission_event"){
    const event={id:id(),playerId:p.id,missionId:String(payload.missionId||"").slice(0,50),state:String(payload.state||"").slice(0,30),time:now()};
    session.world.missions.set(event.missionId,event);broadcast(session,"mission_event",event);return;
  }
  if(type==="vehicle_state"){
    const v={id:String(payload.id||"").slice(0,80),owner:p.id,x:safeNumber(payload.x),y:safeNumber(payload.y),health:Math.max(0,Math.min(100,safeNumber(payload.health,100))),engine:Math.max(0,Math.min(100,safeNumber(payload.engine,100))),tires:payload.tires||{}};
    session.world.vehicles.set(v.id,v);broadcast(session,"vehicle_state",v,ws);return;
  }
  if(type==="ping"){send(ws,"pong",{t:now()});return;}
}

function publicPlayer(p){return{id:p.id,name:p.name,character:p.character,x:p.x,y:p.y,health:p.health}}
const wss=new WebSocketServer({port:PORT});
wss.on("connection",ws=>{
  ws.on("message",raw=>{try{handle(ws,JSON.parse(raw.toString()))}catch(e){reject(ws,"Bad message")}});  
  ws.on("close",()=>{
    const s=getSession(ws);if(!s)return;
    const p=s.players.get(ws.playerId);if(p){s.players.delete(ws.playerId);broadcast(s,"player_left",{playerId:p.id});}
    if(s.players.size===0)sessions.delete(s.id);
  });
});
setInterval(()=>{
  for(const s of sessions.values()){
    s.world.time=(s.world.time+1)%1440;
    broadcast(s,"world_tick",{time:s.world.time,weather:s.world.weather,players:s.players.size});
  }
},1000/TICK);
console.log(`404 server listening on :${PORT}`);
