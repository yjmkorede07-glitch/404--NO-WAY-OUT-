#!/usr/bin/env node
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'); const fail=[]; const ok=(c,m)=>c?console.log('PASS',m):fail.push(m);
const campaign=JSON.parse(fs.readFileSync(path.join(root,'campaign_88_missions.json'),'utf8'));
const ids=campaign.missions.map(m=>m.id); ok(campaign.missions.length===88,'campaign has exactly 88 missions'); ok(JSON.stringify(ids)===JSON.stringify(Array.from({length:88},(_,i)=>`M${String(i+1).padStart(2,'0')}`)),'mission IDs are M01-M88 sequential');
const batch=JSON.parse(fs.readFileSync(path.join(root,'phase19_batch02.json'),'utf8')); ok(batch.missions.length===10,'Batch 02 has 10 missions'); ok(batch.missions.map(m=>m.id).join(',')==='M11,M12,M13,M14,M15,M16,M17,M18,M19,M20','Batch 02 is exactly M11-M20');
for(let n=11;n<=20;n++){const id=`M${String(n).padStart(2,'0')}`,m=campaign.missions.find(x=>x.id===id),b=batch.missions.find(x=>x.id===id);ok(!!m,`${id} exists in campaign`);ok(!!b,`${id} exists in production batch`);ok(m.required_previous_missions?.[0]===`M${String(n-1).padStart(2,'0')}`,`${id} prerequisite resolves`);ok(m.prototype_steps.length>=3,`${id} has multi-step prototype execution`);ok(!!b.production_contract?.length,`${id} has production contract`);ok(b.qa.length>=3,`${id} has QA acceptance coverage`)}
for(const f of ['js/phase19_batch02_runtime.js','js/phase19_batch02.js','js/phase19_dialogue_batch02.js'])ok(fs.existsSync(path.join(root,f)),`${f} exists`);
const dlg=JSON.parse(fs.readFileSync(path.join(root,'phase19_dialogue_batch02.json'),'utf8'));for(let n=11;n<=20;n++){const id=`M${String(n).padStart(2,'0')}`;ok(!!dlg.missions[id],'dialogue exists for '+id);ok(!!dlg.missions[id].beats.start&&!!dlg.missions[id].beats.complete,'start/complete dialogue exists for '+id)}
const idx=fs.readFileSync(path.join(root,'index.html'),'utf8');['phase19_batch02_runtime.js','phase19_batch02.js','phase19_dialogue_batch02.js'].forEach(x=>ok(idx.includes(x),'index loads '+x));
if(fail.length){console.error('\nFAILED',fail.length);fail.forEach(x=>console.error('-',x));process.exit(1)} console.log('\nALL BATCH 02 VALIDATION PASSED');
