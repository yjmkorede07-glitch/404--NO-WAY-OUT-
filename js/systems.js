function openSwitch(){panel(`<h3>Switch Protagonist <button class="close" onclick="closePanel()">×</button></h3><p>Darius, Malik and Amara are fully switchable. Each keeps a separate position, money, skills, health and perspective.</p>${Object.values(gameState.characters).map(c=>`<div class="character ${c.id===gameState.active?"active":""}"><b>${c.name}</b><span>${c.role} · Cash ${money(c.cash)} · Bank ${money(c.bank)}</span><button onclick="switchCharacter('${c.id}')">${c.id===gameState.active?"ACTIVE":"SWITCH"}</button></div>`).join("")}`)}
function openMissions(){
 const phaseMap={};MISSION_DATA.forEach(m=>(phaseMap[m.phase]??=[]).push(m));
 let html=`<h3>Mission Journal <button class="close" onclick="closePanel()">×</button></h3><p>34 main missions. The campaign is designed for 30+ hours before side content and alternate approaches.</p>`;
 for(const phase of Object.keys(phaseMap)){html+=`<h4>Phase ${phase}</h4>`;for(const m of phaseMap[phase])html+=`<div class="mission"><b>${m.id} — ${m.title}</b><small>${m.type} · ${m.hours} hr target</small><span>Win: ${m.win}</span></div>`}
 html+=`<h4>Side Activities</h4><p>${SIDE_ACTIVITIES.join(" · ")}</p>`;panel(html)
}
function openMissionPlan(){openMissions()}
function checkMissionProgress(){return}
function openVehicles(){panel(`<h3>Vehicles <button class="close" onclick="closePanel()">×</button></h3>${gameState.vehicles.map(v=>`<div class="vehicle"><b>${v.name}</b><span>${v.type} · Owner: ${gameState.characters[v.owner]?.name||v.owner} · Condition ${v.health}%</span><button onclick="enterVehicle('${v.id}')">ENTER</button></div>`).join("")}<p>Vehicle ownership and condition are data-driven. Full driving, traffic, damage and part reactions belong to Phase 5.</p>`)}
function enterVehicle(id){const v=gameState.vehicles.find(x=>x.id===id),p=currentPlayer();if(!v)return;if(v.owner!==gameState.active)return notice("This vehicle belongs to another protagonist.");if(Math.hypot(v.x-p.position.x,v.y-p.position.y)>70)return notice("Move closer to the vehicle.");p.inVehicle=id;saveAll();notice("Entered "+v.name+".")}
function commitCrime(){gameState.wanted=Math.min(5,gameState.wanted+1);saveAll();updateHUD();notice("Witness report filed. Wanted level increased.")}
