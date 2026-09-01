/* 404 — Phase 10 finale / ending state */
const FINALE={ending:null,postgameUnlocked:false};
function openFinale(){
 panel(`<h3>THE FINAL CHAPTER <button class="close" onclick="closePanel()">×</button></h3>
 <p>Four major endings. Your choices, relationships, evidence and faction reputation determine availability.</p>
 <div class="mission"><b>E1 — THE ESCAPE</b><span>Expose 404 and disappear.</span></div>
 <div class="mission"><b>E2 — THE CROWN</b><span>Take control of the power structure.</span></div>
 <div class="mission"><b>E3 — THE SACRIFICE</b><span>One protagonist pays the price.</span></div>
 <div class="mission"><b>E4 — NO WAY OUT</b><span>404's plan succeeds.</span></div>
 <h4>POST-GAME</h4><p>Free roam continues after the ending, with the city and available activities reflecting what happened.</p>`);
}
