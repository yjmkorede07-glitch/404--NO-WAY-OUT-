/* 404 — Phase 9 story + full persistence client */
const PERSISTED={
  profile:null,missions:[],properties:[],businesses:[],vehicles:[],
  story:{active_phase:1,active_mission:null,ending_path:null},flags:[],
  relationships:[],factions:[],evidence:[]
};
function applyFullSnapshot(d){
  Object.assign(PERSISTED,{
    profile:d.profile||PERSISTED.profile,missions:d.missions||[],
    properties:d.properties||[],businesses:d.businesses||[],vehicles:d.vehicles||[],
    story:d.story||PERSISTED.story,flags:d.flags||[],
    relationships:d.relationships||[],factions:d.factions||[],evidence:d.evidence||[]
  });
  if(typeof economyApply==="function")economyApply(d);
  if(d.profile){gameState.wanted=d.profile.wanted||0;}
}
function saveStoryState(active_phase,active_mission,ending_path=null){
  realOnlineSend("story_save",{active_phase,active_mission,ending_path});
}
function setStoryFlag(flag,value){realOnlineSend("story_flag",{flag,value});}
function changeRelationship(subjectId,delta){realOnlineSend("relationship",{subjectId,delta});}
function changeFaction(factionId,delta){realOnlineSend("faction_rep",{factionId,delta});}
function addEvidence(evidenceId,metadata={}){realOnlineSend("evidence",{evidenceId,metadata});}
function requestFullSnapshot(){realOnlineSend("full_snapshot",{});}
function openStory(){
  const s=PERSISTED.story;
  panel(`<h3>404 STORY STATE <button class="close" onclick="closePanel()">×</button></h3>
  <div class="row"><span>Phase</span><b>${s.active_phase}</b></div>
  <div class="row"><span>Mission</span><b>${s.active_mission||"Not started"}</b></div>
  <div class="row"><span>Ending path</span><b>${s.ending_path||"Undecided"}</b></div>
  <h4>RELATIONSHIPS</h4>${PERSISTED.relationships.map(r=>`<div class="mission"><b>${r.subject_id}</b><span>${r.level} · ${r.score}</span></div>`).join("")}
  <h4>FACTIONS</h4>${PERSISTED.factions.map(f=>`<div class="mission"><b>${f.faction_id}</b><span>${f.score}</span></div>`).join("")}
  <h4>EVIDENCE</h4><p>${PERSISTED.evidence.length} evidence items collected.</p>`);
}
