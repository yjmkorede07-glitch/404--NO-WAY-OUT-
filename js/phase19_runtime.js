/* 404: NO WAY OUT — PHASE 19 BATCH 01 RUNTIME
 * M01-M10 mission-specific gameplay contracts layered over the existing
 * 2D playable runtime. This is production-oriented prototype logic, not a
 * claim of finished Unreal content.
 */
(function(){
'use strict';
const IDS=new Set(['M01','M02','M03','M04','M05','M06','M07','M08','M09','M10']);
const SPECIAL={
 M01:{actions:{'take-cab':{message:'Cab secured. Follow the route to the Cole family house.',state:{cabTaken:true}}},'inspect-house':{message:'Hidden phone recovered. Malik is the first confirmed lead.',effect:g=>{g.story.leads=g.story.leads||{};g.story.leads.malik=true;g.story.evidence=Math.max(g.story.evidence,1);}}},
 M02:{actions:{account:{message:'Account opened. Suspicious transaction recorded.',effect:g=>{g.story.financialTrail=true;g.story.evidence+=1;}}}},
 M03:{actions:{action:{message:'Name 1/3 secured.',repeat:true,target:3,effect:g=>{g.story.connectedNames=(g.story.connectedNames||0)+1;}}}},
 M04:{actions:{action:{message:'The call connected. Meeting point confirmed.',effect:g=>{g.story.amaraCallAnswered=true;g.story.exposure+=1;g.p18?.relationships?.amara?.darius&&(g.p18.relationships.amara.darius.trust=Math.min(100,g.p18.relationships.amara.darius.trust+2));}}}},
 M05:{actions:{'bank-log':{message:'Central Bank logged.'},'market-log':{message:'East Market logged.'},'police-log':{message:'Police HQ logged without response.'},'safehouse-log':{message:'Central route complete.'}}},
 M06:{actions:{action:{message:'Target exchange recorded. No confirmed identification.',effect:g=>{g.story.quietMoneyEvidence=true;g.story.evidence+=1;}}}},
 M07:{actions:{action:{message:'Malik agrees to cooperate. Workshop access established.',effect:g=>{g.story.malikWorkshop=true;g.p18?.relationships?.amara?.malik&&(g.p18.relationships.amara.malik.trust=Math.min(100,g.p18.relationships.amara.malik.trust+2));}}}},
 M08:{actions:{container:{message:'Container inspected. Evidence secured.',effect:g=>{g.story.portContainer=true;g.story.evidence+=1;g.story.policePressure+=1;}},escape:{message:'Port escaped. Pressure contained.',effect:g=>{g.story.portEscaped=true;g.story.policePressure=Math.max(0,g.story.policePressure-1);}}}},
 M09:{actions:{action:{message:'Contact 1/3 completed. People are talking.',repeat:true,target:3,effect:g=>{g.story.socialContacts=(g.story.socialContacts||0)+1;if(g.p18?.relationships?.malik?.darius)g.p18.relationships.malik.darius.trust=Math.min(100,g.p18.relationships.malik.darius.trust+1);}}}},
 M10:{actions:{action:{message:'Information 1/3 connected.',repeat:true,target:3,effect:g=>{g.story.amaraInformation=(g.story.amaraInformation||0)+1;g.story.evidence+=1;if(g.p18?.relationships?.amara?.darius)g.p18.relationships.amara.darius.trust=Math.min(100,g.p18.relationships.amara.darius.trust+1);}}}}
};
function G(){return window.gameState||null}
function ensure(){const g=G();if(!g)return;g.p19=g.p19||{};g.p19.batch01=g.p19.batch01||{};g.p19.batch01.missions=g.p19.batch01.missions||{};g.p19.batch01.qa=g.p19.batch01.qa||{};}
function ms(id){ensure();const g=G();return g.p19.batch01.missions[id]||(g.p19.batch01.missions[id]={actions:{},checkpoints:[],detected:false});}
function save(){window.saveAll?.()}
function markCheckpoint(id,label){const x=ms(id);if(!x.checkpoints.includes(label))x.checkpoints.push(label);save()}
function actionCount(id,step){const x=ms(id);return Number(x.actions[step]||0)}
function handleAction(m,step){
 if(!IDS.has(m.id))return false;
 const spec=SPECIAL[m.id]?.actions?.[step.id];
 if(!spec){markCheckpoint(m.id,step.id);return false;}
 const g=G(),x=ms(m.id),count=actionCount(m.id,step.id)+1;x.actions[step.id]=count;
 spec.effect?.(g);
 if(spec.repeat){
   const target=spec.target||1;
   if(count<target){markCheckpoint(m.id,`${step.id}-${count}`);const ordinal=count+1;const msg=step.id==='action'&&m.id==='M10'?`Information ${ordinal}/${target} connected.`:step.id==='action'&&m.id==='M09'?`Contact ${ordinal}/${target} completed.`:step.id==='action'&&m.id==='M05'?`Central location ${ordinal}/${target} logged.`:step.id==='action'&&m.id==='M03'?`Name ${ordinal}/${target} secured.`:spec.message;window.notice?.(msg);window.updateHUD?.();return true;}
 }
 markCheckpoint(m.id,step.id);
 window.notice?.(spec.message||'Objective completed.');
 if(m.id==='M06')x.stealthClean=(Number(g.wanted||0)===0);
 if(m.id==='M08')x.portPressure=Number(g.story?.policePressure||0);
 // Let the canonical mission engine advance only after the mission-specific action contract is satisfied.
 window.phase19Advance?.();
 return true;
}
function qaSnapshot(){
 ensure();const g=G();const out={};IDS.forEach(id=>{const x=ms(id),r=g.missionRuntime?.results?.[id];out[id]={started:!!r||g.missionRuntime?.active===id,completed:!!r&&!r.failed,checkpoints:x.checkpoints.length,actions:x.actions,clean:x.stealthClean??null};});return out;
}
function recordCompletion(id,result){ensure();const x=ms(id);x.completed=!!result&&!result.failed;x.result=result||null;if(x.completed)gating(id);save()}
function gating(id){const n=Number(id.slice(1));if(n<10){const next=`M${String(n+1).padStart(2,'0')}`;window.p18?.refreshMissionTriggers?.();window.notice?.(`${id} complete · ${next} is now available.`);}else{window.gameState.p19.batch01.complete=true;window.gameState.p19.batch01.completedAt=Date.now();window.notice?.('BATCH 01 COMPLETE · M01-M10 production gate passed.');}}
function openQA(){ensure();const snap=qaSnapshot();let html='<h3>PHASE 19 · BATCH 01 QA <button class="close" onclick="closePanel()">×</button></h3><p>Runtime acceptance state for M01-M10.</p>';Object.entries(snap).forEach(([id,v])=>html+=`<div class="row"><span><b>${id}</b> · checkpoints ${v.checkpoints}</span><b>${v.completed?'PASS':v.started?'ACTIVE':'PENDING'}</b></div>`);html+=`<div class="row"><span>Batch completion flag</span><b>${G().p19.batch01.complete?'PASS':'IN PROGRESS'}</b></div>`;window.panel?.(html)}
window.phase19Runtime={handleAction,qaSnapshot,openQA,recordCompletion};
window.phase19Advance=function(){
 // Bridge back to the existing lexical advanceMissionStep function without duplicating the mission engine.
 if(typeof advanceMissionStep==='function')advanceMissionStep();
};
const oldFinish=window.finishPlayableMission;
// finishPlayableMission is lexical in playable_phase10.js, so completion is also observed from the runtime loop.
function observe(){const g=G();if(!g)return;ensure();const active=g.missionRuntime?.active;if(active&&IDS.has(active))return;IDS.forEach(id=>{const r=g.missionRuntime?.results?.[id];if(r&&!ms(id).completed){recordCompletion(id,r);}});}
setInterval(observe,500);
window.addEventListener('load',()=>setTimeout(()=>{const q=document.querySelector('.quick-menu');if(q&&!document.getElementById('phase19QAButton')){const b=document.createElement('button');b.id='phase19QAButton';b.textContent='BATCH QA';b.onclick=openQA;q.appendChild(b)}},1600));
})();
