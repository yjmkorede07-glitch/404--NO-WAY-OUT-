# Phase 27 — Online Time, Lifestyle Switching & Opening Cinematics

## Locked choices
- **1 in-game hour = 5 real minutes.**
- **1 in-game day = 2 real hours.**
- Online players may change lifestyle, but a successful change starts a **2 real-hour cooldown**.
- Lifestyle paths: Legitimate, Criminal, Law Enforcement.
- Law Enforcement requires human/admin acceptance every time the player enters/re-enters that path.
- NPC police remain active regardless of player lifestyle.

## Opening flow
1. Login/profile/world selection.
2. **OC-01 — Welcome to Veyron** plays before the player chooses a life.
3. Character creation and life choice.
4. District recommendation.
5. House → Citizen ID → starter car.
6. **OC-02 — Your Life Starts Here** plays after the life choice/onboarding setup and transitions into freemode.

## Lifestyle switching
Switching does not delete owned assets. It changes the active role/job/faction permissions and can change available activities. The server is authoritative for the timestamp and acceptance state.

## Business design
Legitimate businesses are not automatically clean. Owners can keep a legal operation while accepting optional fictional side activities that carry heat/evidence/reputation risk. Examples include a cafe with coded pickups, an auto shop hiding stolen parts, logistics with unregistered cargo, or a construction company doing off-book jobs.
