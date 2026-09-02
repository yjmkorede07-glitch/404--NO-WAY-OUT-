const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
function read(rel){return fs.readFileSync(path.join(root,rel),'utf8')}
const world=JSON.parse(read('world/world_integration_v1.json'));
const identity=JSON.parse(read('player/online_character_creation_v1.json'));
const money=JSON.parse(read('online/online_identity_money_v1.json'));
const campaign=JSON.parse(read('campaign_88_missions.json'));
if(world.regions.length!==14)throw new Error('Expected 14 world regions');
if(identity.worlds.length!==3)throw new Error('Expected 3 online worlds');
if(!money.transfer.enabled||!money.transfer.server_authoritative)throw new Error('Money transfer contract invalid');
if(campaign.missions.length!==88)throw new Error('Campaign mission count changed');
const hooks=campaign.missions.filter(m=>m.world_integration).map(m=>m.id);
const expected=['M06','M19','M26','M35','M37','M38','M39','M40','M49','M50','M69','M83','M88'];
for(const id of expected)if(!hooks.includes(id))throw new Error('Missing world hook '+id);
new Function(read('js/online_identity.js'));
for(const f of ['server/server.js','server/db.js']){ if(!read(f).includes('transferMoney')) throw new Error('Missing transfer backend '+f); }
console.log('Phase 25 validation PASS:',{regions:world.regions.length,onlineWorlds:identity.worlds.length,missionHooks:hooks.length,missions:campaign.missions.length});
