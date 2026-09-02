import Database from "better-sqlite3";
import crypto from "crypto";
const db=new Database(process.env.DB_PATH||"404.db");
db.pragma("journal_mode = WAL");
try{db.exec("ALTER TABLE profiles ADD COLUMN bank_balance INTEGER NOT NULL DEFAULT 0");}catch(e){}
db.exec(`
CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS profiles(account_id TEXT PRIMARY KEY,display_name TEXT NOT NULL,active_character TEXT NOT NULL DEFAULT 'darius',cash INTEGER NOT NULL DEFAULT 0,wanted INTEGER NOT NULL DEFAULT 0,FOREIGN KEY(account_id) REFERENCES accounts(id));
CREATE TABLE IF NOT EXISTS mission_progress(account_id TEXT NOT NULL,mission_id TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'locked',updated_at INTEGER NOT NULL,PRIMARY KEY(account_id,mission_id));
CREATE TABLE IF NOT EXISTS properties(account_id TEXT NOT NULL,property_id TEXT NOT NULL,owned INTEGER NOT NULL DEFAULT 1,level INTEGER NOT NULL DEFAULT 1,updated_at INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(account_id,property_id));
CREATE TABLE IF NOT EXISTS businesses(account_id TEXT NOT NULL,business_id TEXT NOT NULL,level INTEGER NOT NULL DEFAULT 1,balance INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(account_id,business_id));
CREATE TABLE IF NOT EXISTS vehicles(account_id TEXT NOT NULL,vehicle_id TEXT NOT NULL,name TEXT NOT NULL,health INTEGER NOT NULL DEFAULT 100,stored_property TEXT,updated_at INTEGER NOT NULL,PRIMARY KEY(account_id,vehicle_id));
CREATE TABLE IF NOT EXISTS story_state(account_id TEXT PRIMARY KEY,active_phase INTEGER NOT NULL DEFAULT 1,active_mission TEXT,ending_path TEXT,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS story_flags(account_id TEXT NOT NULL,flag TEXT NOT NULL,value TEXT NOT NULL,updated_at INTEGER NOT NULL,PRIMARY KEY(account_id,flag));
CREATE TABLE IF NOT EXISTS relationships(account_id TEXT NOT NULL,subject_id TEXT NOT NULL,score INTEGER NOT NULL DEFAULT 0,level TEXT NOT NULL DEFAULT 'stranger',updated_at INTEGER NOT NULL,PRIMARY KEY(account_id,subject_id));
CREATE TABLE IF NOT EXISTS faction_rep(account_id TEXT NOT NULL,faction_id TEXT NOT NULL,score INTEGER NOT NULL DEFAULT 0,updated_at INTEGER NOT NULL,PRIMARY KEY(account_id,faction_id));
CREATE TABLE IF NOT EXISTS evidence(account_id TEXT NOT NULL,evidence_id TEXT NOT NULL,discovered INTEGER NOT NULL DEFAULT 1,metadata TEXT NOT NULL DEFAULT '{}',updated_at INTEGER NOT NULL,PRIMARY KEY(account_id,evidence_id));
CREATE TABLE IF NOT EXISTS online_identity(account_id TEXT PRIMARY KEY,citizen_id TEXT UNIQUE NOT NULL,world_id TEXT NOT NULL,home_district TEXT NOT NULL,id_active INTEGER NOT NULL DEFAULT 0,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS money_transfers(id TEXT PRIMARY KEY,sender_account_id TEXT NOT NULL,recipient_account_id TEXT NOT NULL,amount INTEGER NOT NULL,idempotency_key TEXT UNIQUE NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS online_career(account_id TEXT PRIMARY KEY,life_path TEXT NOT NULL DEFAULT 'legitimate',criminal_specialization TEXT,law_status TEXT NOT NULL DEFAULT 'not_applied',world_id TEXT,home_district TEXT,grant_claimed INTEGER NOT NULL DEFAULT 0,last_lifestyle_change_at INTEGER NOT NULL DEFAULT 0,updated_at INTEGER NOT NULL,FOREIGN KEY(account_id) REFERENCES accounts(id));
CREATE TABLE IF NOT EXISTS law_enforcement_applications(id TEXT PRIMARY KEY,account_id TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',submitted_at INTEGER NOT NULL,decided_at INTEGER,decided_by TEXT,notes TEXT DEFAULT '',FOREIGN KEY(account_id) REFERENCES accounts(id));
CREATE TABLE IF NOT EXISTS business_illegal_activity(account_id TEXT NOT NULL,business_id TEXT NOT NULL,activity_id TEXT NOT NULL,heat INTEGER NOT NULL DEFAULT 0,evidence INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at INTEGER NOT NULL,PRIMARY KEY(account_id,business_id,activity_id));
`);
function hashPassword(p,salt=crypto.randomBytes(16).toString("hex")){const hash=crypto.scryptSync(p,salt,64).toString("hex");return `${salt}:${hash}`}
function verifyPassword(p,stored){const [salt,hash]=stored.split(":");const test=crypto.scryptSync(p,salt,64).toString("hex");return crypto.timingSafeEqual(Buffer.from(hash,"hex"),Buffer.from(test,"hex"))}
export function createAccount(email,password,name){
 const id=crypto.randomUUID(),pw=hashPassword(password),now=Date.now();
 db.prepare("INSERT INTO accounts VALUES(?,?,?,?)").run(id,email,pw,now);
 db.prepare("INSERT INTO profiles VALUES(?,?,?,?,?)").run(id,name,"darius",0,0);
 return id;
}
export function authenticate(email,password){
 const a=db.prepare("SELECT * FROM accounts WHERE email=?").get(email);
 if(!a||!verifyPassword(password,a.password_hash))return null;
 return db.prepare("SELECT * FROM profiles WHERE account_id=?").get(a.id);
}
export function getProfile(accountId){return db.prepare("SELECT * FROM profiles WHERE account_id=?").get(accountId)}
export function saveProfile(accountId,data){
 db.prepare("UPDATE profiles SET display_name=?,active_character=?,cash=?,wanted=? WHERE account_id=?")
   .run(String(data.display_name||"Player").slice(0,30),["darius","malik","amara"].includes(data.active_character)?data.active_character:"darius",
        Math.max(0,Math.floor(Number(data.cash)||0)),Math.max(0,Math.min(5,Math.floor(Number(data.wanted)||0))),accountId);
}
export function applyCrimeReward(accountId,cashDelta,wanted){
 const delta=Math.floor(Number(cashDelta)||0), w=Math.max(0,Math.min(5,Math.floor(Number(wanted)||0)));
 db.prepare("UPDATE profiles SET cash=MAX(0,cash+?), wanted=? WHERE account_id=?").run(delta,w,accountId);
 return getProfile(accountId);
}

export function saveMission(accountId,missionId,state){
 db.prepare("INSERT INTO mission_progress(account_id,mission_id,state,updated_at) VALUES(?,?,?,?) ON CONFLICT(account_id,mission_id) DO UPDATE SET state=excluded.state,updated_at=excluded.updated_at")
   .run(accountId,String(missionId),String(state),Date.now());
}
export function getMissions(accountId){return db.prepare("SELECT mission_id,state,updated_at FROM mission_progress WHERE account_id=?").all(accountId)}
export function closeDB(){db.close()}

export function getProperties(a){return db.prepare("SELECT property_id,owned,level,updated_at FROM properties WHERE account_id=? AND owned=1").all(a)}
export function getBusinesses(a){return db.prepare("SELECT * FROM businesses WHERE account_id=?").all(a)}
export function getVehicles(a){return db.prepare("SELECT * FROM vehicles WHERE account_id=?").all(a)}
export function buyProperty(a,id,price){price=Math.max(0,Math.floor(Number(price)||0));const p=getProfile(a);if(!p||p.cash<price)return {ok:false,reason:"insufficient_funds"};if(db.prepare("SELECT 1 FROM properties WHERE account_id=? AND property_id=? AND owned=1").get(a,id))return {ok:false,reason:"already_owned"};db.prepare("UPDATE profiles SET cash=cash-? WHERE account_id=?").run(price,a);db.prepare("INSERT INTO properties(account_id,property_id,owned,level,updated_at) VALUES(?,?,1,1,?)").run(a,id,Date.now());return {ok:true,profile:getProfile(a),properties:getProperties(a)}}
export function upgradeProperty(a,id,price){price=Math.max(0,Math.floor(Number(price)||0));const p=getProfile(a),o=db.prepare("SELECT * FROM properties WHERE account_id=? AND property_id=? AND owned=1").get(a,id);if(!o)return {ok:false,reason:"not_owned"};if(!p||p.cash<price)return {ok:false,reason:"insufficient_funds"};db.prepare("UPDATE profiles SET cash=cash-? WHERE account_id=?").run(price,a);db.prepare("UPDATE properties SET level=level+1,updated_at=? WHERE account_id=? AND property_id=?").run(Date.now(),a,id);return {ok:true,profile:getProfile(a),properties:getProperties(a)}}
export function saveBusiness(a,id,d){db.prepare(`INSERT INTO businesses(account_id,business_id,level,balance,active,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(account_id,business_id) DO UPDATE SET level=excluded.level,balance=excluded.balance,active=excluded.active,updated_at=excluded.updated_at`).run(a,id,Math.max(1,Math.floor(Number(d.level)||1)),Math.max(0,Math.floor(Number(d.balance)||0)),d.active===false?0:1,Date.now());return db.prepare("SELECT * FROM businesses WHERE account_id=? AND business_id=?").get(a,id)}
export function storeVehicle(a,id,name,health,propertyId){db.prepare().run(a,id,name||"Vehicle",Math.max(0,Math.min(100,Math.floor(Number(health)||0))),propertyId||null,Date.now())}

export function getStory(accountId){
 return db.prepare("SELECT * FROM story_state WHERE account_id=?").get(accountId) ||
 {account_id:accountId,active_phase:1,active_mission:null,ending_path:null,updated_at:0};
}
export function saveStory(accountId,data){
 db.prepare(`INSERT INTO story_state(account_id,active_phase,active_mission,ending_path,updated_at)
 VALUES(?,?,?,?,?) ON CONFLICT(account_id) DO UPDATE SET active_phase=excluded.active_phase,active_mission=excluded.active_mission,ending_path=excluded.ending_path,updated_at=excluded.updated_at`)
 .run(accountId,Math.max(1,Math.min(10,Math.floor(Number(data.active_phase)||1))),data.active_mission||null,data.ending_path||null,Date.now());
 return getStory(accountId);
}
export function setStoryFlag(accountId,flag,value){
 db.prepare(`INSERT INTO story_flags(account_id,flag,value,updated_at) VALUES(?,?,?,?)
 ON CONFLICT(account_id,flag) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at`)
 .run(accountId,String(flag).slice(0,100),JSON.stringify(value),Date.now());
}
export function getStoryFlags(accountId){
 return db.prepare("SELECT flag,value,updated_at FROM story_flags WHERE account_id=?").all(accountId).map(x=>({...x,value:JSON.parse(x.value)}));
}
function relationshipLevel(score){
 if(score>=80)return "close"; if(score>=50)return "trusted"; if(score>=20)return "acquaintance";
 if(score<=-60)return "rival"; if(score<0)return "strained"; return "stranger";
}
export function updateRelationship(accountId,subjectId,delta){
 const old=db.prepare("SELECT score FROM relationships WHERE account_id=? AND subject_id=?").get(accountId,subjectId);
 const score=Math.max(-100,Math.min(100,(old?.score||0)+Math.floor(Number(delta)||0)));
 const level=relationshipLevel(score);
 db.prepare(`INSERT INTO relationships(account_id,subject_id,score,level,updated_at) VALUES(?,?,?,?,?)
 ON CONFLICT(account_id,subject_id) DO UPDATE SET score=excluded.score,level=excluded.level,updated_at=excluded.updated_at`)
 .run(accountId,String(subjectId).slice(0,100),score,level,Date.now());
 return db.prepare("SELECT * FROM relationships WHERE account_id=? AND subject_id=?").get(accountId,subjectId);
}
export function getRelationships(accountId){return db.prepare("SELECT * FROM relationships WHERE account_id=?").all(accountId)}
export function updateFaction(accountId,factionId,delta){
 const old=db.prepare("SELECT score FROM faction_rep WHERE account_id=? AND faction_id=?").get(accountId,factionId);
 const score=Math.max(-100,Math.min(100,(old?.score||0)+Math.floor(Number(delta)||0)));
 db.prepare(`INSERT INTO faction_rep(account_id,faction_id,score,updated_at) VALUES(?,?,?,?)
 ON CONFLICT(account_id,faction_id) DO UPDATE SET score=excluded.score,updated_at=excluded.updated_at`)
 .run(accountId,String(factionId).slice(0,80),score,Date.now());
 return db.prepare("SELECT * FROM faction_rep WHERE account_id=? AND faction_id=?").get(accountId,factionId);
}
export function getFactions(accountId){return db.prepare("SELECT * FROM faction_rep WHERE account_id=?").all(accountId)}
export function addEvidence(accountId,evidenceId,metadata={}){
 db.prepare(`INSERT INTO evidence(account_id,evidence_id,discovered,metadata,updated_at) VALUES(?,?,?,?,?)
 ON CONFLICT(account_id,evidence_id) DO UPDATE SET discovered=1,metadata=excluded.metadata,updated_at=excluded.updated_at`)
 .run(accountId,String(evidenceId).slice(0,100),1,JSON.stringify(metadata),Date.now());
}
export function getEvidence(accountId){return db.prepare("SELECT * FROM evidence WHERE account_id=?").all(accountId).map(x=>({...x,metadata:JSON.parse(x.metadata)}))}
export function fullAccountSnapshot(accountId){
 return {profile:getProfile(accountId),missions:getMissions(accountId),properties:getProperties(accountId),
 businesses:getBusinesses(accountId),vehicles:getVehicles(accountId),story:getStory(accountId),
 flags:getStoryFlags(accountId),relationships:getRelationships(accountId),factions:getFactions(accountId),evidence:getEvidence(accountId),onlineCareer:getOnlineCareer(accountId),businessIllegalActivities:getBusinessIllegalActivities(accountId)};
}

export function setOnlineIdentity(accountId,data){
 const citizenId=String(data.citizen_id||("VY-"+crypto.randomBytes(5).toString("hex").toUpperCase())).slice(0,32);
 const worldId=String(data.world_id||"veyron-01").slice(0,32);
 const home=String(data.home_district||"Veyron Central").slice(0,64);
 db.prepare(`INSERT INTO online_identity(account_id,citizen_id,world_id,home_district,id_active,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(account_id) DO UPDATE SET citizen_id=excluded.citizen_id,world_id=excluded.world_id,home_district=excluded.home_district,id_active=excluded.id_active,updated_at=excluded.updated_at`).run(accountId,citizenId,worldId,home,data.id_active?1:0,Date.now());
 return db.prepare("SELECT * FROM online_identity WHERE account_id=?").get(accountId);
}
export function getOnlineIdentity(accountId){return db.prepare("SELECT * FROM online_identity WHERE account_id=?").get(accountId)||null}
export function transferMoney(sender,recipient,amount,key){
 amount=Math.floor(Number(amount)||0); key=String(key||""); if(amount<1||amount>250000||!key)return {ok:false,reason:"invalid_transfer"};
 if(sender===recipient)return {ok:false,reason:"same_account"};
 if(db.prepare("SELECT 1 FROM money_transfers WHERE idempotency_key=?").get(key))return {ok:false,reason:"duplicate_transfer"};
 const result=db.transaction(()=>{const s=db.prepare("SELECT bank_balance FROM profiles WHERE account_id=?").get(sender);const r=db.prepare("SELECT 1 FROM profiles WHERE account_id=?").get(recipient);if(!s||!r||s.bank_balance<amount)return false;db.prepare("UPDATE profiles SET bank_balance=bank_balance-? WHERE account_id=?").run(amount,sender);db.prepare("UPDATE profiles SET bank_balance=bank_balance+? WHERE account_id=?").run(amount,recipient);db.prepare("INSERT INTO money_transfers VALUES(?,?,?,?,?,?)").run(crypto.randomUUID(),sender,recipient,amount,key,Date.now());return true;})();
 if(!result)return {ok:false,reason:"insufficient_funds_or_recipient"}; return {ok:true,sender:getProfile(sender),recipient:getProfile(recipient)};
}

export function getOnlineCareer(accountId){
 return db.prepare("SELECT * FROM online_career WHERE account_id=?").get(accountId)||null;
}
export function claimOnlineStartingGrant(accountId){
 const now=Date.now();
 const result=db.transaction(()=>{
   let row=db.prepare("SELECT * FROM online_career WHERE account_id=?").get(accountId);
   if(row?.grant_claimed)return {ok:false,reason:"grant_already_claimed"};
   if(!row){db.prepare("INSERT INTO online_career(account_id,grant_claimed,updated_at) VALUES(?,?,?)").run(accountId,1,now);}
   else db.prepare("UPDATE online_career SET grant_claimed=1,updated_at=? WHERE account_id=?").run(now,accountId);
   db.prepare("UPDATE profiles SET bank_balance=bank_balance+10000000 WHERE account_id=?").run(accountId);
   return {ok:true,amount:10000000};
 })();
 return result.ok?{...result,profile:getProfile(accountId),career:getOnlineCareer(accountId)}:result;
}
export function saveOnlineCareer(accountId,data){
 const life=["legitimate","criminal","law_enforcement"].includes(data.life_path)?data.life_path:"legitimate";
 const law=["not_applied","pending","accepted","rejected"].includes(data.law_status)?data.law_status:"not_applied";
 db.prepare(`INSERT INTO online_career(account_id,life_path,criminal_specialization,law_status,world_id,home_district,grant_claimed,last_lifestyle_change_at,updated_at)
 VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(account_id) DO UPDATE SET life_path=excluded.life_path,criminal_specialization=excluded.criminal_specialization,law_status=excluded.law_status,world_id=excluded.world_id,home_district=excluded.home_district,last_lifestyle_change_at=excluded.last_lifestyle_change_at,updated_at=excluded.updated_at`)
 .run(accountId,life,data.criminal_specialization||null,law,data.world_id||null,data.home_district||null,data.grant_claimed?1:0,Math.max(0,Number(data.last_lifestyle_change_at)||0),Date.now());
 return getOnlineCareer(accountId);
}
export function submitLawEnforcementApplication(accountId){
 const existing=db.prepare("SELECT * FROM law_enforcement_applications WHERE account_id=? AND status='pending' ORDER BY submitted_at DESC LIMIT 1").get(accountId);
 if(existing)return existing;
 const row={id:crypto.randomUUID(),account_id:accountId,status:"pending",submitted_at:Date.now(),decided_at:null,decided_by:null,notes:""};
 db.prepare("INSERT INTO law_enforcement_applications VALUES(?,?,?,?,?,?,?)").run(row.id,row.account_id,row.status,row.submitted_at,null,null,"");
 db.prepare("INSERT INTO online_career(account_id,life_path,law_status,updated_at) VALUES(?,?,?,?) ON CONFLICT(account_id) DO UPDATE SET life_path='law_enforcement',law_status='pending',updated_at=excluded.updated_at").run(accountId,"law_enforcement","pending",Date.now());
 return row;
}
export function listLawEnforcementApplications(){return db.prepare("SELECT * FROM law_enforcement_applications ORDER BY submitted_at ASC").all()}
export function decideLawEnforcementApplication(applicationId,accepted,adminId,notes=""){
 const status=accepted?"accepted":"rejected",now=Date.now();
 const result=db.transaction(()=>{
   const app=db.prepare("SELECT * FROM law_enforcement_applications WHERE id=?").get(applicationId); if(!app)return null;
   db.prepare("UPDATE law_enforcement_applications SET status=?,decided_at=?,decided_by=?,notes=? WHERE id=?").run(status,now,adminId||"admin",String(notes).slice(0,500),applicationId);
   db.prepare("UPDATE online_career SET life_path=?,law_status=?,updated_at=? WHERE account_id=?").run(accepted?"law_enforcement":"legitimate",status,now,app.account_id);
   return db.prepare("SELECT * FROM law_enforcement_applications WHERE id=?").get(applicationId);
 })();
 return result;
}
export function getBusinessIllegalActivities(accountId){return db.prepare("SELECT * FROM business_illegal_activity WHERE account_id=?").all(accountId)}
export function setBusinessIllegalActivity(accountId,businessId,activityId,active){
 db.prepare(`INSERT INTO business_illegal_activity(account_id,business_id,activity_id,active,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(account_id,business_id,activity_id) DO UPDATE SET active=excluded.active,updated_at=excluded.updated_at`).run(accountId,businessId,activityId,active?1:0,Date.now());
 return db.prepare("SELECT * FROM business_illegal_activity WHERE account_id=? AND business_id=? AND activity_id=?").get(accountId,businessId,activityId);
}
