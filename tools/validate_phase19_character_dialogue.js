const fs=require('fs');
const chars=JSON.parse(fs.readFileSync('characters_production.json','utf8'));
const dlg=JSON.parse(fs.readFileSync('phase19_dialogue_batch01.json','utf8'));
const required=['darius','malik','amara'];
if(chars.characters.length!==3)throw Error('Expected exactly 3 playable protagonist contracts');
for(const id of required){const c=chars.characters.find(x=>x.id===id);if(!c)throw Error(`Missing character ${id}`);for(const k of ['visual','performance','voice'])if(!c[k])throw Error(`${id} missing ${k}`);}
const ids=Array.from({length:10},(_,i)=>`M${String(i+1).padStart(2,'0')}`);
for(const id of ids){if(!dlg.missions[id])throw Error(`Missing dialogue for ${id}`);if(!dlg.missions[id].beats?.start)throw Error(`${id} missing start dialogue`);if(!dlg.missions[id].beats?.complete)throw Error(`${id} missing completion dialogue`);}
if(!fs.readFileSync('index.html','utf8').includes('js/phase19_dialogue.js'))throw Error('Dialogue runtime not loaded');
console.log('Phase 19 character/dialogue validation: PASS');
