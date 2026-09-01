/* 404: NO WAY OUT — Phase 5 Vehicle & Traffic Simulation */
const VEHICLE_PHASE5={
  tireStates:["healthy","worn","punctured","flat","destroyed"],
  damageParts:["body","engine","windows","doors","hood","trunk","lights","tires"]
};

function vehiclePhase5Init(v){
  v.health=v.health??100;
  v.engine=v.engine??100;
  v.body=v.body??100;
  v.tires=v.tires||{fl:100,fr:100,rl:100,rr:100};
  v.windows=v.windows??100;
  v.doors=v.doors??100;
  v.lights=v.lights??100;
  v.speed=v.speed??0;
  v.heading=v.heading??0;
  v.damageLog=v.damageLog||[];
  v.driverState=v.driverState||"calm";
  v.class=v.class||"sedan";
  return v;
}

function vehiclePhase5Tick(v,dt){
  vehiclePhase5Init(v);
  if(v.speed>0){
    const tirePenalty=Object.values(v.tires).reduce((s,x)=>s+(x<25?0.18:x<50?0.08:0),0);
    v.speed=Math.max(0,v.speed-(tirePenalty*dt*8));
  }
  if(v.engine<20)v.speed=Math.min(v.speed,35);
  if(v.health<1)v.speed=0;
}

function damageVehicle(v,part,amount,reason="collision"){
  vehiclePhase5Init(v);
  const a=Math.max(0,Math.min(100,amount));
  if(part==="engine")v.engine=Math.max(0,v.engine-a);
  else if(part==="body")v.body=Math.max(0,v.body-a);
  else if(part==="windows")v.windows=Math.max(0,v.windows-a);
  else if(part==="doors")v.doors=Math.max(0,v.doors-a);
  else if(part==="lights")v.lights=Math.max(0,v.lights-a);
  else if(part==="tires"){
    const keys=Object.keys(v.tires);const k=keys[Math.floor(Math.random()*keys.length)];
    v.tires[k]=Math.max(0,v.tires[k]-a);
    v.damageLog.push({part:"tire:"+k,amount:a,reason,time:worldClock});
  } else v.body=Math.max(0,v.body-a);
  v.health=Math.round((v.engine+v.body+v.windows+v.doors+v.lights+Object.values(v.tires).reduce((a,b)=>a+b,0)/4)/6);
  v.damageLog.push({part,amount:a,reason,time:worldClock});
  vehiclePhase5React(v,part);
  saveAll();
}

function vehiclePhase5React(v,part){
  if(part==="tires"){
    const minT=Math.min(...Object.values(v.tires));
    if(minT<=0)v.driverState="panic";
    else if(minT<25)v.driverState="struggling";
  }
  if(v.engine<20)v.driverState="stalling";
}

function punctureNearestVehicle(){
  const p=currentPlayer();
  let best=null,d=Infinity;
  gameState.vehicles.forEach(v=>{const dd=Math.hypot(v.x-p.position.x,v.y-p.position.y);if(dd<d){d=dd;best=v}});
  if(!best||d>90)return notice("Move closer to a vehicle.");
  damageVehicle(best,"tires",75,"tire damage");
  notice("Tire damaged. Handling will be affected.");
}

function openVehicleDamage(){
  const p=currentPlayer();
  const owned=gameState.vehicles.filter(v=>v.owner===gameState.active);
  panel(`<h3>VEHICLE CONDITION <button class="close" onclick="closePanel()">×</button></h3>`+
    owned.map(v=>{vehiclePhase5Init(v);return `<div class="mission"><b>${v.name}</b><span>Body ${Math.round(v.body)} · Engine ${Math.round(v.engine)} · Tires ${Object.values(v.tires).map(x=>Math.round(x)).join("/")}</span><small>Driver state: ${v.driverState}</small></div>`}).join("")+
    `<button onclick="punctureNearestVehicle()">TEST TIRE DAMAGE</button>`);
}

/* Add a light traffic-reaction layer to Phase 3 traffic. */
function vehiclePhase5TrafficTick(dt){
  if(!traffic)return;
  traffic.forEach(v=>{
    v.driverState=v.driverState||"calm";
    if(v.nearHazard){
      const r=Math.random();
      v.driverState=r<.25?"horn":r<.5?"brake":r<.75?"swerve":"change_lane";
    } else v.driverState="calm";
  });
}
const oldUpdateTraffic=typeof updateTraffic==="function"?updateTraffic:null;
if(oldUpdateTraffic){
  updateTraffic=function(dt){oldUpdateTraffic(dt);vehiclePhase5TrafficTick(dt)};
}
