# PHASE 40 — Mission Gameplay, Combat, Police & Physical Commerce

Phase 40 advances Build 013 from vehicle/NPC/interior foundations into reusable runtime gameplay systems.

## Locked systems
- Story, Online, Side and Freemode missions use one lifecycle contract.
- Every mission has opening and post-mission cinematic states, with optional in-mission cinematics.
- Objectives checkpoint after critical progress and can restart from the latest checkpoint.
- Combat is engine-neutral at the contract layer and supports health, armor, vehicle damage and tire damage.
- Police pursuits escalate through investigation, search, pursuit, containment and arrest attempt states.
- 1–3 star custody follows station/holding rules; 4–5 star custody follows prison rules from Phase 35.
- Fugitive state remains fully playable for 10 in-game days before special fugitive heat expires.
- Banks, ATMs, stores, dealerships, repair shops, businesses, property offices, marinas and construction offices are physical-world commerce points.
- Online ownership remains server authoritative; Story and Online ledgers remain separate.
- There is no universal E interaction control.

## Production boundary
These runtime contracts do not claim finished 3D art, animation, audio, networking backend, or platform certification. Unity Editor compilation/play-mode verification requires the production machine.
