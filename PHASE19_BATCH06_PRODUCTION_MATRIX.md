# Phase 19 Batch 06 — M51-M60 Production Matrix

## Gate
M51-M60 are expanded from the authoritative 88-mission registry into explicit browser prototype beats, persistent checkpoint/action state, mission-specific dialogue hooks, scoring/QA contracts, and Unreal migration contracts.

| Mission | Focus | Prototype beats | Key systems |
|---|---|---|---|
| M51 Emergency Lane | traffic response / route following | travel → follow-response → hold-route → reach-destination | mission_runtime, checkpoint_state, save_load, relationships, evidence_exposure, police_heat |
| M52 The Stolen Car | stolen vehicle recovery / vehicle persistence | travel → trace-vehicle → recover-vehicle → return-intact | mission_runtime, checkpoint_state, save_load, relationships, evidence_exposure, police_heat |
| M53 Street Fight | civilian protection / encounter control | travel → reach-contact → protect-contact → survive-encounter | mission_runtime, checkpoint_state, save_load, relationships, evidence_exposure, police_heat |
| M54 First Pursuit | police pursuit / search clearing | travel → trigger-pursuit → lose-first-unit → clear-search | mission_runtime, checkpoint_state, save_load, relationships, evidence_exposure, police_heat |
| M55 Evidence Locker | police evidence recovery / stealth | travel → locate-record → secure-record → leave-territory | mission_runtime, checkpoint_state, save_load, relationships, evidence_exposure, police_heat |
| M56 Silent Witness | witness extraction / NPC escort | travel → reach-witness → escort-witness → safe-exit | mission_runtime, checkpoint_state, save_load, relationships, evidence_exposure, police_heat |
| M57 Five Stars | maximum police response / safehouse escape | travel → trigger-response → evade-response → reach-safehouse | mission_runtime, checkpoint_state, save_load, relationships, evidence_exposure, police_heat |
| M58 Counter-Surveillance | counter-surveillance / tail identification | travel → detect-tail → identify-tail → break-surveillance | mission_runtime, checkpoint_state, save_load, relationships, evidence_exposure, police_heat |
| M59 Clean Hands | clean resolution / wanted-level discipline | travel → assess-risk → resolve-cleanly → confirm-no-wanted | mission_runtime, checkpoint_state, save_load, relationships, evidence_exposure, police_heat |
| M60 The Broker | broker negotiation / network access | travel → meet-broker → negotiate-access → obtain-token | mission_runtime, checkpoint_state, save_load, relationships, evidence_exposure, police_heat |

## QA acceptance
- Every mission retains canonical title/protagonist/location/prerequisite metadata in `campaign_88_missions.json`.
- Every mission has four explicit prototype beats and matching QA/production contracts.
- Every action beat records a persistent checkpoint and invokes the existing mission advance bridge.
- Mission completion is captured in `gameState.missionRuntime.results` and `gameState.p19.batch06`.
- Dialogue is prototype TTS/text-hook only; final recorded VO remains production work.
- Final 3D Unreal assets, animation, facial performance, full cinematics, production vehicles, final audio, multiplayer backend, and mobile certification remain later production stages.
