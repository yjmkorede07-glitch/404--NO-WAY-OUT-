/* 404 — Account client */
const ACCOUNT={token:localStorage.getItem("404_token")||null,profile:null};
function accountRegister(){
  const email=prompt("Email");const password=prompt("Password (8+ characters)");const name=prompt("Display name");
  if(!email||!password||!name)return;
  realOnlineConnect(name);
  setTimeout(()=>realOnlineSend("register",{email,password,name}),350);
}
function accountLogin(){
  const email=prompt("Email");const password=prompt("Password");
  if(!email||!password)return;
  realOnlineConnect("Player");
  setTimeout(()=>realOnlineSend("login",{email,password}),350);
}
function accountLogout(){localStorage.removeItem("404_token");ACCOUNT.token=null;ACCOUNT.profile=null;notice("Logged out.");}
