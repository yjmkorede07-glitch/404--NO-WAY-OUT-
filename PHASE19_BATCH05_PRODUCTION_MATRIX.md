# Phase 19 Batch 05 — M41-M50 Production Matrix

## Gate
M41-M50 are expanded from the authoritative 88-mission registry into explicit browser prototype beats, persistent checkpoint/action state, mission-specific dialogue hooks, scoring/QA contracts, and Unreal migration contracts.

| Mission | Focus | Prototype beats | Key systems |
|---|---|---|---|
| M41 The Regulars | cafe social intelligence | travel → observe-regulars → trace-connection → confirm-source | NPC AI, relationships, evidence |
| M42 Family Business | civilian de-escalation | travel → hear-problem → deescalate → resolve | NPC AI, relationships, police heat |
| M43 Bad Reputation | trust/access | travel → meet-contact → repair-trust → gain-access | relationships, evidence |
| M44 Amara's Memory | remembered lead | travel → retrace-memory → search-location → recover-clue | investigation, evidence |
| M45 Rumor Chain | social tracking | travel → follow-first → follow-second → reach-source | NPC AI, evidence |
| M46 The Second Witness | contradictory accounts | travel → interview-first → interview-second → weigh-leads | police/witness, evidence |
| M47 Traffic Jam | convoy timing | travel → read-traffic → route-convoy → reach-destination | traffic, vehicles, timing |
| M48 Four Flats | vehicle recovery | travel → inspect-vehicle → repair-tires → return-vehicle | vehicles, workshop |
| M49 Workshop Upgrade | capability upgrade | travel → choose-upgrade → install-upgrade → test-vehicle | economy, vehicles, workshop |
| M50 Boat Run | coastal delivery | travel → load-item → coastal-run → dock-delivery | vehicles, port, delivery |

## QA acceptance
- Every mission retains canonical title/protagonist/location/prerequisite metadata.
- Every mission has four explicit prototype beats and matching QA/production contracts.
- Every action beat records a persistent checkpoint and invokes the existing mission advance bridge.
- Mission completion is captured in `gameState.missionRuntime.results` and `gameState.p19.batch05`.
- Dialogue is prototype TTS/text-hook only; final recorded VO remains production work.
- Final 3D Unreal assets, animation, facial performance, full cinematics, production vehicles, final audio, multiplayer backend, and mobile certification remain later production stages.
