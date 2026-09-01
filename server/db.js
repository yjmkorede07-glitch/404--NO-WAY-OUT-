import Database from "better-sqlite3";
import crypto from "crypto";
const db=new Database(process.env.DB_PATH||"404.db");
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS profiles(account_id TEXT PRIMARY KEY,display_name TEXT NOT NULL,active_character TEXT NOT NULL DEFAULT 'darius',cash INTEGER NOT NULL DEFAULT 0,wanted INTEGER NOT NULL DEFAULT 0,FOREIGN KEY(account_id) REFERENCES accounts(id));
CREATE TABLE IF NOT EXISTS mission_progress(account_id TEXT NOT NULL,mission_id TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'locked',updated_at INTEGER NOT NULL,PRIMARY KEY(account_id,mission_id));
CREATE TABLE IF NOT EXISTS properties(account_id TEXT NOT NULL,property_id TEXT NOT NULL,owned INTEGER NOT NULL DEFAULT 1,PRIMARY KEY(account_id,property_id));
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
