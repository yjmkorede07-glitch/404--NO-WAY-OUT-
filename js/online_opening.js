const ONLINE_OPENING={step:'intro',life:null,characterCreated:false,world:'veyron-01'};
function openOnline(){ startOnlineOpening(); }
function startOnlineOpening(){
  ONLINE_OPENING.step='character';
  const defaultName=(typeof currentPlayer==='function'&&currentPlayer()?.name)||'Player';
  panel(`<div class="cinematic"><div class="letterbox"></div><div class="cine-title">404: NO WAY OUT</div><div class="cine-sub">ONLINE — CREATE YOUR CHARACTER</div><p>Build your online identity first. Your $10,000,000 VCR starting grant is deposited to your bank once per account after character creation.</p><input id="onlineCharacterName" value="${defaultName.replace(/"/g,'&quot;')}" maxlength="30" placeholder="Character name"><br><button onclick="createOnlineCharacterFlow()">CREATE CHARACTER</button></div>`);
}
function createOnlineCharacterFlow(){
  const name=(document.getElementById('onlineCharacterName')?.value||'Player').trim().slice(0,30)||'Player';
  ONLINE_OPENING.characterCreated=true;
  if(typeof realOnlineSend==='function')realOnlineSend('online_character_created',{displayName:name,worldId:ONLINE_OPENING.world});
  ONLINE_OPENING.step='intro';
  panel(`<div class="cinematic"><div class="letterbox"></div><div class="cine-title">WELCOME TO VEYRON</div><div class="cine-sub">YOUR STORY HAS NOT BEEN WRITTEN</div><p>The city is moving. Businesses are open. Police patrol. People work, socialize, build and take risks. First, decide what kind of life you want.</p><button onclick="showOnlineLifeChoice()">CHOOSE YOUR LIFE</button></div>`);
}
function showOnlineLifeChoice(){
  ONLINE_OPENING.step='choice';
  panel(`<h3>CHOOSE YOUR LIFE <button class="close" onclick="closePanel()">×</button></h3>
  <p>Choose what your character is trying to become. You can change later, but each successful change starts a <b>2 real-hour</b> cooldown.</p>
  <button onclick="selectOpeningLife('legitimate')">LEGITIMATE</button>
  <button onclick="selectOpeningLife('criminal')">CRIMINAL</button>
  <button onclick="selectOpeningLife('law_enforcement')">LAW ENFORCEMENT</button>
  <p class="muted">Law enforcement requires human/admin acceptance. NPC police are always active.</p>`);
}
function selectOpeningLife(life){
  ONLINE_OPENING.life=life; ONLINE_OPENING.step='post';
  if(typeof onlineLifestyleCanChange==='function' && !onlineLifestyleCanChange() && ONLINE_LIFESTYLE.state!==life){notice('Lifestyle change is on cooldown.');return;}
  ONLINE_LIFESTYLE.state=life; ONLINE_LIFESTYLE.changedAt=Date.now();
  localStorage.setItem('404_lifestyle',life);localStorage.setItem('404_lifestyle_changed_at',String(ONLINE_LIFESTYLE.changedAt));
  if(typeof realOnlineSend==='function')realOnlineSend('online_career_save',{life_path:life,law_status:life==='law_enforcement'?'pending':'not_applied',world_id:ONLINE_OPENING.world,last_lifestyle_change_at:ONLINE_LIFESTYLE.changedAt});
  if(life==='law_enforcement' && typeof realOnlineSend==='function')realOnlineSend('online_law_apply',{});
  const district=life==='criminal'?'East Market / Iron District':life==='law_enforcement'?'Veyron Central / North Hills':'Veyron Central / West Coast';
  panel(`<div class="cinematic"><div class="letterbox"></div><div class="cine-title">YOUR LIFE STARTS HERE</div><div class="cine-sub">${onlineLifestyleLabel(life).toUpperCase()}</div><p>Recommended district: <b>${district}</b></p><p>${life==='legitimate'?'Start with work, property, businesses and a clean reputation.':life==='criminal'?'Start with crews, risky opportunities and a police system that never sleeps.':'Start with public service. Your application is waiting for human/admin acceptance.'}</p><button onclick="beginOnlineOnboardingAfterCinematic()">ENTER VEYRON</button></div>`);
}
function beginOnlineOnboardingAfterCinematic(){ ONLINE_OPENING.step='onboarding'; notice('Opening complete. Start First Day in Veyron: house → ID → car.'); if(typeof openOnlineLifestyle==='function')openOnlineLifestyle(); }
