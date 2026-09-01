/*
 * 404: NO WAY OUT — PHASE 14
 * Combat + Police + Advanced Vehicle Gameplay
 *
 * Browser prototype layer. Extends Phase 13 without replacing prior systems.
 */
(function(){
  "use strict";
  const P14={lastIncident:0,lastVoice:0,serial:0};

  function state(){ return window.gameState||{}; }
  function player(){ return typeof window.currentPlayer==="function" ? window.currentPlayer() : null; }
  function notify(t){ if(typeof window.notice==="function") window.notice(t); }
  function save(){ if(typeof window.saveAll==="function") window.saveAll(); }

  function stars(){
    const w=Math.max(0,Math.min(5,Math.floor(Number(state().wanted||0))));
    return "★".repeat(w)+"☆".repeat(5-w);
  }

  function setWanted(level,reason){
    const g=state();
    g.wanted=Math.max(0,Math.min(5,Math.floor(level)));
    g.police=g.police||{};
    g.police.lastIncident=reason||"unknown";
    g.police.state=g.wanted<=0?"clear":g.wanted<=2?"searching":g.wanted===3?"pursuit":g.wanted===4?"heavy_response":"manhunt";
    g.police.lastChange=Date.now();
    notify(`${stars()}  ${g.police.state.replace("_"," ").toUpperCase()}`);
    save();
  }

  function addWanted(amount,reason){
    const g=state();
    setWanted((Number(g.wanted)||0)+amount,reason);
  }

  function nearestVehicle(){
    const p=player();
    if(!p) return null;
    const list=Array.isArray(window.traffic)?window.traffic:
      (Array.isArray(state().vehicles)?state().vehicles:Object.values(state().vehicles||{}));
    let best=null,bd=Infinity;
    list.forEach(v=>{
      const x=Number(v.x??v.position?.x??0),y=Number(v.y??v.position?.y??0);
      const d=Math.hypot(x-(p.position?.x||0),y-(p.position?.y||0));
      if(d<bd){bd=d;best=v;}
    });
    return bd<75?best:null;
  }

  function ensureVehicle(v){
    if(!v)return;
    v.health=Number(v.health??100);
    v.engineHealth=Number(v.engineHealth??100);
    v.bodyHealth=Number(v.bodyHealth??100);
    v.tires=v.tires||[
      {name:"front-left",health:100,punctured:false},
      {name:"front-right",health:100,punctured:false},
      {name:"rear-left",health:100,punctured:false},
      {name:"rear-right",health:100,punctured:false}
    ];
    v.damageState=v.damageState||"clean";
    v.speedMultiplier=Number(v.speedMultiplier??1);
    v.driverState=v.driverState||"calm";
    v.p14LastDamage=Number(v.p14LastDamage||0);
  }

  function damageVehicle(v,type,amount=20){
    ensureVehicle(v);
    if(type==="tire"){
      const t=v.tires.find(x=>!x.punctured)||v.tires[0];
      t.health=Math.max(0,t.health-amount);
      if(t.health<=0)t.punctured=true;
      v.speedMultiplier=Math.max(.45,v.speedMultiplier-.12);
      v.damageState="tire_damaged";
      v.driverState="panic";
      notify(`TIRE ${t.punctured?"POPPED":"DAMAGED"}`);
      if(typeof window.phase13Tick==="function"){}
      if((Number(state().wanted)||0)<1)addWanted(1,"vehicle_damage");
    } else {
      v.bodyHealth=Math.max(0,v.bodyHealth-amount);
      v.health=Math.max(0,Math.min(v.engineHealth,v.bodyHealth));
      v.damageState=v.bodyHealth<25?"critical":"damaged";
      v.driverState="panic";
      if(v.bodyHealth<=0)v.disabled=true;
    }
    v.p14LastDamage=Date.now();
    save();
  }

  function shootVehicle(){
    const v=nearestVehicle();
    if(!v){ notify("No vehicle in range."); return; }
    damageVehicle(v,"tire",45);
    if(v.driverName){
      speakDriver(v,"My tire! What the hell was that?");
    } else {
      speakDriver(v,"Hey! My car!");
    }
  }

  function speakDriver(v,text){
    const now=Date.now();
    if(now-P14.lastVoice<1800)return;
    P14.lastVoice=now;
    if(typeof window.phase11Speak==="function") window.phase11Speak(text,v.driverName||"Driver");
    else if("speechSynthesis" in window){
      try{ const u=new SpeechSynthesisUtterance(text);u.rate=1;speechSynthesis.speak(u); }catch(_){}
    }
  }

  function vehicleStatus(){
    const v=nearestVehicle();
    if(!v){notify("No nearby vehicle.");return;}
    ensureVehicle(v);
    const popped=v.tires.filter(t=>t.punctured).length;
    notify(`${v.name||"Vehicle"} · ${Math.round(v.bodyHealth)}% body · ${popped}/4 tires punctured`);
  }

  function reportIncident(kind,severity,witness=true){
    const g=state();
    g.incidents=g.incidents||[];
    P14.serial++;
    const p=player();
    const incident={
      id:`P14-${P14.serial}`,
      kind, severity,
      reported:Boolean(witness),
      witnessCount:witness?1:0,
      location:p?.location||"Veyron",
      time:window.worldClock||0,
      evidence:{visible:witness,vehicle:kind.includes("vehicle"),weapon:kind.includes("shoot")},
      p14Handled:false
    };
    g.incidents.push(incident);
    if(g.incidents.length>40)g.incidents.shift();
    if(witness){
      const increase=severity>=4?3:severity>=3?2:1;
      addWanted(increase,kind);
    }
    save();
    return incident;
  }

  function combatFire(){
    const g=state(),p=player();
    g.combat=g.combat||{};
    g.combat.shots=(Number(g.combat.shots)||0)+1;
    g.combat.lastShot=Date.now();
    if(typeof window.phase11Speak==="function" && Math.random()<.15) window.phase11Speak("Keep moving.","Darius");
    // Prototype firearm hit: nearby vehicle first, otherwise an abstract incident.
    const v=nearestVehicle();
    if(v && Math.random()<.72){
      damageVehicle(v,"body",18);
      reportIncident("weapon_vehicle_damage",3,true);
    } else {
      reportIncident("public_gunfire",4,true);
      notify("Gunfire reported. Move!");
    }
    save();
  }

  function policeTick(dt){
    const g=state();
    const w=Math.floor(Number(g.wanted)||0);
    g.police=g.police||{};
    if(w<=0){g.police.state="clear";return;}
    g.police.cooldown=Number(g.police.cooldown||0)+dt;
    if(w>=3){
      g.police.dispatch=g.police.dispatch||{active:true,units:[]};
      if(!g.police.dispatch.units.length){
        g.police.dispatch.units=[
          {type:"patrol",state:"dispatching",distance:650},
          {type:w>=4?"tactical":"patrol",state:"responding",distance:900}
        ];
      }
      g.police.dispatch.units.forEach(u=>{
        u.distance=Math.max(40,(Number(u.distance)||500)-dt*(w>=4?55:42));
        u.state=u.distance<100?"pursuit":"responding";
      });
      g.police.state="pursuit";
    } else {
      g.police.searchActive=true;
      if(g.police.cooldown>32 && !p.inVehicle){
        // Being quiet slowly reduces lower wanted levels.
        g.wanted=Math.max(0,w-1);
        g.police.cooldown=0;
        notify(`Police pressure fading · ${stars()}`);
        save();
      }
    }
  }

  function witnessAwareness(dt){
    const g=state(),p=player();
    if(!p?.position)return;
    const npcs=Object.values(g.npcs||{});
    npcs.forEach(n=>{
      if(!n.position)return;
      const d=Math.hypot(n.position.x-p.position.x,n.position.y-p.position.y);
      if(d<110 && (g.wanted||0)>0){
        n.suspicion=Math.min(100,(Number(n.suspicion)||0)+dt*(g.wanted>=3?.9:.3));
        if(n.suspicion>65)n.mood="afraid";
      }
    });
  }

  function render(){
    const el=document.getElementById("wanted");
    if(el)el.textContent=stars();
    const p=player();
    const v=p?.inVehicle?nearestVehicle():null;
    const vs=document.getElementById("vehicleStatusP14");
    if(vs && v){
      ensureVehicle(v);
      vs.textContent=`${Math.round(v.bodyHealth)}% · ${v.tires.filter(t=>t.punctured).length} tire(s)`;
    }
  }

  function openCombatPanel(){
    if(typeof window.panel!=="function" && typeof window.openPanel!=="function")return;
    const fn=window.panel||window.openPanel;
    fn(`<h3>ACTION SYSTEM <button class="close" onclick="closePanel()">×</button></h3>
      <div class="p13-row"><b>Wanted</b><span>${stars()}</span></div>
      <div class="p13-row"><b>Police State</b><span>${state().police?.state||"clear"}</span></div>
      <div class="p13-row"><b>Combat Shots</b><span>${state().combat?.shots||0}</span></div>
      <div class="p13-row"><b>Vehicle</b><span>${player()?.inVehicle?"DRIVING":"ON FOOT"}</span></div>
      <p>Prototype actions are contextual. Use the action controls when a vehicle is nearby.</p>`);
  }

  window.phase14={
    shootVehicle,combatFire,vehicleStatus,addWanted,reportIncident,openCombatPanel,
    stars,damageVehicle
  };

  window.addEventListener("keydown",e=>{
    if(e.repeat)return;
    if(e.key.toLowerCase()==="v") shootVehicle();
    if(e.key.toLowerCase()==="f") combatFire();
  });

  const oldTick=window.phase13Tick;
  window.phase13Tick=function(dt){
    if(typeof oldTick==="function")oldTick(dt);
    policeTick(dt);
    witnessAwareness(dt);
    render();
  };

  window.addEventListener("load",()=>{
    setTimeout(()=>{
      const q=document.querySelector(".quick-menu");
      if(q && !document.getElementById("combatPanelButton")){
        const b=document.createElement("button");
        b.id="combatPanelButton";b.textContent="ACTION";
        b.onclick=openCombatPanel;q.appendChild(b);
      }
    },700);
  });
})();
