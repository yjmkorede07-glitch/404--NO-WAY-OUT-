# PHASE 22 — World Partition, Boot Flow, Loading Flow, and Online Mission Architecture
Status: LOCKED DESIGN / IMPLEMENTATION CONTRACT — Build 013

## 1. Exact game opening (LOCKED)
The game uses a hybrid boot/loading design, not a loading screen between every street.

**Launch → 404 splash → Boot/initialization → Title → Profile/online check → Loading: Veyron → opening cinematic → M01 playable.**

Title options:
- CONTINUE
- NEW GAME
- ONLINE
- SETTINGS
- CREDITS

First-run initialization: save, audio, online subsystem and configuration. Continue restores the last safe state. New Game starts the authored opening and M01.

## 2. Loading screen states
One reusable Loading UI supports: BOOTING, PROFILE, WORLD, DISTRICT, INTERIOR, MISSION, CINEMATIC, ONLINE_CONNECT, ONLINE_RECONNECT, RETURN_TO_WORLD.

Show the 404 logo, operation text, indeterminate animation unless real progress is available, and optional Veyron tips. Never fake a percentage.

## 3. World Partition
Veyron is one persistent World Partition world with streaming cells/data layers for Veyron Central, East Market, North Hills, Iron District, West Coast, Airport, Port, and Blackwater Island.

Named interiors remain: Veyron Bank, Darius Safehouse, Central Market, Police HQ, Reed Workshop, Lena's Cafe, Port Warehouse 7, Airport Terminal.

Ordinary district movement uses World Partition streaming. Explicit loading is reserved for large interiors/cinematics, Blackwater Island if profiling requires it, reconnect, and Story↔Online mode changes.

## 4. Data layer rule
Gameplay state is not hard-coded into level blueprints. Use subsystems/GameState/PlayerState, SaveGame, server persistence, and Data Assets/Data Tables.

Suggested layers: DL_Global, DL_Central, DL_EastMarket, DL_NorthHills, DL_IronDistrict, DL_WestCoast, DL_Airport, DL_Port, DL_BlackwaterIsland, DL_Interior_*, DL_Mission_*.

## 5. Story mission lifecycle
World → marker → briefing → accept → mission state/streaming → objectives → score → consequences → save → return to persistent world.

## 6. Online mission lifecycle
Online hub → party/lobby → server mission reservation → synchronized briefing → server-authoritative objectives → extraction/result → server reward transaction → persistence → online hub.

## 7. VEYRON ONLINE
Online is a separate persistent progression profile. It shares city technology/art/economy rules where safe, but never shares story ending state or campaign save slots.

Initial party size: 1–4. Persistent session foundation: up to 16 players, subject to final profiling.

## 8. Online mission catalog
A dedicated 24-mission online campaign is added:
- O01–O04 First Signal
- O05–O08 East Market Pressure
- O09–O12 Iron District Run
- O13–O16 Blackwater Jobs
- O17–O20 Port Authority
- O21–O24 The Veyron Network

The canonical 88 story missions remain the narrative campaign. They are not silently converted into online missions.

## 9. Online authority
Client requests actions. Server decides mission start, objective completion, enemy/NPC authoritative state, wanted state, rewards, failure, timeout and persistence. Client cannot grant money, XP, mission completion, inventory, property or rewards.

## 10. Reconnect
Authenticate → validate token → load online profile → inspect mission reservation → resume only when server says safe → otherwise return to online hub → reconcile authoritative inventory/currency/rewards.

## 11. Performance
Nearby relevant actors replicate frequently; distant cosmetic state is lower priority. The 16-player number is an architecture target, not a final mobile-performance guarantee.

This document is the locked game opening and loading contract unless a later explicit production decision changes it.
