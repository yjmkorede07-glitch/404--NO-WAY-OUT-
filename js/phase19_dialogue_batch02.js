/* 404: NO WAY OUT — PHASE 19 BATCH 02 CHARACTER/DIALOGUE */
(function(){'use strict';let dialogue=null;
const state=()=>window.gameState||null;
function speak(c,t){const g=state();if(!g)return;g.p19=g.p19||{};g.p19.characterDialogue=g.p19.characterDialogue||[];g.p19.characterDialogue.push({character:c,line:t,time:Date.now(),voiceMode:'prototype_tts'});if(window.phase16?.dialogue)window.phase16.dialogue(c,t,true);else if('speechSynthesis'in window){try{const u=new SpeechSynthesisUtterance(t);u.rate=.95;speechSynthesis.speak(u)}catch(_){}}window.showDialogue?.(c,'“'+t+'”')}
function play(id,beat,count=1){const a=dialogue?.missions?.[id]?.beats?.[beat]||[];if(!a.length)return;const item=a[Math.min(count-1,a.length-1)];speak(item.character,item.text)}
async function load(){try{dialogue=await (await fetch('phase19_dialogue_batch02.json')).json();window.PHASE19_DIALOGUE_BATCH02=dialogue}catch(e){console.warn('Batch 02 dialogue unavailable',e)}}
const oldStart=window.startPlayableMission;window.startPlayableMission=function(id){const r=oldStart?.apply(this,arguments);if(r!==false)setTimeout(()=>play(id,'start'),70);return r};
const oldHandle=window.phase19Batch02Runtime?.handleAction;
if(oldHandle)window.phase19Batch02Runtime.handleAction=function(m,step){const ok=oldHandle(m,step);if(ok){const c=Number(state()?.p19?.batch02?.missions?.[m.id]?.actions?.[step.id]||1);play(m.id,step.id,c)}return ok};
if(window.phase19Batch02Runtime?.recordCompletion){const old=window.phase19Batch02Runtime.recordCompletion;window.phase19Batch02Runtime.recordCompletion=function(id,r){const x=old(id,r);if(r&&!r.failed)play(id,'complete');return x}}
window.phase19DialogueBatch02={load,play};window.addEventListener('load',load);
})();
