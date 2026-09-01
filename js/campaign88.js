/* 404 — 88 Mission Campaign Journal */
let campaign88=[];
async function loadCampaign88(){
  try{const r=await fetch("campaign_88_missions.json");campaign88=await r.json();renderMissionCount();}catch(e){campaign88=[];}
}
function renderMissionCount(){
  const el=document.getElementById("missionCount"); if(el)el.textContent=campaign88.mission_count||88;
}
function openCampaign(){
  const groups={};
  campaign88.missions.forEach(m=>(groups[m.phase]??=[]).push(m));
  let html=`<h3>CAMPAIGN — ${campaign88.mission_count} MISSIONS <button class="close" onclick="closePanel()">×</button></h3>`;
  Object.entries(groups).forEach(([phase,list])=>{
    html+=`<h4>${phase}</h4>`;
    list.forEach(m=>html+=`<div class="mission"><b>${m.id} — ${m.title}</b><span>${m.brief}</span><small>WIN: ${m.win_condition}</small></div>`);
  });
  panel(html);
}
window.addEventListener("load",loadCampaign88);
