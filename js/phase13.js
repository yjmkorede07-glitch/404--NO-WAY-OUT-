/*
 * 404: NO WAY OUT — PHASE 13
 * Living Veyron City
 *
 * Browser-prototype layer:
 * - NPC daily routines, destinations, moods and social encounters
 * - spontaneous audible NPC reactions
 * - traffic incidents and driver reactions
 * - witness/report bridge to the existing police system
 * - star-based wanted presentation
 * - contextual world events
 *
 * Production 3D NPC animation, navigation, physics and spatial audio belong
 * in the future Unreal Engine implementation.
 */
(function(){
  'use strict';

  const P13 = {
    enabled: true,
    lastWorldEvent: 0,
    worldEventCooldown: 28,
    lastWantedSave: 0,
    eventSerial: 0
  };

  const ROUTES = {
    home: [
      {x:-260,y:-280},{x:-120,y:-80},{x:-20,y:135},{x:180,y:120}
    ],
    work: [
      {x:180,y:120},{x:410,y:150},{x:350,y:110},{x:870,y:500}
    ],
    social: [
      {x:-115,y:70},{x:-500,y:100},{x:120,y:520},{x:80,y:500}
    ],
    leisure: [
      {x:80,y:500},{x:120,y:520},{x:-180,y:500},{x:1260,y:-20}
    ]
  };

  const ARCHETYPES = {
    worker:   {work:"commercial", social:"market", home:"residential"},
    student:  {work:"commercial", social:"market", home:"residential"},
    driver:   {work:"industrial", social:"market", home:"residential"},
    vendor:   {work:"market", social:"market", home:"residential"},
    security: {work:"commercial", social:"social", home:"residential"},
    tourist:  {work:"tourist", social:"beach", home:"hotel"},
    criminal: {work:"industrial", social:"social", home:"residential"}
  };

  function esc(s){
    return String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }

  function seed(n, salt=0){
    return ((String(n.id||n.name||"npc").split("").reduce((a,c)=>a+c.charCodeAt(0),0)+salt)%997)/997;
  }

  function ensure(n){
    if(!n) return;
    n.personality = n.personality || (
      n.id?.includes("malik") ? "funny loyal reckless" :
      n.id?.includes("amara") ? "sarcastic controlled observant" :
      n.id?.includes("police") ? "serious alert" :
      "ordinary cautious"
    );
    n.archetype = n.archetype || (
      n.occupation?.toLowerCase().includes("security") ? "security" :
      n.occupation?.toLowerCase().includes("driver") ? "driver" :
      n.occupation?.toLowerCase().includes("vendor") ? "vendor" :
      n.occupation?.toLowerCase().includes("student") ? "student" :
      "worker"
    );
    n.homeAnchor = n.homeAnchor || {x:-260 + Math.round(seed(n,11)*260), y:-280 + Math.round(seed(n,17)*260)};
    n.workAnchor = n.workAnchor || {x:180 + Math.round(seed(n,23)*520), y:40 + Math.round(seed(n,31)*300)};
    n.socialAnchor = n.socialAnchor || {x:-160 + Math.round(seed(n,41)*660), y:40 + Math.round(seed(n,47)*520)};
    n.activity = n.activity || "walking";
    n.targetActivity = n.targetActivity || "home";
    n.schedulePhase = n.schedulePhase || "";
    n.routeProgress = Number(n.routeProgress)||0;
    n.lastRoutineChange = Number(n.lastRoutineChange)||0;
    n.lastAmbientLine = Number(n.lastAmbientLine)||0;
    n.ambientCooldown = Number(n.ambientCooldown)||0;
    n.socialGroup = n.socialGroup || null;
    n.recentEvents = n.recentEvents || [];
    n.relationship = n.relationship || "stranger";
    n.trust = Number(n.trust ?? 20);
    n.energy = Number(n.energy ?? 70);
  }

  function phase(){
    const h=(worldClock/60)%24;
    if(h<6) return "late_night";
    if(h<9) return "morning";
    if(h<16) return "workday";
    if(h<19) return "afternoon";
    if(h<23) return "evening";
    return "night";
  }

  function chooseRoutine(n){
    ensure(n);
    const ph=phase();
    if(n.id==="malik_friend"){
      if(ph==="workday"||ph==="afternoon") return "work";
      if(ph==="evening") return "social";
      return "home";
    }
    if(n.id==="amara_friend"){
      if(ph==="morning"||ph==="workday") return "work";
      if(ph==="evening") return "social";
      return "home";
    }
    if(ph==="morning") return "commute";
    if(ph==="workday") return n.archetype==="tourist" ? "leisure" : "work";
    if(ph==="afternoon") return Math.random()<0.45 ? "shop" : "work";
    if(ph==="evening") return Math.random()<0.62 ? "social" : "home";
    if(ph==="night") return Math.random()<0.22 ? "social" : "home";
    return "home";
  }

  function targetFor(n,activity){
    ensure(n);
    if(activity==="work"||activity==="commute") return n.workAnchor;
    if(activity==="social"||activity==="shop") return n.socialAnchor;
    if(activity==="leisure") return {x:80+seed(n,71)*280,y:440+seed(n,79)*130};
    return n.homeAnchor;
  }

  function moveToward(n,target,dt){
    if(!target) return;
    const dx=target.x-n.position.x,dy=target.y-n.position.y;
    const d=Math.hypot(dx,dy);
    if(d<7){ n.activity = n.targetActivity==="work"?"working":
                     n.targetActivity==="social"?"socializing":
                     n.targetActivity==="shop"?"shopping":
                     n.targetActivity==="leisure"?"relaxing":"at_home"; return; }
    const speed = n.mood==="afraid" ? 48 : n.mood==="excited" ? 42 : 30;
    n.position.x += dx/d*speed*dt;
    n.position.y += dy/d*speed*dt;
    n.activity = "walking";
  }

  function routineTick(dt){
    const npcs=Object.values(gameState?.npcs||{});
    npcs.forEach(n=>{
      ensure(n);
      const ph=phase();
      if(n.schedulePhase!==ph || worldClock-n.lastRoutineChange>20){
        n.schedulePhase=ph;
        n.targetActivity=chooseRoutine(n);
        n.lastRoutineChange=worldClock;
      }
      const target=targetFor(n,n.targetActivity);
      if(!n.position) n.position={x:target.x,y:target.y};
      moveToward(n,target,dt);

      if(n.activity==="walking" && n.energy>1) n.energy=Math.max(0,n.energy-dt*.25);
      else if(n.activity!=="walking") n.energy=Math.min(100,n.energy+dt*.18);

      if(n.fear>0) n.fear=Math.max(0,n.fear-dt*.12);
      if(n.suspicion>0) n.suspicion=Math.max(0,n.suspicion-dt*.05);

      n.ambientCooldown=Math.max(0,n.ambientCooldown-dt);
    });
  }

  function overrideNpcPosition(){
    const old = window.__p13OriginalNpcPosition;
    if(!old && typeof window.npcPosition==="function"){
      window.__p13OriginalNpcPosition=window.npcPosition;
    }
    window.npcPosition=function(n){
      ensure(n);
      if(!n.position){
        const t=targetFor(n,n.targetActivity);
        n.position={x:t.x,y:t.y};
      }
      return n.position;
    };
  }

  function voice(text,who){
    if(typeof window.phase11Speak==="function"){
      window.phase11Speak(text,who);
      return;
    }
    if(!("speechSynthesis" in window)) return;
    try{
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);
      u.rate=.96; u.pitch=String(who||"").toLowerCase().includes("malik")?1.08:.98;
      speechSynthesis.speak(u);
    }catch(_e){}
  }

  function ambientLine(n,event){
    const p=currentPlayer?.();
    const name=p?.name||"you";
    const personality=String(n.personality||"").toLowerCase();
    const lines={
      bump:["Watch it!","Easy!","Hey—watch where you're going."],
      traffic:["What is this traffic?!","Move! Come on!","Everybody forgot how to drive today."],
      police:["Police are coming. Get out of here.","I saw what happened.","Keep your head down."],
      weather:["That rain came out of nowhere.","Great. Just what we needed.","Veyron weather is impossible."],
      greeting:[`You again, ${name}.`,`Evening.`,`Hey. You look busy.`]
    };
    if(event==="greeting" && personality.includes("funny")) lines.greeting.push("Nice entrance. Very subtle.");
    if(event==="greeting" && personality.includes("sarcastic")) lines.greeting.push("Lovely timing. Truly.");
    if(event==="traffic" && personality.includes("angry")) lines.traffic.push("Learn to drive!");
    const pool=lines[event]||lines.greeting;
    return pool[Math.floor((worldClock+(n.id||"").length)%pool.length)];
  }

  function speakAmbient(n,event){
    ensure(n);
    const now=performance.now();
    if(now-(n._p13LastAmbient||0)<4500) return;
    n._p13LastAmbient=now;
    const line=ambientLine(n,event);
    if(typeof window.showDialogue==="function") window.showDialogue(n.name,line);
    voice(line,n.name);
    n.recentEvents.push({event,time:worldClock,line});
    if(n.recentEvents.length>8)n.recentEvents.shift();
  }

  function detectProximityEvents(){
    const p=currentPlayer?.();
    if(!p?.position || p.inVehicle) return;
    Object.values(gameState?.npcs||{}).forEach(n=>{
      ensure(n);
      const d=Math.hypot(n.position.x-p.position.x,n.position.y-p.position.y);
      if(d<20 && !n._p13Bump){
        n._p13Bump=true;
        if(typeof window.triggerNPCConversation==="function") window.triggerNPCConversation(n,"bump");
        else speakAmbient(n,"bump");
      }
      if(d>34)n._p13Bump=false;
    });
  }

  function trafficIncident(dt){
    if(!Array.isArray(window.traffic)) return;
    for(const v of window.traffic){
      v.p13NearPlayer=false;
      const p=currentPlayer?.();
      if(!p?.position) continue;
      const d=Math.hypot((v.x||0)-p.position.x,(v.y||0)-p.position.y);
      if(d<120 && Math.random()<dt*.018){
        v.nearHazard=true;
        v.p13NearPlayer=true;
        const nearest=Object.values(gameState?.npcs||{}).find(n=>n.position&&Math.hypot(n.position.x-v.x,n.position.y-v.y)<110);
        if(nearest) speakAmbient(nearest,"traffic");
      } else if(Math.random()<dt*.08){
        v.nearHazard=false;
      }
    }
  }

  function worldEventTick(){
    if(!gameState || performance.now()-P13.lastWorldEvent < P13.worldEventCooldown*1000) return;
    if(Math.random()>0.34) return;
    P13.lastWorldEvent=performance.now();
    P13.eventSerial++;
    const events=[
      {name:"Street argument", text:"A heated argument has broken out nearby."},
      {name:"Traffic disruption", text:"Traffic is backing up ahead."},
      {name:"Medical response", text:"An emergency response is moving through the district."},
      {name:"Shop disturbance", text:"People are gathering outside a nearby business."},
      {name:"Suspicious activity", text:"A few people are watching something closely."}
    ];
    const e=events[P13.eventSerial%events.length];
    gameState.worldEvents=gameState.worldEvents||[];
    gameState.worldEvents.push({id:"WE-"+P13.eventSerial,name:e.name,text:e.text,time:worldClock,district:currentPlayer()?.location||"Veyron"});
    if(gameState.worldEvents.length>12)gameState.worldEvents.shift();
    notice?.(e.text);
    saveAll?.();
  }

  function wantedStars(){
    const w=Math.max(0,Math.min(5,Math.floor(Number(gameState?.wanted||0))));
    return "★".repeat(w)+"☆".repeat(5-w);
  }

  function wantedState(){
    const w=Math.floor(Number(gameState?.wanted||0));
    if(w<=0)return "CLEAR";
    if(w===1)return "SEARCHING";
    if(w===2)return "SEARCHING";
    if(w===3)return "PURSUIT";
    if(w===4)return "HEAVY RESPONSE";
    return "MANHUNT";
  }

  function renderWanted(){
    const el=document.getElementById("wanted");
    if(el) el.textContent=wantedStars();
    const chip=document.getElementById("p11StateChip");
    if(chip && gameState){
      const p=currentPlayer?.();
      const base=p?.inVehicle?"DRIVING":gameState.missionRuntime?.active?"MISSION ACTIVE":"FREE ROAM";
      chip.textContent=gameState.wanted>0 ? `${base} · ${wantedStars()} · ${wantedState()}` : base;
    }
  }

  function incidentBridge(){
    if(!gameState?.incidents?.length) return;
    const last=gameState.incidents[gameState.incidents.length-1];
    if(last && last.p13Handled) return;
    if(last){
      last.p13Handled=true;
      if(last.reported && Number(last.severity)>=2){
        gameState.story=gameState.story||{};
        gameState.story.policePressure=Math.min(100,(Number(gameState.story.policePressure)||0)+Number(last.severity)*2);
      }
      saveAll?.();
    }
  }

  function panelLivingWorld(){
    const npcs=Object.values(gameState?.npcs||{});
    const events=(gameState?.worldEvents||[]).slice(-5).reverse();
    const rows=npcs.map(n=>{
      ensure(n);
      return `<div class="p13-row"><b>${esc(n.name)}</b><span>${esc(n.activity)} · ${esc(n.mood||"calm")} · ${esc(n.targetActivity)}</span></div>`;
    }).join("");
    const ev=events.length ? events.map(e=>`<div class="p13-event"><b>${esc(e.name)}</b><small>${esc(e.text)} · ${esc(e.district||"Veyron")}</small></div>`).join("") : "<p>No recent city events.</p>";
    panel(`<h3>LIVING VEYRON <button class="close" onclick="closePanel()">×</button></h3>
      <div class="row"><span>World clock</span><b>${timeText()}</b></div>
      <div class="row"><span>Weather</span><b>${esc(worldWeather?.kind||"clear")}</b></div>
      <div class="row"><span>Wanted</span><b class="stars">${wantedStars()}</b></div>
      <h4>PEOPLE</h4>${rows}
      <h4>RECENT EVENTS</h4>${ev}`);
  }

  window.openLivingWorld=panelLivingWorld;
  window.phase13WantedStars=wantedStars;

  function tick(dt){
    if(!P13.enabled || !window.gameState) return;
    routineTick(dt);
    trafficIncident(dt);
    detectProximityEvents();
    worldEventTick();
    incidentBridge();
    renderWanted();
  }

  window.phase13Tick=tick;
  const oldPlayableTick=window.playableTick;
  window.playableTick=function(dt){
    if(typeof oldPlayableTick==="function") oldPlayableTick(dt);
    tick(dt);
  };

  window.addEventListener("load",()=>{
    overrideNpcPosition();
    setTimeout(()=>{
      if(typeof window.openLivingWorld==="function" && !document.getElementById("livingWorldButton")){
        const q=document.querySelector(".quick-menu");
        if(q){
          const b=document.createElement("button");
          b.id="livingWorldButton";
          b.textContent="CITY LIFE";
          b.onclick=window.openLivingWorld;
          q.appendChild(b);
        }
      }
      renderWanted();
    },450);
  });
})();
