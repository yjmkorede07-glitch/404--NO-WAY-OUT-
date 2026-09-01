/* 404: NO WAY OUT — Phase 8 persistent economy & properties */
const ECONOMY={cash:0,bank:0,properties:[],businesses:[],vehicles:[]};
const PROPERTY_CATALOG={
 "safehouse-01":{name:"Iron District Safehouse",type:"safehouse",price:25000},
 "apartment-01":{name:"Central Apartment",type:"apartment",price:75000},
 "house-01":{name:"North Hills House",type:"house",price:180000},
 "garage-01":{name:"Workshop Garage",type:"garage",price:120000},
 "warehouse-01":{name:"Port Warehouse",type:"warehouse",price:300000},
 "dock-01":{name:"Blackwater Dock",type:"dock",price:450000},
 "business-01":{name:"Corner Market",type:"business",price:200000},
 "business-02":{name:"Auto Workshop",type:"business",price:350000}
};
function economyApply(d){if(d.profile){ECONOMY.cash=d.profile.cash||0;ECONOMY.bank=d.profile.bank_balance||0} ECONOMY.properties=d.properties||ECONOMY.properties;ECONOMY.businesses=d.businesses||ECONOMY.businesses;ECONOMY.vehicles=d.vehicles||ECONOMY.vehicles;}
function buyProperty(id){const p=PROPERTY_CATALOG[id];if(p)realOnlineSend("buy_property",{propertyId:id,price:p.price});}
function upgradeProperty(id){const p=PROPERTY_CATALOG[id];if(p)realOnlineSend("upgrade_property",{propertyId:id,price:Math.round(p.price*.25)});}
function saveBusiness(id,level,balance,active=true){realOnlineSend("business_update",{businessId:id,level,balance,active});}
function storeVehicle(v,propertyId){realOnlineSend("store_vehicle",{vehicleId:v.id,name:v.name,health:v.health,propertyId});}
function openEconomy(){let h=`<h3>ECONOMY & PROPERTIES <button class="close" onclick="closePanel()">×</button></h3><div class="row"><span>Cash</span><b>₦${Number(ECONOMY.cash).toLocaleString()}</b></div><h4>PROPERTIES</h4>`;Object.entries(PROPERTY_CATALOG).forEach(([id,p])=>{const o=ECONOMY.properties.find(x=>x.property_id===id);h+=`<div class="mission"><b>${p.name}</b><span>${p.type} · ₦${p.price.toLocaleString()}</span>${o?`<small>Owned · Level ${o.level} <button onclick="upgradeProperty('${id}')">UPGRADE</button></small>`:`<small><button onclick="buyProperty('${id}')">BUY</button></small>`}</div>`});h+=`<h4>BUSINESSES</h4>`+(ECONOMY.businesses||[]).map(b=>`<div class="mission"><b>${b.business_id}</b><span>Level ${b.level} · ₦${Number(b.balance).toLocaleString()}</span></div>`).join("");panel(h);}
