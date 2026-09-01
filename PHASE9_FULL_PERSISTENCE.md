# Phase 9 — Full Online Persistence

## Persistent state
The account snapshot now covers:
- Profile / character / cash / wanted
- 88-mission progress
- Properties and upgrades
- Businesses
- Stored vehicles
- Active story phase/mission
- Ending path
- Story flags
- Character/NPC relationship scores and levels
- Faction reputation
- Collected evidence

## Authority
The server owns persistent state. The browser requests changes; it does not directly write the database.

## Story design
Relationship and faction changes can be triggered by missions and choices. Phase 10 can use the accumulated state to determine finale variants and post-game consequences.

## Production hardening still required
Use secure authentication infrastructure, TLS/WSS, token expiry/rotation, account recovery, email verification if desired, managed DB backups, transactional economy ledgering, audit logs, rate limiting, moderation, scaling and automated tests.
