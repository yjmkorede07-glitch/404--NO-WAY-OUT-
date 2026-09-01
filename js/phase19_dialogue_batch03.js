/* 404: NO WAY OUT — PHASE 19 BATCH 03 DIALOGUE HOOK */
(function(){'use strict';let data=null;
async function load(){try{const r=await fetch('phase19_dialogue_batch03.json');if(!r.ok)throw Error(r.status);data=await r.json();window.PHASE19_DIALOGUE_BATCH03=data}catch(e){console.warn('Batch 03 dialogue unavailable',e)}}
function play(id,beat){const lines=data?.missions?.[id]?.beats?.[beat];if(!lines?.length)return;lines.forEach((l,i)=>setTimeout(()=>window.phase16?.dialogue?phase16.dialogue(l.character,l.text):window.dialogue?.(l.character,l.text),i*900));}
function wrap(){const rt=window.phase19Batch03Runtime;if(!rt||rt.__dialogueWrapped)return;if(typeof rt.handleAction==='function'){const old=rt.handleAction;rt.handleAction=function(m,step){const ok=old(m,step);if(ok)play(m.id,step.id);return ok}}if(typeof rt.recordCompletion==='function'){const old=rt.recordCompletion;rt.recordCompletion=function(id,result){old(id,result);if(result&&!result.failed)play(id,'complete')}}rt.__dialogueWrapped=true}
window.addEventListener('load',()=>{load();setTimeout(wrap,500);setTimeout(()=>{const q=document.querySelector('.quick-menu');if(q&&!document.getElementById('phase19Batch03DialogueButton')){const b=document.createElement('button');b.id='phase19Batch03DialogueButton';b.textContent='M21-30 DIALOGUE';b.onclick=()=>window.panel?.('<h3>PHASE 19 · BATCH 03 DIALOGUE</h3><p>M21-M30 mission-specific dialogue and VO direction loaded. Browser speech is temporary prototype support.</p>');q.appendChild(b)}},2200)});
window.phase19Batch03Dialogue={load,play};
})();
