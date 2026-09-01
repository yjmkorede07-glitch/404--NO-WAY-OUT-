404: NO WAY OUT — Build 007
PHASE 6 + REAL MULTIPLAYER BACKEND

Phase 6:
- Crime incidents
- Witness integration
- Wanted levels 0–5
- Police dispatch/search/pursuit foundation
- Combat health and damage foundation
- Server-authoritative combat/crime design

REAL ONLINE BACKEND:
- Node.js WebSocket server in /server
- Session creation/joining
- Up to 16 players per session in prototype
- Stable player/session IDs
- Server movement validation
- Server-authoritative crime/wanted state
- Mission event replication
- Vehicle state replication
- Character switching replication
- World tick
- Browser client transport in js/online_real.js

Run:
cd server
npm install
npm start

Production multiplayer still needs persistent accounts/database, TLS, matchmaking, scaling, anti-cheat hardening and deployment infrastructure. Those are intentionally next-layer tasks, not hidden or faked.

Phases 1–6 remain in this build.
