# 404: NO WAY OUT — Phase 35 Master Remaining Systems Gate

Phase 35 consolidates the remaining non-3D production architecture into one engine-neutral gate. After this phase, the intended remaining production work is creation/import/optimization of final 3D assets, animations, facial rigs, audio/VO, cinematics, materials, lighting, level dressing, platform QA, and live backend deployment.

## Prison / custody
- Four-star arrest triggers custody routing when the incident qualifies for arrest and the player is incapacitated/arrested.
- Custody has intake, booking, property seizure, cell assignment, sentence/case state, release and transfer states.
- Main Veyron Central Prison is a large persistent facility with cells, intake, yard, visitation, medical, administration, transport and restricted areas.
- Smaller holding facilities exist for district processing.
- Prison escape is a gameplay route, not an automatic reward: breakout opportunities are generated from missions, contacts, contraband, schedules and facility weaknesses. Escape creates an active fugitive state and escalates police response.
- Story/side missions can explicitly require a prison break or prison extraction.
- Online prison state is server authoritative and cannot be cleared by client commands.

## Islands / maritime world
- Blackwater Island remains a major island district.
- Additional small islands/rocks support boats, docks, properties and missions.
- Players can own boats, store them at marinas/boathouses, purchase marine upgrades and use them in freemode and missions.
- Water travel supports civilian boats, criminal smuggling, police marine response and rescue/transport activities.
- Aircraft/rotorcraft ownership architecture supports helicopters and fixed-wing aircraft where the final platform budget permits.
- Properties can include private docks, boat houses, helipads and aircraft hangars.

## Aircraft wording
The design uses generic functional classes so final vehicle names/models can be original: helicopters, private aircraft, utility aircraft and high-performance aircraft. No third-party game vehicle names or assets are required.

## Property construction
- New-build homes can include optional garage, dock, boathouse, helipad and/or hangar packages when zoning permits.
- Construction phases change the physical world state.
- Property ownership is separate from cosmetic upgrades and storage capacity.

## Remaining universal systems
- Story + side + online mission lifecycle and cinematic markers
- Dynamic world/NPC/traffic/police/business integration
- Law-enforcement career and admin acceptance
- Civilian/criminal/legitimate life switching with two-real-hour cooldown
- Time scale: 5 real minutes = 1 in-game hour
- Banks, Veyron Credit currency and ledger
- Properties, construction, businesses and markets
- Weather/day/night
- Save/load and recovery
- Accessibility/settings
- Online identity, parties, money transfer, persistence, moderation/admin audit
- Mobile/PC/console packaging budgets
- Content streaming and performance tiers
- Localization-ready dialogue/audio metadata
- Analytics/crash/error reporting contracts
- Anti-cheat/server validation contracts

## Production boundary
No claim is made that final 3D assets, voice recordings, final cinematics, animation, backend hosting or platform certification are complete. Those are the post-architecture production gate.

## Phase 35 Revision — custody tiers, bail, fugitive window and underground networks

The police/custody design now uses graduated custody rather than sending every arrest to prison.

- 1-star: station holding can occur; bail available.
- 2-star: station holding; bail available.
- Early 3-star: station jail/holding; bail available; short custody sentence.
- Late 3-star: prison transfer can occur; no bail.
- 4-star: prison custody.
- 5-star: maximum-security prison custody.

Sentence duration is measured in **in-game hours**, using the established world clock of 1 in-game hour = 5 real minutes. Exact sentence length can vary with offense severity and repeat offenses.

After a prison or holding escape, the player enters a **10 in-game day fugitive period**. The player remains fully playable during this period and may perform normal gameplay activities. The intended challenge is to avoid new serious police incidents and keep a low profile. At the end of the 10 in-game days, the special fugitive heat expires and the player returns to the ordinary wanted/police rules. Creating a new serious crime can still generate a new wanted state.

### Underground world network

Veyron now explicitly includes a broad physical underground network: storm drains, sewers, service tunnels, subway maintenance, abandoned rail tunnels, utility corridors, underground parking, basements, bunkers, smuggling tunnels, warehouse sublevels, hidden safehouses, maintenance shafts, coastal caves, island tunnels, mountain tunnels and construction voids. These can provide police evasion routes, mission paths, hidden entrances, stashes, meetings and shortcuts. They are not guaranteed safe zones: some routes can be searched or blocked by police and multiple entrances/exits are required.

### Character reference intake

The three locked playable protagonists are **Darius Cole, Malik Reed and Amara Vale**. Their character photos/reference images and voice references are the first production inputs to request. Supporting characters such as Marcus and Lena remain separately managed; final photo/voice requests for them should wait until their production designs and dialogue requirements are locked.
