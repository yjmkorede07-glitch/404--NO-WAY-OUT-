import { WebSocketServer } from "ws";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createAccount, authenticate, getProfile, saveProfile, saveMission, applyCrimeReward, getMissions, getProperties, getBusinesses, getVehicles, buyProperty, upgradeProperty, saveBusiness, storeVehicle, setOnlineIdentity, getOnlineIdentity, transferMoney, claimOnlineStartingGrant, getOnlineCareer, saveOnlineCareer, submitLawEnforcementApplication, listLawEnforcementApplications, decideLawEnforcementApplication, setBusinessIllegalActivity, getBusinessIllegalActivities } from "./db.js";

const PORT=process.env.PORT||8080;
const TICK=20;
const MAX_PLAYERS=16;
const sessions=new Map();
const onlineMissionCatalog=JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)),"../Unreal/Content/Data/OnlineMissions/online_missions_24.json"),"utf8"));
const onlineMissionById=new Map(onlineMissionCatalog.missions.map(m=>[m.id,m]));

const now=()=>Date.now();
const id=()=>crypto.randomUUID();

function safeNumber(v,f=0){return Number.isFinite(Number(v))?Number(v):f}
function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}

function createSession(){
  const session={id:id(),players:new Map(),onlineMissions:new Map(),world:{
    id: "veyron-01", time:480,weather:"clear",wanted:new Map(),missions:new Map(),vehicles:new Map(),npcEvents:[],
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


const sessionsByToken=new Map();
function token(){return crypto.randomBytes(32).toString("hex")}
function authRequired(ws){return ws.accountId?true:false}

function handle(ws,msg){
  const {type,payload={}}=msg||{};
  if(type==="register"){
    try{
      const email=String(payload.email||"").trim().toLowerCase(),password=String(payload.password||""),name=String(payload.name||"Player").slice(0,30);
      if(!email||password.length<8)return reject(ws,"Email and password (8+ chars) required");
      const accountId=createAccount(email,password,name),t=token();sessionsByToken.set(t,accountId);ws.accountId=accountId;ws.token=t;
      send(ws,"auth_ok",{token:t,...fullAccountSnapshot(accountId)});return;
    }catch(e){return reject(ws,"Account registration failed")}
  }
  if(type==="login"){
    const profile=authenticate(String(payload.email||"").trim().toLowerCase(),String(payload.password||""));
    if(!profile)return reject(ws,"Invalid login");
    const t=token();sessionsByToken.set(t,profile.account_id);ws.accountId=profile.account_id;ws.token=t;
    send(ws,"auth_ok",{token:t,...fullAccountSnapshot(profile.account_id)});return;
  }
  if(type==="resume"){
    const accountId=sessionsByToken.get(String(payload.token||""));
    if(!accountId)return reject(ws,"Session expired");
    ws.accountId=accountId;ws.token=String(payload.token);send(ws,"auth_ok",{token:ws.token,profile:getProfile(accountId),missions:getMissions(accountId)});return;
  }
  if(type==="buy_property"){if(!authRequired(ws))return reject(ws,"Login required");const r=buyProperty(ws.accountId,String(payload.propertyId||""),payload.price);if(!r.ok)return reject(ws,r.reason);return send(ws,"economy_update",{profile:r.profile,properties:r.properties});}
  if(type==="upgrade_property"){if(!authRequired(ws))return reject(ws,"Login required");const r=upgradeProperty(ws.accountId,String(payload.propertyId||""),payload.price);if(!r.ok)return reject(ws,r.reason);return send(ws,"economy_update",{profile:r.profile,properties:r.properties});}
  if(type==="business_update"){if(!authRequired(ws))return reject(ws,"Login required");return send(ws,"business_update",{business:saveBusiness(ws.accountId,String(payload.businessId||""),payload)});}
  if(type==="store_vehicle"){if(!authRequired(ws))return reject(ws,"Login required");storeVehicle(ws.accountId,String(payload.vehicleId||""),payload.name,payload.health,payload.propertyId);return send(ws,"vehicle_persisted",{vehicles:getVehicles(ws.accountId)});}
  if(type==="online_character_created") {
    if(!authRequired(ws))return reject(ws,"Login required");
    const name=String(payload.displayName||"Player").slice(0,30);
    const grant=claimOnlineStartingGrant(ws.accountId);
    if(!grant.ok && grant.reason!=="grant_already_claimed")return reject(ws,grant.reason);
    saveOnlineCareer(ws.accountId,{life_path:"legitimate",world_id:String(payload.worldId||"veyron-01"),grant_claimed:true,last_lifestyle_change_at:0});
    return send(ws,"online_character_created",{displayName:name,grant:grant.ok?grant:{ok:true,alreadyClaimed:true,profile:getProfile(ws.accountId)},career:getOnlineCareer(ws.accountId)});
  }
  if(type==="online_grant_claim") {
    if(!authRequired(ws))return reject(ws,"Login required");
    const r=claimOnlineStartingGrant(ws.accountId); if(!r.ok)return reject(ws,r.reason); return send(ws,"online_grant_claimed",r);
  }
  if(type==="online_career_save") {
    if(!authRequired(ws))return reject(ws,"Login required");
    return send(ws,"online_career_update",{career:saveOnlineCareer(ws.accountId,payload)});
  }
  if(type==="online_law_apply") {
    if(!authRequired(ws))return reject(ws,"Login required");
    return send(ws,"law_application_update",{application:submitLawEnforcementApplication(ws.accountId)});
  }
  if(type==="online_law_admin_list") {
    if(String(payload.adminKey||"")!==String(process.env.ADMIN_API_KEY||""))return reject(ws,"Admin authorization required");
    return send(ws,"law_application_list",{applications:listLawEnforcementApplications()});
  }
  if(type==="online_law_admin_decide") {
    if(String(payload.adminKey||"")!==String(process.env.ADMIN_API_KEY||""))return reject(ws,"Admin authorization required");
    const app=decideLawEnforcementApplication(String(payload.applicationId||""),payload.accepted===true,String(payload.adminId||"admin"),payload.notes||"");
    if(!app)return reject(ws,"Application not found");
    const career=getOnlineCareer(app.account_id);
    for(const sess of sessions.values()) for(const player of sess.players.values()) if(player.ws.accountId===app.account_id) send(player.ws,"law_application_decided",{application:app,career});
    return send(ws,"law_application_decided",{application:app,career});
  }
  if(type==="business_illegal_activity") {
    if(!authRequired(ws))return reject(ws,"Login required");
    const businessId=String(payload.businessId||""),activityId=String(payload.activityId||"");
    if(!businessId||!activityId)return reject(ws,"Business and activity required");
    return send(ws,"business_illegal_activity_update",{activity:setBusinessIllegalActivity(ws.accountId,businessId,activityId,payload.active===true)});
  }
  if(type==="set_online_identity"){if(!authRequired(ws))return reject(ws,"Login required"); const identity=setOnlineIdentity(ws.accountId,{citizen_id:payload.citizen_id,world_id:payload.world_id,home_district:payload.home_district,id_active:true}); return send(ws,"identity_update",{identity});}
  if(type==="get_online_identity"){if(!authRequired(ws))return reject(ws,"Login required"); return send(ws,"identity_update",{identity:getOnlineIdentity(ws.accountId)});}
  if(type==="transfer_money"){if(!authRequired(ws))return reject(ws,"Login required"); const recipient=String(payload.recipientAccountId||""); const amount=Math.floor(Number(payload.amount)||0); const key=String(payload.idempotencyKey||""); const r=transferMoney(ws.accountId,recipient,amount,key); if(!r.ok)return reject(ws,r.reason); send(ws,"money_transfer_complete",r.sender); return;}
  if(type==="economy_snapshot"){if(!authRequired(ws))return reject(ws,"Login required");return send(ws,"economy_snapshot",{profile:getProfile(ws.accountId),properties:getProperties(ws.accountId),businesses:getBusinesses(ws.accountId),vehicles:getVehicles(ws.accountId)});}
  if(type==="story_save"){
    if(!authRequired(ws))return reject(ws,"Login required");
    const story=saveStory(ws.accountId,payload); send(ws,"story_update",{story}); return;
  }
  if(type==="story_flag"){
    if(!authRequired(ws))return reject(ws,"Login required");
    setStoryFlag(ws.accountId,payload.flag,payload.value); send(ws,"story_update",{flags:getStoryFlags(ws.accountId)}); return;
  }
  if(type==="relationship"){
    if(!authRequired(ws))return reject(ws,"Login required");
    const rel=updateRelationship(ws.accountId,payload.subjectId,payload.delta); send(ws,"relationship_update",{relationship:rel}); return;
  }
  if(type==="faction_rep"){
    if(!authRequired(ws))return reject(ws,"Login required");
    const f=updateFaction(ws.accountId,payload.factionId,payload.delta); send(ws,"faction_update",{faction:f}); return;
  }
  if(type==="evidence"){
    if(!authRequired(ws))return reject(ws,"Login required");
    addEvidence(ws.accountId,payload.evidenceId,payload.metadata||{}); send(ws,"evidence_update",{evidence:getEvidence(ws.accountId)}); return;
  }
  if(type==="full_snapshot"){
    if(!authRequired(ws))return reject(ws,"Login required");
    send(ws,"full_snapshot",fullAccountSnapshot(ws.accountId)); return;
  }
  if(type==="save_profile"){
    if(!authRequired(ws))return reject(ws,"Login required");
    saveProfile(ws.accountId,payload);send(ws,"saved",{profile:getProfile(ws.accountId)});return;
  }
  if(type==="save_mission"){
    if(!authRequired(ws))return reject(ws,"Login required");
    saveMission(ws.accountId,payload.missionId,payload.state);send(ws,"mission_saved",{missionId:payload.missionId,state:payload.state});return;
  }
  if(type==="hello"){
    if(payload.token){ws.accountId=sessionsByToken.get(String(payload.token))||null;}
    let session=payload.sessionId?sessions.get(payload.sessionId):null;
    const requestedWorld=["veyron-01","veyron-02","veyron-03"].includes(String(payload.worldId||""))?String(payload.worldId):"veyron-01";
    if(session && session.world.id!==requestedWorld)return reject(ws,"World mismatch");
    if(!session)session=createSession();
    session.world.id=requestedWorld;
    if(session.players.size>=MAX_PLAYERS)return reject(ws,"Session full");
    const player={id:id(),ws,name:String(payload.name||"Player").slice(0,24),character:["darius","malik","amara"].includes(payload.character)?payload.character:"darius",
      x:0,y:0,health:100,last:now()};
    ws.sessionId=session.id;ws.playerId=player.id;session.players.set(player.id,player);
    send(ws,"welcome",{sessionId:session.id,worldId:session.world.id,playerId:player.id,maxPlayers:MAX_PLAYERS,players:[...session.players.values()].map(publicPlayer)});
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
  if(type==="freemode_activity_start"){
    if(!authRequired(ws)) return reject(ws,"Login required");
    const kind=String(payload.kind||"");
    const allowed=["bank_robbery","store_robbery","armored_transport","cash_pickup","vehicle_theft","territory_event","police_intercept"];
    if(!allowed.includes(kind)) return reject(ws,"Unknown freemode activity");
    const x=safeNumber(payload.x,p.x),y=safeNumber(payload.y,p.y);
    if(distance({x,y},p)>30)return reject(ws,"Activity start position rejected");
    const activity={id:id(),kind,playerId:p.id,x,y,state:"active",progress:0,reward:Math.max(0,Math.min(70000,Math.floor(safeNumber(payload.reward,0)))),heat:Math.max(1,Math.min(5,Math.floor(safeNumber(payload.heat,1)))),createdAt:now(),revision:1};
    session.world.incidents.push(activity);session.world.missions.set(activity.id,activity);session.world.wanted.set(p.id,Math.max(session.world.wanted.get(p.id)||0,activity.heat));
    send(ws,"freemode_activity_started",activity);broadcast(session,"freemode_activity_event",activity,ws);return;
  }
  if(type==="freemode_activity_progress"){
    if(!authRequired(ws)) return reject(ws,"Login required");
    const activity=session.world.missions.get(String(payload.activityId||""));
    if(!activity||activity.playerId!==p.id)return reject(ws,"Activity not found");
    if(activity.state!=="active"&&activity.state!=="escape")return reject(ws,"Activity inactive");
    const step=Math.max(1,Math.min(25,Math.floor(safeNumber(payload.step,25))));
    activity.progress=Math.min(100,activity.progress+step);activity.revision++;
    if(activity.progress>=100){activity.state="escape";session.world.wanted.set(p.id,Math.max(session.world.wanted.get(p.id)||0,activity.heat+1));}
    send(ws,"freemode_activity_update",activity);return;
  }
  if(type==="freemode_activity_resolve"){
    if(!authRequired(ws)) return reject(ws,"Login required");
    const activity=session.world.missions.get(String(payload.activityId||""));
    if(!activity||activity.playerId!==p.id)return reject(ws,"Activity not found");
    if(activity.state!=="escape")return reject(ws,"Activity not ready to resolve");
    const success=payload.success===true;activity.state=success?"resolved":"failed";activity.revision++;
    const reward=success?activity.reward:0;const wanted=success?0:activity.heat;
    const profile=applyCrimeReward(ws.accountId,reward,wanted);
    send(ws,"freemode_activity_resolved",{activityId:activity.id,success,reward,wanted,profile,revision:activity.revision});
    broadcast(session,"freemode_activity_event",{id:activity.id,state:activity.state,playerId:p.id},ws);return;
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
  if(type==="online_mission_list") {
    if(!authRequired(ws)) return reject(ws,"Login required");
    return send(ws,"online_mission_offer",{catalogId:onlineMissionCatalog.catalog_id,missions:onlineMissionCatalog.missions});
  }
  if(type==="online_mission_start_request") {
    if(!authRequired(ws)) return reject(ws,"Login required");
    const missionId=String(payload.missionId||"");
    const mission=onlineMissionById.get(missionId);
    if(!mission) return reject(ws,"Unknown online mission");
    const partyId=String(payload.partyId||ws.playerId).slice(0,80);
    const instanceId=id();
    const instance={instanceId,missionId,partyId,ownerId:p.id,currentObjective:0,startedAt:now(),revision:1,status:"started",members:[p.id]};
    session.onlineMissions.set(instanceId,instance);
    return send(ws,"online_mission_started",{instance,mission});
  }
  if(type==="online_objective_action") {
    if(!authRequired(ws)) return reject(ws,"Login required");
    const instance=session.onlineMissions.get(String(payload.instanceId||""));
    if(!instance) return reject(ws,"Mission instance not found");
    if(instance.status!=="started") return reject(ws,"Mission is not active");
    if(instance.currentObjective!==Math.max(0,Math.floor(safeNumber(payload.objectiveIndex,-1)))) return reject(ws,"Objective sequence rejected");
    const mission=onlineMissionById.get(instance.missionId);
    instance.currentObjective++; instance.revision++;
    const complete=instance.currentObjective>=mission.objectives.length;
    if(complete) instance.status="ready_to_extract";
    return send(ws,"online_objective_update",{instanceId:instance.instanceId,revision:instance.revision,currentObjective:instance.currentObjective,status:instance.status});
  }
  if(type==="online_extract_request") {
    if(!authRequired(ws)) return reject(ws,"Login required");
    const instance=session.onlineMissions.get(String(payload.instanceId||""));
    if(!instance) return reject(ws,"Mission instance not found");
    if(instance.status!=="ready_to_extract") return reject(ws,"Objectives are incomplete");
    const mission=onlineMissionById.get(instance.missionId);
    instance.status="completed"; instance.revision++;
    // Reward committing is deliberately represented as a server event; production DB transaction is the next persistence layer.
    return send(ws,"online_mission_completed",{instanceId:instance.instanceId,missionId:mission.id,reward:{cash:mission.cash,xp:mission.xp},revision:instance.revision});
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
    s.world.time=(s.world.time+(60/(5*60))/TICK)%1440;
    broadcast(s,"world_tick",{time:s.world.time,weather:s.world.weather,players:s.players.size});
  }
},1000/TICK);
console.log(`404 server listening on :${PORT}`);
