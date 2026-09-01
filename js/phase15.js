/*
 * 404: NO WAY OUT — PHASE 15
 * Interiors + Properties + Personal Life
 *
 * Browser prototype:
 * - building/interior registry
 * - multi-floor access
 * - property purchase/ownership/upgrades
 * - hotel booking and room access
 * - storage and wardrobe
 * - sleep/rest, shower, food, laptop/phone and social interactions
 * - persistent personal-life state
 *
 * Production 3D interiors/elevators/animation/streaming belong in Unreal.
 */
(function(){
  "use strict";

  const P15={activeFloor:1, hotelBooking:null, lastAction:0};

  const BUILDINGS = {
    "cole-house": {
      id:"cole-house", name:"Cole Family House", type:"residential",
      district:"North Hills", floors:[1,2],
      access:"story", interior:"family_house",
      rooms:{
        1:["living room","kitchen","garage"],
        2:["bedroom","bathroom","office"]
      }
    },
    "veyron-grand": {
      id:"veyron-grand", name:"Veyron Grand Hotel", type:"hotel",
      district:"Veyron Central", floors:[1,2,3,4,5,6,7,8],
      access:"public", interior:"hotel",
      rooms:{
        1:["lobby","reception","restaurant"],
        2:["guest rooms"],3:["guest rooms"],4:["guest rooms"],
        5:["guest rooms"],6:["guest rooms"],7:["guest rooms"],8:["penthouse"]
      }
    },
    "iron-loft": {
      id:"iron-loft", name:"Iron District Loft", type:"property",
      district:"Iron District", floors:[1,2,3],
      access:"purchase", interior:"loft",
      rooms:{1:["living room","kitchen","garage"],2:["bedroom","bathroom","office"],3:["gym","private room","terrace"]}
    },
    "central-apartment": {
      id:"central-apartment", name:"Veyron Central Apartment", type:"property",
      district:"Veyron Central", floors:[1,2],
      access:"purchase", interior:"apartment",
      rooms:{1:["living room","kitchen","balcony"],2:["bedroom","bathroom","office"]}
    }
  };

  const PROPERTY_CATALOG = {
    "iron-loft":{price:185000,garage:2,storage:80,upgrades:["security","gym","interior","garage"]},
    "central-apartment":{price:95000,garage:1,storage:40,upgrades:["security","interior","storage"]}
  };

  function g(){return window.gameState||{};}
  function p(){return typeof window.currentPlayer==="function"?window.currentPlayer():null;}
  function save(){if(typeof window.saveAll==="function")window.saveAll();}
  function note(t){if(typeof window.notice==="function")window.notice(t);}
  function money(){return Number(g().cash||g().money||0);}
  function setMoney(v){if("cash" in g()||!("money" in g()))g().cash=Math.max(0,Math.round(v));else g().money=Math.max(0,Math.round(v));}
  function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

  function ensure(){
    const s=g();
    s.properties=s.properties||{};
    s.interiors=s.interiors||{};
    s.hotels=s.hotels||{bookings:[],active:null};
    s.personalLife=s.personalLife||{
      hunger:72, hygiene:82, energy:78, social:50,
      wardrobe:["default"], equippedOutfit:"default",
      storage:{cash:0,items:[]}, phone:true, laptop:true,
      lastRest:Date.now()
    };
    s.propertyVisits=s.propertyVisits||{};
    Object.values(BUILDINGS).forEach(b=>{
      s.interiors[b.id]=s.interiors[b.id]||{unlocked:b.access!=="purchase",floor:b.floors[0],visits:0};
    });
  }

  function building(id){ensure();return BUILDINGS[id]||null;}
  function owned(id){ensure();return Boolean(g().properties[id]?.owned);}
  function canAccess(id){
    const b=building(id); if(!b)return false;
    if(b.access==="public")return true;
    if(b.access==="story")return true;
    return owned(id);
  }

  function enterBuilding(id){
    ensure();
    const b=building(id);
    if(!b){note("Building unavailable.");return false;}
    if(!canAccess(id)){note(`${b.name} is locked. Purchase or unlock it first.`);return false;}
    g().interiors[id].unlocked=true;
    g().interiors[id].floor=b.floors[0];
    g().interiors[id].visits++;
    g().currentInterior=id;
    P15.activeFloor=b.floors[0];
    note(`Entered ${b.name} · Floor ${P15.activeFloor}`);
    save(); render();
    return true;
  }

  function setFloor(f){
    ensure();
    const id=g().currentInterior,b=building(id);
    f=Number(f);
    if(!b||!b.floors.includes(f)){note("That floor is not accessible.");return false;}
    g().interiors[id].floor=f;
    P15.activeFloor=f;
    note(`${b.name} · Floor ${f}`);
    save();render();return true;
  }

  function exitBuilding(){
    ensure();
    if(!g().currentInterior){note("You are outside.");return;}
    const b=building(g().currentInterior);
    note(`Exited ${b?.name||"building"}.`);
    g().currentInterior=null;
    save();render();
  }

  function buyProperty(id){
    ensure();
    const b=building(id),c=PROPERTY_CATALOG[id];
    if(!b||!c){note("Property unavailable.");return false;}
    if(owned(id)){note("You already own this property.");return false;}
    if(money()<c.price){note(`You need $${c.price.toLocaleString()} to purchase ${b.name}.`);return false;}
    setMoney(money()-c.price);
    g().properties[id]={owned:true,purchasedAt:Date.now(),upgrades:[],garage:c.garage,storageCapacity:c.storage};
    g().interiors[id].unlocked=true;
    note(`PROPERTY ACQUIRED · ${b.name}`);
    save();render();return true;
  }

  function upgradeProperty(id,upgrade){
    ensure();
    const prop=g().properties[id],b=building(id),c=PROPERTY_CATALOG[id];
    if(!prop?.owned||!c?.upgrades.includes(upgrade)){note("Upgrade unavailable.");return false;}
    if(prop.upgrades.includes(upgrade)){note("Upgrade already installed.");return false;}
    const prices={security:18000,gym:25000,interior:14000,garage:22000,storage:12000};
    const price=prices[upgrade]||10000;
    if(money()<price){note(`You need $${price.toLocaleString()}.`);return false;}
    setMoney(money()-price);prop.upgrades.push(upgrade);
    if(upgrade==="garage")prop.garage++;
    if(upgrade==="storage")prop.storageCapacity+=40;
    note(`${upgrade.toUpperCase()} UPGRADE INSTALLED`);
    save();render();return true;
  }

  function bookHotel(hotelId="veyron-grand",floor=3){
    ensure();
    const b=building(hotelId);
    if(!b||b.type!=="hotel"){note("Hotel unavailable.");return false;}
    const nightly=280;
    if(money()<nightly){note(`Hotel room costs $${nightly} per night.`);return false;}
    setMoney(money()-nightly);
    const room=`${hotelId}-room-${floor}`;
    const booking={hotelId,room,floor,paid:true,bookedAt:Date.now()};
    g().hotels.bookings.push(booking);
    g().hotels.active=booking;
    g().interiors[hotelId].unlocked=true;
    note(`ROOM BOOKED · FLOOR ${floor}`);
    save();render();return true;
  }

  function enterHotelRoom(){
    ensure();
    const b=g().hotels.active;
    if(!b){note("No active hotel booking.");return false;}
    return enterBuilding(b.hotelId) && setFloor(b.floor);
  }

  function act(action){
    ensure();
    const life=g().personalLife;
    const id=g().currentInterior;
    const b=building(id);
    const floor=Number(g().interiors[id]?.floor||1);
    if(!b){note("Enter a suitable building first.");return;}
    const room=(b.rooms[floor]||[]).join(", ");
    switch(action){
      case"sleep": life.energy=Math.min(100,life.energy+55); life.hunger=Math.max(0,life.hunger-8); life.lastRest=Date.now(); note("You rest and recover."); break;
      case"shower": life.hygiene=100; note("Freshened up."); break;
      case"eat": life.hunger=Math.min(100,life.hunger+32); life.energy=Math.min(100,life.energy+4); note("Meal finished."); break;
      case"drink": life.hunger=Math.min(100,life.hunger+8); note("Drink finished."); break;
      case"phone": life.social=Math.min(100,life.social+7); note("You check your phone."); break;
      case"laptop": note("Laptop session opened."); break;
      case"wardrobe": note(`Wardrobe · equipped: ${life.equippedOutfit}`); break;
      case"storage": note(`Storage · ${life.storage.items.length} item(s), $${life.storage.cash.toLocaleString()}.`); break;
      case"terrace": life.social=Math.min(100,life.social+8); note("You spend a quiet moment on the terrace."); break;
      default: note(`Available rooms: ${room||"none"}`);
    }
    save();render();
  }

  function storeCash(amount){
    ensure();amount=Math.max(0,Math.floor(Number(amount)||0));
    if(amount>money()){note("Not enough cash.");return;}
    const cap=g().properties[g().currentInterior]?.storageCapacity||100;
    if(g().personalLife.storage.cash+amount>cap*1000){note("Storage capacity reached.");return;}
    setMoney(money()-amount);g().personalLife.storage.cash+=amount;save();render();
  }

  function withdrawCash(amount){
    ensure();amount=Math.max(0,Math.floor(Number(amount)||0));
    if(amount>g().personalLife.storage.cash){note("Not enough stored cash.");return;}
    g().personalLife.storage.cash-=amount;setMoney(money()+amount);save();render();
  }

  function wear(outfit){
    ensure();
    if(!g().personalLife.wardrobe.includes(outfit)){note("Outfit not owned.");return;}
    g().personalLife.equippedOutfit=outfit;note(`Outfit equipped · ${outfit}`);save();render();
  }

  function openProperties(){
    ensure();
    const props=Object.entries(g().properties).filter(([,v])=>v.owned);
    const cards=Object.values(PROPERTY_CATALOG).map(c=>c);
    const ownedHtml=props.length?props.map(([id,v])=>{
      const b=building(id);
      return `<div class="p15-card"><b>${esc(b.name)}</b><span>Floors: ${b.floors.length} · Garage: ${v.garage} · Upgrades: ${(v.upgrades||[]).length}</span><button onclick="phase15.enter('${id}')">ENTER</button></div>`;
    }).join(""):"<p>No properties owned yet.</p>";
    const catalog=Object.keys(PROPERTY_CATALOG).map(id=>{
      const b=building(id),c=PROPERTY_CATALOG[id];
      return `<div class="p15-card"><b>${esc(b.name)}</b><span>$${c.price.toLocaleString()} · ${b.floors.length} floors</span><button onclick="phase15.buy('${id}')">BUY</button></div>`;
    }).join("");
    const fn=window.panel||window.openPanel;
    if(typeof fn==="function")fn(`<h3>PROPERTIES <button class="close" onclick="closePanel()">×</button></h3><div class="row"><span>Cash</span><b>$${money().toLocaleString()}</b></div><h4>OWNED</h4>${ownedHtml}<h4>FOR SALE</h4>${catalog}`);
  }

  function openInterior(){
    ensure();
    const id=g().currentInterior,b=building(id);
    if(!b){note("No interior active.");return;}
    const f=g().interiors[id].floor,rooms=b.rooms[f]||[];
    const actions=["sleep","shower","eat","phone","laptop","wardrobe","storage"];
    if(rooms.includes("terrace"))actions.push("terrace");
    const floors=b.floors.map(x=>`<button onclick="phase15.floor(${x})">${x}</button>`).join("");
    const acts=actions.map(a=>`<button onclick="phase15.act('${a}')">${a.toUpperCase()}</button>`).join("");
    const fn=window.panel||window.openPanel;
    if(typeof fn==="function")fn(`<h3>${esc(b.name)} <button class="close" onclick="closePanel()">×</button></h3><div class="row"><span>Floor</span><b>${f}</b></div><p>${esc(rooms.join(" · "))}</p><div class="p15-floor">${floors}</div><div class="p15-actions">${acts}</div><button onclick="phase15.exit()">EXIT BUILDING</button>`);
  }

  function render(){
    const life=g().personalLife||{};
    const el=document.getElementById("p15Life");
    if(el)el.textContent=`HUN ${Math.round(life.hunger||0)} · HYG ${Math.round(life.hygiene||0)} · ENG ${Math.round(life.energy||0)}`;
    const room=document.getElementById("p15Interior");
    if(room){
      const id=g().currentInterior,b=building(id);
      room.textContent=id?`${b?.name||"Interior"} · F${g().interiors[id]?.floor||1}`:"OUTSIDE";
    }
  }

  window.phase15={enter:enterBuilding,exit:exitBuilding,floor:setFloor,buy:buyProperty,upgrade:upgradeProperty,
    hotel:bookHotel,hotelRoom:enterHotelRoom,act,storeCash,withdrawCash,wear,
    properties:openProperties,interior:openInterior,buildings:BUILDINGS};
  window.addEventListener("load",()=>{
    ensure();
    setTimeout(()=>{
      const q=document.querySelector(".quick-menu");
      if(q && !document.getElementById("propertiesButton")){
        const b=document.createElement("button");b.id="propertiesButton";b.textContent="PROPERTIES";b.onclick=openProperties;q.appendChild(b);
      }
      if(q && !document.getElementById("interiorButton")){
        const b=document.createElement("button");b.id="interiorButton";b.textContent="INTERIOR";b.onclick=openInterior;q.appendChild(b);
      }
      render();
    },850);
  });
})();
