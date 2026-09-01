/* 404: NO WAY OUT — PHASE 12
   3D vertical-slice presentation bridge for the browser prototype.
   Adds: branded loading sequence, first-boot cinematic intro, load/continue state,
   contextual boot narration and a clean hand-off into gameplay.
   Production 3D streaming/cinematics belong to Unreal Engine.
*/
(function(){
  'use strict';
  const KEY='404_no_way_out_phase12_boot_v1';
  const $=id=>document.getElementById(id);
  let progress=0, timer=null, firstBoot=false;

  function inject(){
    if($('phase12Boot')) return;
    const root=document.createElement('div'); root.id='phase12Boot';
    root.innerHTML=`
      <div class="p12-noise"></div>
      <div class="p12-grid"></div>
      <div class="p12-brand">
        <div class="p12-404">404</div>
        <div class="p12-title">NO WAY OUT</div>
        <div class="p12-sub">VEYRON CITY // STORY MODE</div>
      </div>
      <div class="p12-load">
        <div class="p12-load-top"><span id="p12LoadText">INITIALIZING VEYRON CITY</span><span id="p12Percent">0%</span></div>
        <div class="p12-bar"><i id="p12Bar"></i></div>
        <div class="p12-tip" id="p12Tip">Loading city systems…</div>
      </div>
      <button class="p12-skip hidden" id="p12Skip">SKIP INTRO</button>
      <div class="p12-intro hidden" id="p12Intro">
        <div class="p12-intro-card">
          <small>VEYRON CITY • PRESENT DAY</small>
          <h1 id="p12IntroHead">THE CITY NEVER STOPS.</h1>
          <p id="p12IntroBody">Money moves. People disappear. Businesses change hands. Most people never see what is underneath.</p>
          <div class="p12-company"><span>404</span><b>AN UNLISTED NETWORK</b><small>UNKNOWN OWNERSHIP • UNKNOWN PURPOSE</small></div>
          <p id="p12IntroVoice" class="p12-voice-line"></p>
          <button id="p12Continue">ENTER VEYRON CITY</button>
        </div>
      </div>`;
    document.body.appendChild(root);
    $('p12Continue').onclick=finishIntro;
    $('p12Skip').onclick=finishIntro;
  }

  function speak(text){
    if(!('speechSynthesis' in window)) return;
    try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.rate=.92;u.pitch=.86;u.volume=.72;speechSynthesis.speak(u);}catch(e){}
  }
  const stages=[
    ['INITIALIZING VEYRON CITY','Loading city systems…'],
    ['RESTORING WORLD STATE','Loading districts, traffic and weather…'],
    ['LOADING CHARACTERS','Restoring Darius, Malik and Amara…'],
    ['LOADING STORY','Preparing the 88-mission campaign…'],
    ['LOADING VENTURES','Checking properties, economy and relationships…'],
    ['FINALIZING','Synchronizing the city…']
  ];
  function load(){
    inject();
    firstBoot=localStorage.getItem(KEY)!=='1';
    progress=0;
    $('p12Skip').classList.add('hidden'); $('p12Intro').classList.add('hidden');
    timer=setInterval(()=>{
      progress=Math.min(100,progress+Math.floor(2+Math.random()*8));
      const idx=Math.min(stages.length-1,Math.floor(progress/18));
      $('p12LoadText').textContent=stages[idx][0]; $('p12Tip').textContent=stages[idx][1]; $('p12Percent').textContent=progress+'%'; $('p12Bar').style.width=progress+'%';
      if(progress>=100){clearInterval(timer);setTimeout(afterLoad,650);}
    },120);
  }
  function afterLoad(){
    if(firstBoot){
      $('p12Skip').classList.remove('hidden');
      $('p12Intro').classList.remove('hidden');
      speak('Welcome to Veyron City.');
    } else finishIntro();
  }
  function finishIntro(){
    localStorage.setItem(KEY,'1');
    try{speechSynthesis.cancel();}catch(e){}
    const r=$('phase12Boot'); if(!r)return;
    r.classList.add('p12-fadeout');
    setTimeout(()=>r.remove(),650);
  }
  window.phase12ResetFirstBoot=function(){localStorage.removeItem(KEY);notice?.('First-boot intro reset. Reload to preview it.');};
  window.addEventListener('load',()=>setTimeout(load,80));
})();
