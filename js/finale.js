/* 404 — Build 012 conditional finale UI. Uses the existing finale concepts and P10 state machine. */
function openFinale(){
  if(typeof ensureState==='function')ensureState();
  const rows=Object.values(ENDINGS||{}).map(e=>{
    const available=e.conditions(gameState);
    return `<div class="mission"><b>ENDING ${e.id} — ${e.title}</b><span>${e.post}</span><small>${available?'AVAILABLE':'LOCKED'} · Final missions: ${e.finalMissions.join(', ')}</small></div>`;
  }).join('');
  panel(`<h3>THE FINAL CHAPTER <button class="close" onclick="closePanel()">×</button></h3>
  <p>Four major endings are state-driven. Choices, evidence, relationships, faction standing and survivor states determine the outcome.</p>
  ${rows}
  <button onclick="finalizeEnding()">RESOLVE FINALE</button>
  <h4>POST-GAME</h4><p>Free roam continues after the ending, with city state, activities and law pressure reflecting what happened.</p>`);
}
