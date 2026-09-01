/* 404: NO WAY OUT — PHASE 19
 * Production batching layer. Batch 01 turns M01-M10 into an explicit
 * vertical-slice contract with required systems and QA gates.
 * The existing playable mission runtime remains the execution layer.
 */
(function(){
"use strict";
const BATCH="M01-M10";
let data=null;
function esc(s){return String(s??"").replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));}
function completed(id){return !!window.gameState?.missionRuntime?.results?.[id] && window.gameState.missionRuntime.results[id].failed===false;}
async function load(){try{const r=await fetch("phase19_batch01.json");if(!r.ok)throw Error(r.status);data=await r.json();}catch(e){data=null;}}
function batchReady(){return !!data&&data.missions?.length===10&&data.missions.every(m=>completed(m.id));}
function open(){
  if(!data)return window.panel?.('<h3>PHASE 19</h3><p>Loading production batch...</p>');
  const done=data.missions.filter(m=>completed(m.id)).length;
  const active=window.gameState?.missionRuntime?.active;
  let html=`<h3>PHASE 19 · PRODUCTION BATCH 01 <button class="close" onclick="closePanel()">×</button></h3>`;
  html+=`<p><b>${BATCH}</b> · ${done}/10 complete. Every mission carries systems, cinematic/audio contracts and QA gates before the next batch.</p>`;
  html+=`<div class="row"><span>Batch gate</span><b>${batchReady()?"PASSED":"IN PROGRESS"}</b></div>`;
  html+=`<div class="row"><span>Required systems</span><b>${data.required_systems.length}</b></div>`;
  data.missions.forEach(m=>{
    const d=completed(m.id), a=active===m.id;
    html+=`<div class="mission ${d?'done':''} ${a?'active':''}"><b>${m.id} — ${esc(m.title)}</b><small>${esc(m.production_role)}</small><span>${m.systems.map(esc).join(' · ')}</span><small>BEATS: ${m.beats.map(esc).join(' → ')}</small><span>QA: ${m.qa.map(esc).join(' · ')}</span>`;
    if(!active)html+=`<button onclick="startPlayableMission('${m.id}')">${d?'REPLAY':'START'}</button>`;
    html+=`</div>`;
  });
  if(batchReady())html+=`<div class="mission-result"><h3>BATCH 01 GATE PASSED</h3><p>M01-M10 are complete in the current save. M11 is the next campaign gate.</p></div>`;
  window.panel?.(html);
}
window.phase19={load,open,batchReady,getBatch:()=>data};
window.addEventListener('load',()=>{load();setTimeout(()=>{const q=document.querySelector('.quick-menu');if(q&&!document.getElementById('phase19Button')){const b=document.createElement('button');b.id='phase19Button';b.textContent='PHASE 19';b.onclick=open;q.appendChild(b);}},1400);});
})();
