const ONLINE_IDENTITY={playerId:null,citizenId:null,worldId:"veyron-01",homeDistrict:"Veyron Central",active:false};
function chooseOnlineWorld(worldId){ONLINE_IDENTITY.worldId=worldId;}
function createOnlineIdentity(name,homeDistrict){ONLINE_IDENTITY.playerId=currentPlayer().id||null;ONLINE_IDENTITY.citizenId="VY-"+Math.random().toString(36).slice(2,10).toUpperCase();ONLINE_IDENTITY.homeDistrict=homeDistrict||"Veyron Central";ONLINE_IDENTITY.active=false;notice("Identity created. Visit a Veyron Civic Center to activate your Citizen ID.");}
function activateCitizenId(){ONLINE_IDENTITY.active=true;notice("Veyron Citizen ID activated: "+ONLINE_IDENTITY.citizenId);}
function requestMoneyTransfer(recipientAccountId,amount){if(Number(amount)<1)return notice("Transfer amount must be positive.");const key="TR-"+Date.now()+"-"+Math.random().toString(36).slice(2,7);realOnlineSend("transfer_money",{recipientAccountId,amount:Number(amount),idempotencyKey:key});}
