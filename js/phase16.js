/*
 * 404: NO WAY OUT — PHASE 16
 * Mission + Cinematic Production Pipeline
 *
 * Browser prototype layer. Preserves existing mission systems and exposes
 * a modular campaign runtime for briefings, objectives, dialogue, scoring,
 * consequences, replay state and cinematic hooks.
 */
(function(){
  "use strict";

  const P16={active:null,startedAt:0,objectiveIndex:0,shotsFired:0,hits:0,damage:0,dialogueIndex:0};
  const WEIGHTS={critical:50,optional:20,time:10,survival:10,precision:10};

  const MISSION_REGISTRY=[
    {id:"M01",title:"First Night",protagonist:"Darius Cole",type:"introduction",location:"Veyron International Airport",supporting:["Cab Driver","Unknown Caller"],required:[],objectives:[
      {id:"o1",text:"Leave the airport",critical:true},{id:"o2",text:"Take a cab to North Hills",critical:true},
      {id:"o3",text:"Reach the old family house",critical:true},{id:"o4",text:"Inspect the house",critical:true}
    ],optional:[{id:"op1",text:"Speak to the cab driver",points:5},{id:"op2",text:"Look around the airport terminal",points:5}],
      reward:2500,flags:["m01_complete","darius_returns_home"]},
    {id:"M02",title:"Old Walls",protagonist:"Darius Cole",type:"investigation",location:"Cole Family House",supporting:["Darius","Local Contact"],required:["M01"],objectives:[
      {id:"o1",text:"Search the family house",critical:true},{id:"o2",text:"Find the hidden record",critical:true},{id:"o3",text:"Leave before attention builds",critical:true}
    ],optional:[{id:"op1",text:"Inspect the upstairs office",points:10}],reward:3500,flags:["m02_complete","evidence_record_found"]},
    {id:"M03",title:"Bad Timing",protagonist:"Malik",type:"character",location:"East Veyron",supporting:["Malik","Street Mechanic"],required:["M01"],objectives:[
      {id:"o1",text:"Find Malik",critical:true},{id:"o2",text:"Recover the vehicle",critical:true},{id:"o3",text:"Get out of East Veyron",critical:true}
    ],optional:[{id:"op1",text:"Recover the mechanic's missing toolbox",points:10}],reward:3000,flags:["m03_complete","malik_introduced"]},
    {id:"M04",title:"Quiet Contact",protagonist:"Amara",type:"stealth",location:"Veyron Central",supporting:["Amara","Corporate Informant"],required:["M02"],objectives:[
      {id:"o1",text:"Meet the informant",critical:true},{id:"o2",text:"Avoid drawing attention",critical:true},{id:"o3",text:"Secure the data",critical:true}
    ],optional:[{id:"op1",text:"Leave without triggering an alert",points:10}],reward:4500,flags:["m04_complete","amara_introduced"]},
    {id:"M05",title:"Three Ways In",protagonist:"Darius Cole + Malik + Amara",type:"setup",location:"Iron District",supporting:["Darius Cole","Malik","Amara"],required:["M02","M03","M04"],objectives:[
      {id:"o1",text:"Meet at the safehouse",critical:true},{id:"o2",text:"Choose an approach",critical:true},{id:"o3",text:"Prepare the crew",critical:true}
    ],optional:[{id:"op1",text:"Complete every preparation task",points:10}],reward:6000,flags:["m05_complete","crew_formed"]}
  ];

  function G(){return window.gameState||{};}
  function save(){if(typeof window.saveAll==="function")window.saveAll();}
  function note(t){if(typeof window.notice==="function")window.notice(t);}
  function fnPanel(){return window.panel||window.openPanel;}
  function registry(){
    const g=G(); g.p16=g.p16||{};
    if(!Array.isArray(g.p16.missions))g.p16.missions=[];
    return g.p16.missions;
  }
  function getMission(id){
    return (window.MISSION_REGISTRY_P16||MISSION_REGISTRY).find(m=>m.id===id);
  }
  function stateFor(id){
    const r=registry(); let s=r.find(x=>x.id===id);
    if(!s){s={id,status:"locked",score:0,attempts:0,optional:0,completed:false};r.push(s);}
    return s;
  }
  function prereqs(m){
    return (m.required||[]).every(id=>stateFor(id).completed || (G().storyFlags||{})[`${id.toLowerCase()}_complete`] || (G().storyFlags||{})[id]);
  }

  function cinematic(type,data={}){
    const g=G();g.cinematics=g.cinematics||[];
    const scene={id:`${type}-${Date.now()}`,type,data,time:Date.now()};
    g.cinematics.push(scene);
    g.lastCinematic=scene;
    // If a future cinematic player exists, hand it the same contract.
    if(typeof window.playCinematic==="function")window.playCinematic(scene);
    return scene;
  }

  function start(id){
    const m=getMission(id); if(!m){note("Mission not found.");return false;}
    if(!prereqs(m)){note("Mission locked.");return false;}
    const s=stateFor(id);
    s.attempts=(s.attempts||0)+1;s.status="active";s.completed=false;s.score=0;
    P16.active=id;P16.startedAt=Date.now();P16.objectiveIndex=0;P16.dialogueIndex=0;P16.shotsFired=0;P16.hits=0;P16.damage=0;
    G().activeMission=id;
    cinematic("mission_intro",{missionId:id,title:m.title,protagonist:m.protagonist,location:m.location});
    save();render();
    note(`${m.title} · MISSION START`);
    return true;
  }

  function current(){
    return P16.active?getMission(P16.active):null;
  }

  function completeObjective(id,optional=false){
    const m=current(); if(!m)return;
    const list=optional?m.optional||[]:m.objectives||[];
    const o=list.find(x=>x.id===id); if(!o)return;
    const s=stateFor(m.id);s.objectives=s.objectives||{};
    s.objectives[id]=true;
    if(optional)s.optional=(s.optional||0)+1;
    else P16.objectiveIndex=Math.min((m.objectives||[]).length,P16.objectiveIndex+1);
    note(`OBJECTIVE COMPLETE · ${o.text}`);
    if((m.objectives||[]).filter(x=>x.critical).every(x=>s.objectives[x.id])) render();
    save();render();
  }

  function dialogue(character,line,voice=true){
    const g=G();g.dialogueLog=g.dialogueLog||[];
    const d={character,line,voice,time:Date.now()};
    g.dialogueLog.push(d);
    if(voice){
      if(typeof window.phase11Speak==="function")window.phase11Speak(line,character);
      else if("speechSynthesis"in window){
        try{const u=new SpeechSynthesisUtterance(line);u.rate=0.95;window.speechSynthesis.speak(u);}catch(_){}
      }
    }
    return d;
  }

  function recordShot(hit=false){
    P16.shotsFired++;
    if(hit)P16.hits++;
  }
  function recordDamage(amount){P16.damage+=Math.max(0,Number(amount)||0);}

  function score(m){
    const s=stateFor(m.id), objs=m.objectives||[], opts=m.optional||[];
    const critical=objs.length?objs.filter(o=>s.objectives?.[o.id]).filter(o=>o.critical).length/Math.max(1,objs.filter(o=>o.critical).length):1;
    const optional=opts.length?Math.min(1,(s.optional||0)/opts.length):1;
    const elapsed=Math.max(1,(Date.now()-P16.startedAt)/1000);
    const target=Number(m.targetTime||600);
    const time=Math.max(0,Math.min(1,1-(elapsed-target)/target));
    const survival=Math.max(0,Math.min(1,1-P16.damage/100));
    const precision=P16.shotsFired?Math.max(0,Math.min(1,P16.hits/P16.shotsFired)):1;
    return Math.round(critical*WEIGHTS.critical+optional*WEIGHTS.optional+time*WEIGHTS.time+survival*WEIGHTS.survival+precision*WEIGHTS.precision);
  }

  function finish(success=true){
    const m=current(); if(!m)return;
    const s=stateFor(m.id);
    const sc=success?score(m):0;
    s.status=success?"passed":"failed";s.completed=success;s.score=sc;
    s.finishedAt=Date.now();
    if(success){
      G().storyFlags=G().storyFlags||{};
      (m.flags||[]).forEach(f=>G().storyFlags[f]=true);
      G().cash=(Number(G().cash)||0)+(Number(m.reward)||0);
    }
    G().activeMission=null;
    cinematic(success?"mission_complete":"mission_failed",{missionId:m.id,score:sc});
    note(success?`MISSION PASSED · ${m.title} · ${sc}/100`:`MISSION FAILED · ${m.title}`);
    P16.active=null;save();render();
  }

  function fail(reason="Failure condition"){
    const g=G();g.lastMissionFailure={reason,time:Date.now()};
    finish(false);
  }

  function replay(id){
    const s=stateFor(id);s.replays=(s.replays||0)+1;
    return start(id);
  }

  function available(){
    return (window.MISSION_REGISTRY_P16||MISSION_REGISTRY).filter(m=>prereqs(m));
  }

  function render(){
    const m=current(),s=m?stateFor(m.id):null;
    const el=document.getElementById("p16MissionStatus");
    if(el)el.textContent=m?`${m.id} · ${m.title} · ${s?.status||"active"}`:"NO ACTIVE MISSION";
    const scoreEl=document.getElementById("p16Score");
    if(scoreEl)scoreEl.textContent=m?`${score(m)}/100`:"—";
  }

  function missionPanel(){
    const list=window.MISSION_REGISTRY_P16||MISSION_REGISTRY;
    const html=list.map(m=>{
      const s=stateFor(m.id),ok=prereqs(m);
      return `<div class="p16-mission"><b>${m.id} · ${m.title}</b><span>${m.protagonist} · ${m.type}</span><small>${m.location}</small><button ${ok?"":"disabled"} onclick="phase16.start('${m.id}')">${s.completed?"REPLAY":"START"}</button></div>`;
    }).join("");
    const fn=fnPanel();
    if(typeof fn==="function")fn(`<h3>STORY MISSIONS <button class="close" onclick="closePanel()">×</button></h3>${html}`);
  }

  window.MISSION_REGISTRY_P16=MISSION_REGISTRY;
  window.phase16={start,finish,fail,completeObjective,dialogue,recordShot,recordDamage,replay,missionPanel,cinematic,score,getMission,available,weights:WEIGHTS};
  window.addEventListener("load",()=>{
    registry();
    setTimeout(()=>{
      const q=document.querySelector(".quick-menu");
      if(q&&!document.getElementById("missionPipelineButton")){
        const b=document.createElement("button");b.id="missionPipelineButton";b.textContent="MISSIONS";b.onclick=missionPanel;q.appendChild(b);
      }
      render();
    },950);
  });
})();
