const SAVE_KEY="404_nowayout_save_v2";
function loadGame(){try{const raw=localStorage.getItem(SAVE_KEY);return raw?JSON.parse(raw):null}catch(e){return null}}
function saveGame(data){localStorage.setItem(SAVE_KEY,JSON.stringify(data))}
function resetGame(){if(confirm("Reset the 404 test save?")){localStorage.removeItem(SAVE_KEY);location.reload()}}
