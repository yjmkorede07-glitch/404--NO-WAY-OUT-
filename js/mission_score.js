/* 404 — Phase 10 mission scoring: 0–100 */
const MISSION_SCORE={
  critical:0, optional:0, time:0, survival:0, precision:0
};
function calculateMissionScore(parts){
  const c=Math.max(0,Math.min(50,Number(parts.critical)||0));
  const o=Math.max(0,Math.min(20,Number(parts.optional)||0));
  const t=Math.max(0,Math.min(10,Number(parts.time)||0));
  const s=Math.max(0,Math.min(10,Number(parts.survival)||0));
  const p=Math.max(0,Math.min(10,Number(parts.precision)||0));
  return Math.round(c+o+t+s+p);
}
function missionGrade(score){
  score=Math.max(0,Math.min(100,Math.round(score)));
  if(score>=90)return "EXCEPTIONAL";
  if(score>=75)return "EXCELLENT";
  if(score>=60)return "PASSED";
  if(score>=40)return "BARELY PASSED";
  return "FAILED";
}
function showMissionResult(name,score,failedReason=""){
  const failed=score<40 || !!failedReason;
  const title=failed?"MISSION FAILED":"MISSION PASSED";
  const grade=failed?"FAILED":missionGrade(score);
  panel(`<div class="mission-result"><h2>${title}</h2><h3>${name}</h3>
  <div class="score">${failed?0:score}<small>/100</small></div>
  <b>${grade}</b>${failedReason?`<p>${failedReason}</p>`:""}
  <p>Critical objectives determine completion. Optional objectives improve your score.</p>
  <button onclick="closePanel()">CONTINUE</button>
  ${failed?`<button onclick="restartMission()">RETRY</button>`:""}</div>`);
}
function restartMission(){notice("Mission restart requested.");closePanel();}
