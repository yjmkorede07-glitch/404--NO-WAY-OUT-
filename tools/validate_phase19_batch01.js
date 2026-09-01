/* Static production-gate validator for Phase 19 Batch 01. */
const fs=require('fs');
const campaign=JSON.parse(fs.readFileSync('campaign_88_missions.json','utf8'));
const batch=JSON.parse(fs.readFileSync('phase19_batch01.json','utf8'));
const expected=[...Array(10)].map((_,i)=>`M${String(i+1).padStart(2,'0')}`);
const actual=batch.missions.map(m=>m.id);
const fail=[];
if(batch.batch!=='M01-M10')fail.push('wrong batch id');
if(JSON.stringify(actual)!==JSON.stringify(expected))fail.push('batch mission IDs are not M01-M10 in order');
if(campaign.missions.length!==88)fail.push('campaign does not contain 88 missions');
for(const id of expected){
 const m=campaign.missions.find(x=>x.id===id), b=batch.missions.find(x=>x.id===id);
 if(!m)fail.push(`${id} missing from campaign`);
 if(!b)continue;
 if(!Array.isArray(m.prototype_steps)||!m.prototype_steps.length)fail.push(`${id} has no prototype steps`);
 if(!b.production_contract)fail.push(`${id} missing production_contract`);
 else for(const k of ['cinematic','audio_vo','art_world','animation','npc_ai','failure_modes','save_points','score_components','persistence'])if(!Array.isArray(b.production_contract[k])||!b.production_contract[k].length)fail.push(`${id} missing ${k} contract`);
}
const scripts=fs.readFileSync('index.html','utf8');
for(const s of ['js/phase19.js','js/phase19_runtime.js','js/playable_phase10.js'])if(!scripts.includes(s))fail.push(`index.html missing ${s}`);
if(fail.length){console.error('FAIL: Phase 19 Batch 01');fail.forEach(x=>console.error(' - '+x));process.exit(1)}
console.log('PASS: Phase 19 Batch 01 production contracts; M01-M10 mapped; runtime bridge present.');
