# 404: NO WAY OUT — PHASE 18 FINAL PROJECT BLUEPRINT

## 1. Verified baseline
- City: Veyron City
- Campaign registry: 88 missions
- Target campaign length: 45-60+ depending on play style+ hours
- Endings: 4
- Browser prototype: 2D
- Future production target: Unreal Engine 5.x / World Partition
- Current Build 013 extends Build 012 rather than replacing it.

## 2. World specification
The existing world registry defines these districts:
- Veyron Central: Downtown core: bank, market, apartments, safehouse access and civic buildings.
- East Market: Dense residential and commercial streets, small shops and alleys.
- North Hills: Affluent hillside district with guarded properties and quieter streets.
- Iron District: Industrial yards, workshops, warehouses and freight traffic.
- West Coast: Beachfront, hotels, leisure spaces and tourist traffic.
- Veyron International Airport: Runways, terminals, service roads and future flight systems.
- Veyron Port: Container yards, docks, warehouses and maritime traffic.
- Blackwater Island: Remote island location reserved for later story and endgame content.

Phase 18 adds runtime state for:
- traffic density
- crowd density
- emergency pressure
- district pressure
- business activity
- weather/intensity
- temporary world events
- tiered NPC simulation

## 3. Building/interior registry
The current verified interior registry contains:
- Veyron Bank (financial) — central
- Darius Safehouse (safehouse) — central
- Central Market (shopping) — central
- Police Headquarters (civic) — central
- Reed Workshop (garage) — iron
- Lena's Cafe (social) — east
- Port Warehouse 7 (industrial) — port
- Airport Terminal (transport) — airport

The requested larger footprint remains a production expansion target. Major mission interiors should receive priority, with FULL / CONDITIONAL / BACKGROUND access tiers in the future 3D implementation.

## 4. Property system
Existing Phase 8 data defines property types:
safehouse, apartment, house, garage, business, warehouse, dock.

Required production features:
- ownership
- upgrades
- multi-floor access
- garages/storage
- wardrobe
- safehouse behavior
- hotel booking/room access
- business balances and operating expenses

## 5. NPC simulation
Architecture:
**context → personality → proximity → event → reaction**

Phase 18 browser tiers:
- near: detailed local representation
- district: aggregate district behavior
- aggregate: off-screen statistical state

Production Unreal implementation should replace aggregate placeholders with streamed AI agents and schedules.

## 6. Protagonist system
Playable:
- Darius Cole
- Malik
- Amara Vale

Only these three are playable protagonists in Story Mode in the current cast registry. Their relationships, contacts, missions and consequences remain persistent.

## 7. Character / face bible
### Darius Cole
Calm, intelligent, observant, ambitious. Visual direction: controlled posture, understated premium wardrobe, focused eyes, restrained expressions. Driving/combat style should favor deliberate decisions.

### Malik Reed
Loud, funny, reckless, loyal. Visual direction: expressive face, energetic movement, practical street/workshop wardrobe, visible confidence. Animation should have broader gestures and faster reactions.

### Amara Vale
Intelligent, controlled, sarcastic, mysterious. Visual direction: precise posture, minimal wasted movement, sophisticated functional wardrobe, guarded expressions. Animation should communicate observation before action.

### Important NPC pipeline
Build original faces and identities. The eventual 3D pipeline may use MetaHuman or an equivalent original-character workflow, followed by custom wardrobe, hair, scars/tattoos, performance and facial direction.

## 8. Cinematic specification
Production scenes should combine:
- cinematic camera blocking
- facial/body reactions
- environmental movement
- dialogue
- sound/music
- lighting
- vehicle/background activity
- transitions
- performance capture where available

Browser implementation stores cinematic/state contracts; it does not claim full cinematic animation.

## 9. 88-mission campaign registry
The verified Build 012 campaign registry is reproduced below as the implementation baseline:

| ID | Mission | Protagonist | Type | Location |
|---|---|---|---|---|
| M01 | First Night | darius |  | Darius Safehouse |
| M02 | The First Account | darius |  | Central Bank |
| M03 | Three Names | malik |  | Veyron Central |
| M04 | The Call | amara |  | Veyron Central |
| M05 | Veyron Central | darius |  | Veyron Central |
| M06 | North Hills, Quiet Money | malik |  | North Hills |
| M07 | Iron District | amara |  | Reed Workshop |
| M08 | The Port Doesn't Sleep | darius |  | Veyron Port |
| M09 | People Remember | malik |  | Veyron Police Headquarters |
| M10 | Amara's Rule | amara |  | Veyron Central |
| M11 | The Witness | darius |  | Veyron Police Headquarters |
| M12 | No One Saw Anything | malik |  | Veyron Police Headquarters |
| M13 | Workshop Wheels | malik |  | Reed Workshop |
| M14 | Bad Tire, Worse Timing | malik |  | Reed Workshop |
| M15 | Night Run | malik |  | Veyron Central |
| M16 | The Driver | amara |  | Veyron Central |
| M17 | A Witness Called It In | darius |  | Veyron Police Headquarters |
| M18 | Heat | malik |  | Veyron Police Headquarters |
| M19 | The Warehouse Job | amara |  | Veyron Port |
| M20 | The Cost of Being Seen | darius |  | Veyron Central |
| M21 | Three Angles | all |  | Veyron Central |
| M22 | False Delivery | amara |  | Veyron Central |
| M23 | The Long Chase | darius |  | Veyron Central |
| M24 | A Door That Wasn't There | malik |  | Veyron Central |
| M25 | The Empty Office | amara |  | Meridian Corporate Tower |
| M26 | First Investment | darius |  | Veyron Central |
| M27 | Safehouse | malik |  | Reed Workshop |
| M28 | Pressure on the Books | amara |  | Central Bank |
| M29 | The Brother's Trail | darius |  | Veyron Central |
| M30 | They Found Me | malik |  | Veyron Central |
| M31 | 404 | amara |  | Veyron Central |
| M32 | The Choice | darius |  | Veyron Central |
| M33 | No Way Out | malik |  | Veyron Central |
| M34 | After 404 | amara |  | Veyron Central |
| M35 | Market Signals | darius |  | East Market |
| M36 | Rain on Central | malik |  | Veyron Central |
| M37 | Hilltop Contact | amara |  | North Hills |
| M38 | Port Manifest | darius |  | Veyron Port |
| M39 | Airport Window | malik |  | Veyron International Airport |
| M40 | Island Rumor | amara |  | Blackwater Island |
| M41 | The Regulars | darius |  | Lena's Cafe |
| M42 | Family Business | npc |  | Veyron Central |
| M43 | Bad Reputation | amara |  | Veyron Central |
| M44 | Amara's Memory | amara |  | Veyron Central |
| M45 | Rumor Chain | npc |  | Veyron Central |
| M46 | The Second Witness | npc |  | Veyron Police Headquarters |
| M47 | Traffic Jam | malik |  | Veyron Central |
| M48 | Four Flats | malik |  | Reed Workshop |
| M49 | Workshop Upgrade | malik |  | Reed Workshop |
| M50 | Boat Run | malik |  | Veyron Port |
| M51 | Emergency Lane | malik |  | Veyron Central |
| M52 | The Stolen Car | malik |  | Reed Workshop |
| M53 | Street Fight | malik |  | Veyron Central |
| M54 | First Pursuit | malik |  | Veyron Police Headquarters |
| M55 | Evidence Locker | amara |  | Veyron Police Headquarters |
| M56 | Silent Witness | npc |  | Veyron Police Headquarters |
| M57 | Five Stars | malik |  | Darius Safehouse |
| M58 | Counter-Surveillance | amara |  | Veyron Central |
| M59 | Clean Hands | darius |  | Veyron Central |
| M60 | The Broker | malik |  | Veyron Central |
| M61 | Three Deliveries | amara |  | Veyron Central |
| M62 | False Friend | npc |  | Veyron Central |
| M63 | Dead Drop | malik |  | Veyron Central |
| M64 | Switchboard | amara |  | Veyron Central |
| M65 | The Long Game | darius |  | Veyron Central |
| M66 | Three Doors | malik |  | Veyron Central |
| M67 | Legitimate Front | amara |  | Veyron Central |
| M68 | Payroll | darius |  | Veyron Central |
| M69 | The Property Deal | malik |  | Veyron Central |
| M70 | Garage Full | amara |  | Reed Workshop |
| M71 | Cash Flow | darius |  | Veyron Central |
| M72 | Quiet Investor | amara |  | Veyron Central |
| M73 | Paper Trail | amara |  | Veyron Central |
| M74 | Brother's Photograph | darius |  | Veyron Central |
| M75 | The Safe Voice | amara |  | Veyron Central |
| M76 | Old Friends | npc |  | Veyron Central |
| M77 | The Inside Room | darius |  | Meridian Corporate Tower |
| M78 | Network Map | malik |  | Veyron Central |
| M79 | The Man Behind It | amara |  | Veyron Central |
| M80 | Broken Trust | npc |  | Veyron Central |
| M81 | Last Preparation | all |  | Veyron Central |
| M82 | No Loose Ends | amara |  | Veyron Central |
| M83 | The Final Route | darius |  | Veyron Port |
| M84 | The Final Ledger | malik |  | Central Bank |
| M85 | Three Against The City | all |  | Veyron Central |
| M86 | The Last Choice | darius |  | Veyron Central |
| M87 | Dawn | malik |  | Veyron Central |
| M88 | Veyron After 404 | amara |  | Veyron Central |


## 10. Mission scoring and pass/fail
Verified Phase 10 scoring:
- Critical objectives: 50
- Optional objectives: 20
- Time: 10
- Survival/damage: 10
- Precision/stealth: 10

Grades:
- 90–100 Exceptional
- 75–89 Excellent
- 60–74 Passed
- 40–59 Barely Passed
- 0–39 Failed

Critical objective failure can fail a mission. Checkpoint restart and full replay remain distinct.

## 11. Four endings
The existing final-chapter registry defines:
- E1 — The Escape: Expose 404 and attempt to disappear from Veyron.
- E2 — The Crown: Take control of the power structure instead of destroying it.
- E3 — The Sacrifice: One protagonist pays a major personal price so the others can survive.
- E4 — No Way Out: 404's plan succeeds in a devastating way.

Ending resolution should consider trust, evidence, civilian/informant survival, character survival, Amara's decision, exposure/leverage choice, protagonist choices and aggressive handling.

## 12. Free-roam heists
Separate from the 88 Story missions:
- jewelry store
- bank
- casino
- armored transport
- art gallery
- mansion
- warehouse
- corporate vault
- port cargo
- airport cargo

Flow:
**discover → scope → plan → recruit → prepare → execute → escape → consequences**

Crew can be Darius, Malik, Amara, NPC specialists or mixed.

## 13. Economy
Required persistent systems:
- cash/bank
- ATMs
- purchases
- income/expenses
- mission rewards
- properties/businesses
- investments
- fictional stock market
- dynamic prices
- story-influenced events

## 14. Online architecture
The repository separates Story Mode and Online. The browser layer can carry session/persistence contracts, but authoritative multiplayer requires a server.

Production architecture:
client → session/auth → authoritative world server → persistence database → economy/property service → matchmaking/party service → voice service → anti-cheat/telemetry.

## 15. Police investigation
Phase 18 formalizes:
**incident → witness → report → dispatch → investigation → search → identification → pursuit**

Inputs:
- witness count
- camera evidence
- recognition
- vehicle evidence
- suspect identity
- district pressure
- wanted state

## 16. Optimization plan
- world streaming
- LOD/HLOD
- occlusion
- pooled traffic/NPC objects
- NPC simulation tiers
- texture compression
- material/shader budgets
- physics sleep/islands
- async loading
- memory budgets
- GPU/CPU profiling
- mobile thermal testing
- mission interior streaming

## 17. Expansion architecture
Keep stable IDs for:
- missions
- characters
- factions
- properties
- businesses
- vehicles
- districts
- story flags
- relationship edges
- police cases

New content should append registries rather than invalidate save data.

## 18. What is actually implemented now
### Verified / implemented in the supplied Build 012 + Build 013
- 88-mission browser campaign registry/framework
- mission progression/replay/scoring foundation
- protagonist switching framework
- NPC relationship foundations
- vehicle/prototype driving foundation
- police/wanted foundation
- economy/properties foundations
- online data/session foundations
- Phase 17 dynamic relationship/trigger/world-sim layer
- Phase 18 dynamic lead graph
- Phase 18 relationship persistence bridge
- Phase 18 weather/business/world-event simulation
- Phase 18 police-case investigation contract
- Phase 18 world-sim UI

### Future Unreal/full-backend work
- final 3D city
- 69% meaningful building footprint at production scale
- production interiors/elevators/stairs
- final character meshes and facial animation
- performance capture/lip sync
- production vehicle physics/damage
- full police AI/search/pursuit in 3D
- wildlife simulation
- seamless large-world streaming at target scale
- authoritative multiplayer
- voice chat infrastructure
- anti-cheat
- production economy backend
- final audio/voice acting
- console-quality cinematic presentation translated to mobile hardware

## 19. Phase 18 acceptance criteria
1. Existing game still loads.
2. Mission count remains 88.
3. Existing campaign start/replay behavior remains intact.
4. World Sim panel opens on mobile.
5. Relationship state survives save/reload.
6. Mission availability derives from campaign prerequisites.
7. Police case stages are inspectable and persist.
8. No statement implies the browser is the final 3D game.
