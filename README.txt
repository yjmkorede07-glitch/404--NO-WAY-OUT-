# 404: NO WAY OUT — BUILD 013 / PHASE 18

## Source of truth
This build starts from the **user-supplied Build 012 Phase 17 archive**. Existing functionality is preserved and extended.

## What the audit found
The supplied Build 012 repository already contains:
- 88 mission campaign data
- browser-playable campaign framework
- mission progression/replay/scoring foundation
- Darius/Malik/Amara protagonist framework
- NPC, vehicle, police, economy, properties and online data layers
- Phase 17 relationships, mission triggers, world simulation, aim/controller contracts

Therefore Build 013 does **not** pretend to implement the 88 missions from scratch. It builds upward from what is actually present.

## Phase 18 additions
- Persistent protagonist relationship graph
- Dynamic mission lead/trigger graph for the 88-mission registry
- Mission discovery state
- Dynamic traffic/crowd/emergency simulation state
- Business activity simulation
- Weather transitions and intensity
- Dynamic world events
- Tiered NPC simulation representation
- Witness-to-police investigation case state
- Mission consequence bridge
- World Simulation UI

## Run
Serve the project from a normal local/static web server or publish the project root to a static host. Keep the relative paths intact.

For GitHub Pages, upload the project files themselves; do not expect a ZIP file to execute as the game.

## Test
1. Open the game.
2. Open **MISSIONS** and verify the 88-mission journal.
3. Start/replay missions through the existing campaign framework.
4. Open **WORLD SIM**.
5. Verify weather, traffic, crowd, emergency and business values update.
6. Trigger/inspect relationship state through existing NPC interactions.
7. Use `phase18.reportIncident({...})` from the browser console to verify the police case chain.
8. Reload the page and verify Phase 18 state persists through the existing save layer.

## Production boundary
The final game vision still requires a future Unreal Engine/mobile production build for:
- true 3D characters and animation
- facial performance/lip sync
- production vehicle physics
- large-world streaming at scale
- full cinematic production
- authoritative multiplayer/backend services
- server-side anti-cheat and persistence
