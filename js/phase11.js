/* 404: NO WAY OUT — PHASE 11
   Mobile gameplay presentation layer:
   - floating virtual analog movement stick
   - right-side camera/look pad (2D prototype presentation bridge)
   - contextual action controls
   - cinematic protagonist switching
   - autonomous NPC remarks + audible replies using browser SpeechSynthesis
   Production 3D camera, animation and spatial audio are future Unreal systems.
*/
(function(){
  'use strict';
  let analog={active:false,id:null,baseX:0,baseY:0,x:0,y:0};
  let look={active:false,id:null,baseX:0,baseY:0,x:0,y:0};
  let lastNpcEvent=0;
  let currentNpcId=null;
  const audioState={enabled:true,rate:1,pitch:1};

  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function el(id){return document.getElementById(id);}

  function installHUD(){
    const world=el('world'); if(!world||el('phase11Hud'))return;
    const hud=document.createElement('div');
    hud.id='phase11Hud';
    hud.innerHTML=`
      <div class="p11-objective-chip hidden" id="p11StateChip"></div>
      <div class="p11-joystick" id="moveStick" aria-label="Movement analog">
        <div class="p11-stick-ring"><div class="p11-stick-knob"></div></div>
      </div>
      <div class="p11-lookpad" id="lookPad" aria-label="Camera look"></div>
      <div class="p11-actions" id="p11Actions">
        <button id="p11Action" class="p11-btn p11-context">ACTION</button>
        <button id="p11Fire" class="p11-btn p11-round">●</button>
        <button id="p11Jump" class="p11-btn p11-round">JUMP</button>
      </div>
      <div class="p11-voice" id="voiceIndicator"><span class="p11-dot"></span><span id="voiceLabel">VOICE ON</span></div>
      <div class="p11-switch" id="p11Switch"><span>⇄</span><small>SWITCH</small></div>`;
    world.appendChild(hud);

    const oldControls=world.querySelector('.controls'); if(oldControls)oldControls.classList.add('p11-legacy-hidden');
    bindJoystick(el('moveStick'),false);
    bindJoystick(el('lookPad'),true);
    el('p11Action').addEventListener('pointerdown',e=>{e.preventDefault(); if(typeof contextAction==='function')contextAction();});
    el('p11Fire').addEventListener('pointerdown',e=>{e.preventDefault(); if(typeof fireAction==='function')fireAction();});
    el('p11Jump').addEventListener('pointerdown',e=>{e.preventDefault(); window.phase11Jump?.();});
    el('p11Switch').addEventListener('pointerdown',e=>{e.preventDefault();window.phase11OpenSwitch?.();});
    el('voiceIndicator').addEventListener('pointerdown',e=>{e.preventDefault();window.phase11ToggleVoice?.();});
  }

  function bindJoystick(node,isLook){
    if(!node)return;
    const knob=node.querySelector('.p11-stick-knob');
    const end=()=>{const o=isLook?look:analog;o.active=false;o.id=null;if(!isLook){['w','a','s','d'].forEach(k=>keys[k]=false);}};
    node.addEventListener('pointerdown',e=>{
      e.preventDefault(); node.setPointerCapture?.(e.pointerId);
      const r=node.getBoundingClientRect(),o=isLook?look:analog;
      o.active=true;o.id=e.pointerId;o.baseX=r.left+r.width/2;o.baseY=r.top+r.height/2;o.x=e.clientX;o.y=e.clientY;
      updateStick(o,knob,isLook);
    });
    node.addEventListener('pointermove',e=>{const o=isLook?look:analog;if(!o.active||o.id!==e.pointerId)return;e.preventDefault();o.x=e.clientX;o.y=e.clientY;updateStick(o,knob,isLook);});
    ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>node.addEventListener(ev,end));
  }
  function updateStick(o,knob,isLook){
    const max=52,dx=o.x-o.baseX,dy=o.y-o.baseY,len=Math.hypot(dx,dy),scale=len>max?max/len:1;
    const x=dx*scale,y=dy*scale;if(knob){knob.style.transform=`translate(${x}px,${y}px)`;}
    if(isLook){window.phase11LookX=x/max;window.phase11LookY=y/max;return;}
    const nx=x/max,ny=y/max,dead=.18;
    keys.d=Math.abs(nx)>dead&&nx>0;keys.a=Math.abs(nx)>dead&&nx<0;keys.s=Math.abs(ny)>dead&&ny>0;keys.w=Math.abs(ny)>dead&&ny<0;
  }

  function setActionLabel(){
    const b=el('p11Action');if(!b)return;
    const p=currentPlayer?.();
    if(!p)return;
    if(p.inVehicle){b.textContent='EXIT';return;}
    const m=typeof currentMission==='function'?currentMission():null,step=typeof currentStep==='function'?currentStep():null;
    if(m&&step){b.textContent=step.kind==='choice'?'DECIDE':'ACTION';return;}
    if(window.near){b.textContent='TALK';return;}
    if(typeof nearestVehicle==='function'&&nearestVehicle(90)){b.textContent='ENTER';return;}
    b.textContent='ACTION';
  }

  function stateChip(){
    const chip=el('p11StateChip');if(!chip||!gameState)return;
    const p=currentPlayer();
    let txt=p?.inVehicle?'DRIVING':(gameState.missionRuntime?.active?'MISSION ACTIVE':'FREE ROAM');
    if(gameState.wanted>0)txt+=` · ${'★'.repeat(Math.min(5,gameState.wanted))}`;
    chip.textContent=txt;chip.classList.remove('hidden');
  }

  function speak(text,who,kind='npc'){
    if(!audioState.enabled||!('speechSynthesis' in window))return;
    try{
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);
      const id=(who||'').toLowerCase();
      u.rate=kind==='player'?1.02:(id.includes('malik')?1.08:(id.includes('amara')?0.96:0.98));
      u.pitch=kind==='player'?0.98:(id.includes('malik')?1.08:(id.includes('amara')?0.90:0.98));
      u.volume=.9;
      speechSynthesis.speak(u);
      el('voiceLabel')?.replaceChildren(document.createTextNode('VOICE ON'));
    }catch(_e){}
  }

  function playerReplyFor(n,event){
    const p=currentPlayer(); const name=n.name||'there';
    const replies={
      bump:[`Easy. I didn't mean to hit you.`, `Relax. It was an accident.`, `My bad. You alright?`],
      greeting:[`Hey.`, `What's going on?`, `You good?`],
      tire:[`Keep the noise down and nobody gets hurt.`, `Walk away. This isn't your problem.`, `I said back off.`],
      help:[`You're welcome. Stay safe.`, `No problem. Take care.`, `You looked like you needed a hand.`],
      suspicious:[`I'm just passing through.`, `You got a problem?`, `I'm not looking for trouble.`],
      hostile:[`Watch your tone.`, `Don't make this bigger than it is.`, `Keep moving.`]
    };
    const pool=replies[event]||replies.greeting;
    return pool[(Date.now()+name.length+(p?.name||'').length)%pool.length];
  }

  function npcRemarkFor(n,event){
    const p=currentPlayer();const area=p?.location||'Veyron';
    const personality=String(n.personality||'').toLowerCase();
    const lines={
      bump:[`Watch where you're going!`,`Hey! Eyes up!`,`Seriously? Watch it.`],
      greeting:[`You look like you've got somewhere to be.`,`Hey, I know you.`, `Evening.`],
      suspicious:[`I've seen you around. What's your business?`,`You always move like you're being followed.`,`Something about you feels off.`],
      tire:[`Hey! What did you do to my car?!`,`You just popped my tire!`,`Are you crazy?!`],
      help:[`Appreciate that. People don't usually stop anymore.`,`Thanks. I owe you one.`,`That was decent of you.`],
      hostile:[`Don't start something you can't finish.`,`Back off.`,`You picked the wrong person.`]
    };
    if(personality.includes('sarcastic'))lines.greeting.push(`Nice of you to finally notice the rest of the city.`);
    if(personality.includes('funny'))lines.greeting.push(`Look at you, making an entrance.`);
    const pool=lines[event]||lines.greeting;
    return pool[(Math.floor(worldClock)+String(n.id||'').length)%pool.length];
  }

  function relationshipEvent(n,event){
    if(typeof npcPhase4Remember==='function')npcPhase4Remember(n,event,'phase11_contextual_interaction');
    if(typeof npcPhase4Relationship==='function')npcPhase4Relationship(n,event==='help'?2:event==='bump'?-1:0);
    n.lastReaction=event;n.lastReactionAt=worldClock;
  }

  function spokenCue(name,kind){
    const d=el('dialogue');if(!d)return;
    d.innerHTML=`<strong>${esc(name)}</strong><p class="p11-speaking">${kind==='player'?'DARIUS RESPONDS':'SPEAKING'} · AUDIO</p>`;
    d.classList.remove('hidden');clearTimeout(d._p11t);d._p11t=setTimeout(()=>d.classList.add('hidden'),1700);
  }

  function triggerNPCConversation(n,event='greeting'){
    if(!n||!gameState)return;
    const now=performance.now();if(now-lastNpcEvent<1800&&currentNpcId===n.id)return;
    lastNpcEvent=now;currentNpcId=n.id;
    relationshipEvent(n,event);
    const line=npcRemarkFor(n,event);
    spokenCue(n.name,'npc');
    speak(line,n.name,'npc');
    const replyDelay=Math.max(850,Math.min(1700,line.length*22));
    window.setTimeout(()=>{
      if(currentNpcId!==n.id)return;
      const reply=playerReplyFor(n,event);
      spokenCue(currentPlayer().name,'player');
      speak(reply,currentPlayer().name,'player');
      n.memory=n.memory||[];n.memory.push({event:'conversation_response',detail:reply,time:worldClock,protagonist:gameState.active});
      if(n.memory.length>12)n.memory.shift();saveAll?.();
    },replyDelay);
  }

  function detectContextualNPC(){
    if(!gameState||!currentPlayer)return;
    const p=currentPlayer();if(!p.position||p.inVehicle)return;
    let nearest=null,dist=Infinity;
    Object.values(gameState.npcs||{}).forEach(n=>{if(!n.position)return;const d=Math.hypot(n.position.x-p.position.x,n.position.y-p.position.y);if(d<dist){dist=d;nearest=n;}});
    if(!nearest||dist>38){currentNpcId=null;return;}
    const old=window.__p11NpcProximity;
    if(old!==nearest.id){window.__p11NpcProximity=nearest.id;triggerNPCConversation(nearest,'greeting');}
  }

  function checkBump(){
    if(!gameState||!currentPlayer)return;
    const p=currentPlayer();if(!p.position||p.inVehicle)return;
    Object.values(gameState.npcs||{}).forEach(n=>{
      if(!n.position)return;const d=Math.hypot(n.position.x-p.position.x,n.position.y-p.position.y);
      if(d<18){const now=performance.now();if(now-(n._lastBump||0)>3500){n._lastBump=now;triggerNPCConversation(n,'bump');}}
    });
  }

  function jump(){
    const p=currentPlayer?.();if(!p)return;
    if(p.inVehicle){notice?.('Jump is unavailable while driving.');return;}
    // Prototype: short stamina burst and a visual/audio feedback. 3D animation comes later.
    if((p.stamina||0)<8)return notice?.('Too tired to jump.');
    p.stamina=Math.max(0,p.stamina-8);notice?.('JUMP');saveAll?.();
  }

  function cinematicSwitch(id){
    if(!gameState?.characters?.[id]||id===gameState.active)return;
    const from=currentPlayer(),to=gameState.characters[id];
    const overlay=document.createElement('div');overlay.className='p11-switch-cinematic';
    overlay.innerHTML=`<div class="p11-switch-lines"></div><div class="p11-switch-card"><small>VEYRON CITY · CHARACTER TRANSFER</small><div class="p11-switch-from">${esc(from.name)}</div><div class="p11-arrow">↓</div><div class="p11-switch-to">${esc(to.name)}</div><p>Camera transferring to ${esc(to.location||getDistrict(to.position.x,to.position.y))}</p></div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(()=>overlay.classList.add('active'));
    setTimeout(()=>{
      gameState.active=id;saveAll?.();updateHUD?.();
      document.body.classList.add('p11-switch-flash');
      setTimeout(()=>document.body.classList.remove('p11-switch-flash'),240);
    },650);
    setTimeout(()=>{overlay.classList.remove('active');setTimeout(()=>overlay.remove(),500);notice?.(`${to.name} · CONTROL TRANSFERRED`);},1450);
  }

  function openCinematicSwitch(){
    const list=Object.values(gameState?.characters||{});
    const active=gameState?.active;
    panel?.(`<div class="p11-switch-panel"><small>CHARACTER NETWORK</small><h2>WHO'S MOVING?</h2><p>The camera leaves ${esc(currentPlayer().name)} and transfers to the selected protagonist's current location.</p>${list.map(c=>`<button class="p11-character-choice ${c.id===active?'active':''}" ${c.id===active?'disabled':''} onclick="phase11CinematicSwitch('${c.id}')"><span>${esc(c.name)}</span><small>${esc(c.role)} · ${esc(c.location||'Veyron')}</small></button>`).join('')}</div>`);
  }

  window.phase11CinematicSwitch=cinematicSwitch;
  window.openSwitch=openCinematicSwitch;
  window.phase11OpenSwitch=openCinematicSwitch;
  window.phase11Jump=jump;
  window.phase11Speak=speak;
  window.phase11ToggleVoice=function(){audioState.enabled=!audioState.enabled;if(!audioState.enabled)speechSynthesis?.cancel();const l=el('voiceLabel');if(l)l.textContent=audioState.enabled?'VOICE ON':'VOICE OFF';};

  const oldSwitch=window.switchCharacter;
  window.switchCharacter=function(id){cinematicSwitch(id);};

  const oldTalk=window.talkTo;
  window.talkTo=function(id){
    const n=gameState?.npcs?.[id];if(!n)return;
    triggerNPCConversation(n,'greeting');
  };

  const oldFire=window.fireAction;
  window.fireAction=function(){
    const before=gameState?.vehicles?.map(v=>v.tires?.map(t=>t.state)).flat()||[];
    oldFire?.();
    // The nearest driver's reaction is now audible as well as visual.
    const v=typeof nearestVehicle==='function'?nearestVehicle(120):null;
    if(v?.driverState==='panic'){
      const nearby=Object.values(gameState.npcs||{}).find(n=>n.position&&v.x!=null&&Math.hypot(n.position.x-v.x,n.position.y-v.y)<180);
      if(nearby)triggerNPCConversation(nearby,'tire');
      else { spokenCue('Driver','npc'); speak('What the hell was that?', 'Driver', 'npc'); }
    }
  };

  function tick(){
    installHUD();setActionLabel();stateChip();detectContextualNPC();checkBump();
    const voice=el('voiceIndicator');if(voice)voice.classList.toggle('muted',!audioState.enabled);
  }
  window.phase11Tick=tick;
  window.addEventListener('load',()=>{installHUD();setTimeout(()=>{tick();},250);});
  const oldPlayableTick=window.playableTick;
  window.playableTick=function(dt){oldPlayableTick?.(dt);tick();};
})();
