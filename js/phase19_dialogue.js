/* 404: NO WAY OUT — PHASE 19 BATCH 01 CHARACTER/DIALOGUE LAYER */
(function(){
  'use strict';
  let chars=null, dialogue=null;
  const state=()=>window.gameState||null;
  function save(){window.saveAll?.()}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function speak(line,character){
    const g=state(); if(!g)return;
    g.p19=g.p19||{};g.p19.characterDialogue=g.p19.characterDialogue||[];
    g.p19.characterDialogue.push({character,line,time:Date.now(),voiceMode:'prototype_tts'});
    if(typeof window.phase16?.dialogue==='function') window.phase16.dialogue(character,line,true);
    else if('speechSynthesis' in window){try{const u=new SpeechSynthesisUtterance(line);u.rate=0.95;window.speechSynthesis.speak(u);}catch(_) {}}
    window.showDialogue?.(character,'“'+line+'”');
  }
  function lines(id,beat){return dialogue?.missions?.[id]?.beats?.[beat]||[];}
  function play(id,beat,index=0){const arr=lines(id,beat); if(!arr.length)return false; const item=arr[Math.min(index,arr.length-1)]; speak(item.text,item.character); return true;}
  function onStart(id){play(id,'start');}
  function onAction(id,stepId,count){
    const beat=(stepId==='action')?'action':stepId;
    const arr=lines(id,beat); if(!arr.length)return false;
    if(count===1){arr.forEach(item=>speak(item.text,item.character));}else{speak(arr[Math.min(count-1,arr.length-1)].text,arr[Math.min(count-1,arr.length-1)].character);} return true;
  }
  function onComplete(id){
    const arr=lines(id,'complete');arr.forEach(x=>speak(x.text,x.character));
  }
  async function load(){
    try{const [c,d]=await Promise.all([fetch('characters_production.json'),fetch('phase19_dialogue_batch01.json')]);chars=await c.json();dialogue=await d.json();window.PHASE19_CHARACTERS=chars;window.PHASE19_DIALOGUE_BATCH01=dialogue;}catch(e){console.warn('Phase 19 character/dialogue data unavailable',e);}
  }
  function panel(){
    if(!chars)return window.panel?.('<h3>CHARACTER PRODUCTION</h3><p>Loading...</p>');
    let html='<h3>CHARACTER PRODUCTION <button class="close" onclick="closePanel()">×</button></h3><p>Design, performance and voice contracts for the three playable protagonists.</p>';
    chars.characters.forEach(c=>{html+=`<div class="row"><span><b>${esc(c.name)}</b><small>${esc(c.personality.join(' · '))}</small></span><b>${esc(c.voice.type)}</b></div>`});
    html+='<p><b>Current boundary:</b> written dialogue + temporary browser TTS. Final 3D faces, animation and recorded performances remain the Unreal/content-production stage.</p>';
    window.panel?.(html);
  }
  const oldStart=window.startPlayableMission;
  window.startPlayableMission=function(id){const result=oldStart?.apply(this,arguments);if(result!==false)setTimeout(()=>onStart(id),60);return result;};
  const oldHandle=window.phase19Runtime?.handleAction;
  if(oldHandle){window.phase19Runtime.handleAction=function(m,step){const handled=oldHandle(m,step);if(handled)onAction(m.id,step.id,Number(window.gameState?.p19?.batch01?.missions?.[m.id]?.actions?.[step.id]||1));return handled;};}
  if(window.phase19Runtime?.recordCompletion){const oldRecord=window.phase19Runtime.recordCompletion;window.phase19Runtime.recordCompletion=function(id,result){const r=oldRecord(id,result);if(result&&!result.failed)onComplete(id);return r;};}
  window.phase19Dialogue={load,play,onStart,onAction,onComplete,panel,characters:()=>chars,dialogue:()=>dialogue};
  window.addEventListener('load',()=>{load();setTimeout(()=>{const q=document.querySelector('.quick-menu');if(q&&!document.getElementById('characterProductionButton')){const b=document.createElement('button');b.id='characterProductionButton';b.textContent='CHARACTERS';b.onclick=panel;q.appendChild(b);}},1700);});
})();
