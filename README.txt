404: NO WAY OUT — Build 010
PHASE 9 + FULL ONLINE PERSISTENCE

Phase 9:
- Story state persistence
- Story flags
- Relationship scores/levels
- Faction reputation
- Evidence collection
- Ending-path persistence
- Full account snapshot
- Story/relationship UI

Persistent online data:
- Account/profile
- 88 missions
- Cash
- Properties/upgrades
- Businesses
- Stored vehicles
- Wanted state
- Story state
- Relationships
- Faction reputation
- Evidence

The server remains authoritative: clients request state changes and the database persists them.

Run:
cd server
npm install
npm start

Production still needs TLS/WSS, secure token lifecycle, account recovery/verification, managed database/backups, transaction ledgering, scaling, rate limits and hardened anti-cheat.
