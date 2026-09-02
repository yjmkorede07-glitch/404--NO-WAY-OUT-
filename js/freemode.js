/* 404: NO WAY OUT — Freemode Criminal Sandbox runtime (browser prototype)
 * This is a reference implementation for the Unreal production architecture.
 */
(function(){
  const BANKS=[
    {id:'bank_veyron_central',name:'Veyron Bank',x:120,y:70,tier:3,min:8000,max:22000},
    {id:'bank_central_reserve',name:'Central Reserve Bank',x:235,y:70,tier:5,min:25000,max:70000},
    {id:'bank_east_market',name:'East Market Credit Union',x:-610,y:80,tier:2,min:4000,max:12000},
    {id:'bank_port_finance',name:'Port Finance',x:760,y:470,tier:3,min:7000,max:18000}
  ];
  window.FREEMODE_BANKS=BANKS;
  function state(){ gameState.freemode=gameState.freemode||{activities:{},bankCooldowns:{},events:[]}; return gameState.freemode; }
  function bank(id){return BANKS.find(b=>b.id===id)}
  function nearBank(b){const p=currentPlayer();return Math.hypot(p.position.x-b.x,p.position.y-b.y)<95}
  function startBankRobbery(id){
    const b=bank(id); if(!b)return;
    const s=state(), now=Date.now(), cd=Number(s.bankCooldowns[id]||0);
    if(now<cd)return notice('Security is still recovering at '+b.name+'.');
    if(!nearBank(b))return notice('Move closer to '+b.name+'.');
    const key='bank:'+id, reward=Math.floor(b.min+Math.random()*(b.max-b.min+1));
    s.activities[key]={type:'bank_robbery',location:id,state:'active',startedAt:now,reward,heat:Math.min(5,1+Math.floor(b.tier/2)),progress:0};
    s.events.unshift({type:'bank_robbery_started',location:id,time:now});
    gameState.wanted=Math.max(gameState.wanted||0,Math.min(5,s.activities[key].heat));
    saveAll(); updateHUD(); renderRobbery(key);
  }
  function progressRobbery(key){
    const a=state().activities[key]; if(!a)return;
    a.progress=Math.min(100,(a.progress||0)+25);
    if(a.progress>=100){
      a.state='escape';
      gameState.wanted=Math.max(gameState.wanted||0,4);
      notice('Cash secured. Escape the police.');
    } else notice('Robbery progress: '+a.progress+'%');
    saveAll();updateHUD();renderRobbery(key);
  }
  function finishRobbery(key){
    const a=state().activities[key]; if(!a)return;
    if(a.state!=='escape')return notice('You have not secured the cash yet.');
    const p=currentPlayer();p.cash+=a.reward;a.state='resolved';state().bankCooldowns[a.location]=Date.now()+30*60*1000;
    state().events.unshift({type:'bank_robbery_completed',location:a.location,reward:a.reward,time:Date.now()});
    notice('Robbery complete: +$'+a.reward.toLocaleString());saveAll();updateHUD();closePanel();
  }
  function abandonRobbery(key){const a=state().activities[key];if(!a)return;a.state='resolved';a.reward=0;state().events.unshift({type:'bank_robbery_abandoned',location:a.location,time:Date.now()});saveAll();closePanel();notice('Robbery abandoned.');}
  function renderRobbery(key){const a=state().activities[key],b=bank(a.location);panel(`<h3>${b.name} — FREEMODE ROBBERY <button class="close" onclick="closePanel()">×</button></h3><div class="row"><span>State</span><b>${a.state.toUpperCase()}</b></div><div class="row"><span>Cash</span><b>$${a.reward.toLocaleString()}</b></div><div class="row"><span>Heat</span><b>${'★'.repeat(a.heat)}${'☆'.repeat(5-a.heat)}</b></div><div class="row"><span>Progress</span><b>${a.progress}%</b></div>${a.state==='active'?'<button onclick="freemodeProgress(\''+key+'\')">CONTINUE ROBBERY</button>':''}${a.state==='escape'?'<button onclick="freemodeFinish(\''+key+'\')">ESCAPE / CLAIM</button>':''}<button onclick="freemodeAbandon(\''+key+'\')">ABANDON</button><p>This is a freemode activity. No mission marker is required. Story and Online can both use the same activity family.</p>`)}
  function openBankMenu(id){const b=bank(id);if(!b)return;panel(`<h3>${b.name}<button class="close" onclick="closePanel()">×</button></h3><p>Open-world interaction point. You can enter normally, or choose to start a criminal activity.</p><button onclick="freemodeStartBank('${id}')">ATTEMPT ROBBERY</button><button onclick="closePanel()">LEAVE</button>`)}
  function scanBanks(){const p=currentPlayer();const nearby=BANKS.filter(nearBank);if(!nearby.length)return null;return nearby[0]}
  window.freemodeStartBank=startBankRobbery;window.freemodeProgress=progressRobbery;window.freemodeFinish=finishRobbery;window.freemodeAbandon=abandonRobbery;window.openBankMenu=openBankMenu;
  window.freemodeTick=function(){const b=scanBanks(),hint=document.getElementById('interactHint');if(!hint||near)return; if(b){hint.textContent='E / tap: '+b.name+' · interact';hint.classList.remove('hidden');}}
  const oldInteract=window.interact; window.interact=function(){const b=scanBanks();if(b){openBankMenu(b.id);return;} if(typeof oldInteract==='function')oldInteract();};
  const oldInit=window.init; window.addEventListener('load',()=>{state();setTimeout(()=>{const q=document.querySelector('.quick-menu');if(q&&!document.getElementById('freemodeButton')){const btn=document.createElement('button');btn.id='freemodeButton';btn.textContent='FREEMODE CRIMES';btn.onclick=()=>panel('<h3>FREEMODE CRIMES <button class="close" onclick="closePanel()">×</button></h3>'+BANKS.map(b=>`<div class="row"><span>${b.name}<small>${b.tier} · ${b.min.toLocaleString()}-${b.max.toLocaleString()}</small></span><button onclick="freemodeStartBank('${b.id}')">GO</button></div>`).join(''));q.appendChild(btn)}},2500)});
})();
