const ONLINE_CONFIG={enabled:true,maxPlayers:16,mode:"shared-world"};
let onlineSession={status:"offline",sessionId:null,displayName:null,players:[]};

function createOnlineSession(){
    onlineSession={status:"hosting",sessionId:"VY-"+Math.random().toString(36).slice(2,8).toUpperCase(),displayName:currentPlayer().name,players:[{name:currentPlayer().name,character:gameState.active}]};
    saveAll();renderOnline();
    notice("Online session created: "+onlineSession.sessionId);
}
function joinDemoSession(){
    onlineSession={status:"connected",sessionId:"DEMO-"+Math.random().toString(36).slice(2,7).toUpperCase(),displayName:currentPlayer().name,players:[
        {name:currentPlayer().name,character:gameState.active},
        {name:"Online Player",character:"malik"}
    ]};
    renderOnline();notice("Connected to the Phase 3 online test session.");
}
function leaveOnline(){onlineSession={status:"offline",sessionId:null,displayName:null,players:[]};renderOnline();notice("Left online session.")}
function renderOnline(){
    const list=onlineSession.players.length?onlineSession.players.map(p=>`<div class="row"><span>${p.name}</span><b>${p.character}</b></div>`).join(""):"<p>No connected players.</p>";
    panel(`<h3>ONLINE <button class="close" onclick="closePanel()">×</button></h3>
    <div class="row"><span>Status</span><b>${onlineSession.status}</b></div>
    <div class="row"><span>Mode</span><b>Shared World</b></div>
    <div class="row"><span>Capacity</span><b>${ONLINE_CONFIG.maxPlayers}</b></div>
    ${list}
    <button onclick="createOnlineSession()">HOST</button>
    <button onclick="joinDemoSession()">JOIN TEST</button>
    <button onclick="leaveOnline()">LEAVE</button>
    <p>This is the online architecture/UI foundation. Real online play will use an authoritative server for movement, missions, economy, vehicles and anti-cheat.</p>`);
}
function openOnline(){renderOnline()}
