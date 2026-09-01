404: NO WAY OUT — Build 008
PHASE 7 + PERSISTENT ONLINE ACCOUNTS + 88 MISSIONS

Campaign:
- 88 main missions
- Original first 34 missions retained
- 54 additional missions
- Explicit win condition for every mission
- Expanded target: roughly 45–60+ hours for main story depending on play style

Online:
- Real WebSocket server
- Persistent SQLite accounts
- scrypt password hashing
- register/login/resume sessions
- persistent player profile
- persistent mission progress
- property persistence foundation
- authoritative movement/combat/crime/vehicle/mission events

Run server:
cd server
npm install
npm start

This is still a prototype backend. Production deployment needs TLS/WSS, secure token lifecycle, managed database, scaling, rate limits, backups, monitoring, matchmaking and hardened anti-cheat.
