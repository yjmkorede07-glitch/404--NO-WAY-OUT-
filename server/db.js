import Database from "better-sqlite3";
import crypto from "crypto";
const db=new Database(process.env.DB_PATH||"404.db");
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS profiles(account_id TEXT PRIMARY KEY,display_name TEXT NOT NULL,active_character TEXT NOT NULL DEFAULT 'darius',cash INTEGER NOT NULL DEFAULT 0,wanted INTEGER NOT NULL DEFAULT 0,FOREIGN KEY(account_id) REFERENCES accounts(id));
CREATE TABLE IF NOT EXISTS mission_progress(account_id TEXT NOT NULL,mission_id TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'locked',updated_at INTEGER NOT NULL,PRIMARY KEY(account_id,mission_id));
CREATE TABLE IF NOT EXISTS properties(account_id TEXT NOT NULL,property_id TEXT NOT NULL,owned INTEGER NOT NULL DEFAULT 1,level INTEGER NOT NULL DEFAULT 1,updated_at INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(account_id,property_id));
CREATE TABLE IF NOT EXISTS businesses(account_id TEXT NOT NULL,business_id TEXT NOT NULL,level INTEGER NOT NULL DEFAULT 1,balance INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(account_id,business_id));
CREATE TABLE IF NOT EXISTS vehicles(account_id TEXT NOT NULL,vehicle_id TEXT NOT NULL,name TEXT NOT NULL,health INTEGER NOT NULL DEFAULT 100,stored_property TEXT,updated_at INTEGER NOT NULL,PRIMARY KEY(account_id,vehicle_id));
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
export function saveBusiness(a,id,d){db.prepare().run(a,id,Math.max(1,Math.floor(Number(d.level)||1)),Math.max(0,Math.floor(Number(d.balance)||0)),d.active===false?0:1,Date.now());return db.prepare("SELECT * FROM businesses WHERE account_id=? AND business_id=?").get(a,id)}
export function storeVehicle(a,id,name,health,propertyId){db.prepare().run(a,id,name||"Vehicle",Math.max(0,Math.min(100,Math.floor(Number(health)||0))),propertyId||null,Date.now())}
