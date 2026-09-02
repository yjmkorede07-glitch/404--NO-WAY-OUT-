const ONLINE_TIME={realMinutesPerGameHour:5,gameHoursPerRealHour:12,lifestyleCooldownRealMinutes:120};
const ONLINE_LIFESTYLE={state:localStorage.getItem("404_lifestyle")||"legitimate",changedAt:Number(localStorage.getItem("404_lifestyle_changed_at")||0),introSeen:false,postSeen:false};
function onlineLifestyleRemainingMs(){return Math.max(0,ONLINE_LIFESTYLE.changedAt+ONLINE_TIME.lifestyleCooldownRealMinutes*60000-Date.now());}
function onlineLifestyleCanChange(){return onlineLifestyleRemainingMs()===0;}
function onlineLifestyleLabel(v){return ({legitimate:"Legitimate",criminal:"Criminal",law_enforcement:"Law Enforcement"})[v]||v;}
function openOnlineLifestyle(){
  const remain=Math.ceil(onlineLifestyleRemainingMs()/60000);
  panel(`<h3>LIFE IN VEYRON <button class="close" onclick="closePanel()">×</button></h3>
    <p>Current life: <b>${onlineLifestyleLabel(ONLINE_LIFESTYLE.state)}</b></p>
    <p>Veyron time: <b>1 in-game hour = 5 real minutes</b>. A full in-game day is 2 real hours.</p>
    <p>${remain?`Lifestyle change available in about <b>${remain} real minutes</b>.`:`You can change your lifestyle now.`}</p>
    <button onclick="changeOnlineLifestyle('legitimate')" ${remain?'disabled':''}>LEGITIMATE</button>
    <button onclick="changeOnlineLifestyle('criminal')" ${remain?'disabled':''}>CRIMINAL</button>
    <button onclick="changeOnlineLifestyle('law_enforcement')" ${remain?'disabled':''}>LAW ENFORCEMENT</button>
    <p class="muted">Law enforcement applications require human/admin acceptance. NPC police remain active for everyone.</p>`);
}
function changeOnlineLifestyle(next){
  if(!onlineLifestyleCanChange()){notice("Lifestyle change is on cooldown.");return;}
  ONLINE_LIFESTYLE.state=next;ONLINE_LIFESTYLE.changedAt=Date.now();
  localStorage.setItem("404_lifestyle",next);localStorage.setItem("404_lifestyle_changed_at",String(ONLINE_LIFESTYLE.changedAt));
  notice(`Lifestyle changed to ${onlineLifestyleLabel(next)}. Opening transition cinematic queued.`);
  openOnlineLifestyle();
  if(typeof realOnlineSend==='function')realOnlineSend("online_lifestyle_change",{lifestyle:next,changedAt:ONLINE_LIFESTYLE.changedAt});
}
